import { Body, Controller, Delete, Get, Post, Put, Req, Res } from '@nestjs/common';
import { AppService } from '../service/app.service';
import { UserService } from 'src/service/user.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}
  @Get('/index') // 새로운 GET 요청 핸들러 추가
  async getBoard(@Req() req: Request, @Res() res: Response) {
    const boardData = this.appService.getBoard(); // 실제 보드 데이터를 가져오는 메서드
    const sessionUser = req.session.user || null; // 세션 사용자 정보
    return res.status(200).json({ board: boardData, user: sessionUser });
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
  updateBoard(@Body() item: { id: number; name: string }) {
    this.appService.updateBoard(item);
    return { message: '변경완료' };
  }

  @Post('/login')
  async login(@Body() item: { user_id: string; user_pwd: string }, @Req() req: Request, @Res() res: Response) {
    if (req.session.user) {
      return res.json({ board: req.session.board, item: req.session.user });
    } else {
      const user = await this.userService.login(item);
      const board = this.appService.getBoard();
      console.log(board);
      if (user !== null) {
        req.session.user = user;
        req.session.board = board;
        return res.status(200).json({ board: board, item: user });
      } else {
        return res.status(401).json({ message: '아이디 혹은 비밀번호를 확인해주세요' });
      }
    }
  }
  @Get('/logout')
  async logout(@Req() req: Request) {
    req.session.user = null;
    return { message: '로그아웃이 되었습니다!' };
  }
  @Post('/signup')
  async signup(@Body() item) {
    console.log(item);
    this.userService.signup(item);
    return { message: '회원가입 성공!' };
  }
  @Post('duplication')
  async duplicaion(@Body() item) {
    const dupliactionUser = await this.userService.dupliaction(item);
    if (dupliactionUser === false) {
      return { message: '이미 사용하고있는 아이디입니다.', result: dupliactionUser };
    } else {
      return { message: '아이디가 사용가능합니다.', result: dupliactionUser };
    }
  }
}
