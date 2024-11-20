import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('board')
export class Board {
  @PrimaryGeneratedColumn()
  boardnum: number;

  @Column()
  boardname: string;

  @Column()
  boardcontent: string;

  @Column()
  createdate: Date;

  @ManyToOne(() => User, (user) => user.boards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_user_num' })
  user: User;
}
