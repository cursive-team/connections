import { Button } from "@/components/ui/Button";

interface UsePasskeyProps {
  onSubmit: () => void;
}

export const UsePasskey: React.FC<UsePasskeyProps> = ({ onSubmit }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Use your passkey to login securely.
      </p>
      <Button onClick={onSubmit} className="w-full">
        Use Passkey
      </Button>
    </div>
  );
};
