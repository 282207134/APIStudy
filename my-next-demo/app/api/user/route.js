// 定义 GET 接口 → 创建API
// 查数据：GET
export async function GET() {
    // 直接返回JSON
    return Response.json({
        name: "张三",
        age: 20,
        msg: "我是后端创建的API"
    })
}
// 提交数据：POST
export async function POST(req) {
    // 1. 拿到前端传来的 JSON 参数
    const body = await req.json()

    // 2. 简单处理（模拟保存）
    const resData = {
        msg: "接收成功",
        yourName: body.name,   // 前端发过来的
        yourAge: body.age
    }

    // 3. 返回结果
    return Response.json(resData)
}