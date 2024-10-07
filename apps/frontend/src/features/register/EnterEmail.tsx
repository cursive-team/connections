import React, { useState } from "react";
import { EmailSchema } from "@types";
import { toast } from "sonner";

interface EnterEmailProps {
  chipIssuer: string | null;
  submitEmail: (email: string) => Promise<void>;
}

const EnterEmail: React.FC<EnterEmailProps> = ({ chipIssuer, submitEmail }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      EmailSchema.parse(email);
      await submitEmail(email);
    } catch (error) {
      console.error(error);
      toast.error("Please enter a valid email address");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
  };

  return (
    <div className="space-y-6">
      {chipIssuer && (
        <p className="text-sm text-gray-500">
          Registering chip issued by: {chipIssuer}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnterEmail;
