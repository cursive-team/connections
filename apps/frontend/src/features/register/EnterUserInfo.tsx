import React, { useState } from "react";
import { UsernameSchema } from "@types";
import { verifyUsernameIsUnique } from "@/lib/auth/util";
import { toast } from "sonner";

interface EnterUserInfoProps {
  chipIssuer: string | null;
  onSubmit: (userInfo: {
    username: string;
    displayName: string;
    bio: string;
    telegramHandle: string;
    twitterHandle: string;
  }) => Promise<void>;
}

const EnterUserInfo: React.FC<EnterUserInfoProps> = ({
  chipIssuer,
  onSubmit,
}) => {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [telegramHandle, setTelegramHandle] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      UsernameSchema.parse(username);
      const isUnique = await verifyUsernameIsUnique(username);
      if (!isUnique) {
        toast.error("Username is already taken");
        return;
      }

      if (telegramHandle.includes("@") || twitterHandle.includes("@")) {
        toast.error("Please enter handles without the '@' symbol");
        return;
      }

      await onSubmit({
        username,
        displayName: displayName.trim(),
        bio: bio.trim(),
        telegramHandle: telegramHandle.trim(),
        twitterHandle: twitterHandle.trim(),
      });
    } catch (error) {
      console.error(error);
      toast.error("Please enter a valid username");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {chipIssuer && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Registering chip issued by: {chipIssuer}
        </p>
      )}
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>
      <div>
        <label
          htmlFor="displayName"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Display Name
        </label>
        <input
          type="text"
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>
      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={3}
        />
      </div>
      <div>
        <label
          htmlFor="telegramHandle"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Telegram Handle
        </label>
        <input
          type="text"
          id="telegramHandle"
          value={telegramHandle}
          onChange={(e) => setTelegramHandle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      <div>
        <label
          htmlFor="twitterHandle"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Twitter Handle
        </label>
        <input
          type="text"
          id="twitterHandle"
          value={twitterHandle}
          onChange={(e) => setTwitterHandle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          Continue
        </button>
      </div>
    </form>
  );
};

export default EnterUserInfo;
