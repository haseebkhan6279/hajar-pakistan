import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BRAND_NAME } from '../common/brand';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ default: BRAND_NAME })
  brand: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  compareAtPrice?: number;

  @Prop({ default: 0 })
  stock: number;

  @Prop({ default: 'draft', enum: ['draft', 'published'] })
  status: 'draft' | 'published';

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: '' })
  description: string;

  @Prop({ type: [String], default: [] })
  highlights: string[];

  /** Apparel sizing — e.g. XS · S · M · L · XL or Unstitched */
  @Prop({ type: [String], default: [] })
  sizes: string[];

  /** Colourways shown as swatches on the PDP */
  @Prop({
    type: [{ name: { type: String }, hex: { type: String }, _id: false }],
    default: [],
  })
  colors: { name: string; hex: string }[];

  /** Fabric / composition line shown above the spec table */
  @Prop({ default: '' })
  fabric: string;

  /** Number of pieces in the suit — "3 Piece", "2 Piece", "Unstitched" */
  @Prop({ default: '' })
  pieces: string;

  @Prop({
    type: [{ key: { type: String }, value: { type: String }, _id: false }],
    default: [],
  })
  specifications: { key: string; value: string }[];

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: '' })
  seoTitle: string;

  @Prop({ default: '' })
  seoDescription: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

export function toAdminProduct(doc: ProductDocument) {
  const o = doc.toObject();
  const images = o.images ?? [];
  return {
    id: String(o._id),
    name: o.name,
    slug: o.slug,
    brand: o.brand,
    category: o.category,
    price: o.price,
    compareAtPrice: o.compareAtPrice,
    stock: o.stock,
    status: o.status,
    thumb: images[0] ?? '',
    tags: o.tags ?? [],
    description: o.description ?? '',
    highlights: o.highlights ?? [],
    sizes: o.sizes ?? [],
    colors: (o.colors ?? []).map((c: { name?: string; hex?: string }) => ({
      name: c.name ?? '',
      hex: c.hex ?? '#C6982C',
    })),
    fabric: o.fabric ?? '',
    pieces: o.pieces ?? '',
    specifications: (o.specifications ?? []).map(
      (s: { key?: string; value?: string }) => ({
        key: s.key ?? '',
        value: s.value ?? '',
      }),
    ),
    images,
    seoTitle: o.seoTitle ?? '',
    seoDescription: o.seoDescription ?? '',
  };
}
