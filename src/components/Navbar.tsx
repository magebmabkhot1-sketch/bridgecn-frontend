import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex justify-between items-center px-8 py-4 border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="font-bold text-xl">BridgeCN</div>

      <div className="flex gap-4 items-center">
        <Link to="/">Home</Link>

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Create Account</Link>
          </>
        )}

        {user && (
          <>
            <span
              onClick={() => navigate("/")}
              className="cursor-pointer"
            >
              👤 {user.name}
            </span>

            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
}