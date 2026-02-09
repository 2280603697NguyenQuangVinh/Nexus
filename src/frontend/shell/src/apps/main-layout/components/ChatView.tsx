import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';
import { socketClient } from '@/websocket/socket';

interface Message {
    id: string;
    content: string;
    authorId: string;
    author?: { username: string };
    createdAt: string;
}

interface Props {
    channelId: string;
    guildId: string;
}

export default function ChatView({ channelId, guildId }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const { token, user } = useAuthStore();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchMessages();
        socketClient.joinChannel(channelId);

        // Listen for new messages
        const handleNewMessage = (data: any) => {
            setMessages((prev) => [...prev, data]);
        };
        socketClient.on('message:new', handleNewMessage);

        return () => {
            socketClient.leaveChannel(channelId);
            socketClient.off('message:new', handleNewMessage);
        };
    }, [channelId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/messages/channel/${channelId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(response.data.reverse());
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await axios.post(
                'http://localhost:3000/messages',
                {
                    content: newMessage,
                    channelId,
                    guildId,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div key={message.id} className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                            {message.author?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <span className="text-white font-semibold">
                                    {message.author?.username || 'Unknown'}
                                </span>
                                <span className="text-gray-400 text-xs">
                                    {new Date(message.createdAt).toLocaleTimeString()}
                                </span>
                            </div>
                            <p className="text-gray-300">{message.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-gray-800">
                <form onSubmit={sendMessage}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded"
                    />
                </form>
            </div>
        </div>
    );
}
