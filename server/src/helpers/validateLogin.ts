import { z } from 'zod';

interface UserLogin {
  email: string;
  password: string;
}

export default function validateLogin(userInfo: UserLogin) {
  const { email, password } = userInfo;

  const schema = z.object({
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
    email,
    password,
  });
}
