import { Request, Response } from "express";

import {
  create,
  findAll,
  findOne,
  update,
  remove,
} from "../services/category.service";
import { IPaginationQuery } from "../utils/interfaces";

export default {
  async create(req: Request, res: Response) {
    /**
    #swagger.tags = ['Category']
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/CreateCategory"
      }
    }
    */
    try {
      const result = await create(req.body);
      res.status(201).json({
        data: result,
        message: "Success create category",
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed create category",
      });
    }
  },
  async findAll(req: Request, res: Response) {
    /**
    #swagger.tags = ['Category']
    */
    try {
      const {
        limit = 10,
        page = 1,
        search,
      } = req.query as unknown as IPaginationQuery;

      const query = {};

      if (search) {
        Object.assign(query, {
          name: { $regex: search, $options: "i" },
        });
      }

      const result = await findAll(query, limit, page);
      res.status(200).json({
        data: result,
        message: "Success get all categories",
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed get all categories",
      });
    }
  },
  async findOne(req: Request, res: Response) {
    /**
    #swagger.tags = ['Category']
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'The unique ID of the category to fetch.',
      required: true,
      type: 'string',
      example: '60d21b9667d0d8992e610c85'
    }
    */
    try {
      const result = await findOne(req.params?.id);
      res.status(200).json({
        data: result,
        message: "Success get one category",
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed get one category",
      });
    }
  },
  async update(req: Request, res: Response) {
    /**
    #swagger.tags = ['Category']
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/CreateCategory"
      }
    }
    */
    try {
      const result = await update(req.params?.id, req.body);

      res.status(200).json({
        data: result,
        message: "Success update category",
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed update category",
      });
    }
  },
  async delete(req: Request, res: Response) {
    /**
    #swagger.tags = ['Category']
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'The unique ID of the category to delete.',
      required: true,
      type: 'string',
      example: '60d21b9667d0d8992e610c85'  
    }
    */
    try {
      const result = await remove(req.params?.id);
      
      res.status(200).json({
        data: result,
        message: "Success delete category",
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed delete category",
      });
    }
  },
};
