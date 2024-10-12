import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const CompanySignUp = () => {
  const [accountDetails, setAccountDetails] = useState({
    companyName: "",
    companyAddress: "",
    designation: "",
    phoneNumber: "",
  });
  const navigation = useNavigation();
  const canSignUp = () => {
    return (
      accountDetails.designation &&
      accountDetails.companyName &&
      accountDetails.companyAddress &&
      accountDetails.phoneNumber
    );
  };

  const handleSignUp = () => {
    if (!canSignUp()) {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }

    Alert.alert("Success", "Account created successfully");
    navigation.navigate("(tabs)" as never);
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Sign Up</Text>

        {/* Personal Details */}
        <TextInput
          placeholder="Company Name"
          value={accountDetails.companyName}
          onChangeText={(text) =>
            setAccountDetails({ ...accountDetails, companyName: text })
          }
          style={styles.input}
        />
        <TextInput
          placeholder="Designation"
          value={accountDetails.designation}
          onChangeText={(text) =>
            setAccountDetails({ ...accountDetails, designation: text })
          }
          style={styles.input}
        />

        {/* Company Details */}

        <TextInput
          placeholder="Company Address"
          value={accountDetails.companyAddress}
          onChangeText={(text) =>
            setAccountDetails({ ...accountDetails, companyAddress: text })
          }
          style={styles.input}
        />

        {/* Account Details */}
        <TextInput
          placeholder="Phone Number"
          value={accountDetails.phoneNumber}
          onChangeText={(text) =>
            // Remove any non-numeric characters
            setAccountDetails({
              ...accountDetails,
              phoneNumber: text.replace(/[^0-9]/g, ""),
            })
          }
          keyboardType="phone-pad"
          style={styles.input}
        />

        <View style={styles.PressableContainer}>
          <Pressable
            style={[
              styles.signUpButton,
              { backgroundColor: canSignUp() ? "#966440" : "#aaa" },
            ]}
            onPress={handleSignUp}
            disabled={!canSignUp()}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    zIndex: 1,
  },
  innerContainer: {
    width: "100%",
    maxWidth: 500, // Max width for the form
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
  },
  input: {
    width: "100%",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    borderColor: "#966440",
    borderWidth: 1,
    color: "#000",
  },
  otpButton: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: "center",
    width: "100%", // Make OTP button full width
  },
  otpButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  PressableContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    width: "100%",
  },
  signUpButton: {
    padding: 15,
    borderRadius: 8,
    width: "100%",
  },
  signUpButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default CompanySignUp;
