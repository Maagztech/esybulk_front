import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import axios from 'axios';
import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
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
    if (userInfo) return;
    const fetchUser = async () => {
      try {
        const refresh_token = await getLocalUser();
        if (!refresh_token) router.push("/")
        if (refresh_token) {
          const response = await axios.post("http://localhost:5000/api/refresh_token", { refresh_token });
          setUserInfo(response.data.user)
          console.log(response.data.access_token)
          setAccessToken(response.data.access_token)
          await AsyncStorage.setItem("refresh_token", response.data.refresh_token);
        } else {
          router.push("/");
        }
      } catch (error) {
        router.push("/");
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
    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        {},
        {
          headers: { Authorization: `${token}` },
        }
      );

      const user = response.data;
      setAccessToken(user.access_token);
      await AsyncStorage.setItem("refresh_token", user.refresh_token);

      if (user.user.role && user.user.pinCode) {
        setUserInfo(user.user);
        setRole(user.user.role);
        router.push("/home");
      } else {
        router.push("/selectRole");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Failed Try again!");
    }
  };


  const selectRole = async (role) => {
    try {
      const response = await axios.post("http://localhost:5000/api/selectRole", { role }, {
        headers: { Authorization: `${access_token}` },
      });
    } catch (error) {
      console.error("Error selecting role:", error);
    }
  };


  const activeAccount = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/api/active",
        data,
        { headers: { Authorization: `${access_token}` } })
      setUserInfo(response.data.user);
      toast.success("Account created successfully");
      navigation.navigate("(tabs)");
    } catch (error) {
      toast.error("Errour occured, Try Again !")
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
