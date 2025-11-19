import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Link } from './link.entity';
import { Click } from './click.entity';
import { Conversion } from './conversion.entity';
import { Commission } from './commission.entity';

export enum PayoutSchedule {
  INSTANT = 'instant',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  NET30 = 'net30',
}

@Entity('merchants')
@Index(['slug'])
@Index(['api_key'])
@Index(['user_id'])
export class Merchant {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logo_url: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  website_url: string;

  @Column({ type: 'varchar', length: 128, unique: true })
  api_key: string;

  @Column({ type: 'varchar', length: 128 })
  api_secret: string;

  @Column({ type: 'json', default: '{}' })
  settings: Record<string, any>;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 10.0 })
  commission_rate: number;

  @Column({
    type: 'enum',
    enum: PayoutSchedule,
    default: PayoutSchedule.MONTHLY,
  })
  payout_schedule: PayoutSchedule;

  @Column({ type: 'tinyint', default: 1 })
  is_active: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.affiliates, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Link, (link) => link.merchant)
  links: Link[];

  @OneToMany(() => Click, (click) => click.merchant)
  clicks: Click[];

  @OneToMany(() => Conversion, (conversion) => conversion.merchant)
  conversions: Conversion[];

  @OneToMany(() => Commission, (commission) => commission.merchant)
  commissions: Commission[];
}

