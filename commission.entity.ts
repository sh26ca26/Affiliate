import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Conversion } from './conversion.entity';
import { Affiliate } from './affiliate.entity';
import { Merchant } from './merchant.entity';

export enum CommissionStatus {
  UNPAID = 'unpaid',
  PENDING_PAYOUT = 'pending_payout',
  PAID = 'paid',
  REFUNDED = 'refunded',
}

@Entity('commissions')
@Index(['conversion_id'])
@Index(['affiliate_id'])
@Index(['merchant_id'])
@Index(['status'])
@Index(['created_at'])
@Index(['created_at', 'affiliate_id'])
export class Commission {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'bigint' })
  conversion_id: number;

  @Column({ type: 'bigint' })
  affiliate_id: number;

  @Column({ type: 'bigint' })
  merchant_id: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  rate: number;

  @Column({
    type: 'enum',
    enum: CommissionStatus,
    default: CommissionStatus.UNPAID,
  })
  status: CommissionStatus;

  @Column({ type: 'bigint', nullable: true })
  payout_id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  paid_at: Date;

  // Relations
  @ManyToOne(() => Conversion, (conversion) => conversion.commissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversion_id' })
  conversion: Conversion;

  @ManyToOne(() => Affiliate, (affiliate) => affiliate.commissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'affiliate_id' })
  affiliate: Affiliate;

  @ManyToOne(() => Merchant, (merchant) => merchant.commissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;
}

