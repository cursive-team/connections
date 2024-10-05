import { BASE_API_URL } from "@/config";
import {
  EmailSchema,
  SigninTokenSchema,
  VerifyEmailUniqueResponseSchema,
  VerifySigninTokenResponseSchema,
  VerifyUsernameUniqueResponseSchema,
  errorToString,
} from "@types";

export const requestSigninToken = async (email: string): Promise<void> => {
  try {
    const parsedEmail = EmailSchema.parse(email);
    const response = await fetch(
      `${BASE_API_URL}/user/get_signin_token?email=${encodeURIComponent(
        parsedEmail
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to get signin token");
    }
    return;
  } catch (error) {
    console.error("Error requesting signin token:", errorToString(error));
    throw error;
  }
};

export const verifySigninToken = async (
  email: string,
  code: string
): Promise<boolean> => {
  try {
    SigninTokenSchema.parse(code);
    const response = await fetch(`${BASE_API_URL}/user/verify_signin_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, signinToken: code }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to verify signin token");
    }
    const data = await response.json();
    const verifyResponse = VerifySigninTokenResponseSchema.parse(data);

    return verifyResponse.success;
  } catch (error) {
    console.error("Error verifying signin token:", errorToString(error));
    throw error;
  }
};

export const verifyUsernameIsUnique = async (
  username: string
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${BASE_API_URL}/user/verify_username_unique`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Failed to verify username uniqueness"
      );
    }

    const data = await response.json();
    const verifyResponse = VerifyUsernameUniqueResponseSchema.parse(data);

    return verifyResponse.isUnique;
  } catch (error) {
    console.error("Error verifying username uniqueness:", errorToString(error));
    throw error;
  }
};

export const verifyEmailIsUnique = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_API_URL}/user/verify_email_unique`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to verify email uniqueness");
    }

    const data = await response.json();
    const verifyResponse = VerifyEmailUniqueResponseSchema.parse(data);

    return verifyResponse.isUnique;
  } catch (error) {
    console.error("Error verifying email uniqueness:", errorToString(error));
    throw error;
  }
};
