import { useAuth } from "@/context/authContext";
import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  GoogleSignin.configure({
    webClientId:
      "204818550386-adh6lokl3o462k7sjmlb5hqur4s1vqjl.apps.googleusercontent.com",
  });

  const { getUserInfo }: any = useAuth();

  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  async function onGoogleButtonPress() {
    try {

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const signInResult = await GoogleSignin.signIn();

      const idToken = signInResult.data?.idToken;
      if (!idToken) return;
      const googleCredential = auth.GoogleAuthProvider.credential(
        idToken || null
      );

      const userSigned = await auth().signInWithCredential(googleCredential);

      const firebaseToken = await userSigned.user.getIdToken();

      await getUserInfo(firebaseToken);
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
      Toast.show({
        type: "error",
        text1: "Google Sign-In Error",
        text2: "Unable to sign in with Google. Please try again.",
      });
    }
  }

  if (initializing) return null;
  return (
    <View style={styles.container}>
      <View style={styles.PressableContainer}>
        <GoogleSigninButton
          style={{ width: 250, height: 60 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={onGoogleButtonPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  PressableContainer: {
    display: "flex",
    justifyContent: "center",
    marginVertical: 10,
    width: "100%",
    maxWidth: 500,
    alignItems: "center",
  },
  signUpPresseble: {
    display: "flex",
    justifyContent: "center",
    marginVertical: 10,
    width: "100%",
    maxWidth: 500,
    alignItems: "center",
  },
  signUpButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#966440",
    color: "white",
    fontWeight: "bold",
  },
});
