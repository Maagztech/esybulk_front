import { useAuth } from "@/context/authContext";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { toast } from "react-toastify";

const DistributorSignUp = () => {
  const { activeAccount, userInfo }: any = useAuth();
  const [accountDetails, setAccountDetails] = useState({
    name: userInfo?.name || "",
    phoneNumber: userInfo?.phoneNumber || "",
    landmark: userInfo?.landmark || "",
    village_city: userInfo?.village_city || "",
    pinCode: userInfo?.pinCode || "",
    block: userInfo?.block || "",
    district: userInfo?.district || "",
    state: userInfo?.state || "",
    companyName: userInfo?.companyName || "",
    designation: userInfo?.designation || "",
  });

  const [hasVehicleAccess, setHasVehicleAccess] = useState<boolean | null>(
    null
  );

  const handleSignUp = async () => {
    if (!canSignUp()) {
      toast.error("Please fill out all fields");
      return;
    }
    await activeAccount(accountDetails);
  };
  const isValidPhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const canSignUp = () => {
    return (
      hasVehicleAccess === true &&
      accountDetails.name &&
      accountDetails.phoneNumber &&
      accountDetails.landmark &&
      accountDetails.village_city &&
      accountDetails.pinCode &&
      accountDetails.block &&
      accountDetails.district &&
      accountDetails.state &&
      accountDetails.companyName
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Profile</Text>
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
        <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
          Company Address{" "}
          <Text style={{ fontSize: 12, color: "#966440" }}>
            (Fill it correctly)
          </Text>
        </Text>
        <View style={styles.address}>
          <TextInput
            placeholder="Landmark"
            value={accountDetails.landmark}
            onChangeText={(text) =>
              setAccountDetails({ ...accountDetails, landmark: text })
            }
            style={styles.input}
          />
          <TextInput
            placeholder="Village / city"
            value={accountDetails.village_city}
            onChangeText={(text) =>
              setAccountDetails({ ...accountDetails, village_city: text })
            }
            style={styles.input}
          />
        </View>
        <View style={styles.address}>
          <TextInput
            placeholder="Pin Code"
            value={accountDetails.pinCode}
            onChangeText={(text) =>
              setAccountDetails({ ...accountDetails, pinCode: text })
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
            placeholder="District"
            value={accountDetails.district}
            onChangeText={(text) =>
              setAccountDetails({ ...accountDetails, district: text })
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

        {/* Vehicle Access Section */}
        <Text style={styles.vehicleAccessText}>
          Do you have a vehicle for transporting goods?
        </Text>
        <View style={styles.vehicleAccessContainer}>
          <Pressable
            style={[
              styles.vehicleButton,
              hasVehicleAccess === true && styles.selectedButton,
            ]}
            onPress={() => setHasVehicleAccess(true)}
          >
            <Text style={styles.vehicleButtonText}>Yes</Text>
          </Pressable>
          <Pressable
            style={[
              styles.vehicleButton,
              hasVehicleAccess === false && styles.selectedButton,
            ]}
            onPress={() => {
              toast.error("Please arrange a vehicle first");
              setHasVehicleAccess(false);
            }}
          >
            <Text style={styles.vehicleButtonText}>No</Text>
          </Pressable>
        </View>

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
  vehicleAccessText: {
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  vehicleAccessContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 15,
  },
  vehicleButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#966440",
    width: "45%",
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#966440",
  },
  vehicleButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default DistributorSignUp;
