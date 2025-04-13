import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('token')
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'device_id', type: 'varchar' })
  deviceId: string;

  @Column({ type: 'varchar' })
  token: string;
}