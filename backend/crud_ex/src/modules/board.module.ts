import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from 'src/model/board.entity';
import { boardService } from 'src/service/board.service';

@Module({
  imports: [TypeOrmModule.forFeature([Board])],
  providers: [boardService],
  exports: [boardService],
})
export class BoardModule {}
