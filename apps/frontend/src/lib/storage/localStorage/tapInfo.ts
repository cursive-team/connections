import { TapInfo, TapInfoSchema } from "@/lib/storage/types";
import {
  saveToLocalStorage,
  getFromLocalStorage,
  deleteFromLocalStorage,
} from "./utils";

const TAP_INFO_KEY = "savedTapInfo";

export const saveTapInfo = (tapInfo: TapInfo): void => {
  saveToLocalStorage(TAP_INFO_KEY, JSON.stringify(tapInfo));
};

export const loadSavedTapInfo = (): TapInfo | undefined => {
  const savedTapInfo = getFromLocalStorage(TAP_INFO_KEY);
  if (savedTapInfo) {
    try {
      return TapInfoSchema.parse(JSON.parse(savedTapInfo));
    } catch (error) {
      console.error("Error parsing saved tap info:", error);
    }
  }
  return undefined;
};

export const deleteSavedTapInfo = (): void => {
  deleteFromLocalStorage(TAP_INFO_KEY);
};
