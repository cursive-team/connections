-- AlterTable
ALTER TABLE "SigninToken" ADD COLUMN     "signinAttemptCount" INTEGER NOT NULL DEFAULT 0;
