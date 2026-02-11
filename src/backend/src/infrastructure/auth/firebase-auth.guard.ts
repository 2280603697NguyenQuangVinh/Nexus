// auth/firebase-auth.guard.ts
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { FirebaseAdmin } from './firebase-admin.provider';
  
  @Injectable()
  export class FirebaseAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers['authorization'] as string | undefined;
  
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('No token');
      }
  
      const token = authHeader.substring(7);
  
      try {
        const decoded = await FirebaseAdmin.auth().verifyIdToken(token);
        req.firebaseUser = decoded;
        return true;
      } catch {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }