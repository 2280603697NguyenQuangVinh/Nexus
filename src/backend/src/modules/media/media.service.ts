import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from './media.entity';
import { UserService } from '../user/user.service';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class MediaService {
    private uploadDir = process.env.UPLOAD_DIR || './uploads';

    constructor(
        @InjectRepository(Media)
        private mediaRepository: Repository<Media>,
        private readonly userService: UserService,
    ) {
        // Ensure upload directory exists
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    // Legacy local-disk upload (still available if you need it)
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

    // New method used by MediaController when client uploads via Firebase Storage
    async createFromClientBody(firebaseUser: any, dto: any): Promise<Media> {
        // Map firebase user -> app user (PostgreSQL)
        const user = await this.userService.findOrCreateFromFirebase(firebaseUser);

        const media = this.mediaRepository.create({
            filename: dto.fileName,
            originalName: dto.fileName,
            mimeType: dto.mimeType,
            size: dto.fileSize,
            url: dto.downloadUrl,
            uploadedBy: user.id,
        });

        return this.mediaRepository.save(media);
    }

    async findOne(id: string): Promise<Media | null> {
        return this.mediaRepository.findOne({ where: { id } });
    }

    async findByUser(userId: string): Promise<Media[]> {
        return this.mediaRepository.find({ where: { uploadedBy: userId } });
    }
}
