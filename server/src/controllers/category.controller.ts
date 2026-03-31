import { type Request, type Response } from "express";
import { logger } from "@/utils/log";

export async function getAllCategories(req: Request, res: Response): Promise<void> {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit as string, 10) || 10, 1), 100);
    const offset = parseInt(req.query.offset as string, 10) || 0;

    // TODO: call service
    const result = {data: [], total: 0, limit, offset};
    res.json(result);
  } catch (error) {
    logger.error("Failed to fetch categories", error);
    res.status(500).json({error: "Failed to fetch categories"});
  }
}

export async function getCategoryById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);

    if (isNaN(id)) {
      res.status(400).json({error: "Invalid category ID"});
      return;
    }

    // TODO: call service
    res.json(null);
  } catch (error) {
    logger.error("Failed to fetch category", error);
    res.status(500).json({error: "Failed to fetch category"});
  }
}

export async function createCategory(req: Request, res: Response): Promise<void> {
  try {
    const {name, description} = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      res.status(400).json({error: "Name is required"});
      return;
    }

    // TODO: call service
    res.status(201).json({id: 1, name: name.trim(), description});
  } catch (error) {
    logger.error("Failed to create category", error);
    res.status(500).json({error: "Failed to create category"});
  }
}

export async function updateCategory(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);

    if (isNaN(id)) {
      res.status(400).json({error: "Invalid category ID"});
      return;
    }

    const {name, description} = req.body;

    if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
      res.status(400).json({error: "Name must be a non-empty string"});
      return;
    }

    // TODO: call service
    res.json({id, name: name || "updated", description});
  } catch (error) {
    logger.error("Failed to update category", error);
    res.status(500).json({error: "Failed to update category"});
  }
}

export async function deleteCategory(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);

    if (isNaN(id)) {
      res.status(400).json({error: "Invalid category ID"});
      return;
    }

    // TODO: call service
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message.includes("fk_category")) {
      res.status(409).json({error: "Cannot delete category with associated products"});
      return;
    }
    logger.error("Failed to delete category", error);
    res.status(500).json({error: "Failed to delete category"});
  }
}
