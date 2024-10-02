import { BASE_API_URL } from "@/constants";
import { TapParams, ChipTapResponse, ChipTapResponseSchema } from "@types";
import { storage } from "@/lib/storage";

/**
 * Taps a chip with the given parameters and add the result to storage.
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
    const parsedData = ChipTapResponseSchema.parse(data);

    await storage.addTap(parsedData);

    return parsedData;
  } catch (error) {
    console.error("Error tapping chip:", error);
    throw error;
  }
}
