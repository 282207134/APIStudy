# Go API Demo - Gin 框架学习笔记

## 项目概述
这是一个使用 Go 语言和 Gin 框架构建的 RESTful API 示例项目，演示了如何创建 Web 服务、处理 HTTP 请求以及实现并发安全的数据管理。

## 项目结构

```
go-api-demo/
├── main.go          # 主程序文件
├── go.mod          # Go 模块依赖管理文件
└── README.md       # 项目说明文档
```

## 创建步骤

### 1. 创建项目目录
```bash
mkdir go-api-demo
cd go-api-demo
```

### 2. 初始化 Go 模块
```bash
go mod init go-api-demo
```
**作用：**
- 告诉 Go 这是一个独立项目
- 创建依赖管理文件 `go.mod`
- 项目安装第三方库时，Go 会记录在 `go.mod` 中

### 3. 安装 Gin 框架
```bash
go get github.com/gin-gonic/gin
```

### 4. 创建 main.go

#### 核心概念说明

**包声明**
```go
package main
```
- 表示这是可执行程序的主包

**导入依赖**
```go
import (
    "net/http"              // 提供 HTTP 状态码等常量
    "sync"                 // 提供互斥锁，保证并发安全
    "github.com/gin-gonic/gin"  // Gin Web 框架
)
```

**数据模型定义**
```go
type User struct {
    ID   int    `json:"id"`   // 用户编号，服务端自动分配
    Name string `json:"name"` // 用户名称
    Age  int    `json:"age"`  // 用户年龄
}
```

**全局变量**
```go
var (
    users  []User     // 保存用户列表数据
    nextID = 1        // 下一个可分配的用户 ID
    mu     sync.Mutex // 保护并发访问的互斥锁
)
```

**主函数**
```go
func main() {
    r := gin.Default()  // 创建带默认中间件的 Gin 引擎
}
```

## 接口详解

### 1. GET /hello - 问候接口

**路由注册**
```go
r.GET("/hello", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
        "message": "hello",
    })
})
```

**说明：**
- 请求方式：GET
- 路径：`/hello`
- 响应：`{"message": "hello"}`
- 状态码：200 OK

**关键概念：**
- `c *gin.Context`：请求上下文对象，用于获取参数、返回响应
- `c.JSON(...)`：返回 JSON 格式响应
- `http.StatusOK`：HTTP 200 状态码常量
- `gin.H{}`：Gin 提供的快捷类型，等价于 `map[string]interface{}`

---

### 2. GET /users - 获取用户列表

**路由注册**
```go
r.GET("/users", func(c *gin.Context) {
    mu.Lock()                        // 加锁保护
    list := make([]User, len(users)) // 创建副本
    copy(list, users)                // 拷贝数据
    mu.Unlock()                      // 解锁
    
    c.JSON(http.StatusOK, gin.H{
        "data": list,
    })
})
```

**说明：**
- 请求方式：GET
- 路径：`/users`
- 响应：`{"data": [...]}`（用户列表）
- 状态码：200 OK

**并发安全设计：**
- 使用 `mu.Lock()` 和 `mu.Unlock()` 保护共享数据
- 创建切片副本而非直接返回，避免外部修改影响内部数据
- 确保读写操作的原子性

---

### 3. POST /users - 创建用户

**路由注册**
```go
r.POST("/users", func(c *gin.Context) {
    var user User  // 声明接收变量
    
    // JSON 绑定校验
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error": err.Error(),
        })
        return
    }
    
    // 并发安全写入
    mu.Lock()
    user.ID = nextID     // 自动分配 ID
    nextID++            // ID 自增
    users = append(users, user)  // 添加到列表
    mu.Unlock()
    
    c.JSON(http.StatusCreated, gin.H{
        "message": "创建成功",
        "data":    user,
    })
})
```

**说明：**
- 请求方式：POST
- 路径：`/users`
- 请求体示例：`{"name": "张三", "age": 25}`
- 响应：`{"message": "创建成功", "data": {"id": 1, "name": "张三", "age": 25}}`
- 状态码：201 Created

**关键特性：**
1. **自动参数绑定**：`c.ShouldBindJSON(&user)` 自动解析 JSON 到结构体
2. **输入验证**：绑定失败返回 400 Bad Request
3. **自动 ID 分配**：服务端维护自增 ID，避免客户端伪造
4. **并发安全**：使用互斥锁保证数据一致性

---

### 4. 启动服务

```go
if err := r.Run(":8080"); err != nil {
    panic(err)
}
```

**说明：**
- 监听端口：8080
- 启动失败时会抛出异常并终止程序

## 运行项目

### 启动命令
```bash
go run main.go
```

### 接口测试

**1. 测试问候接口**
```bash
curl http://localhost:8080/hello
# 响应：{"message":"hello"}
```

**2. 获取用户列表**
```bash
curl http://localhost:8080/users
# 响应：{"data":[]}
```

**3. 创建用户**
```bash
curl -X POST http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{"name":"张三","age":25}'
# 响应：{"message":"创建成功","data":{"id":1,"name":"张三","age":25}}
```

**4. 再次获取列表**
```bash
curl http://localhost:8080/users
# 响应：{"data":[{"id":1,"name":"张三","age":25}]}
```

## 核心技术点总结

### 1. Gin 框架基础
- **路由注册**：`r.GET()`, `r.POST()` 等
- **上下文对象**：`*gin.Context` 贯穿请求处理全过程
- **JSON 响应**：`c.JSON(statusCode, data)`
- **参数绑定**：`c.ShouldBindJSON()` 等便捷方法

### 2. 并发安全
- **互斥锁**：`sync.Mutex` 保护共享资源
- **锁的使用模式**：
  ```go
  mu.Lock()
  // 操作共享数据
  mu.Unlock()
  ```
- **数据副本**：读取时创建副本，避免外部影响内部状态

### 3. RESTful API 设计
- **GET**：查询资源
- **POST**：创建资源
- **状态码规范**：
  - 200 OK：成功
  - 201 Created：创建成功
  - 400 Bad Request：请求参数错误

### 4. Go 语言特性
- **结构体标签**：`` `json:"field"` `` 控制 JSON 序列化
- **defer 机制**：虽然本例未使用，但可用 `defer mu.Unlock()` 简化锁释放
- **切片操作**：`make()`, `copy()`, `append()`

## 扩展建议

### 可以添加的功能
1. **PUT /users/:id** - 更新用户
2. **DELETE /users/:id** - 删除用户
3. **GET /users/:id** - 获取单个用户
4. **数据持久化** - 使用数据库或文件存储
5. **更完善的验证** - 年龄范围、名称长度等
6. **日志记录** - 使用 Gin 的日志中间件
7. **错误处理中间件** - 统一错误响应格式

### 代码优化方向
1. 使用 `defer` 简化锁释放
2. 提取业务逻辑到独立函数
3. 添加输入验证逻辑
4. 使用配置文件管理端口等参数
5. 添加单元测试

## 学习收获

通过这个项目，你可以掌握：
1. ✅ Go 项目初始化和依赖管理
2. ✅ Gin 框架的基本使用
3. ✅ RESTful API 设计规范
4. ✅ JSON 数据绑定和响应
5. ✅ 并发安全和互斥锁使用
6. ✅ HTTP 状态码的正确使用
7. ✅ Go 语言结构体和标签语法
