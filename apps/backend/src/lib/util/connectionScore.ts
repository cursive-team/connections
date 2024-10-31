/**
 * Computes a connection score between two users based on their common data hashes
 * The score is calculated as the product of:
 * 1. The ratio of common hashes to user A's total hashes
 * 2. The ratio of common hashes to user B's total hashes
 * This produces a score between 0-1 where:
 * - 0 means no hashes in common
 * - 1 means all hashes are identical between users
 * @param userAHashCount Total number of hashes for user A
 * @param userBHashCount Total number of hashes for user B
 * @param commonHashCount Number of hashes shared between both users
 * @returns Connection score between 0-1
 */
export const computeConnectionScore = (
  userAHashCount: number,
  userBHashCount: number,
  commonHashCount: number
) => {
  return (
    (commonHashCount / userAHashCount) * (commonHashCount / userBHashCount)
  );
};
