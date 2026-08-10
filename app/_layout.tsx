import "react-native-reanimated";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Alert } from "react-native";
import { useNetworkState } from "expo-network";
import {
  DarkTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
// Note: Error logging is auto-initialized via index.ts import

// Only wrap with ErrorBoundary in dev — production apps should not include it
const DevErrorBoundary = __DEV__
  ? ErrorBoundary
  : ({ children }: { children: React.ReactNode }) => <>{children}</>;

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(tabs)", // Ensure any route can link back to `/`
};

const DJVerseDarkTheme: Theme = {
  ...DarkTheme,
  dark: true,
  colors: {
    primary: "#7B4FFF",
    background: "#0A0A0F",
    card: "#13131A",
    text: "#F0F0FF",
    border: "rgba(255,255,255,0.07)",
    notification: "#FF4F4F",
  },
};

export default function RootLayout() {
  const networkState = useNetworkState();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "SpaceGrotesk-Regular": {
      uri: "https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gozuPTPgc8.woff2",
    },
    "SpaceGrotesk-Medium": {
      uri: "https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gozuPTPgc8.woff2",
    },
    "SpaceGrotesk-Bold": {
      uri: "https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gozuPTPgc8.woff2",
    },
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  React.useEffect(() => {
    if (
      !networkState.isConnected &&
      networkState.isInternetReachable === false
    ) {
      Alert.alert(
        "🔌 You are offline",
        "You can keep using the app! Your changes will be saved locally and synced when you are back online."
      );
    }
  }, [networkState.isConnected, networkState.isInternetReachable]);

  return (
    <DevErrorBoundary>
      <StatusBar style="light" animated />
      <ThemeProvider value={DJVerseDarkTheme}>
        <SafeAreaProvider>
          <WidgetProvider>
            <GestureHandlerRootView>
              <Stack>
                {/* Main app with tabs */}
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                {/* Stack screens outside tabs */}
                <Stack.Screen name="shorts/index" options={{ headerShown: false }} />
                <Stack.Screen name="ai-assistant/index" options={{ headerShown: false }} />
                <Stack.Screen name="ranking/index" options={{ headerShown: false }} />
                <Stack.Screen name="plans/index" options={{ headerShown: false }} />
              </Stack>
              <SystemBars style={"light"} />
            </GestureHandlerRootView>
          </WidgetProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </DevErrorBoundary>
  );
}
