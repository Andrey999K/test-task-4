import { Router, Response } from "express";

const router = Router();

router.get("/", (_req, res: Response) => {
  res.json({ message: "GET all products - TODO" });
});

router.get("/:id", (_req, res: Response) => {
  res.json({ message: "GET product by id - TODO" });
});

router.post("/", (_req, res: Response) => {
  res.json({ message: "POST create product - TODO" });
});

router.put("/:id", (_req, res: Response) => {
  res.json({ message: "PUT update product - TODO" });
});

router.delete("/:id", (_req, res: Response) => {
  res.json({ message: "DELETE product - TODO" });
});

export { router as productRoutes };
