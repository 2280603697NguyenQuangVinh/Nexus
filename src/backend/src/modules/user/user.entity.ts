// users/user.entity.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Guild } from '../guild/guild.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  firebase_uid!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  // Optional hashed password for classic email/password auth
  @Column({ nullable: true })
  password!: string | null;

  @Column({ nullable: true })
  avatar_url!: string | null;

  @Column({ nullable: true })
  status!: string | null;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_at!: Date;

  @OneToMany(() => Guild, (g) => g.owner)
  ownedGuilds!: Guild[];
}