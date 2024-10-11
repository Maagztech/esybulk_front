import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const ShopKeeperSignUp = () => {
  const [personalDetails, setPersonalDetails] = useState({
    name: "",
    designation: "",
  });

  const [companyDetails, setCompanyDetails] = useState({
    companyName: "",
    companyAddress: "",
  });

  const [accountDetails, setAccountDetails] = useState({
    phoneNumber: "",
    password: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false); // Tracks if OTP is sent
  const [otpVerified, setOtpVerified] = useState(false); // Tracks if OTP is verified

  const handleSendOtp = () => {
    // Simulate OTP send action
    console.log("Sending OTP to:", accountDetails.phoneNumber);
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    // Simulate OTP verification (you would call an API to verify the OTP)
    if (accountDetails.otp === "123456") {
      setOtpVerified(true);
      console.log("OTP Verified");
    } else {
      console.log("Invalid OTP");
    }
  };

  const handleSignUp = () => {
    console.log("Sign Up Data:", {
      ...personalDetails,
      ...companyDetails,
      ...accountDetails,
    });
  };

  const canSendOtp = () => {
    return accountDetails.phoneNumber.length === 10; // Ensure valid 10-digit phone number
  };

  const canSignUp = () => {
    return (
      personalDetails.name &&
      personalDetails.designation &&
      companyDetails.companyName &&
      companyDetails.companyAddress &&
      accountDetails.phoneNumber &&
      accountDetails.password &&
      otpVerified // Sign up enabled only when OTP is verified
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          placeholder="Name"
          value={personalDetails.name}
          onChangeText={(text) =>
            setPersonalDetails({ ...personalDetails, name: text })
          }
          style={styles.input}
        />
        <TextInput
          placeholder="Designation"
          value={personalDetails.designation}
          onChangeText={(text) =>
            setPersonalDetails({ ...personalDetails, designation: text })
          }
          style={styles.input}
        />

        <TextInput
          placeholder="Company Name"
          value={companyDetails.companyName}
          onChangeText={(text) =>
            setCompanyDetails({ ...companyDetails, companyName: text })
          }
          style={styles.input}
        />
        <TextInput
          placeholder="Company Address"
          value={companyDetails.companyAddress}
          onChangeText={(text) =>
            setCompanyDetails({ ...companyDetails, companyAddress: text })
          }
          style={styles.input}
        />

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

        {/* Send OTP Button */}
        {canSendOtp() && !otpSent && (
          <Pressable style={styles.otpButton} onPress={handleSendOtp}>
            <Text style={styles.otpButtonText}>Send OTP</Text>
          </Pressable>
        )}

        {/* OTP Input and Verify Button */}
        {otpSent && (
          <View style={styles.otpContainer}>
            <TextInput
              placeholder="Enter OTP"
              value={accountDetails.otp}
              onChangeText={(text) =>
                setAccountDetails({ ...accountDetails, otp: text })
              }
              style={styles.input}
              keyboardType="numeric"
            />
          </View>
        )}

        <TextInput
          placeholder="Password"
          secureTextEntry
          value={accountDetails.password}
          onChangeText={(text) =>
            setAccountDetails({ ...accountDetails, password: text })
          }
          style={styles.input}
        />

        {/* Sign Up Button */}
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
    backgroundColor: "#966440",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  otpButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  verifyButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#28a745",
    marginLeft: 10,
  },
  verifyButtonText: {
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

export default ShopKeeperSignUp;
