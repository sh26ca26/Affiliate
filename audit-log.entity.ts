import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('audit_logs')
@Index(['user_id'])
@Index(['action'])
@Index(['entity_type'])
@Index(['created_at'])
export class AuditLog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'bigint', nullable: true })
  user_id: number;

  @Column({ type: 'varchar', length: 255 })
  action: string;

  @Column({ type: 'varchar', length: 100 })
  entity_type: string;

  @Column({ type: 'bigint', nullable: true })
  entity_id: number;

  @Column({ type: 'json', default: '{}' })
  changes: Record<string, any>;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip_address: string;

  @Column({ type: 'text', nullable: true })
  user_agent: string;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

