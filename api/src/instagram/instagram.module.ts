import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstagramPost, InstagramPostSchema } from './instagram-post.schema';
import { InstagramService } from './instagram.service';
import { InstagramImportService } from './instagram-import.service';
import { InstagramController } from './instagram.controller';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InstagramPost.name, schema: InstagramPostSchema },
    ]),
    // Imported posts are mirrored into Cloudinary so they outlive the CDN link
    UploadsModule,
  ],
  controllers: [InstagramController],
  providers: [InstagramService, InstagramImportService],
  exports: [InstagramService],
})
export class InstagramModule {}
