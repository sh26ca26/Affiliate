import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Link } from './link.entity';
import { Affiliate } from './affiliate.entity';
import { Merchant } from './merchant.entity';
import { Commission } from './commission.entity';

export enum ConversionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REFUNDED = 'refunded',
}

@Entity('conversions')
@Index(['order_id', 'merchant_id'], { unique: true })
@Index(['link_id'])
@Index(['affiliate_id'])
@Index(['merchant_id'])
@Index(['status'])
@Index(['created_at'])
@Index(['created_at', 'merchant_id'])
export class Conversion {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 128 })
  order_id: string;

  @Column({ type: 'bigint' })
  link_id: number;

  @Column({ type: 'bigint', nullable: true })
  affiliate_id: number;

  @Column({ type: 'bigint' })
  merchant_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customer_email: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({
    type: 'enum',
    enum: ConversionStatus,
    default: ConversionStatus.PENDING,
  })
  status: ConversionStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  rejection_reason: string;

  @Column({ type: 'json', default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Link, (link) => link.conversions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'link_id' })
  link: Link;

  @ManyToOne(() => Affiliate, (affiliate) => affiliate.conversions, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'affiliate_id' })
  affiliate: Affiliate;

  @ManyToOne(() => Merchant, (merchant) => merchant.conversions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;

  @OneToMany(() => Commission, (commission) => commission.conversion)
  commissions: Commission[];
}

