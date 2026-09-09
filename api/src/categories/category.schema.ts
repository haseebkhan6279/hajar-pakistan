import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  /** Short line used on the collection landing page */
  @Prop({ default: '' })
  tagline: string;

  /** Cover image for the collection card / hero */
  @Prop({ default: '' })
  image: string;

  /** Manual ordering in nav and grids — lower shows first */
  @Prop({ default: 0 })
  sortOrder: number;

  /**
   * Slug of the parent collection, empty for a top-level house.
   * HAJAR is a parent of ZOUQ 1 and ZOUQ 2; HAJAR BY NAZISH ALI stands alone.
   * Products are always filed against a leaf.
   */
  @Prop({ default: '' })
  parentSlug: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

export function toAdminCategory(doc: CategoryDocument, productCount = 0) {
  const o = doc.toObject();
  return {
    id: String(o._id),
    name: o.name,
    slug: o.slug,
    tagline: o.tagline ?? '',
    image: o.image ?? '',
    sortOrder: o.sortOrder ?? 0,
    parentSlug: o.parentSlug ?? '',
    productCount,
  };
}
