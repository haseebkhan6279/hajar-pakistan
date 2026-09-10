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
import { InquiriesService } from './inquiries.service';
import {
  CreateInquiryDto,
  UpdateInquiryNoteDto,
  UpdateInquiryStatusDto,
} from './dto/inquiry.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('inquiries')
export class InquiriesController {
  constructor(private inquiries: InquiriesService) {}

  /** Public — the storefront contact form posts here. */
  @Post()
  create(@Body() dto: CreateInquiryDto) {
    return this.inquiries.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('status') status?: string) {
    return this.inquiries.findAll(status);
  }

  // Declared before ':id' so "new-count" is not swallowed as an id.
  @UseGuards(JwtAuthGuard)
  @Get('new-count')
  countNew() {
    return this.inquiries.countNew();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inquiries.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateInquiryStatusDto) {
    return this.inquiries.updateStatus(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/note')
  updateNote(@Param('id') id: string, @Body() dto: UpdateInquiryNoteDto) {
    return this.inquiries.updateNote(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inquiries.remove(id);
  }
}
