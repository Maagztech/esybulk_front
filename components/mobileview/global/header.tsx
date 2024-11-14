import { useAuth } from "@/context/authContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Tooltip } from "react-native-paper";

const Header = () => {
  const navigation = useNavigation();
  const [canGoBack, setCanGoBack] = useState(false);
  const { userInfo, handleLogout, role }: any = useAuth();
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", () => {
      setCanGoBack(navigation.canGoBack());
    });

    return unsubscribe;
  }, [navigation]);

  const handleSearchPress = () => {
    router.push("/search" as never);
  };

  const handleCartPress = () => {
    router.push("cart" as never);
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
        <View style={styles.textContainer}></View>
      </View>
      {userInfo && (
        <View style={styles.rightContainer}>
          {userInfo.role != "company" && (
            <>
              <Tooltip title="Cart">
                <Pressable onPress={handleCartPress}>
                  <Ionicons name="heart" size={28} color="#000" />
                </Pressable>
              </Tooltip>

              <Tooltip title="Search">
                <Pressable onPress={handleSearchPress}>
                  <Ionicons name="search" size={28} color="#000" />
                </Pressable>
              </Tooltip>
            </>
          )}
          <Tooltip title="Logout">
            <Pressable onPress={handleLogout}>
              <Ionicons name="log-out" size={28} color="#000" />
            </Pressable>
          </Tooltip>
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
  rightContainer: {
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
