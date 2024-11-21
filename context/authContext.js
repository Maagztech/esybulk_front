import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import axios from 'axios';
import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import Toast from "react-native-toast-message";
import { useLoading } from "./loadingContext";
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
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
      router.push("/");
    }
    if (userInfo && currentPathname === null) {
      navigation.navigate("(tabs)");
    }
  }, [currentPathname, userInfo, router]);

  useEffect(() => {

    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const refresh_token = await getLocalUser();
        if (refresh_token) {
          const response = await axios.post("https://esybulkback-production.up.railway.app/api/refresh_token", { refresh_token });
          setUserInfo(response.data.user)
          if (response.data.user.role && response.data.user.pinCode) {
            router.push("/home");
          } else {
            router.push("/selectRole");
          }
          setAccessToken(response.data.access_token)
          Toast.show({
            type: 'success',
            text1: 'Sign In',
            text2: 'Sing in successfully'
          });

          AsyncStorage.setItem("refresh_token", response.data.refresh_token);
          setIsLoading(false);
        } else {
          router.push("/");
          setIsLoading(false);
        }
      } catch (error) {
        router.push("/");
        setIsLoading(false);
      }
    };
    fetchUser();

  }, [])

  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("refresh_token");
    if (!data) return null;
    return data;
  };

  const getUserInfo = async (token) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://esybulkback-production.up.railway.app/api/login",
        {},
        {
          headers: { Authorization: `${token}` },
        }
      );
      const user = response.data;
      setAccessToken(user.access_token);
      Toast.show({
        type: 'success',
        text1: 'Sign In',
        text2: 'Sing in successfully'
      });
      if (user.user.role && user.user.pinCode) {
        setUserInfo(user.user);
        setRole(user.user.role);
        router.push("/home");
      } else {
        router.push("/selectRole");
      }
      AsyncStorage.setItem("refresh_token", user.refresh_token);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Errour occured, cut the app come again !'
      });
    }
    setIsLoading(false);
  };


  const selectRole = async (role) => {
    try {
      const response = await axios.post("https://esybulkback-production.up.railway.app/api/selectRole", { role }, {
        headers: { Authorization: `${access_token}` },
      });
    } catch (error) {
      console.error("Error selecting role:", error);
    }
  };


  const activeAccount = async (data) => {
    try {
      const response = await axios.post("https://esybulkback-production.up.railway.app/api/active",
        data,
        { headers: { Authorization: `${access_token}` } })
      setUserInfo(response.data.user);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Account created successfully'
      });
      navigation.navigate("(tabs)");
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Errour occured, Try Again !'
      });
    }
  }

  const handleLogout = async () => {
    try {
      axios.get("https://esybulkback-production.up.railway.app/api/logout",
        { headers: { Authorization: `${access_token}` } })

      await AsyncStorage.removeItem("refresh_token");

      setUserInfo(null);
      setRole(null);
      navigation.navigate("(auth)");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };




  return (
    <AuthContext.Provider value={{ handleLogout, activeAccount, userInfo, setUserInfo, getUserInfo, access_token, role, selectRole }}>
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
