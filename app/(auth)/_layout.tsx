import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="selectRole" options={{ headerShown: false }} />
      <Stack.Screen name="companySignUp" options={{ headerShown: false }} />
      <Stack.Screen name="distributorSignUp" options={{ headerShown: false }} />
      <Stack.Screen name="shopKeeperSignUp" options={{ headerShown: false }} />
    </Stack>
  );
}
