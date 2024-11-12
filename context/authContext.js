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
  useEffect(()=>{

  },[])

  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("rf_token");
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
      if (user.user.role && user.user.pincode) {
        router.push("/home");
      } else {
        router.push("/selectRole");
      }
      setUserInfo(user);
    } catch (error) {
      Alert.alert("Failed! Try again.");
    }
  };
  return (
    <AuthContext.Provider value={{ idtoken, userInfo, setUserInfo, getUserInfo }}>
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
