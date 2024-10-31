import { Injectable } from '@nestjs/common';

export interface Item {
  id: number;
  name: string;
}

@Injectable()
export class AppService {
  private items: Item[] = [
    { id: 1, name: '집에 보내줘' },
    { id: 2, name: '피곤해' },
  ];

  getHello(): string {
    return 'Hello World!';
  }
  getBoard(): Item[] {
    return this.items;
  }
  postBoard(item: Item) {
    this.items.push(item);
  }
  deleteBoard(item: Item) {
    this.items = this.items.filter((array) => array.id !== item.id); //특정값 삭제는 filter를 사용!!
  }
  updateBoard(item: Item) {
    console.log(item);
    const updateData = this.items.map((board) => {
      if (board.id === item.id) {
        return { ...board, name: item.name };
      }
      return board;
    });
    this.items = updateData;
  }
}
