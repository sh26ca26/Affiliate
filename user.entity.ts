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

export enum UserRole {
  ADMIN = 'admin',
  MERCHANT = 'merchant',
  AFFILIATE = 'affiliate',
}

@Entity('users')
@Index(['email'])
@Index(['role'])
@Index(['merchant_id'])
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.AFFILIATE,
  })
  role: UserRole;

  @Column({ type: 'bigint', nullable: true })
  merchant_id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password_hash: string;

  @Column({ type: 'tinyint', default: 0 })
  verified: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  verification_token: string;

  @Column({ type: 'timestamp', nullable: true })
  verification_token_expires_at: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reset_token: string;

  @Column({ type: 'timestamp', nullable: true })
  reset_token_expires_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_login_at: Date;

  @Column({ type: 'tinyint', default: 1 })
  is_active: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Merchant, (merchant) => merchant.users, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;

  @OneToMany(() => Affiliate, (affiliate) => affiliate.user)
  affiliates: Affiliate[];
}

