import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument, toAdminCategory } from './category.schema';
import { Product, ProductDocument } from '../products/product.schema';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { slugify } from '../common/slug';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll() {
    const docs = await this.categoryModel
      .find()
      .sort({ sortOrder: 1, name: 1 })
      .exec();
    const counts = await this.productModel.aggregate<{
      _id: string;
      count: number;
    }>([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const byName = new Map(counts.map((c) => [c._id, c.count]));

    // A parent shows the total of its children, since products are filed
    // against leaves only.
    const childTotals = new Map<string, number>();
    for (const d of docs) {
      if (!d.parentSlug) continue;
      childTotals.set(
        d.parentSlug,
        (childTotals.get(d.parentSlug) ?? 0) + (byName.get(d.name) ?? 0),
      );
    }

    return docs.map((d) =>
      toAdminCategory(d, (byName.get(d.name) ?? 0) + (childTotals.get(d.slug) ?? 0)),
    );
  }

  async create(dto: CreateCategoryDto) {
    const slug = slugify(dto.slug || dto.name);
    if (!slug) throw new BadRequestException('A valid slug is required');
    const doc = await this.categoryModel.create({
      name: dto.name.trim(),
      slug,
      tagline: dto.tagline ?? '',
      image: dto.image ?? '',
      sortOrder: dto.sortOrder ?? 0,
      parentSlug: dto.parentSlug ?? '',
    });
    return toAdminCategory(doc, 0);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const patch: Record<string, unknown> = {};
    if (dto.name) patch.name = dto.name.trim();
    if (dto.slug !== undefined) {
      const slug = slugify(dto.slug);
      if (!slug) throw new BadRequestException('A valid slug is required');
      patch.slug = slug;
    }
    if (dto.tagline !== undefined) patch.tagline = dto.tagline;
    if (dto.image !== undefined) patch.image = dto.image;
    if (dto.sortOrder !== undefined) patch.sortOrder = dto.sortOrder;
    if (dto.parentSlug !== undefined) patch.parentSlug = dto.parentSlug;

    const doc = await this.categoryModel
      .findByIdAndUpdate(id, patch, { new: true })
      .exec();
    if (!doc) throw new NotFoundException('Category not found');
    const count = await this.productModel.countDocuments({
      category: doc.name,
      status: 'published',
    });
    return toAdminCategory(doc, count);
  }

  async remove(id: string) {
    const doc = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!doc) throw new NotFoundException('Category not found');
    return { ok: true };
  }

  count() {
    return this.categoryModel.countDocuments().exec();
  }
}
