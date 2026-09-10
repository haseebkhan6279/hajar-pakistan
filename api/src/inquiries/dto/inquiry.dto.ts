import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { INQUIRY_STATUSES, type InquiryStatus } from '../inquiry.schema';

export class CreateInquiryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  subject?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  message: string;

  /**
   * Honeypot. Hidden from people by the storefront's CSS, so anything that
   * fills it in is a bot — the request is accepted and quietly dropped, since
   * an error would only tell the bot to try a different shape.
   */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  company?: string;
}

export class UpdateInquiryStatusDto {
  @IsIn(INQUIRY_STATUSES as unknown as string[])
  status: InquiryStatus;
}

export class UpdateInquiryNoteDto {
  @IsString()
  @MaxLength(2000)
  adminNote: string;
}
