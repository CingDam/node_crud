import 'express-session';
import { User } from 'src/model/user.entity';
import { AppService } from 'src/service/app.service';

declare module 'express-session' {
  interface SessionData {
    username: string;
    user: User;
    board: AppService.Item;
  }
}
