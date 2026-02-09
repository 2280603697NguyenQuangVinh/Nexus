import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { UseGuards } from '@nestjs/common';
import { EVENTS, MessageSentEvent, UserTypingEvent } from '@shared/events/events';
import { PresenceService } from '@modules/presence/presence.service';

@WebSocketGateway({
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    },
})
export class WebSocketGatewayClass implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private presenceService: PresenceService) { }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth.token || client.handshake.headers.authorization;
            // In production, verify JWT here
            const userId = client.handshake.query.userId as string;

            if (userId) {
                client.data.userId = userId;
                await this.presenceService.setUserOnline(userId);
                this.server.emit('user:online', { userId });
                console.log(`Client connected: ${client.id}, User: ${userId}`);
            }
        } catch (error) {
            console.error('Connection error:', error);
            client.disconnect();
        }
    }

    async handleDisconnect(client: Socket) {
        const userId = client.data.userId;
        if (userId) {
            await this.presenceService.setUserOffline(userId);
            this.server.emit('user:offline', { userId });
            console.log(`Client disconnected: ${client.id}, User: ${userId}`);
        }
    }

    @SubscribeMessage('typing:start')
    async handleTypingStart(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { channelId: string; guildId: string },
    ) {
        const userId = client.data.userId;
        await this.presenceService.setUserTyping(userId, data.channelId);

        // Broadcast to channel
        client.to(`channel:${data.channelId}`).emit('user:typing', {
            userId,
            channelId: data.channelId,
        });
    }

    @SubscribeMessage('channel:join')
    handleJoinChannel(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { channelId: string },
    ) {
        client.join(`channel:${data.channelId}`);
        console.log(`User ${client.data.userId} joined channel ${data.channelId}`);
    }

    @SubscribeMessage('channel:leave')
    handleLeaveChannel(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { channelId: string },
    ) {
        client.leave(`channel:${data.channelId}`);
        console.log(`User ${client.data.userId} left channel ${data.channelId}`);
    }

    // Event listeners - broadcast domain events to clients
    @OnEvent(EVENTS.MESSAGE_SENT)
    handleMessageSent(event: MessageSentEvent) {
        this.server.to(`channel:${event.channelId}`).emit('message:new', {
            messageId: event.messageId,
            channelId: event.channelId,
            authorId: event.authorId,
            content: event.content,
            createdAt: event.createdAt,
        });
    }

    @OnEvent(EVENTS.USER_TYPING)
    handleUserTyping(event: UserTypingEvent) {
        this.server.to(`channel:${event.channelId}`).emit('user:typing', {
            userId: event.userId,
            channelId: event.channelId,
        });
    }
}
