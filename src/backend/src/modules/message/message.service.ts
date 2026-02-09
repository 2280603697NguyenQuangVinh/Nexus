import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Message } from './message.entity';
import { EVENTS, MessageSentEvent } from '@shared/events/events';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        private eventEmitter: EventEmitter2,
    ) { }

    async create(
        content: string,
        authorId: string,
        channelId: string,
        guildId: string,
        attachments?: string[],
    ): Promise<Message> {
        // Extract mentions from content (simple @userId pattern)
        const mentions = this.extractMentions(content);

        const message = this.messageRepository.create({
            content,
            authorId,
            channelId,
            attachments: attachments || [],
            mentions,
        });

        const savedMessage = await this.messageRepository.save(message);

        // Emit event for other modules to react
        const event: MessageSentEvent = {
            messageId: savedMessage.id,
            channelId,
            guildId,
            authorId,
            content,
            mentions,
            createdAt: savedMessage.createdAt,
        };
        this.eventEmitter.emit(EVENTS.MESSAGE_SENT, event);

        return savedMessage;
    }

    async findByChannel(channelId: string, limit: number = 50): Promise<Message[]> {
        return this.messageRepository.find({
            where: { channelId },
            order: { createdAt: 'DESC' },
            take: limit,
            relations: ['author'],
        });
    }

    async findOne(id: string): Promise<Message> {
        return this.messageRepository.findOne({
            where: { id },
            relations: ['author', 'channel'],
        });
    }

    private extractMentions(content: string): string[] {
        const mentionPattern = /@(\w+)/g;
        const matches = content.match(mentionPattern);
        return matches ? matches.map(m => m.substring(1)) : [];
    }
}
