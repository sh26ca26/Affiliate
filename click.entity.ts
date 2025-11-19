import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Link } from './link.entity';
import { Affiliate } from './affiliate.entity';
import { Merchant } from './merchant.entity';

@Entity('clicks')
@Index(['link_id'])
@Index(['affiliate_id'])
@Index(['merchant_id'])
@Index(['created_at'])
@Index(['ip_address'])
@Index(['session_id'])
@Index(['created_at', 'merchant_id'])
export class Click {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'bigint' })
  link_id: number;

  @Column({ type: 'bigint', nullable: true })
  affiliate_id: number;

  @Column({ type: 'bigint' })
  merchant_id: number;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip_address: string;

  @Column({ type: 'text', nullable: true })
  user_agent: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  referrer: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  device_type: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  browser: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  os: string;

  @Column({ type: 'json', default: '{}' })
  utm: Record<string, string>;

  @Column({ type: 'json', default: '{}' })
  custom_params: Record<string, any>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  session_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fingerprint: string;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => Link, (link) => link.clicks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'link_id' })
  link: Link;

  @ManyToOne(() => Affiliate, (affiliate) => affiliate.clicks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'affiliate_id' })
  affiliate: Affiliate;

  @ManyToOne(() => Merchant, (merchant) => merchant.clicks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;
}

