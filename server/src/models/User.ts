import { Schema, model } from 'mongoose';

interface IUser {
  username: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      maxlength: 50,
      required: true,
    },

    email: {
      type: String,
      maxlength: 255,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      minlength: 6,
      maxlength: 255,
      required: true,
    },
  },
  { timestamps: true },
);

export default model('User', userSchema);
