import { registerUser } from "@/lib/auth/register";
import { useState } from "react";

export default function Home() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    registerUser(registerEmail, registerPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your login logic here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <main className="flex flex-col gap-8 items-center w-full max-w-md">
        <form
          onSubmit={handleRegister}
          className="flex flex-col gap-4 w-full p-4 bg-white dark:bg-gray-800 rounded shadow"
        >
          <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-gray-100">
            Register
          </h2>
          <input
            type="email"
            placeholder="Email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            className="p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            className="p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Register
          </button>
        </form>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4 w-full p-4 bg-white dark:bg-gray-800 rounded shadow"
        >
          <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-gray-100">
            Login
          </h2>
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Login
          </button>
        </form>
      </main>
    </div>
  );
}
