import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { UPLOAD_FOLDER } from '../common/brand';

export type UploadKind = 'image' | 'video';

@Injectable()
export class UploadsService {
  constructor(config: ConfigService) {
    cloudinary.config({
      cloud_name: config.getOrThrow('CLOUDINARY_CLOUD_NAME'),
      api_key: config.getOrThrow('CLOUDINARY_API_KEY'),
      api_secret: config.getOrThrow('CLOUDINARY_API_SECRET'),
    });
  }

  /**
   * `kind` picks the Cloudinary resource type. Video has to be declared: an
   * mp4 sent as `image` is stored but never transcoded, and the delivery URL
   * comes back under /image/ where players will not touch it.
   */
  uploadBuffer(
    buffer: Buffer,
    folder = UPLOAD_FOLDER,
    kind: UploadKind = 'image',
  ) {
    return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: kind },
        (err, result) => {
          if (err || !result) {
            reject(err ?? new Error('Upload failed'));
            return;
          }
          resolve({ url: result.secure_url, publicId: result.public_id });
        },
      );
      stream.end(buffer);
    });
  }
}
