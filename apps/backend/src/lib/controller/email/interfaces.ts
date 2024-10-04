import { SigninToken } from "@/lib/controller/postgres/types";

export interface iEmailClient {
  EmailSigninToken(signinToken: SigninToken): Promise<void>;
}
