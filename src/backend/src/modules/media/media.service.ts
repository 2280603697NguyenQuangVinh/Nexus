import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from './media.entity';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class MediaService {
    private uploadDir = process.env.UPLOAD_DIR || './uploads';

    constructor(
        @InjectRepository(Media)
        private mediaRepository: Repository<Media>,
    ) {
        // Ensure upload directory exists
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    async saveFile(file: Express.Multer.File, uploadedBy: string): Promise<Media> {
        const filename = `${Date.now()}-${file.originalname}`;
        const filepath = path.join(this.uploadDir, filename);
        const url = `/uploads/${filename}`;

        // Save file to disk
        fs.writeFileSync(filepath, file.buffer);

        // Save metadata to database
        const media = this.mediaRepository.create({
            filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            url,
            uploadedBy,
        });

        return this.mediaRepository.save(media);
    }

    async findOne(id: string): Promise<Media> {
        return this.mediaRepository.findOne({ where: { id } });
    }

    async findByUser(userId: string): Promise<Media[]> {
        return this.mediaRepository.find({ where: { uploadedBy: userId } });
    }
}
