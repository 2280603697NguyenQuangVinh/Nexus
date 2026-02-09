// Event names for inter-module communication
export const EVENTS = {
    // Message events
    MESSAGE_SENT: 'message.sent',
    MESSAGE_UPDATED: 'message.updated',
    MESSAGE_DELETED: 'message.deleted',

    // User events
    USER_JOINED_GUILD: 'user.joined.guild',
    USER_LEFT_GUILD: 'user.left.guild',
    USER_JOINED_CHANNEL: 'user.joined.channel',
    USER_LEFT_CHANNEL: 'user.left.channel',
    USER_TYPING: 'user.typing',

    // Presence events
    USER_PRESENCE_CHANGED: 'user.presence.changed',
    USER_ONLINE: 'user.online',
    USER_OFFLINE: 'user.offline',

    // Notification events
    USER_MENTIONED: 'user.mentioned',
};

// Event payload interfaces
export interface MessageSentEvent {
    messageId: string;
    channelId: string;
    guildId: string;
    authorId: string;
    content: string;
    mentions: string[];
    createdAt: Date;
}

export interface UserTypingEvent {
    userId: string;
    channelId: string;
    guildId: string;
}

export interface UserPresenceChangedEvent {
    userId: string;
    status: 'online' | 'offline' | 'away' | 'dnd';
    timestamp: Date;
}

export interface UserMentionedEvent {
    userId: string;
    messageId: string;
    channelId: string;
    guildId: string;
    mentionedBy: string;
}
