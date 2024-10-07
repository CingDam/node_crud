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
    console.log(this.items);
    return this.items;
  }
  postBoard(item: Item) {
    console.log('Before push', this.items);
    this.items.push(item);
    console.log('After push', this.items);
  }
  deleteBoard(item: Item) {
    console.log(item.id);
    this.items = this.items.filter((array) => array.id !== item.id); //특정값 삭제는 filter를 사용!!
    console.log(this.items);
  }
  updateBoard(item: Item) {
    console.log(item)
    const updateData = this.items.map((board) => {
      if(board.id === item.id) {
        return {...board, name: item.name}
      }
      return board;
    })
    this.items = updateData;
  }
}
