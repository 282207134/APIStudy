// 前端页面 直接请求自己的API
export default async function Home() {
  // 1. 调用本地API
  const res = await fetch("http://localhost:3000/api/user");
  // 2. 解析数据
  const data = await res.json();
  // 发 POST 请求
  const fetchPost = async () => {
    const res = await fetch("/api/user", {
      method: "POST",          // 指定方式
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({   // 传给后端的数据
        name: "我是前端发来的",
        age: 22
      })
    })
    const data = await res.json()
    console.log(data)
  }
  // 3. 渲染页面
  return (
    <div style={{padding:30}}>
      <h1>最简 Next.js 前后端一体</h1>
      <p>名字：{data.name}</p>
      <p>年龄：{data.age}</p>
      <p>信息：{data.msg}</p>
    </div>
  )
}