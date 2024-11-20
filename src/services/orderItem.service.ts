/**
 * src/services/orderItem.service.ts
 */

import OrderModel, { OrderItem} from "../models/orderItems.model";

export const create = async (payload: OrderItem): Promise<OrderItem> => {
  const result = await OrderModel.create(payload);
  return result;
};

