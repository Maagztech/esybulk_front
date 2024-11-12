import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from "react-native";
import 'react-toastify/dist/ReactToastify.css';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const navigation = useNavigation();
  const [access_token, setAccessToken] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const refresh_token = await getLocalUser();
      if (!refresh_token) router.push("/")
      if (refresh_token) {
        const response = await axios.post("http://localhost:5000/api/refresh_token", { refresh_token });
        console.log(response.data)
        setAccessToken(response.data.access_token)
        await AsyncStorage.setItem("refresh_token", response.data.refresh_token);
      } else {
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


  const getUserInfo = async (token, setUserInfo) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        {},
        {
          headers: { Authorization: `${token}` },
        }
      );
      const user = response.data;
      setAccessToken(user.access_token)
      await AsyncStorage.setItem("refresh_token", user.refresh_token);
      if (user.user.role && user.user.pincode) {
        setRole(user.user.role);
        router.push("/home");
      } else {
        router.push("/selectRole");
      }
      setUserInfo(user);
    } catch (error) {
      Alert.alert("Failed! Try again.");
    }
  };

  const selectRole = async (role) => {
    try {
      const response = await axios.post("http://localhost:5000/api/selectRole", { role }, {
        headers: { Authorization: `${access_token}` },
      });
      console.log(response.data); // Use response.data instead of response.body
    } catch (error) {
      console.error("Error selecting role:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo, getUserInfo, access_token, role, selectRole }}>
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
