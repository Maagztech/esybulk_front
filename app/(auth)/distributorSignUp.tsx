import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const DistributorSignUp = () => {
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
    otp: "",
    password: "",
  });

  const [otpSent, setOtpSent] = useState(false);

  const handleSignUp = () => {
    console.log("Sign Up", { personalDetails, companyDetails, accountDetails });
  };
  // Function to validate if a phone number is valid (basic validation)
  const isValidPhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const sendOtp = () => {
    if (!isValidPhoneNumber(accountDetails.phoneNumber)) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }
    Alert.alert(
      "OTP Sent",
      `OTP has been sent to ${accountDetails.phoneNumber}`
    );
    setOtpSent(true);
  };

  const canSignUp = () => {
    return (
      personalDetails.name &&
      personalDetails.designation &&
      companyDetails.companyName &&
      companyDetails.companyAddress &&
      accountDetails.phoneNumber &&
      accountDetails.password &&
      accountDetails.otp
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
        <Pressable
          style={[
            styles.otpButton,
            {
              backgroundColor: isValidPhoneNumber(accountDetails.phoneNumber)
                ? "#966440"
                : "#aaa",
            },
          ]}
          onPress={sendOtp}
          disabled={!isValidPhoneNumber(accountDetails.phoneNumber)}
        >
          <Text style={styles.otpButtonText}>
            {otpSent ? "OTP Sent" : "Send OTP"}
          </Text>
        </Pressable>

        {otpSent && (
          <TextInput
            placeholder="Enter OTP"
            value={accountDetails.otp}
            onChangeText={(text) =>
              setAccountDetails({ ...accountDetails, otp: text })
            }
            keyboardType="number-pad"
            style={styles.input}
          />
        )}
        {otpSent && accountDetails.otp.length > 0 && (
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={accountDetails.password}
            onChangeText={(text) =>
              setAccountDetails({ ...accountDetails, password: text })
            }
            style={styles.input}
          />
        )}

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
  PressableContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    width: "100%",
  },

  signUpButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    width: "100%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  otpButton: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: "center",
    width: "100%",
  },
  otpButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  orText: {
    marginTop: 20,
    textAlign: "center",
    color: "#333",
  },
  socialPressables: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  pressableText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  signUpButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default DistributorSignUp;
