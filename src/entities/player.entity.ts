import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { BaseEntity } from './base.entity';


@Entity()
export class Player extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  position: string;

  @Column({ nullable: true })
  jerseyNumber: number;

  @Column({ nullable: true })
  nationality: string;

  @Column({ nullable: true })
  height: number; // in cm

  @Column({ nullable: true })
  weight: number; // in kg

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Tenant, tenant => tenant.players)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ name: 'tenant_id' })
  tenantId: string;
}