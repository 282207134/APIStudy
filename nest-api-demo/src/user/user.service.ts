import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private users = [
    { id: 1, name: '张三', age: 20 },
    { id: 2, name: '李四', age: 25 },
  ];

  // 查询所有
  findAll() {
    return this.users;
  }

  // 根据ID查询
  findOne(id: number) {
    return this.users.find(item => item.id === id);
  }

  // 新增用户（自动递增ID）
  create(body: any) {
    // 核心：获取当前最大ID + 1
    const newId = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;

    this.users.push({ 
      id: newId, // 使用自增数字ID
      ...body 
    });
    return '创建成功';
  }
}