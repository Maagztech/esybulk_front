import Header from "@/components/mobileview/global/header";
import { AuthProvider } from "@/context/authContext";
import { CompanyProvider } from "@/context/companyContext";
import { DistributorProvider } from "@/context/distributorContext";
import { LoadingProvider } from "@/context/loadingContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <LoadingProvider>
      <AuthProvider>
        <CompanyProvider>
          <DistributorProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <View style={styles.overlay}>
                <SafeAreaView
                  style={styles.container}
                  edges={["top", "bottom", "left", "right"]}
                >
                  <PaperProvider>
                    <Header />
                    <ToastContainer
                      style={{ fontSize: "14px", zIndex: 99999 }}
                      autoClose={3000}
                    />
                    <Stack
                      screenOptions={{
                        headerShown: false,
                      }}
                    >
                      <Stack.Screen
                        name="(auth)"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                      />
                    </Stack>
                  </PaperProvider>
                </SafeAreaView>
              </View>
            </ThemeProvider>
          </DistributorProvider>
        </CompanyProvider>
      </AuthProvider>
    </LoadingProvider>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
