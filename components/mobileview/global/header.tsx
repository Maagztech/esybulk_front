import { useAuth } from "@/context/authContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

const Header = () => {
  const navigation = useNavigation();
  const [canGoBack, setCanGoBack] = useState(false);
  const { userInfo }: any = useAuth();
  const [user, setUser] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = navigation.addListener("state", () => {
      setCanGoBack(navigation.canGoBack());
    });

    return unsubscribe;
  }, [navigation]);

  const handleSearchPress = () => {
    navigation.navigate("search" as never);
  };

  const handleLogout = () => {
    router.push("/");
  };

  const handleCartPress = () => {
    navigation.navigate("cart" as never);
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {canGoBack && (
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
        )}
        <Image
          source={require("../../../assets/images/namelogo-w.png")}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          {/* <Text style={styles.title}>{auth?.type}</Text> */}
        </View>
      </View>
      {user && (
        <View style={styles.rightcontainer}>
          <Pressable onPress={handleCartPress} style={styles.iconContainer}>
            <Ionicons name="cart" size={28} color="#000" />
          </Pressable>
          <Pressable onPress={handleSearchPress} style={styles.iconContainer}>
            <Ionicons name="search" size={28} color="#000" />
          </Pressable>
          <Pressable
            style={styles.iconContainer}
            onPress={async () => {
              await AsyncStorage.removeItem("@user");
              handleLogout();
            }}
          >
            <Ionicons name="log-out" size={28} color="#000" />
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    zIndex: 2,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    borderBottomColor: "#ddd",
  },
  rightcontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
  },
  iconContainer: {
    padding: 5,
    marginHorizontal: 10,
  },
  image: {
    height: 42,
    marginRight: 10,
    width: 140,
  },
  textContainer: {
    marginLeft: -10,
  },
  title: {
    fontSize: 13,
    fontWeight: "bold",
  },
});

export default Header;
