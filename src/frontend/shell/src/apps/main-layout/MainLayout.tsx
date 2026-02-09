import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { socketClient } from '@/websocket/socket';
import GuildSidebar from './components/GuildSidebar';
import ChannelSidebar from './components/ChannelSidebar';
import ChatView from './components/ChatView';

export default function MainLayout() {
    const { user, token } = useAuthStore();
    const [selectedGuild, setSelectedGuild] = useState<string | null>(null);
    const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

    useEffect(() => {
        if (user && token) {
            socketClient.connect(token, user.id);
        }

        return () => {
            socketClient.disconnect();
        };
    }, [user, token]);

    return (
        <div className="flex h-screen bg-gray-900">
            {/* Guild Sidebar */}
            <GuildSidebar
                selectedGuild={selectedGuild}
                onSelectGuild={setSelectedGuild}
            />

            {/* Channel Sidebar */}
            {selectedGuild && (
                <ChannelSidebar
                    guildId={selectedGuild}
                    selectedChannel={selectedChannel}
                    onSelectChannel={setSelectedChannel}
                />
            )}

            {/* Main Content */}
            <div className="flex-1">
                {selectedChannel ? (
                    <ChatView channelId={selectedChannel} guildId={selectedGuild!} />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Select a channel to start chatting
                    </div>
                )}
            </div>
        </div>
    );
}
