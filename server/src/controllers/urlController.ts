import { Request, Response } from 'express';
import { nanoid } from 'nanoid';

import Url from '../models/Url.js';
import validateUrl from '../helpers/validateUrl.js';

const BASE_URL = 'http://localhost:5000';

// CREATE SHORT LINK
export const createUrl = async (req: Request, res: Response) => {
  const { longUrl, name } = req.body;

  if (!req.user?.userId) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  const parsed = validateUrl({ longUrl });
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.format() });
  }

  const linkExists = await Url.find({ user: req.user?.userId })
    .where('longUrl')
    .equals(longUrl)
    .lean()
    .exec();

  if (linkExists.length) return res.status(200).json(linkExists);

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

// GET ALL LINKS FOR A USER
export const getUserLinks = async (req: Request, res: Response) => {
  if (!req.user?.userId) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  if (req.user?.userId !== req.params.id) {
    res.status(403);
    throw new Error('Forbidden');
  }

  const links = await Url.find({ user: req.user?.userId }).lean().exec();
  if (!links) {
    res.status(404);
    throw new Error('No links found');
  }

  res.status(200).json(links);
};

// GET LINK BY CODE
export const getUrlByUrlCode = async (req: Request, res: Response) => {
  // if (!req.user?.userId) {
  //   res.status(401);
  //   throw new Error('Unauthorized');
  // }

  const link = await Url.findOne({ urlCode: req.params.code }).exec();
  if (!link) {
    res.status(404);
    throw new Error('Link not found');
  }

  // if (req.user?.userId !== link.user.toString()) {
  //   res.status(403);
  //   throw new Error('Forbidden');
  // }

  link.visitCount += 1;

  await link.save();

  res.status(301).redirect(link.longUrl);
};

// UPDATE LINK
export const updateUrlCode = async (req: Request, res: Response) => {
  const { longUrl, name } = req.body;

  if (!req.user?.userId) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  const parsed = validateUrl({ longUrl });
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.format() });
  }

  const link = await Url.findOne({ urlCode: req.params.code }).exec();
  if (!link) {
    res.status(404);
    throw new Error('Link not found');
  }

  if (req.user?.userId !== link.user.toString()) {
    res.status(403);
    throw new Error('Forbidden');
  }

  link.longUrl = longUrl;
  link.name = name;

  await link.save();

  res.status(200).json(link);
};

// DELETE LINK
export const deleteUrlCode = async (req: Request, res: Response) => {
  if (!req.user?.userId) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  const link = await Url.findOne({ urlCode: req.params.code }).exec();
  if (!link) {
    res.status(404);
    throw new Error('Link not found');
  }

  if (req.user?.userId !== link.user.toString()) {
    res.status(403);
    throw new Error('Forbidden');
  }

  await link.deleteOne();

  res.status(200).json('Link successfully deleted');
};
