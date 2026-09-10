import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../users/user.schema';
import { Category, CategoryDocument } from '../categories/category.schema';
import { DEFAULT_CATEGORIES } from '../common/brand';

const SEED_CATEGORIES = DEFAULT_CATEGORIES.map((c) => ({ ...c }));

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private config: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async onModuleInit() {
    // On a long-running server this costs one bcrypt hash per restart. On
    // serverless it would cost one per cold start, on the request that
    // happens to pay for the container — so it is opt-out there, and the
    // same work is done deliberately with `npm run reset:admin` /
    // `npm run sync:collections` instead.
    if ((this.config.get<string>('SEED_ON_BOOT') ?? 'true') !== 'true') {
      this.logger.log('SEED_ON_BOOT is off — skipping boot seed');
      return;
    }

    const email = this.config.getOrThrow<string>('ADMIN_EMAIL').toLowerCase();
    const password = this.config.getOrThrow<string>('ADMIN_PASSWORD');
    const passwordHash = await bcrypt.hash(password, 10);
    await this.userModel.findOneAndUpdate(
      { email },
      { email, passwordHash, role: 'admin' },
      { upsert: true, new: true },
    );
    this.logger.log(`Admin user ready: ${email}`);

    // Upsert by slug so renaming in the dashboard is never clobbered on restart.
    for (const cat of SEED_CATEGORIES) {
      await this.categoryModel.findOneAndUpdate(
        { slug: cat.slug },
        { $setOnInsert: cat },
        { upsert: true, new: true },
      );
    }
    this.logger.log(
      'Collections ready: HAJAR (ZOUQ 1, ZOUQ 2) / HAJAR BY NAZISH ALI',
    );
  }
}
