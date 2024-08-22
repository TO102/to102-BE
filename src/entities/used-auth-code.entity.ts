import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('used_auth_code')
export class UsedAuthCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @CreateDateColumn({ name: 'used_at' })
  usedAt: Date;
}
