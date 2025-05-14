import { Alert, Platform, Linking } from "react-native";
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
      sound: "default",
    });
  }

  if (!Device.isDevice) {
    Alert.alert("Error", "Must use a physical device for push notifications.");
    return;
  }

  let { status } = await Notifications.getPermissionsAsync();

  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    status = newStatus;
  }

  while (status !== "granted") {
    await new Promise((resolve) => {
      Alert.alert(
        "Permission Required",
        "Notification permission is required to use this app. Please enable it in settings.",
        [
          {
            text: "Go to Settings",
            onPress: async () => {
              await Linking.openSettings();
              resolve(undefined);
            },
          },
        ]
      );
    });

    const { status: updatedStatus } = await Notifications.getPermissionsAsync();
    if (updatedStatus === "granted") {
      status = updatedStatus;
    }
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
