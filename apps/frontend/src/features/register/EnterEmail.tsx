import React, { useState } from "react";
import { EmailSchema } from "@types";
import { toast } from "sonner";
import { AppButton } from "@/components/ui/Button";
import { AppInput } from "@/components/ui/AppInput";
import { RegisterHeader } from "./RegisterHeader";
import { AppCopy } from "@/components/ui/AppCopy";

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
    <div className="flex flex-col space-y-6 h-full">
      <RegisterHeader
        title="Ready to tap into serendipity?"
        description="Discover & deepen connections with residents while choosing what you reveal about your data. This is programmable cryptography in action!"
      />
      {chipIssuer && (
        <p className="text-sm text-gray-500">
          Registering chip issued by: {chipIssuer}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="mt-1">
            <AppInput
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              required
              value={email}
              onChange={handleChange}
              description="Register with the email you used for Edge City."
            />
          </div>
        </div>
        <div>
          <AppButton type="submit">Next</AppButton>
        </div>
      </form>
      <AppCopy className=" mt-auto mx-auto absolute bottom-5 text-center justify-center left-1/2 -translate-x-1/2" />
    </div>
  );
};

export default EnterEmail;
