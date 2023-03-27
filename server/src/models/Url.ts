import { Schema, Types, model } from 'mongoose';

interface IUrl {
  user: Types.ObjectId;
  urlCode: string;
  longUrl: string;
  shortUrl: string;
  name?: string;
  visitCount: number;
}

const urlSchema = new Schema<IUrl>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    urlCode: {
      type: String,
      required: true,
      unique: true,
    },

    longUrl: {
      type: String,
      required: true,
    },

    shortUrl: {
      type: String,
      required: true,
    },

    name: {
      type: String,
    },

    visitCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default model('Url', urlSchema);
