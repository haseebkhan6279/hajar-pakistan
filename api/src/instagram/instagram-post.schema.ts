import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InstagramPostDocument = HydratedDocument<InstagramPost>;

/**
 * A tile in the storefront Instagram grid.
 *
 * Posts are curated by hand rather than pulled from Instagram: the Basic
 * Display API was shut down in December 2024, and the replacement needs a Meta
 * app plus a token that expires every 60 days. If that sync is added later it
 * should write into this same collection, so the storefront never has to care
 * where a tile came from.
 */
@Schema({ timestamps: true })
export class InstagramPost {
  /** Cloudinary URL of the square crop shown in the grid */
  @Prop({ required: true, trim: true })
  image: string;

  /**
   * Optional Cloudinary URL of a reel. When set, the tile plays this on loop
   * with  as its poster frame — Instagram hands out no public video
   * URL, so the file is uploaded here rather than pulled off the post.
   */
  @Prop({ default: '', trim: true })
  video: string;

  /** Shown on hover, and used as the image alt text */
  @Prop({ default: '', trim: true })
  caption: string;

  /** Permalink to the post — falls back to the profile when empty */
  @Prop({ default: '', trim: true })
  postUrl: string;

  /** Lower shows first */
  @Prop({ default: 0 })
  sortOrder: number;

  /** Unpublished tiles stay in the dashboard but drop off the storefront */
  @Prop({ default: true })
  published: boolean;
}

export const InstagramPostSchema = SchemaFactory.createForClass(InstagramPost);

export function toAdminPost(doc: InstagramPostDocument) {
  const o = doc.toObject();
  return {
    id: String(o._id),
    image: o.image,
    video: o.video ?? '',
    caption: o.caption ?? '',
    postUrl: o.postUrl ?? '',
    sortOrder: o.sortOrder ?? 0,
    published: o.published !== false,
  };
}

/** What the storefront gets — no ordering or draft state leaks out. */
export function toPublicPost(doc: InstagramPostDocument) {
  const o = doc.toObject();
  return {
    id: String(o._id),
    image: o.image,
    video: o.video ?? '',
    caption: o.caption ?? '',
    postUrl: o.postUrl ?? '',
  };
}
