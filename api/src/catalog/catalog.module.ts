import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { CategoriesModule } from '../categories/categories.module';
import { CatalogController } from './catalog.controller';

@Module({
  imports: [ProductsModule, CategoriesModule],
  controllers: [CatalogController],
})
export class CatalogModule {}
