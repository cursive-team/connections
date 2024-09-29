import { BASE_API_URL } from "@/constants";
import { TapParams, ChipTapResponse } from "@types";

/**
 * Taps a chip with the given parameters.
 * @param tapParams The parameters for tapping the chip.
 * @returns A promise that resolves to the ChipTapResponse.
 */
export async function tapChip(tapParams: TapParams): Promise<ChipTapResponse> {
  try {
    const request: TapParams = tapParams;
    const response = await fetch(`${BASE_API_URL}/chip/tap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data as ChipTapResponse;
  } catch (error) {
    console.error("Error tapping chip:", error);
    throw error;
  }
}
