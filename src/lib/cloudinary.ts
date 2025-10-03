import { app } from 'app';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { env } from 'env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: env.NODE_ENV === 'production',
});

export default function uploadToCloudinary(
  buffer: Buffer<ArrayBufferLike>,
  publicId: string,
): Promise<UploadApiResponse | undefined> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
          resource_type: 'image',
          folder: 'blog-api',
          public_id: publicId,
          transformation: { quality: 'auto' },
        },
        (err, result) => {
          if (err) {
            app.log.error(err, 'Error uploading image to Cloudinary.');

            reject(err);
          }

          resolve(result);
        },
      )
      .end(buffer);
  });
}
