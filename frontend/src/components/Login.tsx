import { useState } from "react";
import { loginStudent } from "../services/api";

const Login = ({ onLogin, onSwitchToSignup }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const data = await loginStudent(email, password);

      // Check if we have user data with proper id (successful login)
      if (data.id && data.name && data.email) {
        setMsg("✅ Login successful!");
        onLogin(data);
      } else {
        setMsg("❌ Invalid credentials");
      }
    } catch (error: any) {
      setMsg("❌ " + (error.message || "Login failed"));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-600 to-indigo-500">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6 text-purple-600">
          Student Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition"
          >
            Login
          </button>
        </form>
        {msg && <p className="mt-4 text-center text-sm text-gray-700">{msg}</p>}
        <p
          className="text-center mt-4 text-sm text-purple-600 cursor-pointer hover:text-purple-800 transition"
          onClick={onSwitchToSignup}
        >
          Don't have an account? Signup
        </p>
      </div>
    </div>
  );
};

export default Login;