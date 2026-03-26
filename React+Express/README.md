# React + Express 学习笔记

这是一个前后端分离的入门项目：

- 前端：React
- 后端：Express

---

## 项目目录结构

```txt
React+Express/
├─ api-server/      # Express 后端
└─ react-client/    # React 前端
```

---

## 一、后端（Express）

### 1) 创建后端目录并进入

```bash
mkdir api-server
cd api-server
```

### 2) 初始化 Node 项目

```bash
npm init -y
```

说明：会生成 `package.json`，用于记录项目配置和依赖。

### 3) 安装依赖

```bash
npm install express cors
```

### 4) 创建后端入口文件

创建 `server.js`，编写 API 代码。

### 5) 启动后端服务

```bash
node server.js
```

示例接口地址：
`http://localhost:5000/api/user`

---

## 二、前端（React）

### 1) 创建 React 项目

```bash
npx create-react-app react-client
```

主要开发文件：`react-client/src/App.js`

### 2) 启动前端项目

```bash
npm start
```

---

## 三、联调说明

- 后端默认运行在 `5000` 端口。
- 前端默认运行在 `3000` 端口。
- 前端通过接口地址访问后端数据（如 `/api/user`）。
