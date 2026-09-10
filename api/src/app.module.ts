import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';
import { SeedModule } from './seed/seed.module';
import { CatalogModule } from './catalog/catalog.module';
import { OrdersModule } from './orders/orders.module';
import { InstagramModule } from './instagram/instagram.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGODB_URI'),
        family: 4,
        // Serverless runs many short-lived containers at once, and an Atlas
        // M0 caps total connections at 500 — a large pool per container
        // exhausts that far sooner than the traffic warrants.
        maxPoolSize: process.env.VERCEL ? 5 : 20,
        // Must stay under the function's maxDuration so a cluster that is
        // unreachable fails with a real error instead of a platform timeout.
        serverSelectionTimeoutMS: process.env.VERCEL ? 10000 : 20000,
      }),
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    UploadsModule,
    SeedModule,
    CatalogModule,
    OrdersModule,
    InstagramModule,
    InquiriesModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
