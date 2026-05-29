import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(
        "https://bridgecn-api.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      navigate("/");
      window.location.reload();
    } catch (err) {
      alert("Login failed");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-cyan-500/20 blur-[140px] rounded-full" />

      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-blue-700/20 blur-[140px] rounded-full" />

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[36px] p-10 shadow-2xl"
      >
        {/* LOGO */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text mb-4">
            BridgeCN
          </h1>

          <p className="text-slate-400">
            Welcome back to the global student network
          </p>
        </div>

        {/* EMAIL */}
        <div className="mb-5">
          <label className="block mb-2 text-slate-300">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-14 px-5 rounded-2xl bg-black/30 border border-white/10 outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-8">
          <label className="block mb-2 text-slate-300">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-14 px-5 rounded-2xl bg-black/30 border border-white/10 outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={login}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-bold text-lg hover:scale-[1.02] transition shadow-2xl"
        >
          Login
        </button>

        {/* FOOTER */}
        <div className="mt-8 text-center text-slate-400">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-cyan-400 hover:text-cyan-300"
          >
            Create Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
