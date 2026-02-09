import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Channel } from '../channel/channel.entity';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    content: string;

    @Column()
    authorId: string;

    @Column()
    channelId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'authorId' })
    author: User;

    @ManyToOne(() => Channel)
    @JoinColumn({ name: 'channelId' })
    channel: Channel;

    @Column('simple-array', { nullable: true })
    attachments: string[];

    @Column('simple-array', { nullable: true })
    mentions: string[];

    @CreateDateColumn()
    createdAt: Date;
}
