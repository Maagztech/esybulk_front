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
    name: "",
    companyName: "",
    landmark: "",
    zipCode: "",
    block: "",
    city_village: "",
    state: "",
    designation: "",
    phoneNumber: "",
  });
  const navigation = useNavigation();
  const canSignUp = () => {
    return (
      accountDetails.name &&
      accountDetails.designation &&
      accountDetails.companyName &&
      accountDetails.landmark &&
      accountDetails.zipCode &&
      accountDetails.block &&
      accountDetails.city_village &&
      accountDetails.state &&
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
          placeholder="Your Name"
          value={accountDetails.name}
          onChangeText={(text) =>
            setAccountDetails({ ...accountDetails, name: text })
          }
          style={styles.input}
        />
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
        <TextInput
          placeholder="Landmark"
          value={accountDetails.landmark}
          onChangeText={(text) =>
            setAccountDetails({ ...accountDetails, landmark: text })
          }
          style={styles.input}
        />
        <View style={styles.address}>
          <TextInput
            placeholder="Zip Code"
            value={accountDetails.zipCode}
            onChangeText={(text) =>
              setAccountDetails({ ...accountDetails, zipCode: text })
            }
            style={styles.input50}
          />
          <TextInput
            placeholder="Block"
            value={accountDetails.block}
            onChangeText={(text) =>
              setAccountDetails({ ...accountDetails, block: text })
            }
            style={styles.input50}
          />
        </View>
        <View style={styles.address}>
          <TextInput
            placeholder="City / Village"
            value={accountDetails.city_village}
            onChangeText={(text) =>
              setAccountDetails({ ...accountDetails, city_village: text })
            }
            style={styles.input50}
          />
          <TextInput
            placeholder="State"
            value={accountDetails.state}
            onChangeText={(text) =>
              setAccountDetails({ ...accountDetails, state: text })
            }
            style={styles.input50}
          />
        </View>
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
  input50: {
    width: "50%",
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
  address: {
    width: "100%",
    flexDirection: "row", // Add this line
    justifyContent: "space-between",
    gap: 10,
  },
});

export default CompanySignUp;
