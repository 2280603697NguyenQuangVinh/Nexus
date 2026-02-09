import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

interface Channel {
    id: string;
    name: string;
    type: string;
}

interface Props {
    guildId: string;
    selectedChannel: string | null;
    onSelectChannel: (channelId: string) => void;
}

export default function ChannelSidebar({ guildId, selectedChannel, onSelectChannel }: Props) {
    const [channels, setChannels] = useState<Channel[]>([]);
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        fetchChannels();
    }, [guildId]);

    const fetchChannels = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/channels/guild/${guildId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setChannels(response.data);
        } catch (error) {
            console.error('Failed to fetch channels:', error);
        }
    };

    return (
        <div className="w-60 bg-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-white font-bold">Channels</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
                {channels.map((channel) => (
                    <button
                        key={channel.id}
                        onClick={() => onSelectChannel(channel.id)}
                        className={`w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 ${selectedChannel === channel.id ? 'bg-gray-700' : ''
                            }`}
                    >
                        # {channel.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
