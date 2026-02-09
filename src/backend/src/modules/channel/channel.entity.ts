import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Guild } from '../guild/guild.entity';

@Entity('channels')
export class Channel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: 'text' })
    type: string; // text, voice, announcement

    @Column()
    guildId: string;

    @ManyToOne(() => Guild)
    @JoinColumn({ name: 'guildId' })
    guild: Guild;

    @Column({ nullable: true })
    topic: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
