import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  // Used by AuthService for classic email/password registration
  async create(data: Partial<User>): Promise<User> {
    const user: User = this.repo.create(data);
    return this.repo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findOrCreateFromFirebase(decoded: any): Promise<User> {
    const firebase_uid = decoded.uid;

    let user = await this.repo.findOne({ where: { firebase_uid } });

    if (!user) {
      user = this.repo.create({
        firebase_uid,
        email: decoded.email,
        username: decoded.name || `user_${firebase_uid.slice(0, 8)}`,
        avatar_url: decoded.picture || null,
      });

      await this.repo.save(user);
    }

    return user;
  }
}