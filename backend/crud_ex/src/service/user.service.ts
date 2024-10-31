import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/model/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signup(item: { user_id: string; user_pwd: string; user_name: string; user_email: string }) {
    const newUser = {
      user_id: item.user_id,
      user_pwd: item.user_pwd,
      user_name: item.user_name,
      user_email: item.user_email,
    };
    console.log(newUser);
    await this.userRepository.save(newUser);
  }
  async login(item: { user_id: string; user_pwd: string }): Promise<User> {
    const loginItem = await this.userRepository.findOne({
      where: { user_id: item.user_id, user_pwd: item.user_pwd },
    });

    return loginItem;
  }
}
