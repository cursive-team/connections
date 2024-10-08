import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { storage } from "@/lib/storage";
import { Session, User } from "@/lib/storage/types";
import { toast } from "sonner";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isEditingSocials, setIsEditingSocials] = useState(false);
  const [twitterUsername, setTwitterUsername] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const user = await storage.getUser();
      const session = await storage.getSession();
      if (user && session) {
        setUser(user);
        setSession(session);
      } else {
        toast.error("User not found");
        router.push("/");
      }
    };

    fetchUser();
  }, [router]);

  const handleUpdateSocials = async () => {
    if (!user) return;

    if (
      twitterUsername === user.userData.twitter?.username &&
      telegramUsername === user.userData.telegram?.username
    ) {
      setIsEditingSocials(false);
      return;
    }

    try {
      const updatedUserData = {
        ...user.userData,
        twitter: { username: twitterUsername || undefined },
        telegram: { username: telegramUsername || undefined },
      };

      await storage.updateUserData(updatedUserData);
      const newUser = await storage.getUser();
      const newSession = await storage.getSession();
      if (!newUser || !newSession) {
        throw new Error("User or session not found");
      }
      setUser(newUser);
      setSession(newSession);
      setIsEditingSocials(false);
      toast.success("Socials updated successfully!");
    } catch (error) {
      console.error("Error updating socials:", error);
      toast.error("Failed to update socials.");
    }
  };

  if (!user) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your Profile
          </h1>
        </div>
        <button
          onClick={() => {
            console.log("Session:", session);
            console.log("User:", user);
          }}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
        >
          Log Session and User
        </button>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {user.userData.displayName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              @{user.userData.username}
            </p>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            {user.userData.bio}
          </p>
          <div className="space-y-2">
            {isEditingSocials ? (
              <>
                <input
                  type="text"
                  value={twitterUsername}
                  onChange={(e) => setTwitterUsername(e.target.value)}
                  placeholder="Twitter username"
                  className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  type="text"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  placeholder="Telegram username"
                  className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdateSocials}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingSocials(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-700 dark:text-gray-300">
                  Twitter: {user.userData.twitter?.username || "Not set"}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Telegram: {user.userData.telegram?.username || "Not set"}
                </p>
                <button
                  onClick={() => setIsEditingSocials(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Edit Socials
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
