import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { ReqUser } from '../types/ReqUser.js';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const auhtHeader = req.headers.authorization;

  if (!auhtHeader?.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  const token = auhtHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as Secret,
    );

    req.user = decoded as ReqUser;

    next();
  } catch (err) {
    res.status(403);
    throw new Error('Forbidden');
  }
};

export default verifyToken;
