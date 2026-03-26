import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';

// 接口前缀：http://localhost:3000/user
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET 查询所有用户
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // GET 根据ID查用户
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  // POST 新增用户
  @Post()
  create(@Body() body: { name: string; age: number }) {
    return this.userService.create(body);
  }
}