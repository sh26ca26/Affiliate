import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Merchant } from './merchant.entity';

export enum IntegrationType {
  SHOPIFY = 'shopify',
  WOOCOMMERCE = 'woocommerce',
  CUSTOM = 'custom',
  API = 'api',
}

@Entity('store_integrations')
@Index(['merchant_id'])
export class StoreIntegration {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'bigint' })
  merchant_id: number;

  @Column({
    type: 'enum',
    enum: IntegrationType,
  })
  type: IntegrationType;

  @Column({ type: 'json', default: '{}' })
  config: Record<string, any>;

  @Column({ type: 'tinyint', default: 1 })
  is_active: number;

  @Column({ type: 'timestamp', nullable: true })
  last_sync_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Merchant, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;
}

