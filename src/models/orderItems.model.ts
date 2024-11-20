import mongoose, { Schema, Types ,Document } from 'mongoose';

export interface OrderItem extends Document {
  _id?: Types.ObjectId;
  name: string;
  productId: mongoose.Types.ObjectId;
  price: number;
  quantity: number;
}

const orderItemSchema = new Schema<OrderItem>({
  name: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const OrderItemModel = mongoose.model<OrderItem>('OrderItem', orderItemSchema);

export default OrderItemModel;
