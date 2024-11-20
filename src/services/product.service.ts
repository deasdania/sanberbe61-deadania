/**
 * src/services/product.service.ts
 */

import ProductsModel, { Product } from "../models/products.model";

export const create = async (payload: Product): Promise<Product> => {
  const result = await ProductsModel.create(payload);
  return result;
};

export interface IFindAll {
  query?: unknown;
  limit: number;
  page: number;
}

export const findAll = async (
  query: any,
  limit: number = 10,
  page: number = 1
): Promise<Product[]> => {
  const result = await ProductsModel.find(query)
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 })
    .populate("category", "name"); 
  return result;
};
export const findOne = async (id: string): Promise<Product | null> => {
  const result = await ProductsModel.findById(id).populate("category", "name");
  return result;
};
export const update = async (
  id: string,
  payload: Product
): Promise<Product | null> => {
  const result = await ProductsModel.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};
export const remove = async (id: string): Promise<Product | null> => {
  const result = await ProductsModel.findOneAndDelete({
    _id: id,
  });
  return result;
};
