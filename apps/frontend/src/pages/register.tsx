import React, { useState } from "react";
import { z } from "zod";
import { errorToString } from "@types";
import { BASE_API_URL } from "@/constants";

const EmailSchema = z.string().email();
const CodeSchema = z.string().length(6).regex(/^\d+$/);

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleGetSigninToken = async () => {
    try {
      const parsedEmail = EmailSchema.parse(email);
      const response = await fetch(
        `${BASE_API_URL}/user/get_signin_token?email=${encodeURIComponent(
          parsedEmail
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get signin token");
      }
      setMessage("Signin token sent to your email");
    } catch (error) {
      const errorMessage = errorToString(error);
      console.error(errorMessage);
      setError(
        "Failed to get signin token. Please check your email and try again."
      );
    }
  };

  const handleVerifySigninToken = async () => {
    try {
      CodeSchema.parse(code);
      const response = await fetch(`${BASE_API_URL}/user/verify_signin_token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, signinToken: code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to verify signin token");
      }
      const data = await response.json();
      setMessage(
        data.success
          ? "Signin token verified successfully"
          : "Invalid signin token"
      );
    } catch (error) {
      const errorMessage = errorToString(error);
      console.error(errorMessage);
      setError(
        "Failed to verify signin token. Please check your code and try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register for Cursive
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
          {message && (
            <div className="mb-4 text-green-600 text-sm">{message}</div>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <button
            onClick={handleGetSigninToken}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Get Signin Token
          </button>

          <div className="mt-6">
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700"
            >
              6-digit Code
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <button
            onClick={handleVerifySigninToken}
            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Verify Signin Token
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
