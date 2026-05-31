import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WEB_TOP = 52;
const WEB_BOTTOM = 24;

export function useSafeInsets() {
  const insets = useSafeAreaInsets();
  if (Platform.OS === "web") {
    return { top: WEB_TOP, bottom: WEB_BOTTOM };
  }
  return { top: insets.top, bottom: insets.bottom };
}
