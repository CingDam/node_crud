import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  user_num: number;

  @Column()
  user_id: string;

  @Column()
  user_pwd: string;

  @Column()
  user_name: string;

  @Column()
  user_email: string;
}
