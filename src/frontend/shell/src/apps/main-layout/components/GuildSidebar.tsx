import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

interface Guild {
    id: string;
    name: string;
    icon?: string;
}

interface Props {
    selectedGuild: string | null;
    onSelectGuild: (guildId: string) => void;
}

export default function GuildSidebar({ selectedGuild, onSelectGuild }: Props) {
    const [guilds, setGuilds] = useState<Guild[]>([]);
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        fetchGuilds();
    }, []);

    const fetchGuilds = async () => {
        try {
            const response = await axios.get('http://localhost:3000/guilds/my', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGuilds(response.data);
        } catch (error) {
            console.error('Failed to fetch guilds:', error);
        }
    };

    return (
        <div className="w-20 bg-gray-950 flex flex-col items-center py-4 space-y-2">
            {guilds.map((guild) => (
                <button
                    key={guild.id}
                    onClick={() => onSelectGuild(guild.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${selectedGuild === guild.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                >
                    {guild.icon ? (
                        <img src={guild.icon} alt={guild.name} className="w-full h-full rounded-full" />
                    ) : (
                        guild.name.charAt(0).toUpperCase()
                    )}
                </button>
            ))}
        </div>
    );
}
