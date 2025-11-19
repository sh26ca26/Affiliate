import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Merchant } from './merchant.entity';
import { Affiliate } from './affiliate.entity';
import { Link } from './link.entity';
import { Conversion } from './conversion.entity';
import { User } from './user.entity';

export enum FraudSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum FraudStatus {
  FLAGGED = 'flagged',
  UNDER_REVIEW = 'under_review',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
}

@Entity('fraud_logs')
@Index(['merchant_id'])
@Index(['affiliate_id'])
@Index(['link_id'])
@Index(['conversion_id'])
@Index(['severity'])
@Index(['status'])
@Index(['created_at'])
export class FraudLog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'bigint', nullable: true })
  merchant_id: number;

  @Column({ type: 'bigint', nullable: true })
  affiliate_id: number;

  @Column({ type: 'bigint', nullable: true })
  link_id: number;

  @Column({ type: 'bigint', nullable: true })
  conversion_id: number;

  @Column({ type: 'bigint', nullable: true })
  click_id: number;

  @Column({ type: 'varchar', length: 255 })
  reason: string;

  @Column({
    type: 'enum',
    enum: FraudSeverity,
    default: FraudSeverity.MEDIUM,
  })
  severity: FraudSeverity;

  @Column({
    type: 'enum',
    enum: FraudStatus,
    default: FraudStatus.FLAGGED,
  })
  status: FraudStatus;

  @Column({ type: 'json', default: '{}' })
  meta: Record<string, any>;

  @Column({ type: 'bigint', nullable: true })
  reviewed_by: number;

  @Column({ type: 'timestamp', nullable: true })
  reviewed_at: Date;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => Merchant, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;

  @ManyToOne(() => Affiliate, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'affiliate_id' })
  affiliate: Affiliate;

  @ManyToOne(() => Link, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'link_id' })
  link: Link;

  @ManyToOne(() => Conversion, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'conversion_id' })
  conversion: Conversion;

  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'reviewed_by' })
  reviewer: User;
}

