import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Board } from './board.entity';

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

  @OneToMany(() => Board, (board) => board.user)
  boards: Board[];
}
