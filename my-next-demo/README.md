# Next.js 学习笔记（前后端一体）

## 1) 什么是 Next.js

- Next.js 是前后端一体的框架，自带 API 路由能力。
- 核心理解：`app/api/**/route.js` 的路径，映射为对应接口地址。

## 2) 新建项目

```bash
npx create-next-app@latest my-next-demo
cd my-next-demo
```

## 3) 创建一个 API 示例

- 新建文件：`app/api/user/route.js`
- 接口地址：`http://localhost:3000/api/user`

## 4) 前端调用 API

- 页面文件：`app/page.js`
- 启动项目：

```bash
npm run dev
```

## 5) POST 请求示例数据

```json
{
  "name": "测试用户",
  "age": 25
}
```