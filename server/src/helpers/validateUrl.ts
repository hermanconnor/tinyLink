import { z } from 'zod';

interface UserUrl {
  longUrl: string;
}

export default function validateUrl(userUrl: UserUrl) {
  const { longUrl } = userUrl;

  const schema = z.object({
    longUrl: z
      .string({ invalid_type_error: 'URL must be a string' })
      .nonempty({ message: 'URL is required' })
      .url({ message: 'Invalid URL' }),
  });

  return schema.safeParse({
    longUrl,
  });
}
