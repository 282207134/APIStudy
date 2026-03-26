// 引入框架
const express = require('express'); // 1. 引入 express（用来创建接口）
const cors = require('cors'); // 2. 引入 cors（用来解决跨域问题）
const app = express(); // 3. 创建 express 实例
// 允许跨域
app.use(cors());
// 创建接口
// 接口地址：http://localhost:5000/api/user
app.get('/api/user', (req, res) => { 
    res.json({ 
        name: "小明", 
        age: 20, 
        message: "我是后端创建的API"
    });
});
// 启动服务
//通过 node server.js 启动服务
app.listen(5000, () => { 
    console.log("服务运行在 http://localhost:5000");
});
