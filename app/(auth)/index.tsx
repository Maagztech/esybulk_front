import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [token, setToken] = useState("");
  interface UserInfo {
    picture?: string;
    email: string;
    verified_email: boolean;
    name: string;
  }

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "791745687932-ghg45cqrj6ojrupbs3h9v2tbr665bt4h.apps.googleusercontent.com",
    // iosClientId: "",
    webClientId:
      "791745687932-e0dh3e3inqbgmmjabntt927fe104jlme.apps.googleusercontent.com",
  });

  useEffect(() => {
    handleEffect();
  }, [response, token]);

  async function handleEffect() {
    const user = await getLocalUser();
    if (!user) {
      if (response?.type === "success") {
        if (response?.authentication?.accessToken) {
          getUserInfo(response.authentication.accessToken);
        }
      }
    } else {
      setUserInfo(user);
    }
  }

  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("@user");
    if (!data) return null;
    return JSON.parse(data);
  };

  const getUserInfo = async (token: string) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      // Add your own error handler here
    }
  };

  return (
    <View style={styles.container}>
      {!userInfo ? (
        <View style={styles.PressableContainer}>
          <Pressable
            disabled={!request}
            onPress={() => {
              promptAsync();
            }}
            style={styles.signUpPresseble}
          >
            <Text style={styles.signUpButton}>Continue with Google</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.card}>
          {userInfo?.picture && (
            <Image source={{ uri: userInfo?.picture }} style={styles.image} />
          )}
          <Text style={styles.text}>{JSON.stringify(userInfo)}</Text>
        </View>
      )}
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
