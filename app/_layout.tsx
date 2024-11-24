import Loading from "@/components/mobileview/global/GlobalLoader";
import Header from "@/components/mobileview/global/Headers";
import { AuthProvider } from "@/context/authContext";
import { CompanyProvider } from "@/context/companyContext";
import { DistributorProvider } from "@/context/distributorContext";
import { LoadingProvider } from "@/context/loadingContext";
import { NotificationProvider } from "@/context/notificationsContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

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
    <NotificationProvider>
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
                      <Loading />
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
      <Toast />
    </NotificationProvider>
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
