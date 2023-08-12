import { z } from 'zod';

export const postValidationSchema = z.object({
  post: z.string().min(1, { message: 'please write something...' }),
  media: z.union([
    z.string(),
    z.string().url(),
    z
      .any()
      .refine((file?: FileList) => {
        if (!file) return true;
        if (file && file.length === 0) return true;
        if (file)
          return [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
          ].includes(file[0].type);
      }, 'only .jpg, .jpeg, .png and .webp formats are supported...')
      .refine((file?: FileList) => {
        if (!file) return true;
        if (file && file.length === 0) return true;
        if (file) return file?.[0]?.size <= 5_000_000;
      }, `max image size is 5MB...`),
  ]),
});
export type PostValidationSchema = z.infer<typeof postValidationSchema>;
