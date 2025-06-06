import { useAuth } from "@/context/authContext";
import { auth } from "@/firebaseConfig"; // Use our Firebase config
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { useEffect, useState } from "react";

export default function App() {
  const [initializing, setInitializing] = useState(true);

  GoogleSignin.configure({
    webClientId: "204818550386-adh6lokl3o462k7sjmlb5hqur4s1vqjl.apps.googleusercontent.com",
  });

  const { getUserInfo }: any = useAuth();

  function onAuthStateChanged(user: any) {
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(onAuthStateChanged);
    return unsubscribe;
  }, []);

  async function onGoogleButtonPress() {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();

      const idToken = signInResult.data?.idToken
      if (!idToken) return;

      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userSigned = await signInWithCredential(auth, googleCredential);

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
      source={require("../../assets/images/login_bg.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.signinButton} onPress={onGoogleButtonPress}>
          <Text style={styles.signinText}>Enter with Google</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 20,

  },
  signinButton: {
    backgroundColor: "black",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
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
