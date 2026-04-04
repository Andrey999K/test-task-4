import { type Request, type Response } from "express";
import { logger } from "@/utils/log";
import { categoryModel } from "@/models/category.model";

export const categoryController = {
  async getAll(req: Request, res: Response): Promise<void> {
    const limit = Math.min(Math.max(parseInt(req.query.limit as string, 10) || 10, 1), 100);
    const offset = parseInt(req.query.offset as string, 10) || 0;

    const result = await categoryModel.findAll(limit, offset);
    res.json(result);
  },

  async getById(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string, 10);

    if (isNaN(id)) {
      throw new Error("Invalid category ID");
    }

    const category = await categoryModel.findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    res.json(category);
  },

  async create(req: Request, res: Response): Promise<void> {
    const { name, description } = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      throw new Error("Name is required");
    }

    const category = await categoryModel.create(name.trim(), description || null);
    logger.info(`Category created with id: ${category.id}`);
    res.status(201).json(category);
  },

  async update(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string, 10);

    if (isNaN(id)) {
      throw new Error("Invalid category ID");
    }

    const { name, description } = req.body;

    if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
      throw new Error("Name must be a non-empty string");
    }

    const category = await categoryModel.update(id, name || null, description ?? null);

    if (!category) {
      throw new Error("Category not found");
    }

    logger.info(`Category updated: ${id}`);
    res.json(category);
  },

  async delete(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string, 10);

    if (isNaN(id)) {
      throw new Error("Invalid category ID");
    }

    const deleted = await categoryModel.delete(id);

    if (!deleted) {
      throw new Error("Category not found");
    }

    logger.info(`Category deleted: ${id}`);
    res.status(204).send();
  },
};
