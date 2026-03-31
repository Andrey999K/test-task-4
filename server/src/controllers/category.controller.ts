import { type Request, type Response } from "express";
import { logger } from "@/utils/log";
import { categoryModel } from "@/models/category.model";

export const categoryController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const limit = Math.min(Math.max(parseInt(req.query.limit as string, 10) || 10, 1), 100);
      const offset = parseInt(req.query.offset as string, 10) || 0;

      const result = await categoryModel.findAll(limit, offset);
      res.json(result);
    } catch (error) {
      logger.error("Failed to fetch categories", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid category ID" });
        return;
      }

      const category = await categoryModel.findById(id);

      if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
      }

      res.json(category);
    } catch (error) {
      logger.error("Failed to fetch category", error);
      res.status(500).json({ error: "Failed to fetch category" });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body;

      if (!name || typeof name !== "string" || name.trim().length === 0) {
        res.status(400).json({ error: "Name is required" });
        return;
      }

      const category = await categoryModel.create(name.trim(), description || null);
      logger.info(`Category created with id: ${category.id}`);
      res.status(201).json(category);
    } catch (error) {
      logger.error("Failed to create category", error);
      res.status(500).json({ error: "Failed to create category" });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid category ID" });
        return;
      }

      const { name, description } = req.body;

      if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
        res.status(400).json({ error: "Name must be a non-empty string" });
        return;
      }

      const category = await categoryModel.update(id, name || null, description ?? null);

      if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
      }

      logger.info(`Category updated: ${id}`);
      res.json(category);
    } catch (error) {
      logger.error("Failed to update category", error);
      res.status(500).json({ error: "Failed to update category" });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid category ID" });
        return;
      }

      const deleted = await categoryModel.delete(id);

      if (!deleted) {
        res.status(404).json({ error: "Category not found" });
        return;
      }

      logger.info(`Category deleted: ${id}`);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message.includes("fk_category")) {
        res.status(409).json({ error: "Cannot delete category with associated products" });
        return;
      }
      logger.error("Failed to delete category", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  },
};
