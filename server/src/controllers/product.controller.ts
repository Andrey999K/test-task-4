import { type Request, type Response } from "express";
import { logger } from "@/utils/log";
import { productModel } from "@/models/product.model";

export const productController = {
  async getAll(req: Request, res: Response): Promise<void> {
    const limit = Math.min(Math.max(parseInt(req.query.limit as string, 10) || 10, 1), 100);
    const offset = parseInt(req.query.offset as string, 10) || 0;

    const result = await productModel.findAll(limit, offset);
    res.json(result);
  },

  async getById(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string, 10);

    if (isNaN(id)) {
      throw new Error("Invalid product ID");
    }

    const product = await productModel.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    res.json(product);
  },

  async create(req: Request, res: Response): Promise<void> {
    const { name, categoryId, price, stock } = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      throw new Error("Name is required");
    }

    if (categoryId === undefined || typeof categoryId !== "number") {
      throw new Error("categoryId is required");
    }

    if (price === undefined || typeof price !== "number" || price <= 0) {
      throw new Error("price is required and must be positive");
    }

    const product = await productModel.create(
      name.trim(),
      categoryId,
      price,
      stock || 0
    );
    logger.info(`Product created with id: ${product.id}`);
    res.status(201).json(product);
  },

  async update(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string, 10);

    if (isNaN(id)) {
      throw new Error("Invalid product ID");
    }

    const { name, categoryId, price, stock } = req.body;

    if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
      throw new Error("Name must be a non-empty string");
    }

    if (categoryId !== undefined && typeof categoryId !== "number") {
      throw new Error("categoryId must be a number");
    }

    if (price !== undefined && (typeof price !== "number" || price <= 0)) {
      throw new Error("price must be a positive number");
    }

    const product = await productModel.update(id, name || null, categoryId ?? null, price ?? null, stock ?? null);

    if (!product) {
      throw new Error("Product not found");
    }

    logger.info(`Product updated: ${id}`);
    res.json(product);
  },

  async delete(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string, 10);

    if (isNaN(id)) {
      throw new Error("Invalid product ID");
    }

    const deleted = await productModel.delete(id);

    if (!deleted) {
      throw new Error("Product not found");
    }

    logger.info(`Product deleted: ${id}`);
    res.status(204).send();
  },
};
