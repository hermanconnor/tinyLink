import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err.message);

  const status = res.statusCode ? res.statusCode : 500;

  res.status(status);

  res.json({ message: err.message });
};

export default errorHandler;
