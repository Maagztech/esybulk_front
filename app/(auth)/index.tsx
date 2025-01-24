import { useAuth } from "@/context/authContext";
import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
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
      <Image
        source={require("./assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.heading}>Welcome to EsyBulk</Text>
      <Text style={styles.subheading}>
        The Largest B2B E-commerce Chain in India
      </Text>
      <Text style={styles.description}>
        Revolutionizing how businesses connect, trade, and grow. Join thousands
        of partners and simplify your B2B supply chain with EsyBulk.
      </Text>
      <View style={styles.PressableContainer}>
        <GoogleSigninButton
          style={styles.signinButton}
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
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 10,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#34495e",
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 30,
  },
  PressableContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
  },
  signinButton: {
    width: 250,
    height: 60,
  },
});
