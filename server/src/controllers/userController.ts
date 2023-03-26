import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';

import User from '../models/User';
import validateRegister from '../helpers/validateRegister';

// REGISTER USER
export const createUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const parsed = validateRegister({ username, email, password });

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
    { id: user._id },
    process.env.ACCESS_TOKEN_SECRET as Secret,
    { expiresIn: '15min' },
  );

  // const refreshToken = jwt.sign(
  //   { id: user._id },
  //   process.env.REFRESH_TOKEN_SECRET as Secret,
  //   { expiresIn: '7d' },
  // );

  // res.cookie('token', refreshToken, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: 'none',
  //   maxAge: 7 * 24 * 60 * 60 * 1000,
  // });

  res.status(201).json({ accessToken });
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
