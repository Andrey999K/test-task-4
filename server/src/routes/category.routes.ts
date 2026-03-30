import { Router, Response } from "express";

const router = Router();

router.get("/", (_req, res: Response) => {
  res.json({ message: "GET all categories - TODO" });
});

router.get("/:id", (_req, res: Response) => {
  res.json({ message: "GET category by id - TODO" });
});

router.post("/", (_req, res: Response) => {
  res.json({ message: "POST create category - TODO" });
});

router.put("/:id", (_req, res: Response) => {
  res.json({ message: "PUT update category - TODO" });
});

router.delete("/:id", (_req, res: Response) => {
  res.json({ message: "DELETE category - TODO" });
});

export { router as categoryRoutes };
