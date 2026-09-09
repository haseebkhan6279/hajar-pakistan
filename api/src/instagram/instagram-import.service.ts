import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UploadsService } from '../uploads/uploads.service';

export type ImportedPost = {
  image: string;
  caption: string;
  postUrl: string;
  /** False when the image is still hot-linked from Instagram's CDN */
  mirrored: boolean;
  warning?: string;
};

const OEMBED = 'https://www.instagram.com/api/v1/oembed/';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const TIMEOUT_MS = 10_000;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

type OEmbedResponse = {
  title?: string;
  thumbnail_url?: string;
  author_name?: string;
};

/**
 * Fills a tile in from the post link, so the same image never has to be found
 * and uploaded by hand.
 *
 * Instagram's oEmbed endpoint answers without a token and returns the caption
 * and a 640px thumbnail. It is not part of the documented Graph API, so it can
 * rate-limit or refuse — every failure here is reported as "paste the image
 * yourself instead", never as a broken page.
 */
@Injectable()
export class InstagramImportService {
  private readonly logger = new Logger(InstagramImportService.name);

  constructor(private uploads: UploadsService) {}

  /** Only real post permalinks — this URL is fetched by the server. */
  private normalizeUrl(input: string): string {
    let parsed: URL;
    try {
      parsed = new URL(input.trim());
    } catch {
      throw new BadRequestException('That is not a valid link');
    }
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    if (host !== 'instagram.com' && host !== 'instagr.am') {
      throw new BadRequestException('Only instagram.com links can be imported');
    }
    if (!/^\/(p|reel|tv)\/[\w-]+\/?$/.test(parsed.pathname)) {
      throw new BadRequestException(
        'Use the link to a single post, e.g. instagram.com/p/ABC123/',
      );
    }
    // Drop tracking params — they are not needed and vary per share
    return `https://www.instagram.com${parsed.pathname.replace(/\/?$/, '/')}`;
  }

  async importFromUrl(input: string): Promise<ImportedPost> {
    const postUrl = this.normalizeUrl(input);

    let data: OEmbedResponse;
    try {
      const res = await fetch(
        `${OEMBED}?url=${encodeURIComponent(postUrl)}&omitscript=true`,
        {
          headers: { 'User-Agent': UA, Accept: 'application/json' },
          signal: AbortSignal.timeout(TIMEOUT_MS),
        },
      );
      if (!res.ok) {
        throw new Error(`oEmbed responded ${res.status}`);
      }
      data = (await res.json()) as OEmbedResponse;
    } catch (err) {
      this.logger.warn(`oEmbed failed for ${postUrl}: ${String(err)}`);
      throw new BadRequestException(
        'Instagram did not return this post. It may be private or removed — upload the image instead.',
      );
    }

    const thumbnail = data.thumbnail_url;
    if (!thumbnail) {
      throw new BadRequestException(
        'Instagram returned no image for this post — upload it instead.',
      );
    }

    // Collapse the caption onto one line; the tile shows a few lines at most
    const caption = (data.title ?? '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 300);

    const mirror = await this.mirror(thumbnail);
    return { ...mirror, caption, postUrl };
  }

  /**
   * Copy the image into Cloudinary. Instagram's CDN URLs are signed and expire,
   * so a stored copy is the only version that keeps working — but a missing
   * Cloudinary key should not block the import, so the original URL is used
   * with a warning attached.
   */
  private async mirror(
    thumbnail: string,
  ): Promise<Pick<ImportedPost, 'image' | 'mirrored' | 'warning'>> {
    try {
      const res = await fetch(thumbnail, {
        headers: { 'User-Agent': UA },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`image responded ${res.status}`);

      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.byteLength > MAX_IMAGE_BYTES) {
        throw new Error('image too large');
      }

      const { url } = await this.uploads.uploadBuffer(buffer);
      return { image: url, mirrored: true };
    } catch (err) {
      this.logger.warn(`Could not mirror ${thumbnail}: ${String(err)}`);
      return {
        image: thumbnail,
        mirrored: false,
        warning:
          'Saved, but the image is still loading from Instagram and will stop working when that link expires. Add the Cloudinary keys to api/.env to keep a permanent copy.',
      };
    }
  }
}
