import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InstagramService } from './instagram.service';
import { InstagramImportService } from './instagram-import.service';
import {
  CreateInstagramPostDto,
  ImportInstagramDto,
  ReorderInstagramDto,
  UpdateInstagramPostDto,
} from './dto/instagram-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/**
 * Guards sit on the routes rather than the class: `feed` is the storefront's
 * public read, everything else is admin-only.
 */
@Controller('instagram')
export class InstagramController {
  constructor(
    private instagram: InstagramService,
    private importer: InstagramImportService,
  ) {}

  @Get('feed')
  feed(@Query('limit') limit?: string) {
    return this.instagram.findPublished(Number(limit) || 12);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.instagram.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateInstagramPostDto) {
    return this.instagram.create(dto);
  }

  /** Pulls the image and caption off a post link so neither is retyped. */
  @Post('import')
  @UseGuards(JwtAuthGuard)
  importPost(@Body() dto: ImportInstagramDto) {
    return this.importer.importFromUrl(dto.url);
  }

  // Declared before ':id' so "reorder" is not read as an id
  @Patch('reorder')
  @UseGuards(JwtAuthGuard)
  reorder(@Body() dto: ReorderInstagramDto) {
    return this.instagram.reorder(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateInstagramPostDto) {
    return this.instagram.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.instagram.remove(id);
  }
}
