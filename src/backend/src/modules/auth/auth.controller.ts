// src/modules/auth/auth.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../../infrastructure/auth/firebase-auth.guard';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UserService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    const user = await this.usersService.findOrCreateFromFirebase(req.firebaseUser);
    return { user };
  }
}