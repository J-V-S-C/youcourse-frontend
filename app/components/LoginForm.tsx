"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials. Please try again.");
    } else {
      router.push("/");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
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
            />
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <label className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox text-blue-500" />
            <span className="ml-2 text-gray-300 text-sm">Remember me</span>
          </label>
          <button
            className="inline-block align-baseline font-bold text-sm text-white hover:text-white hover:underline"
            type="button"
            onClick={() => router.push("/forgot-password")}
            disabled={loading}
          >
            Forgot Password?
          </button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>
        <div className="text-center my-4">
          <span className="text-gray-400">or</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <button
            className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50"
            type="button"
            onClick={() => router.push("/register")}
            disabled={loading}
          >
            Sign up free
          </button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <button
            className="bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50"
            type="button"
            disabled={loading}
          >
            Continue with Google
          </button>
        </div>
      </form>
    </div>
  );
}
