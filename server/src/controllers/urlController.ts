import { Request, Response } from 'express';
import { nanoid } from 'nanoid';

import Url from '../models/Url.js';
import validateUrl from '../helpers/validateUrl.js';

const BASE_URL = 'http://localhost:5000';

// CREATE SHORT URL
export const createUrl = async (req: Request, res: Response) => {
  const { longUrl, name } = req.body;

  const parsed = validateUrl({ longUrl });
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.format() });
  }

  const urlExists = await Url.findOne({ longUrl }).exec();
  if (urlExists) return res.status(200).json(urlExists);

  const urlCode = nanoid(8);

  const shortUrl = `${BASE_URL}/${urlCode}`;

  const url = await Url.create({
    user: req.user?.userId,
    longUrl,
    shortUrl,
    name,
    urlCode,
  });

  if (!url) {
    res.status(400);
    throw new Error('Invalid data received');
  }

  res.status(201).json(url);
};
