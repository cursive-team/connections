interface RegisterResponse {
  registrationNumber: number;
}

export async function registerUser(
  email: string,
  password: string
): Promise<RegisterResponse> {
  try {
    const response = await fetch("/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error || "Registration failed");
    }

    const data: RegisterResponse = await response.json();
    return { registrationNumber: data.registrationNumber };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred during registration");
  }
}
