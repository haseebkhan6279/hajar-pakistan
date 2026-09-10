import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { UPLOAD_FOLDER } from '../common/brand';

export type UploadKind = 'image' | 'video';

/**
 * File storage, when it is switched on.
 *
 * Cloudinary is optional: the keys may simply be absent, and the API still has
 * to boot without them — reading them with getOrThrow here would take the whole
 * process down at startup over a feature nobody has asked for yet. Instead the
 * service reports itself unconfigured and refuses the individual request, which
 * the Instagram importer already treats as "keep the original URL".
 *
 * To switch it on: set the three CLOUDINARY_* variables and redeploy.
 */
@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  readonly isConfigured: boolean;

  constructor(config: ConfigService) {
    const cloudName = config.get<string>('CLOUDINARY_CLOUD_NAME')?.trim();
    const apiKey = config.get<string>('CLOUDINARY_API_KEY')?.trim();
    const apiSecret = config.get<string>('CLOUDINARY_API_SECRET')?.trim();

    this.isConfigured = Boolean(cloudName && apiKey && apiSecret);

    if (this.isConfigured) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
    } else {
      this.logger.warn(
        'CLOUDINARY_* not set — file uploads are disabled and will return 503',
      );
    }
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
  ): Promise<{ url: string; publicId: string }> {
    if (!this.isConfigured) {
      throw new ServiceUnavailableException(
        'File uploads are not configured on this server.',
      );
    }

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
