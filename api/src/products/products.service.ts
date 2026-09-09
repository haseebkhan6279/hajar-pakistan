import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument, toAdminProduct } from './product.schema';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { slugify } from '../common/slug';
import { BRAND_NAME } from '../common/brand';

function sanitizeSpecs(specs?: { key: string; value: string; _id?: string }[]) {
  return (specs ?? []).map(({ key, value }) => ({ key, value }));
}

function sanitizeColors(colors?: { name: string; hex: string; _id?: string }[]) {
  return (colors ?? []).map(({ name, hex }) => ({ name, hex }));
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(q?: string, status?: string) {
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } },
      ];
    }
    const docs = await this.productModel
      .find(filter)
      .sort({ updatedAt: -1 })
      .exec();
    return docs.map(toAdminProduct);
  }

  async findOne(id: string) {
    const doc = await this.productModel.findById(id).exec();
    if (!doc) throw new NotFoundException('Product not found');
    return toAdminProduct(doc);
  }

  async findBySlug(slug: string, publishedOnly = false) {
    const raw = decodeURIComponent(slug).toLowerCase().trim();
    const normalized = slugify(raw);
    const slugCandidates = [...new Set([normalized, raw].filter(Boolean))];
    const filter: Record<string, unknown> = { slug: { $in: slugCandidates } };
    if (publishedOnly) filter.status = 'published';
    const doc = await this.productModel.findOne(filter).exec();
    if (!doc) throw new NotFoundException('Product not found');
    return toAdminProduct(doc);
  }

  async findPublished(q?: string, category?: string) {
    const filter: Record<string, unknown> = { status: 'published' };
    if (category) filter.category = category;
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } },
      ];
    }
    const docs = await this.productModel
      .find(filter)
      .sort({ updatedAt: -1 })
      .exec();
    return docs.map(toAdminProduct);
  }

  async create(dto: CreateProductDto) {
    const slug = slugify(dto.slug || dto.name);
    if (!slug) throw new BadRequestException('A valid slug is required');
    const doc = await this.productModel.create({
      ...dto,
      slug,
      brand: dto.brand ?? BRAND_NAME,
      stock: dto.stock ?? 0,
      status: dto.status ?? 'draft',
      tags: dto.tags ?? [],
      highlights: dto.highlights ?? [],
      sizes: dto.sizes ?? [],
      colors: sanitizeColors(dto.colors),
      fabric: dto.fabric ?? '',
      pieces: dto.pieces ?? '',
      specifications: sanitizeSpecs(dto.specifications),
      images: dto.images ?? [],
    });
    return toAdminProduct(doc);
  }

  async update(id: string, dto: UpdateProductDto) {
    const patch: Record<string, unknown> = { ...dto };
    if (dto.slug !== undefined) {
      const slug = slugify(dto.slug);
      if (!slug) throw new BadRequestException('A valid slug is required');
      patch.slug = slug;
    }
    if (dto.specifications !== undefined) {
      patch.specifications = sanitizeSpecs(dto.specifications);
    }
    if (dto.colors !== undefined) {
      patch.colors = sanitizeColors(dto.colors);
    }
    const doc = await this.productModel
      .findByIdAndUpdate(id, patch, { new: true })
      .exec();
    if (!doc) throw new NotFoundException('Product not found');
    return toAdminProduct(doc);
  }

  async remove(id: string) {
    const doc = await this.productModel.findByIdAndDelete(id).exec();
    if (!doc) throw new NotFoundException('Product not found');
    return { ok: true };
  }

  count() {
    return this.productModel.countDocuments().exec();
  }
}
