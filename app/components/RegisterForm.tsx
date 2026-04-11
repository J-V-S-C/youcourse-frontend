"use client";

import { register } from "@/lib/user/user.service";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await register({ name, email, password });
      router.push("/login");
    } catch {
      setError("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}

        <div className="mb-4 relative">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <div className="flex items-center border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-white">
            <input
              className="appearance-none bg-transparent border-none w-full text-black leading-tight focus:outline-none"
              id="name"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="mb-4 relative">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <div className="flex items-center border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-white">
            <input
              className="appearance-none bg-transparent border-none w-full text-black leading-tight focus:outline-none"
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="mb-4 relative">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <div className="flex items-center border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-white">
            <input
              className="appearance-none bg-transparent border-none w-full text-black leading-tight focus:outline-none"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="mb-6 relative">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <div className="flex items-center border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-white">
            <input
              className="appearance-none bg-transparent border-none w-full text-black leading-tight focus:outline-none"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>

        <div className="text-center my-4">
          <span className="text-gray-400">or</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            className="bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50"
            type="button"
            onClick={() => router.push("/login")}
            disabled={loading}
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}
