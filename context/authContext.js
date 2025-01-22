import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import axios from "axios";
import { router } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { useLoading } from "./loadingContext";
import { useNotification } from "./notificationsContext";
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
  const { expoPushToken } = useNotification();
  const { loading, setIsLoading } = useLoading();
  const [userInfo, setUserInfo] = useState(null);
  const navigation = useNavigation();
  const [access_token, setAccessToken] = useState(null);
  const [role, setRole] = useState("");

  const currentPathname = useNavigationState((state) => {
    return state.routes[state.index] ? state.routes[state.index].name : null;
  });

  useEffect(() => {
    if (!userInfo && currentPathname && currentPathname !== "index") {
      router.replace("/");
    }
  }, [currentPathname, userInfo]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const refresh_token = await getLocalUser();
        if (refresh_token) {
          const response = await axios.post(
            "http://3.110.56.148:5000/api/refresh_token",
            { refresh_token }
          );
          setUserInfo(response.data.user);
          if (response.data.user.role && response.data.user.pinCode) {
            router.replace("/home");
          } else {
            router.replace("/selectRole");
          }
          setAccessToken(response.data.access_token);
          Toast.show({
            type: "success",
            text1: "Sign In",
            text2: "Sing in successfully",
          });

          AsyncStorage.setItem("refresh_token", response.data.refresh_token);
          setIsLoading(false);
        } else {
          router.replace("/");
          setIsLoading(false);
        }
      } catch (error) {
        router.replace("/");
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("refresh_token");
    if (!data) return null;
    return data;
  };

  const getUserInfo = async (token) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://3.110.56.148:5000/api/login",
        {
          pushToken: expoPushToken,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );
      const user = response.data;
      setAccessToken(user.access_token);
      Toast.show({
        type: "success",
        text1: "Sign In",
        text2: "Sing in successfully",
      });
      if (user.user.role && user.user.pinCode) {
        setUserInfo(user.user);
        setRole(user.user.role);
        router.replace("/home");
      } else {
        router.replace("/selectRole");
      }
      AsyncStorage.setItem("refresh_token", user.refresh_token);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Errour occured, cut the app come again !",
      });
    }
    setIsLoading(false);
  };

  const selectRole = async (role) => {
    try {
      const response = await axios.post(
        "http://3.110.56.148:5000/api/selectRole",
        { role },
        {
          headers: { Authorization: `${access_token}` },
        }
      );
    } catch (error) {
      console.error("Error selecting role:", error);
    }
  };

  const activeAccount = async (data) => {
    try {
      const response = await axios.post(
        "http://3.110.56.148:5000/api/active",
        data,
        { headers: { Authorization: `${access_token}` } }
      );
      setUserInfo(response.data.user);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Account created successfully",
      });
      navigation.navigate("(tabs)");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Errour occured, Try Again !",
      });
    }
  };

  const handleLogout = async () => {
    try {
      axios.get("http://3.110.56.148:5000/api/logout", {
        headers: { Authorization: `${access_token}` },
      });

      await AsyncStorage.removeItem("refresh_token");

      setUserInfo(null);
      setRole(null);
      navigation.navigate("(auth)");
      await GoogleSignin.signOut();
      await auth().signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        handleLogout,
        activeAccount,
        userInfo,
        setUserInfo,
        getUserInfo,
        access_token,
        role,
        selectRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
