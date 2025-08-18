import { Entity, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Player } from './player.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Tenant extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany(() => User, (user) => user.tenant, { onDelete: 'SET NULL' })
  users: User[];
  
  // NEW Players relationship
  @OneToMany(() => Player, (player) => player.tenant)
  players: Player[];
}