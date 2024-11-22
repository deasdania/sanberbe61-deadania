import { Request, Response } from "express";
import mongoose, { ObjectId } from 'mongoose';
import * as Yup from "yup";

import { IRequestWithUser } from "../middlewares/auth.middleware";
import { IPaginationQuery } from "../utils/interfaces";
import Order from '../models/orders.model';

import { create, getOrdersByUser, findOne } from "../services/order.service";
import { create as createOrderItem } from "../services/orderItem.service";
import { update as updateProduct, findOne as findOneProduct } from "../services/product.service";


// Yup schema for validating the order items
const orderItemSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  price: Yup.number().min(0, 'Price must be greater than or equal to 0').required('Price is required'),
  quantity: Yup.number().min(1, 'Quantity must be greater than or equal to 1').max(5, 'Quantity must not be greater than 5').required('Quantity is required'),
});

const orderSchema = Yup.object({
  grandTotal: Yup.number().min(0, 'Grand Total must be greater than or equal to 0').required('Grand Total is required'),
  orderItems: Yup.array().of(orderItemSchema).min(1, 'At least one order item is required').required('Order items are required'),
  createdBy: Yup.string()
    .test('is-objectid', 'CreatedBy must be a valid ObjectId', (value) => {
      return value ? mongoose.Types.ObjectId.isValid(value) : true; // If undefined, skip validation
    }),
});

// Types for the order and order items to match the Yup schema
type TOrderItem = Yup.InferType<typeof orderItemSchema>;
type TOrder = Yup.InferType<typeof orderSchema>;

export { orderSchema, TOrder, TOrderItem };



export default {
  async createOrder(req: IRequestWithUser, res: Response) {
    /**
    #swagger.tags = ['Order']
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/CreateOrder"
      }
    }
    */
    try {
      const id = req.user?.id;
      // Validate the incoming request body using Yup
      const validatedOrder: TOrder = await orderSchema.validate(req.body, { abortEarly: false });

      // Validate products and update stock levels
      const updatedOrderItems = await Promise.all(
        validatedOrder.orderItems.map(async (item: any) => {
          const product = await findOneProduct(item.productId);

          if (!product) {
            throw new Error(`Product with ID ${item.productId} not found`);
          }

          if (product.qty < item.quantity) {
            throw new Error(
              `Product with ID ${item.productId} is out of stock. Available stock: ${product.qty}, requested: ${item.quantity}`
            );
          }

          // Create order item data
          const updateItem = await createOrderItem(item)
          const orderItem = {
            ...updateItem,
            name: product.name,
            price: product.price,
            total: product.price * item.quantity, // Calculate total price for this item
          };

          // Update the product quantity
          product.qty -= item.quantity;
          await updateProduct(item.productId, product);

          return orderItem;
        })
      );

      const grandTotal = updatedOrderItems.reduce((acc, item) => acc + item.total, 0);
      const newOrder = new Order({
        grandTotal: grandTotal,
        orderItems: updatedOrderItems,
        createdBy: id,
        status: 'pending'
      });
      const order = await create(newOrder)
      return res.status(201).json({
        message: 'Order created successfully',
        data: order,
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // If Yup validation fails, return the error messages
        return res.status(400).json({
          message: 'Validation failed',
          errors: error.errors,
        });
      }
      const err = error as Error;
      // Handle other errors (e.g., database errors)
      return res.status(500).json({
        message: 'Server error',
        error: err.message,
      });
    }
  },
  async getOrderDetail(req: IRequestWithUser, res: Response) {
    /**
    #swagger.tags = ['Order']
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'The unique ID of the order to fetch details for.',
      required: true,
      type: 'string',
      example: '60d21b9667d0d8992e610c85'
    }
    */
    try {
      const orderId = req.params.id;
      const id = req.user?.id;

      // Fetch the order by ID
      const order = await findOne(orderId);

      if (!order) {
        return res.status(404).json({
          message: 'Order not found',
        });
      }
      if (order.createdBy._id != id) {
        return res.status(404).json({
          message: 'Unauthorized to see the details',
        });
      }

      return res.status(200).json({
        message: 'Order details fetched successfully',
        data: order,
      });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({
        message: 'Failed to fetch order details',
        error: err.message,
      });
    }
  },

  async getOrders(req: IRequestWithUser, res: Response) {
    /**
    #swagger.tags = ['Order']
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.parameters['limit'] = {
      in: 'query',
      description: 'The number of orders to fetch per page.',
      required: false,
      type: 'integer',
      default: 10,
      example: 20
    }
    #swagger.parameters['page'] = {
      in: 'query',
      description: 'The page number to fetch.',
      required: false,
      type: 'integer',
      default: 1,
      example: 1
    }
    */
    try {
      const id = req.user?.id;
      const {
        limit = 10,
        page = 1,
        search,
      } = req.query as unknown as IPaginationQuery;
      const result = await getOrdersByUser(id as unknown as ObjectId, limit, page)
      return res.status(200).json({
        message: 'Order fetched successfully',
        data: result,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed update user profile",
      });
    }
  },
};