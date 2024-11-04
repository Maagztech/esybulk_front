import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { router } from "expo-router";
import React, { createContext, useContext, useState } from 'react';
const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const navigation = useNavigation();
  const getUserInfo = async (token) => {
    if (!token) return;
    await AsyncStorage.setItem("@user", token);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/login", {},
        {
          headers: { Authorization: `${token}` },
        },
      );
      const user = response.data;
      if (user.role && user.zipcode) router.push("/home")
      else router.push("/selectRole");
      setUserInfo(user);
    } catch (error) {
      router.push("/selectRole")
    }
  };
  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo, getUserInfo }}>
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
