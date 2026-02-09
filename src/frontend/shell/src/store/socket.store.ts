import { create } from 'zustand';

interface SocketState {
    connected: boolean;
    onlineUsers: string[];
    typingUsers: Map<string, string[]>; // channelId -> userIds
    setConnected: (connected: boolean) => void;
    addOnlineUser: (userId: string) => void;
    removeOnlineUser: (userId: string) => void;
    setTyping: (channelId: string, userId: string) => void;
    removeTyping: (channelId: string, userId: string) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
    connected: false,
    onlineUsers: [],
    typingUsers: new Map(),

    setConnected: (connected) => set({ connected }),

    addOnlineUser: (userId) => set((state) => ({
        onlineUsers: [...state.onlineUsers, userId],
    })),

    removeOnlineUser: (userId) => set((state) => ({
        onlineUsers: state.onlineUsers.filter(id => id !== userId),
    })),

    setTyping: (channelId, userId) => set((state) => {
        const newTypingUsers = new Map(state.typingUsers);
        const users = newTypingUsers.get(channelId) || [];
        if (!users.includes(userId)) {
            newTypingUsers.set(channelId, [...users, userId]);
        }
        return { typingUsers: newTypingUsers };
    }),

    removeTyping: (channelId, userId) => set((state) => {
        const newTypingUsers = new Map(state.typingUsers);
        const users = newTypingUsers.get(channelId) || [];
        newTypingUsers.set(channelId, users.filter(id => id !== userId));
        return { typingUsers: newTypingUsers };
    }),
}));
