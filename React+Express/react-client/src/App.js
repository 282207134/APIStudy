//引入 React 钩子：useState、useEffect
import { useState, useEffect } from "react";
function App() {
  // 1. 定义状态：存后端返回的数据
  const [user, setUser] = useState(null);
  // 2. 加载状态  
  const [loading, setLoading] = useState(true);
  // 3. 调用后端创建的 API  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 调用后端接口
        const res = await fetch("http://localhost:5000/api/user");
        const data = await res.json();
        // 把后端数据存起来 
        setUser(data);
      } catch (err) {
        console.log("请求失败", err);
      } finally {
        setLoading(false);
      }
    };
    // 执行调用 
    fetchUser();
  }, []);
  // 4. 页面渲染  
  if (loading) return <h3>加载中...</h3>;
  return (
    <div style={{ padding: 20 }}>
      <h2>React 调用后端 API</h2>
      <p>姓名：{user.name}</p>
      <p>年龄：{user.age}</p>
      <p>信息：{user.message}</p>
    </div>
  );
}
export default App;