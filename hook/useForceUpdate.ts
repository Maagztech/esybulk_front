import { useEffect } from "react";
import { Alert, Linking } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Constants from "expo-constants";

interface AppVersionData {
  version: string;
  force_update: boolean;
  update_url: string;
}

const useForceUpdate = () => {
  useEffect(() => {
    const checkVersion = async () => {
      try {
        const docRef = doc(db, "app_version", "latest_version");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const { version, force_update, update_url } =
            docSnap.data() as AppVersionData;
          const currentVersion = Constants.expoConfig?.version || "0.0.0";

          if (currentVersion < version) {
            Alert.alert(
              "Update Required",
              "A new version of the app is available. Please update.",
              [
                {
                  text: force_update ? "Update Now" : "Later",
                  onPress: () => Linking.openURL(update_url),
                },
              ],
              { cancelable: !force_update }
            );
          }
        }
      } catch (error) {
        console.error("Error fetching app version:", error);
      }
    };

    checkVersion();
  }, []);
};

export default useForceUpdate;
