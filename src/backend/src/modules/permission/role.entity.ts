import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Guild } from '../guild/guild.entity';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    guildId: string;

    @ManyToOne(() => Guild)
    @JoinColumn({ name: 'guildId' })
    guild: Guild;

    @Column('simple-json')
    permissions: {
        manageChannels: boolean;
        manageRoles: boolean;
        kickMembers: boolean;
        banMembers: boolean;
        sendMessages: boolean;
        manageMessages: boolean;
        mentionEveryone: boolean;
        administrator: boolean;
    };

    @Column({ default: 0 })
    position: number;

    @CreateDateColumn()
    createdAt: Date;
}
