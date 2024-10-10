import React, { useState } from "react";
import { EmailSchema } from "@types";
import { toast } from "sonner";
import { AppButton } from "@/components/ui/Button";
import { AppInput } from "@/components/ui/AppInput";
import { RegisterHeader } from "./RegisterHeader";
import { AppCopy } from "@/components/ui/AppCopy";

interface EnterEmailProps {
  submitEmail: (email: string) => Promise<void>;
}

const EnterEmail: React.FC<EnterEmailProps> = ({ submitEmail }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      EmailSchema.parse(email);
      await submitEmail(email);
      setLoading(false);
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
    <div className="flex flex-col grow">
      <RegisterHeader
        title="Ready to tap into serendipity?"
        description="Discover & deepen connections with residents while choosing what you reveal about your data. This is programmable cryptography in action!"
      />
      <div className="flex flex-col mt-auto">
        <form onSubmit={handleSubmit} className="space-y-4 pb-2">
          <div className="text-center mt-1">
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
          <AppButton loading={loading} type="submit">
            Next
          </AppButton>
        </form>
        <AppCopy className="text-center py-4" />
      </div>
    </div>
  );
};

export default EnterEmail;
