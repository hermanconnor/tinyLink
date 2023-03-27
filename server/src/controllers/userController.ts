import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';

import User from '../models/User.js';
import validateUser from '../helpers/validateUser.js';

// REGISTER USER
export const createUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const parsed = validateUser({ username, email, password });
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.format() });
  }

  const userExists = await User.findOne({ email }).lean().exec();
  if (userExists) {
    res.status(400);
    throw new Error('User already registered');
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hash });

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET as Secret,
    { expiresIn: '15min' },
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
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({ accessToken });
};

// UPDATE USER
export const updateUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (req.user?.userId.toString() !== req.params.id) {
    res.status(403);
    throw new Error('Forbidden. User not authorized');
  }

  const parsed = validateUser({ username, email, password });
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.format() });
  }

  const user = await User.findById(req.user?.userId).exec();
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.username = username;
  user.email = email;
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();

  res.json('Profile updated successfully');
};

// DELETE USER
export const deleteUser = async (req: Request, res: Response) => {
  if (!req.user?.userId) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  if (req.user?.userId.toString() !== req.params.id) {
    res.status(403);
    throw new Error('Forbidden. User not authorized');
  }

  const user = await User.findByIdAndDelete(req.user?.userId).exec();
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // TODO: *** MAYBE CLEAR/DELETE COOKIES ***
  // const cookies = req.cookies;

  // if (!cookies?.jwt) return res.sendStatus(204);

  // res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });

  res.status(200).json('Account deleted');
};

// message: {
//   _errors: [],
//   username: {
//     _errors: ['String must contain at least 1 character(s)'],
//   },
//   email: {
//     _errors: ['Invalid email'],
//   },
//   password: {
//     _errors: ['String must contain at least 6 character(s)'],
//   },
// };
