import { BASE_API_URL } from "@/constants";
<<<<<<< HEAD
<<<<<<< HEAD
import { TapParams, ChipTapResponse, ChipTapResponseSchema } from "@types";
=======
import { TapParams, ChipTapResponse } from "@types";
>>>>>>> a49a19c (make api use null, client storage use undefined)
=======
import { TapParams, ChipTapResponse, ChipTapResponseSchema } from "@types";
>>>>>>> c10b8a5 (working chip registration and tap)

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
<<<<<<< HEAD
    const parsedData = ChipTapResponseSchema.parse(data);

    return parsedData;
=======

    return data as ChipTapResponse;
>>>>>>> a49a19c (make api use null, client storage use undefined)
=======
    const parsedData = ChipTapResponseSchema.parse(data);

    return parsedData;
>>>>>>> c10b8a5 (working chip registration and tap)
  } catch (error) {
    console.error("Error tapping chip:", error);
    throw error;
  }
}
