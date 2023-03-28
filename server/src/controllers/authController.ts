import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';

import User from '../models/User.js';
import validateLogin from '../helpers/validateLogin.js';
import { ReqUser } from '../types/ReqUser.js';

const MAX_AGE = 7 * 24 * 60 * 60 * 1000;

// LOGIN USER
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const parsed = validateLogin({ email, password });
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.format() });
  }

  const user = await User.findOne({ email }).exec();
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET as Secret,
    { expiresIn: '15m' },
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET as Secret,
    { expiresIn: '7d' },
  );

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: MAX_AGE,
  });

  res.status(200).json({ accessToken });
};

// LOGOUT
export const logoutUser = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204);

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });

  res.json({ message: 'Loggged Out Successfully' });
};

// REFRESH TOKEN
export const refresh = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  const refreshToken = cookies.jwt;

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as Secret,
    );

    const decodedUser = decoded as ReqUser;

    const user = await User.findById(decodedUser.userId).exec();

    if (!user) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET as Secret,
      { expiresIn: '15m' },
    );

    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(403);
    throw new Error('Forbidden');
  }
};
