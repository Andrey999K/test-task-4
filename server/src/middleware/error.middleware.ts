import { type NextFunction, type Request, type Response } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const message = err.message;
  let statusCode = 500;

  if (message.includes("not found")) {
    statusCode = 404;
  } else if (message.includes("required") || message.includes("must be") || message.includes("Invalid")) {
    statusCode = 400;
  } else if (message.includes("fk_category")) {
    statusCode = 400;
  }

  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
