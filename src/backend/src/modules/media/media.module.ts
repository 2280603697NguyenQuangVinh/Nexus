import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { Media } from './media.entity';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Media]),
        MulterModule.register({
            limits: {
                fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
            },
        }),
    ],
    controllers: [MediaController],
    providers: [MediaService],
    exports: [MediaService],
})
export class MediaModule { }
