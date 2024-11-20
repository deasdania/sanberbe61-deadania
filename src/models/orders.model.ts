import mongoose, { Document, Schema } from 'mongoose';
import { OrderItem } from './orderItems.model';
import UserModel from "./users.model";
import { MAIL_USER } from '../utils/env';
import email from "../utils/mail";

export interface IOrder extends Document {
  grandTotal: number;
  orderItems: OrderItem[];
  createdBy: mongoose.Types.ObjectId;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

const orderItemSchema = new Schema<OrderItem>({
  name: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});


const orderSchema = new Schema<IOrder>({
  grandTotal: { type: Number, required: true },
  orderItems: { type: [orderItemSchema], required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], required: true },
}, {
  timestamps: true,
});


// After saving the order, update the product quantities
orderSchema.post('save', async function (doc: IOrder, next) {
  const order = doc;

  const user = await UserModel.findById(order.createdBy);
  if (!user) {
    throw new Error(`User with ID ${order.createdBy} not found`);
  }

  const data = {
    customerName: user?.fullName,
    orderItems: order.orderItems,
    grandTotal: order.grandTotal,
    contactEmail: MAIL_USER,
    companyName: "Dea's Lapak",
    year: 2024,
  }
  await email.sendInvoiceMail(user.email, "Checkout Barang", data)

  next();
});

const OrderModel = mongoose.model<IOrder>('Order', orderSchema);

export default OrderModel;
