import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Channel } from '../channel/channel.entity';

@Entity('guilds')
export class Guild {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @ManyToOne(() => User, (u) => u.ownedGuilds)
  owner!: User;

  @Column()
  owner_id!: string;

  @Column({ nullable: true })
  icon_url!: string;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_at!: Date;

  @OneToMany(() => Channel, (c) => c.guild)
  channels!: Channel[];
}