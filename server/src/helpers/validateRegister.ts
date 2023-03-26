import { z } from 'zod';

interface UserInfo {
  username: string;
  email: string;
  password: string;
}

export default function validateRegister(newUser: UserInfo) {
  const { username, email, password } = newUser;

  const schema = z.object({
    username: z
      .string({ invalid_type_error: 'Username must be a string' })
      .nonempty({ message: 'Username is required' })
      .max(50, { message: 'Must be 50 characters or less' }),
    email: z
      .string({ invalid_type_error: 'Email must be a string' })
      .nonempty({ message: 'Email is required' })
      .email()
      .max(255),
    password: z
      .string({ invalid_type_error: 'Password must be a string' })
      .min(6, { message: 'Must be 6 or more characters long' })
      .max(255),
  });

  return schema.safeParse({
    username,
    email,
    password,
  });
}
