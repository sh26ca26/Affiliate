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
import { Merchant } from './merchant.entity';
import { Affiliate } from './affiliate.entity';
import { Click } from './click.entity';
import { Conversion } from './conversion.entity';

export enum LinkType {
  STORE = 'store',
  PRODUCT = 'product',
  OFFER = 'offer',
  CUSTOM = 'custom',
}

@Entity('links')
@Index(['slug'])
@Index(['merchant_id'])
@Index(['affiliate_id'])
@Index(['created_at'])
export class Link {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'bigint' })
  merchant_id: number;

  @Column({ type: 'bigint', nullable: true })
  affiliate_id: number;

  @Column({
    type: 'enum',
    enum: LinkType,
    default: LinkType.STORE,
  })
  type: LinkType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  target_id: string;

  @Column({ type: 'varchar', length: 500 })
  target_url: string;

  @Column({ type: 'varchar', length: 128, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', default: '{}' })
  utm_params: Record<string, string>;

  @Column({ type: 'json', default: '{}' })
  metadata: Record<string, any>;

  @Column({ type: 'bigint', default: 0 })
  total_clicks: number;

  @Column({ type: 'bigint', default: 0 })
  total_conversions: number;

  @Column({ type: 'tinyint', default: 1 })
  is_active: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Merchant, (merchant) => merchant.links, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;

  @ManyToOne(() => Affiliate, (affiliate) => affiliate.links, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'affiliate_id' })
  affiliate: Affiliate;

  @OneToMany(() => Click, (click) => click.link)
  clicks: Click[];

  @OneToMany(() => Conversion, (conversion) => conversion.link)
  conversions: Conversion[];
}

