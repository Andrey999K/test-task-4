import { type Request, type Response } from "express";
import { logger } from "@/utils/log";
import { productModel } from "@/models/product.model";

export const productController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const limit = Math.min(Math.max(parseInt(req.query.limit as string, 10) || 10, 1), 100);
      const offset = parseInt(req.query.offset as string, 10) || 0;

      const result = await productModel.findAll(limit, offset);
      res.json(result);
    } catch (error) {
      logger.error("Failed to fetch products", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid product ID" });
        return;
      }

      const product = await productModel.findById(id);

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      res.json(product);
    } catch (error) {
      logger.error("Failed to fetch product", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, categoryId, price, stock } = req.body;

      if (!name || typeof name !== "string" || name.trim().length === 0) {
        res.status(400).json({ error: "Name is required" });
        return;
      }

      if (categoryId === undefined || typeof categoryId !== "number") {
        res.status(400).json({ error: "categoryId is required" });
        return;
      }

      if (price === undefined || typeof price !== "number" || price <= 0) {
        res.status(400).json({ error: "price is required and must be positive" });
        return;
      }

      const product = await productModel.create(
        name.trim(),
        categoryId,
        price,
        stock || 0
      );
      logger.info(`Product created with id: ${product.id}`);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof Error && error.message.includes("fk_category")) {
        res.status(400).json({ error: "Invalid categoryId - category does not exist" });
        return;
      }
      logger.error("Failed to create product", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid product ID" });
        return;
      }

      const { name, categoryId, price, stock } = req.body;

      if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
        res.status(400).json({ error: "Name must be a non-empty string" });
        return;
      }

      if (categoryId !== undefined && typeof categoryId !== "number") {
        res.status(400).json({ error: "categoryId must be a number" });
        return;
      }

      if (price !== undefined && (typeof price !== "number" || price <= 0)) {
        res.status(400).json({ error: "price must be a positive number" });
        return;
      }

      const product = await productModel.update(id, name || null, categoryId ?? null, price ?? null, stock ?? null);

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      logger.info(`Product updated: ${id}`);
      res.json(product);
    } catch (error) {
      if (error instanceof Error && error.message.includes("fk_category")) {
        res.status(400).json({ error: "Invalid categoryId - category does not exist" });
        return;
      }
      logger.error("Failed to update product", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid product ID" });
        return;
      }

      const deleted = await productModel.delete(id);

      if (!deleted) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      logger.info(`Product deleted: ${id}`);
      res.status(204).send();
    } catch (error) {
      logger.error("Failed to delete product", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  },
};
