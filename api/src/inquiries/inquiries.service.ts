import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  INQUIRY_STATUSES,
  Inquiry,
  InquiryDocument,
  toAdminInquiry,
} from './inquiry.schema';
import {
  CreateInquiryDto,
  UpdateInquiryNoteDto,
  UpdateInquiryStatusDto,
} from './dto/inquiry.dto';

@Injectable()
export class InquiriesService {
  private readonly logger = new Logger(InquiriesService.name);

  constructor(
    @InjectModel(Inquiry.name) private inquiryModel: Model<InquiryDocument>,
  ) {}

  async create(dto: CreateInquiryDto) {
    // Honeypot tripped — answer as though it worked, store nothing.
    if (dto.company?.trim()) {
      this.logger.warn('Discarded an enquiry that filled the honeypot field');
      return { ok: true };
    }

    await this.inquiryModel.create({
      name: dto.name.trim(),
      email: (dto.email ?? '').trim().toLowerCase(),
      phone: (dto.phone ?? '').trim(),
      subject: (dto.subject ?? '').trim(),
      message: dto.message.trim(),
      status: 'new',
      source: 'contact-form',
    });

    // Nothing from the record goes back to the storefront: the endpoint is
    // public, and an id would be enough to start guessing at others.
    return { ok: true };
  }

  async findAll(status?: string) {
    const filter: Record<string, unknown> = {};
    if (status && (INQUIRY_STATUSES as readonly string[]).includes(status)) {
      filter.status = status;
    }
    const docs = await this.inquiryModel
      .find(filter)
      .sort({ createdAt: -1 })
      .exec();
    return docs.map(toAdminInquiry);
  }

  /** Count of unanswered enquiries, for the overview tile and nav badge. */
  async countNew() {
    return { count: await this.inquiryModel.countDocuments({ status: 'new' }) };
  }

  async findOne(id: string) {
    const doc = await this.inquiryModel.findById(id).exec();
    if (!doc) throw new NotFoundException('Inquiry not found');
    return toAdminInquiry(doc);
  }

  async updateStatus(id: string, dto: UpdateInquiryStatusDto) {
    const doc = await this.inquiryModel
      .findByIdAndUpdate(id, { status: dto.status }, { new: true })
      .exec();
    if (!doc) throw new NotFoundException('Inquiry not found');
    return toAdminInquiry(doc);
  }

  async updateNote(id: string, dto: UpdateInquiryNoteDto) {
    const doc = await this.inquiryModel
      .findByIdAndUpdate(id, { adminNote: dto.adminNote }, { new: true })
      .exec();
    if (!doc) throw new NotFoundException('Inquiry not found');
    return toAdminInquiry(doc);
  }

  async remove(id: string) {
    const doc = await this.inquiryModel.findByIdAndDelete(id).exec();
    if (!doc) throw new NotFoundException('Inquiry not found');
    return { ok: true };
  }
}
