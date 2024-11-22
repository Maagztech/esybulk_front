import { useAuth } from "@/context/authContext";
import { useNavigationState } from "@react-navigation/native"; // Import navigation state hook
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const { getUserInfo, setUserInfo, userInfo }: any = useAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "791745687932-ghg45cqrj6ojrupbs3h9v2tbr665bt4h.apps.googleusercontent.com",
    webClientId:
      "791745687932-e0dh3e3inqbgmmjabntt927fe104jlme.apps.googleusercontent.com",
  });

  const currentPathname = useNavigationState(
    (state) => state.routes[state.index].name
  );

  useEffect(() => {
    if (currentPathname === "index") {
      handleEffect();
    }
  }, [response, currentPathname]);

  async function handleEffect() {
    if (response?.type === "success") {
      if (response?.authentication?.accessToken) {
        getUserInfo(response.authentication.accessToken);
      }
    }
  }

  return (
    <View style={styles.container}>
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
