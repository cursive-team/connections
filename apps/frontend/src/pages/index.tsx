import { registerUser, loginUser, logoutUser } from "@/lib/auth";
import { useState, useEffect } from "react";
import { storage } from "@/lib/storage";
import { Session, User } from "@/lib/storage/types";

export default function Home() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const session = await storage.getSession();
      const userData = await storage.getUser();
      if (session && userData) {
        setSession(session);
        setUser(userData);
      }
    };
    checkUser();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(registerEmail, registerPassword);
      const session = await storage.getSession();
      const user = await storage.getUser();
      if (session && user) {
        setSession(session);
        setUser(user);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(loginEmail, loginPassword);
      const session = await storage.getSession();
      const user = await storage.getUser();
      if (session && user) {
        setSession(session);
        setUser(user);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setSession(null);
    setUser(null);
    window.location.reload();
  };

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
        <main className="flex flex-col gap-4 items-center w-full max-w-md p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-gray-100">
            Welcome, {user.email}!
          </h2>
          <button
            onClick={() => {
              console.log("Session:", session);
              console.log("User:", user);
            }}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
          >
            Log Session and User
          </button>
          <button
            onClick={handleLogout}
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
          >
            Logout
          </button>
        </main>
      </div>
    );
  }

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
