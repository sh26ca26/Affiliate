import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Affiliate } from './affiliate.entity';

export enum PayoutStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('payouts')
@Index(['affiliate_id'])
@Index(['status'])
@Index(['requested_at'])
export class Payout {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'bigint' })
  affiliate_id: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', length: 64 })
  method: string;

  @Column({ type: 'json', default: '{}' })
  method_details: Record<string, any>;

  @Column({
    type: 'enum',
    enum: PayoutStatus,
    default: PayoutStatus.REQUESTED,
  })
  status: PayoutStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transaction_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  failure_reason: string;

  @Column({ type: 'json', default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn()
  requested_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  processed_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date;

  // Relations
  @ManyToOne(() => Affiliate, (affiliate) => affiliate.payouts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'affiliate_id' })
  affiliate: Affiliate;
}

