import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../../infrastructure/auth/firebase-auth.guard';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private service: MediaService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post()
  async create(@Req() req: any, @Body() body: any) {
    const media = await this.service.createFromClientBody(req.firebaseUser, body);
    return { media };
  }
}