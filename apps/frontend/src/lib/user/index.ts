import { User } from "@/lib/storage/types";

// NOTE: other methods that depend on user object but not localstorage should be moved here
export const getConnectionPubKey = (user: User, connectionUsername: string): string => {
  const connection = user.connections[connectionUsername];
  return connection.user.signaturePublicKey;
};

export const getUserSigPubKey = (user: User): string => {
  return user.userData.signaturePublicKey;
};

