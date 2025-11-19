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
import { Payout } from './payout.entity';

@Entity('affiliates')
@Index(['affiliate_code'])
@Index(['user_id'])
export class Affiliate {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'bigint', unique: true })
  user_id: number;

  @Column({ type: 'varchar', length: 64, unique: true })
  affiliate_code: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  display_name: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar_url: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  website_url: string;

  @Column({ type: 'json', default: '{}' })
  social_links: Record<string, string>;

  @Column({ type: 'json', default: '{}' })
  metadata: Record<string, any>;

  @Column({ type: 'bigint', default: 0 })
  total_clicks: number;

  @Column({ type: 'bigint', default: 0 })
  total_conversions: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total_earnings: number;

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

  @OneToMany(() => Link, (link) => link.affiliate)
  links: Link[];

  @OneToMany(() => Click, (click) => click.affiliate)
  clicks: Click[];

  @OneToMany(() => Conversion, (conversion) => conversion.affiliate)
  conversions: Conversion[];

  @OneToMany(() => Commission, (commission) => commission.affiliate)
  commissions: Commission[];

  @OneToMany(() => Payout, (payout) => payout.affiliate)
  payouts: Payout[];
}

