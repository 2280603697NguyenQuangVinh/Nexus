import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('guilds')
export class Guild {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    icon: string;

    @Column()
    ownerId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'ownerId' })
    owner: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

@Entity('guild_members')
export class GuildMember {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    guildId: string;

    @Column()
    userId: string;

    @Column({ default: 'member' })
    role: string;

    @ManyToOne(() => Guild)
    @JoinColumn({ name: 'guildId' })
    guild: Guild;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @CreateDateColumn()
    joinedAt: Date;
}
