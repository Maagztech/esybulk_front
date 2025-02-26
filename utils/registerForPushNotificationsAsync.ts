import { Alert, Platform } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: "default", // 🔊 Ensures sound plays
    });
  }

  if (!Device.isDevice) {
    Alert.alert("Error", "Must use physical device for push notifications");
    throw new Error("Must use physical device for push notifications");
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return new Promise(() => {
      Alert.alert(
        "Permission Required",
        "Push notification permission is required to continue using the app.",
        [{ text: "OK", onPress: () => registerForPushNotificationsAsync() }]
      );
    });
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;
  if (!projectId) {
    throw new Error("Project ID not found");
  }

  try {
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;
    console.log(pushTokenString);
    return pushTokenString;
  } catch (e) {
    throw new Error(`${e}`);
  }
}
