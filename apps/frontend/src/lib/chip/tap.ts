import { BASE_API_URL } from "@/constants";
<<<<<<< HEAD
import { TapParams, ChipTapResponse, ChipTapResponseSchema } from "@types";
=======
import { TapParams, ChipTapResponse } from "@types";
>>>>>>> a49a19c (make api use null, client storage use undefined)

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
<<<<<<< HEAD
    const parsedData = ChipTapResponseSchema.parse(data);

    return parsedData;
=======

    return data as ChipTapResponse;
>>>>>>> a49a19c (make api use null, client storage use undefined)
  } catch (error) {
    console.error("Error tapping chip:", error);
    throw error;
  }
}
