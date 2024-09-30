import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('/') // 새로운 GET 요청 핸들러 추가
  getBoard() {
    return this.appService.getBoard();
  }
  @Post('/insert')
  postBoard(@Body() item: { id: number; name: string }) {
    this.appService.postBoard(item);
    return { item };
  }
  @Post('/delete')
  deleteBoard(@Body() item: { id: number; name: string }) {
    this.appService.deleteBoard(item);
    return { message: '삭제완료' };
  }
}
