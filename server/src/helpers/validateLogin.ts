import { z } from 'zod';

interface UserLogin {
  email: string;
  password: string;
}

export default function validateLogin(userInfo: UserLogin) {
  const { email, password } = userInfo;

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
  });

  return schema.safeParse({
    email,
    password,
  });
}
