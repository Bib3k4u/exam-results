import React, { useState } from "react";
import { registerStudent } from "../services/api";

interface SignupProps {
  onSwitchToLogin: () => void;
  onSignup: (user: any) => void;
}

const Signup = ({ onSwitchToLogin, onSignup }: SignupProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await registerStudent(name, email, password);
      setMessage(res.message || "Registration successful ✅");

      // Redirect to dashboard after successful registration
      if (res.id && res.name && res.email) {
        setTimeout(() => {
          onSignup(res);
        }, 1500);
      }
    } catch (err: any) {
      setMessage(err.message || "Registration failed ❌");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Student Signup
        </h1>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
        <p
          className="text-center mt-4 text-sm text-blue-600 cursor-pointer hover:text-blue-800 transition"
          onClick={onSwitchToLogin}
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
};

export default Signup;