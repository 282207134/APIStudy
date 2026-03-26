package main // 声明当前文件属于 main 包，用于构建可执行程序

import ( // 导入本文件所需的依赖包
	"net/http" // 提供 HTTP 状态码等常量
	"sync"     // 提供互斥锁，保证并发安全

	"github.com/gin-gonic/gin" // 导入 Gin Web 框架
) // 导入结束

type User struct { // 定义用户结构体
	ID   int    `json:"id"`   // 用户编号字段，由服务端自动分配
	Name string `json:"name"` // 用户名称字段，对应 JSON 的 name
	Age  int    `json:"age"`  // 用户年龄字段，对应 JSON 的 age
} // 用户结构体定义结束

var ( // 定义全局变量
	users  []User     // 保存用户列表数据
	nextID = 1        // 下一个可分配的用户 ID
	mu     sync.Mutex // 保护 users 和 nextID 的并发访问
) // 全局变量定义结束

func main() { // 程序入口函数
	r := gin.Default() // 创建一个带默认中间件的 Gin 引擎

	// 注册 GET /hello 路由
	r.GET("/hello", func(c *gin.Context) { // 处理 GET /hello 请求
		c.JSON(http.StatusOK, gin.H{ // 返回 200 状态码和 JSON 数据
			"message": "hello", // 返回固定问候消息
		}) // JSON 响应构建结束
	}) // /hello 路由处理结束

	// 注册 GET /users 路由
	r.GET("/users", func(c *gin.Context) { // 处理 GET /users 请求
		mu.Lock()                        // 读取前加锁，避免并发读写冲突
		list := make([]User, len(users)) // 创建切片副本，避免直接暴露底层数组
		copy(list, users)                // 拷贝当前用户数据
		mu.Unlock()                      // 读取完成后解锁

		c.JSON(http.StatusOK, gin.H{ // 返回 200 状态码和 JSON 数据
			"data": list, // 返回当前用户列表
		}) // JSON 响应构建结束
	}) // /users GET 路由处理结束

	// 注册 POST /users 路由
	r.POST("/users", func(c *gin.Context) { // 处理 POST /users 请求
		var user User // 声明 user 变量用于接收请求体

		if err := c.ShouldBindJSON(&user); err != nil { // 将请求 JSON 绑定到 user，失败则进入错误分支
			c.JSON(http.StatusBadRequest, gin.H{ // 返回 400 状态码和错误信息
				"error": err.Error(), // 返回具体的绑定错误内容
			}) // 错误 JSON 响应构建结束
			return // 绑定失败后提前返回，不再继续执行
		} // JSON 绑定校验结束

		mu.Lock()                   // 写入前加锁，保证 ID 分配和追加操作原子性
		user.ID = nextID            // 由服务端分配自增 ID
		nextID++                    // 递增下一个待分配的 ID
		users = append(users, user) // 将新用户加入用户列表
		mu.Unlock()                 // 写入完成后解锁

		c.JSON(http.StatusCreated, gin.H{ // 返回 201 状态码表示创建成功
			"message": "创建成功", // 返回创建结果提示文本
			"data":    user,   // 返回创建后的用户数据（包含自动生成 ID）
		}) // 成功 JSON 响应构建结束
	}) // /users POST 路由处理结束

	if err := r.Run(":8080"); err != nil { // 启动服务并监听 8080 端口
		panic(err) // 启动失败时抛出异常并终止程序
	} // 服务启动判断结束
} // main 函数结束
