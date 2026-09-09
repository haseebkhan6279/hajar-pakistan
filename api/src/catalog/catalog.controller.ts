import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { CategoriesService } from '../categories/categories.service';

/** Public, unauthenticated read surface for the storefront. */
@Controller('catalog')
export class CatalogController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get('products')
  listProducts(@Query('q') q?: string, @Query('category') category?: string) {
    return this.productsService.findPublished(q, category);
  }

  @Get('products/by-slug/:slug')
  productBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug, true);
  }

  @Get('categories')
  listCategories() {
    return this.categoriesService.findAll();
  }
}
