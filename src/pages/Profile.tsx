import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [followData, setFollowData] = useState<any>(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchData = async () => {
      const userRes = await axios.get(`http://localhost:4000/api/users/${id}`);
      const followRes = await axios.get(`http://localhost:4000/api/follow/${id}`);

      setUser(userRes.data);
      setFollowData(followRes.data);
    };

    fetchData();
  }, [id]);

  const follow = async () => {
    await axios.post(`http://localhost:4000/api/follow/${id}/follow`, {
      userId: currentUser.id,
    });

    window.location.reload();
  };

  const unfollow = async () => {
    await axios.post(`http://localhost:4000/api/follow/${id}/unfollow`, {
      userId: currentUser.id,
    });

    window.location.reload();
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{user.name}'s Profile</h1>
      <p>Email: {user.email}</p>

      <p>
        👥 Followers: {followData?.followers || 0} | Following:{" "}
        {followData?.following || 0}
      </p>

      {currentUser?.id !== id && (
        <>
          <button onClick={follow}>Follow</button>
          <button onClick={unfollow} style={{ marginLeft: 10 }}>
            Unfollow
          </button>
        </>
      )}

      <h3>Posts</h3>

      {user.posts?.map((post: any) => (
        <div key={post.id} style={{ border: "1px solid #ccc", padding: 10 }}>
          <h4>{post.title}</h4>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}