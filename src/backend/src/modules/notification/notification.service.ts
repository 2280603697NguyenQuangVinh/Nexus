import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { Notification } from './notification.entity';
import { EVENTS, MessageSentEvent } from '@shared/events/events';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
    ) { }

    async create(userId: string, type: string, content: string, metadata?: any): Promise<Notification> {
        const notification = this.notificationRepository.create({
            userId,
            type,
            content,
            metadata,
        });
        return this.notificationRepository.save(notification);
    }

    async findByUser(userId: string): Promise<Notification[]> {
        return this.notificationRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    async markAsRead(id: string): Promise<void> {
        await this.notificationRepository.update(id, { read: true });
    }

    @OnEvent(EVENTS.MESSAGE_SENT)
    async handleMessageSent(event: MessageSentEvent) {
        // Create notifications for mentioned users
        for (const mentionedUsername of event.mentions) {
            await this.create(
                mentionedUsername,
                'mention',
                `You were mentioned in a message`,
                {
                    messageId: event.messageId,
                    channelId: event.channelId,
                    guildId: event.guildId,
                },
            );
        }
    }
}
