import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import axios from 'axios';
import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import Toast from "react-native-toast-message";
import { useLoading } from "./loadingContext";
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
  const { loadinf, setIsLoading } = useLoading();
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
    if (userInfo && currentPathname === "index") {
      router.push("/home");
    }
  }, [currentPathname, userInfo, router]);

  useEffect(() => {
    setIsLoading(true);
    const fetchUser = async () => {
      try {
        const refresh_token = await getLocalUser();
        if (refresh_token) {
          const response = await axios.post("https://esybulk-back.onrender.com/api/refresh_token", { refresh_token });
          setUserInfo(response.data.user)
          console.log(response.data.access_token)
          if (response.data.user.role && response.data.user.pinCode) {
            router.push("/home");
          } else {
            router.push("/selectRole");
          }
          setAccessToken(response.data.access_token)
          await AsyncStorage.setItem("refresh_token", response.data.refresh_token);
        } else {
          console.log("No user");
          router.push("/");
        }
      } catch (error) {
        router.push("/");
      }
    };
    fetchUser();
    setIsLoading(false);
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
        "https://esybulk-back.onrender.com/api/login",
        {},
        {
          headers: { Authorization: `${token}` },
        }
      );

      const user = response.data;
      setAccessToken(user.access_token);
      await AsyncStorage.setItem("refresh_token", user.refresh_token);

      
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
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed Try again!'
      });
    }
    setIsLoading(false);
  };


  const selectRole = async (role) => {
    try {
      const response = await axios.post("https://esybulk-back.onrender.com/api/selectRole", { role }, {
        headers: { Authorization: `${access_token}` },
      });
    } catch (error) {
      console.error("Error selecting role:", error);
    }
  };


  const activeAccount = async (data) => {
    try {
      const response = await axios.post("https://esybulk-back.onrender.com/api/active",
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
      await AsyncStorage.removeItem("refresh_token");
      setUserInfo(null);
      setRole(null);
      router.push("/");
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
