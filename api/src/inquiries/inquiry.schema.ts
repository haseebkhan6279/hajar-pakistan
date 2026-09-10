import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InquiryDocument = HydratedDocument<Inquiry>;

export const INQUIRY_STATUSES = ['new', 'read', 'replied', 'closed'] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

@Schema({ timestamps: true })
export class Inquiry {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: '', trim: true, lowercase: true })
  email: string;

  @Prop({ default: '', trim: true })
  phone: string;

  /**
   * Free text rather than an enum. The storefront offers a fixed list
   * ("Bridal appointment", "Made to order", …) but that copy belongs to the
   * house and changes without a deploy of this service; pinning it here would
   * mean a rejected enquiry every time the wording moved.
   */
  @Prop({ default: '', trim: true })
  subject: string;

  @Prop({ required: true, trim: true })
  message: string;

  @Prop({
    default: 'new',
    enum: INQUIRY_STATUSES,
    index: true,
  })
  status: InquiryStatus;

  /** Where it came from, so a second channel later stays distinguishable. */
  @Prop({ default: 'contact-form' })
  source: string;

  /** Private working note for the team — never shown on the storefront. */
  @Prop({ default: '' })
  adminNote: string;
}

export const InquirySchema = SchemaFactory.createForClass(Inquiry);

// The inbox is always read newest-first, and filtered by status beside it.
InquirySchema.index({ createdAt: -1 });

export function toAdminInquiry(doc: InquiryDocument) {
  const i = doc.toObject() as Inquiry & {
    _id: { toString(): string };
    createdAt?: Date;
    updatedAt?: Date;
  };
  return {
    id: String(i._id),
    name: i.name,
    email: i.email,
    phone: i.phone,
    subject: i.subject,
    message: i.message,
    status: i.status,
    source: i.source,
    adminNote: i.adminNote,
    createdAt: i.createdAt,
    updatedAt: i.updatedAt,
  };
}
