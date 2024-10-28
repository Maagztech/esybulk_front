import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const DistributorSignUp = () => {
  const [accountDetails, setAccountDetails] = useState({
    name: "",
    phoneNumber: "",
    landmark: "",
    zipCode: "",
    block: "",
    city_village: "",
    state: "",
    companyName: "",
  });

  const handleSignUp = () => {
    console.log("Sign Up", { accountDetails });
  };

  const isValidPhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const canSignUp = () => {
    return (
      accountDetails.name &&
      accountDetails.phoneNumber &&
      accountDetails.landmark &&
      accountDetails.zipCode &&
      accountDetails.block &&
      accountDetails.city_village &&
      accountDetails.state &&
      accountDetails.companyName
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Sign Up</Text>
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
        <TextInput
          placeholder="Phone Number"
          value={accountDetails.phoneNumber}
          onChangeText={(text) =>
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
              {
                backgroundColor:
                  canSignUp() && isValidPhoneNumber(accountDetails.phoneNumber)
                    ? "#966440"
                    : "#aaa",
              },
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
  address: {
    width: "100%",
    flexDirection: "row", // Add this line
    justifyContent: "space-between",
    gap: 10,
  },
});

export default DistributorSignUp;
