import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('media')
export class Media {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    filename: string;

    @Column()
    originalName: string;

    @Column()
    mimeType: string;

    @Column()
    size: number;

    @Column()
    url: string;

    @Column()
    uploadedBy: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'uploadedBy' })
    uploader: User;

    @CreateDateColumn()
    createdAt: Date;
}
