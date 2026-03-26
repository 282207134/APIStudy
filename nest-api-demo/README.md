# NestJS API 学习笔记

## 1. 环境准备

### 安装 Nest CLI
```bash
npm i -g @nestjs/cli
```

### 创建项目
```bash
nest new nest-api-demo
cd nest-api-demo
```

## 2. 写 API 的三个核心概念

- **Controller（控制器）**：处理请求路径（路由）
- **Service（服务）**：处理业务逻辑
- **Module（模块）**：组织代码并管理依赖

## 3. 快速生成 CRUD 资源

最常用的用户资源生成命令：

```bash
nest g resource user
```

生成后重点关注：

- `src/user/user.controller.ts`：路由与请求入口
- `src/user/user.service.ts`：业务逻辑实现
- `src/app.module.ts`：将 `UserController`、`UserService` 挂载到应用模块

## 4. 启动服务

```bash
npm run start:dev
```

启动后访问：

- 首页：`http://localhost:3000`

## 5. 接口示例（User）

### 获取全部用户
- **Method**: `GET`
- **URL**: `/user`

### 获取指定用户
- **Method**: `GET`
- **URL**: `/user/1`
- **说明**: 获取 `ID = 1` 的用户

### 创建用户
- **Method**: `POST`
- **URL**: `/user`
- **Body 示例**：

```json
{ "name": "小王", "age": 22 }
```