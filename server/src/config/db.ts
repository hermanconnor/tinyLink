import mongoose from 'mongoose';

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URI ?? '');
  } catch (err) {
    let message;

    if (err instanceof Error) {
      message = err.message;
    } else {
      message = err;
    }

    console.error(message);
    process.exit(1);
  }
};

export default dbConnect;
