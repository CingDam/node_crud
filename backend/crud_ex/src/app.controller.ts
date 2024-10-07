import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
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
  @Delete('/delete')
  deleteBoard(@Body() item: { id: number; name: string }) {
    this.appService.deleteBoard(item);
    return { message: '삭제완료' };
  }
  @Put('/update')
  updateBoard(@Body() item: {id:number; name: string}) {
    this.appService.updateBoard(item)
    return{message : '변경완료'}

  }
}
