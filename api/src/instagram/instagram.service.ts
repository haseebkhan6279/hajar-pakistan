import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  InstagramPost,
  InstagramPostDocument,
  toAdminPost,
  toPublicPost,
} from './instagram-post.schema';
import {
  CreateInstagramPostDto,
  ReorderInstagramDto,
  UpdateInstagramPostDto,
} from './dto/instagram-post.dto';

/** Ceiling on what the storefront can ask for, so the grid can't be flooded. */
const MAX_FEED = 24;

@Injectable()
export class InstagramService {
  constructor(
    @InjectModel(InstagramPost.name)
    private postModel: Model<InstagramPostDocument>,
  ) {}

  /** Everything, drafts included — the dashboard list. */
  async findAll() {
    const docs = await this.postModel
      .find()
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
    return docs.map(toAdminPost);
  }

  /** Published tiles only — the storefront grid. */
  async findPublished(limit = 12) {
    const capped = Math.min(Math.max(Math.trunc(limit) || 12, 1), MAX_FEED);
    const docs = await this.postModel
      .find({ published: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(capped)
      .exec();
    return docs.map(toPublicPost);
  }

  async create(dto: CreateInstagramPostDto) {
    const image = dto.image?.trim();
    if (!image) throw new BadRequestException('An image is required');

    // New tiles land at the end unless the caller places them
    const sortOrder =
      dto.sortOrder ?? (await this.postModel.countDocuments().exec());

    const doc = await this.postModel.create({
      image,
      caption: dto.caption?.trim() ?? '',
      postUrl: dto.postUrl?.trim() ?? '',
      sortOrder,
      published: dto.published ?? true,
    });
    return toAdminPost(doc);
  }

  async update(id: string, dto: UpdateInstagramPostDto) {
    const patch: Record<string, unknown> = {};
    if (dto.image !== undefined) {
      const image = dto.image.trim();
      if (!image) throw new BadRequestException('An image is required');
      patch.image = image;
    }
    if (dto.caption !== undefined) patch.caption = dto.caption.trim();
    if (dto.postUrl !== undefined) patch.postUrl = dto.postUrl.trim();
    if (dto.sortOrder !== undefined) patch.sortOrder = dto.sortOrder;
    if (dto.published !== undefined) patch.published = dto.published;

    const doc = await this.postModel
      .findByIdAndUpdate(id, patch, { new: true })
      .exec();
    if (!doc) throw new NotFoundException('Post not found');
    return toAdminPost(doc);
  }

  /** Rewrites sortOrder to match the order the ids arrive in. */
  async reorder(dto: ReorderInstagramDto) {
    await this.postModel.bulkWrite(
      dto.ids.map((id, index) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { sortOrder: index } },
        },
      })),
    );
    return this.findAll();
  }

  async remove(id: string) {
    const doc = await this.postModel.findByIdAndDelete(id).exec();
    if (!doc) throw new NotFoundException('Post not found');
    return { ok: true };
  }
}
