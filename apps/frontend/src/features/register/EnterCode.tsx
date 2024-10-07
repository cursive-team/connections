import React, { useState } from "react";
import { SigninTokenSchema } from "@types";
import { toast } from "sonner";

interface EnterCodeProps {
  chipIssuer: string | null;
  email: string;
  submitCode: (code: string) => Promise<void>;
}

const EnterCode: React.FC<EnterCodeProps> = ({
  chipIssuer,
  email,
  submitCode,
}) => {
  const [code, setCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      SigninTokenSchema.parse(code);
      await submitCode(code);
    } catch (error) {
      console.error(error);
      toast.error("Please enter a valid 6-digit code");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(newCode);
  };

  return (
    <div className="space-y-6">
      {chipIssuer && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Registering chip issued by: {chipIssuer}
        </p>
      )}
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Enter the 6-digit code sent to: <strong>{email}</strong>
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Enter 6-digit code
          </label>
          <div className="mt-1">
            <input
              id="code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={code}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Verify Code
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnterCode;
