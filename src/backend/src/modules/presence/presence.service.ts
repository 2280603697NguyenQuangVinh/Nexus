import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { REDIS_CLIENT } from '@infrastructure/redis/redis.module';
import { EVENTS, UserPresenceChangedEvent } from '@shared/events/events';
import Redis from 'ioredis';

@Injectable()
export class PresenceService {
    constructor(@Inject(REDIS_CLIENT) private redis: Redis) { }

    async setUserOnline(userId: string): Promise<void> {
        await this.redis.set(`presence:${userId}`, 'online', 'EX', 3600);
        await this.redis.sadd('users:online', userId);
    }

    async setUserOffline(userId: string): Promise<void> {
        await this.redis.del(`presence:${userId}`);
        await this.redis.srem('users:online', userId);
    }

    async setUserTyping(userId: string, channelId: string): Promise<void> {
        await this.redis.set(`typing:${channelId}:${userId}`, '1', 'EX', 5);
    }

    async getUserStatus(userId: string): Promise<string> {
        return (await this.redis.get(`presence:${userId}`)) || 'offline';
    }

    async getOnlineUsers(): Promise<string[]> {
        return this.redis.smembers('users:online');
    }

    async getTypingUsers(channelId: string): Promise<string[]> {
        const keys = await this.redis.keys(`typing:${channelId}:*`);
        return keys.map(key => key.split(':')[2]);
    }

    @OnEvent(EVENTS.USER_ONLINE)
    handleUserOnline(event: UserPresenceChangedEvent) {
        this.setUserOnline(event.userId);
    }

    @OnEvent(EVENTS.USER_OFFLINE)
    handleUserOffline(event: UserPresenceChangedEvent) {
        this.setUserOffline(event.userId);
    }
}
