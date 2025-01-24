import { useAuth } from "@/context/authContext";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { useEffect, useState } from "react";

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
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();

      const idToken = signInResult.data?.idToken;
      if (!idToken) return;
      const googleCredential = auth.GoogleAuthProvider.credential(idToken || null);

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
    <ImageBackground
      source={require("../../assets/images/login_bg.webp")} // Replace with your image path
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.heading}>India's Largest B2B E-commerce Chain</Text>
        <Text style={styles.subHeading}>Empowering Businesses Nationwide</Text>
        <TouchableOpacity style={styles.signinButton} onPress={onGoogleButtonPress}>
          <Text style={styles.signinText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // Ensures the image covers the entire background
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Optional overlay for better text visibility
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 30,
  },
  signinButton: {
    backgroundColor: "#966440",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 250,
  },
  signinText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
