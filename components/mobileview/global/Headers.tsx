import { useAuth } from "@/context/authContext";
import { useDistributor } from "@/context/distributorContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Tooltip } from "react-native-paper";
import ConfirmModal from "./BuyNowConfirmModal";

const Header = () => {
  const navigation = useNavigation();
  const [canGoBack, setCanGoBack] = useState(false);
  const { userInfo, handleLogout, role }: any = useAuth();
  const {
    handleSearchSubmit,
    searchText,
    setSearchText,
    setSearchCurrentPage,
  }: any = useDistributor();
  const router = useRouter();
  const [searchVisible, setSearchVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const currentPathname = useNavigationState((state) => {
    return state.routes[state.index] ? state.routes[state.index].name : null;
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", () => {
      setCanGoBack(navigation.canGoBack());
    });
    return unsubscribe;
  }, [navigation]);

  const handleSearchPress = () => {
    if (currentPathname != "/search") {
      router.push("/search" as never);
      setSearchVisible(true);
    } else {
      setSearchVisible(true);
    }
  };

  const handleClosePress = () => {
    setSearchVisible(false);
  };

  const handleCartPress = () => {
    router.push("cart" as never);
  };

  return (
    <>
      {!searchVisible ? (
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            {canGoBack &&
              (currentPathname === "search/index" ||
                currentPathname === "cart/index" ||
                currentPathname?.startsWith("product/")) && ( 
                <Pressable onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={24} color="black" />
                </Pressable>
              )}
            <Image
              source={require("../../../assets/images/namelogo-w.png")}
              style={styles.image}
            />
          </View>
          {userInfo && (
            <View style={styles.rightContainer}>
              {userInfo?.role != "company" && (
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
                <Pressable onPress={() => setVisible(true)}>
                  <Ionicons name="log-out" size={28} color="#000" />
                </Pressable>
              </Tooltip>
            </View>
          )}
          <ConfirmModal
            text1="Logout"
            text2="Are you sure want to logout?"
            visible={visible}
            onCancel={() => setVisible(false)}
            onConfirm={() => {
              handleLogout();
              setVisible(false);
            }}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchText}
            onChangeText={(e) => {
              setSearchText(e);
            }}
            onSubmitEditing={() => handleSearchSubmit()}
            autoFocus
          />
          <Tooltip title="Search">
            <Pressable onPress={() => handleSearchSubmit()}>
              <Ionicons name="search" size={28} color="#000" />
            </Pressable>
          </Tooltip>
          <Tooltip title="Close">
            <Pressable onPress={() => handleClosePress()}>
              <Ionicons name="close" size={28} color="#000" />
            </Pressable>
          </Tooltip>
        </View>
      )}
    </>
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
    gap: 10,
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
    gap: 15,
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
  searchInput: {
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    marginVertical: 10,
    width: "75%",
  },
});

export default Header;
