/**
 * src/services/order.service.ts
 */

import mongoose, { Document, Schema, ObjectId } from 'mongoose';
import OrderModel, { IOrder as Order} from "../models/orders.model";

export const create = async (payload: Order): Promise<Order> => {
  const result = await OrderModel.create(payload);
  return result;
};

export interface IFindAll {
  query?: unknown;
  limit: number;
  page: number;
}

export const getOrdersByUser = async (
  userId: ObjectId,
  limit: number = 10,
  page: number = 1,
): Promise<Order[]> => {
  try {
    // Get the total number of orders for the user
    const total = await OrderModel.countDocuments({ createdBy: userId });

    // Fetch the orders with pagination
    const orders = await OrderModel.find({ createdBy: userId })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();
      
    return orders;
  } catch (error) {
    console.error("Error fetching orders by user:", error);
    throw error;
  }
}

export const findAll = async (
  query: any,
  limit: number = 10,
  page: number = 1,
): Promise<Order[]> => {
  const result = await OrderModel.find(query)
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 })
    .populate("category");
  return result;
};

export const findOne = async (id: string): Promise<Order | null> => {
  const result = await OrderModel.findById(id).populate('orderItems.productId').populate('createdBy');
  return result;
};

export const update = async (
  id: string,
  payload: Order
): Promise<Order | null> => {
  const result = await OrderModel.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const remove = async (id: string): Promise<Order | null> => {
  const result = await OrderModel.findOneAndDelete({
    _id: id,
  });
  return result;
};
