import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/model/board.entity';
import { Repository } from 'typeorm';

@Injectable()
export class boardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  async getBoard(): Promise<Board[]> {
    const boardContent = await this.boardRepository.find();
    console.log(boardContent);
    return boardContent;
  }
}
