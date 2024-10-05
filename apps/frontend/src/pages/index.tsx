import { loginUser, logoutUser } from "@/lib/auth";
import { useState, useEffect } from "react";
import { storage } from "@/lib/storage";
import { Session, User } from "@/lib/storage/types";
import { tapChip } from "@/lib/chip/tap";
import { registerChip } from "@/lib/chip/register";
import { ChipTapResponse, TapParams } from "@types";

export default function Home() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerDisplayName, setRegisterDisplayName] = useState("");
  const [registerBio, setRegisterBio] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [chipId, setChipId] = useState("");
  const [tapParams, setTapParams] = useState<TapParams | null>(null);
  const [tapResponse, setTapResponse] = useState<ChipTapResponse | null>(null);
  const [showRegisterChipModal, setShowRegisterChipModal] = useState(false);
  const [showTapChipModal, setShowTapChipModal] = useState(false);
  const [isEditingSocials, setIsEditingSocials] = useState(false);
  const [editedTwitterUsername, setEditedTwitterUsername] = useState("");
  const [editedTelegramUsername, setEditedTelegramUsername] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [privateNote, setPrivateNote] = useState("");

  const refreshStorage = async () => {
    const session = await storage.getSession();
    const userData = await storage.getUser();
    if (session && userData) {
      setSession(session);
      setUser(userData);
    }
  };

  useEffect(() => {
    refreshStorage();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // await registerUser(
      //   registerEmail,
      //   registerPassword,
      //   registerDisplayName,
      //   registerBio
      // );
      await refreshStorage();
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(loginEmail, loginPassword);
      await refreshStorage();
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

  const handleTapChip = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const params: TapParams = { chipId };
      setTapParams(params);

      const result = await tapChip(params);
      setTapResponse(result);
      await refreshStorage();

      if (result.chipIsRegistered) {
        setShowTapChipModal(true);
      } else {
        setShowRegisterChipModal(true);
      }
    } catch (error) {
      console.error("Error tapping chip:", error);
      alert("Failed to tap chip.");
    }
  };

  const handleRegisterChip = async () => {
    if (!user || !tapResponse || !tapParams) return;

    if (!session || !session.authTokenValue) {
      alert("Your session has expired. Please log in again.");
      return;
    }

    try {
      await registerChip({
        authToken: session.authTokenValue,
        tapParams,
        ownerDisplayName: user.userData.displayName,
        ownerBio: user.userData.bio,
        ownerSignaturePublicKey: user.userData.signaturePublicKey,
        ownerEncryptionPublicKey: user.userData.encryptionPublicKey,
        ownerUserData: JSON.parse(
          JSON.stringify({
            twitter: user.userData.twitter,
            telegram: user.userData.telegram,
          })
        ),
      });
      await refreshStorage();

      setShowRegisterChipModal(false);
      alert("Chip registered successfully!");
    } catch (error) {
      console.error("Error registering chip:", error);
      alert("Failed to register chip.");
    }
  };

  const handleUpdateSocials = async () => {
    if (!user || !session) return;

    // if (
    //   user.userData.twitter?.username === editedTwitterUsername &&
    //   user.userData.telegram?.username === editedTelegramUsername
    // ) {
    //   setIsEditingSocials(false);
    //   return;
    // }

    // const updateTwitterUsername =
    //   editedTwitterUsername === "" ? undefined : editedTwitterUsername;
    // const updateTelegramUsername =
    //   editedTelegramUsername === "" ? undefined : editedTelegramUsername;

    // try {
    //   const userData: UserData = {
    //     displayName: user.userData.displayName,
    //     bio: user.userData.bio,
    //     signaturePublicKey: user.userData.signaturePublicKey,
    //     encryptionPublicKey: user.userData.encryptionPublicKey,
    //     twitter: { username: updateTwitterUsername },
    //     telegram: { username: updateTelegramUsername },
    //   };
    //   await storage.updateUserData(userData);
    //   await refreshStorage();

    //   setIsEditingSocials(false);
    //   alert("Socials updated successfully!");
    // } catch (error) {
    //   console.error("Error updating socials:", error);
    //   alert("Failed to update socials.");
    // }
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(selectedEmoji === emoji ? null : emoji);
  };

  const handleSubmitComment = async () => {
    if (
      !user ||
      !tapResponse ||
      !tapResponse.tap ||
      !tapResponse.tap.ownerUsername
    ) {
      alert("Failed to submit comment.");
      return;
    }

    try {
      await storage.updateComment(tapResponse.tap.ownerUsername, {
        emoji: selectedEmoji || undefined,
        note: privateNote === "" ? undefined : privateNote,
      });
      await refreshStorage();
      setShowTapChipModal(false);
      alert("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment.");
    }
  };

  const RegisterChipModal = () => {
    if (!showRegisterChipModal || !tapResponse) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Register Chip</h3>
          <p>Chip Issuer: {tapResponse.chipIssuer}</p>
          <button
            onClick={handleRegisterChip}
            className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Register Chip
          </button>
          <button
            onClick={() => setShowRegisterChipModal(false)}
            className="mt-4 ml-2 p-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  const TapChipModal = () => {
    if (!showTapChipModal || !tapResponse) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">You tapped a chip!</h3>
          <p>Chip Issuer: {tapResponse.chipIssuer}</p>
          <p>Chip Public Key: {tapResponse?.tap?.chipPublicKey}</p>
          <p>Message: {tapResponse?.tap?.message}</p>
          <p>Signature: {tapResponse?.tap?.signature}</p>
          <p>Tap Count: {tapResponse?.tap?.tapCount}</p>
          <p>Owner Display Name: {tapResponse?.tap?.ownerDisplayName}</p>
          <p>Owner Bio: {tapResponse?.tap?.ownerBio}</p>
          <p>
            Owner Signature Public Key:{" "}
            {tapResponse?.tap?.ownerSignaturePublicKey}
          </p>
          <p>
            Owner Encryption Public Key:{" "}
            {tapResponse?.tap?.ownerEncryptionPublicKey}
          </p>
          {typeof tapResponse?.tap?.ownerUserData === "object" &&
            tapResponse?.tap?.ownerUserData !== null &&
            "twitter" in tapResponse.tap.ownerUserData &&
            typeof tapResponse.tap.ownerUserData.twitter === "object" &&
            tapResponse.tap.ownerUserData.twitter !== null &&
            "username" in tapResponse.tap.ownerUserData.twitter &&
            typeof tapResponse.tap.ownerUserData.twitter.username ===
              "string" &&
            tapResponse.tap.ownerUserData.twitter.username !== "" && (
              <p>Twitter: @{tapResponse.tap.ownerUserData.twitter.username}</p>
            )}
          {typeof tapResponse?.tap?.ownerUserData === "object" &&
            tapResponse?.tap?.ownerUserData !== null &&
            "telegram" in tapResponse.tap.ownerUserData &&
            typeof tapResponse.tap.ownerUserData.telegram === "object" &&
            tapResponse.tap.ownerUserData.telegram !== null &&
            "username" in tapResponse.tap.ownerUserData.telegram &&
            typeof tapResponse.tap.ownerUserData.telegram.username ===
              "string" &&
            tapResponse.tap.ownerUserData.telegram.username !== "" && (
              <p>
                Telegram: @{tapResponse.tap.ownerUserData.telegram.username}
              </p>
            )}
          <p>Timestamp: {tapResponse?.tap?.timestamp.toISOString()}</p>
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Add a reaction:</h4>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEmojiSelect("😊")}
                className={`p-2 rounded ${
                  selectedEmoji === "😊"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                😊
              </button>
              <button
                onClick={() => handleEmojiSelect("😢")}
                className={`p-2 rounded ${
                  selectedEmoji === "😢"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                😢
              </button>
              <button
                onClick={() => handleEmojiSelect("❤️")}
                className={`p-2 rounded ${
                  selectedEmoji === "❤️"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                ❤️
              </button>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Add a private note:</h4>
            <textarea
              value={privateNote}
              onChange={(e) => setPrivateNote(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              rows={3}
            />
          </div>
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => setShowTapChipModal(false)}
              className="p-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
              Close
            </button>
            <button
              onClick={handleSubmitComment}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
        <main className="flex flex-col gap-4 items-center w-full max-w-md p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-gray-100">
            Welcome, {user.userData.displayName}!
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-center mb-4">
            {user.userData.bio}
          </p>
          <div className="w-full">
            {isEditingSocials ? (
              <>
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="Twitter Username"
                    value={editedTwitterUsername}
                    onChange={(e) => setEditedTwitterUsername(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="Telegram Username"
                    value={editedTelegramUsername}
                    onChange={(e) => setEditedTelegramUsername(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => setIsEditingSocials(false)}
                    className="p-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateSocials}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    Submit
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-2">
                  Twitter: {user.userData.twitter?.username || "Not set"}
                </p>
                <p className="mb-2">
                  Telegram: {user.userData.telegram?.username || "Not set"}
                </p>
                <button
                  onClick={() => {
                    setIsEditingSocials(true);
                    setEditedTwitterUsername(
                      user.userData.twitter?.username || ""
                    );
                    setEditedTelegramUsername(
                      user.userData.telegram?.username || ""
                    );
                  }}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  Edit Socials
                </button>
              </>
            )}
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
          <form onSubmit={handleTapChip} className="flex flex-col gap-4 w-full">
            <input
              type="text"
              placeholder="Chip ID"
              value={chipId}
              onChange={(e) => setChipId(e.target.value)}
              className="p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              required
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Tap Chip
            </button>
          </form>
          <button
            onClick={handleLogout}
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
          >
            Logout
          </button>
        </main>
        <RegisterChipModal />
        <TapChipModal />
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
          <input
            type="text"
            placeholder="Display Name"
            value={registerDisplayName}
            onChange={(e) => setRegisterDisplayName(e.target.value)}
            className="p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          />
          <textarea
            placeholder="Bio"
            value={registerBio}
            onChange={(e) => setRegisterBio(e.target.value)}
            className="p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            rows={3}
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
