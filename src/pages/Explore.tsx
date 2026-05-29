import { useEffect, useState } from "react";
import axios from "axios";

export default function Explore() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    axios.get("http://localhost:4000/api/posts")
      .then((res) => setPosts(res.data));
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>Explore Posts</h1>

      {posts.map((p) => (
        <div key={p.id} style={{ marginBottom: 20 }}>
          <h3>{p.title}</h3>
          <p>{p.content}</p>
        </div>
      ))}
    </div>
  );
}