import LabeledInput from "@/components/mobileview/global/labeledInput";
import { useAuth } from "@/context/authContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Checkbox } from "react-native-paper";
import Toast from "react-native-toast-message";

const DistributorSignUp = () => {
  const { activeAccount, userInfo }: any = useAuth();
  const categories = [
    "Grocery",
    "Clothing and Apparel",
    "Electronics and Technology",
    "Home and Furniture",
    "Pharmacy and Health",
    "Beauty and Personal Care",
    "Bookstores and Stationery",
    "Sports",
    "Automotive and Transportation",
  ];
  const [showDropdown, setShowDropdown] = useState(false);
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
    categories: userInfo?.categories || [],
  });

  const [hasVehicleAccess, setHasVehicleAccess] = useState<boolean | null>(
    null
  );

  const handleSignUp = async () => {
    if (!canSignUp()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill out all fields'
      });
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
      accountDetails.categories.length > 0 &&
      accountDetails.landmark &&
      accountDetails.village_city &&
      accountDetails.pinCode &&
      accountDetails.block &&
      accountDetails.district &&
      accountDetails.state &&
      accountDetails.companyName
    );
  };
  const handleTypeChange = (type: string) => {
    setAccountDetails((prevData) => {
      const updatedCategories = prevData.categories.includes(type)
        ? prevData.categories.filter((category: string) => category !== type)
        : [...prevData.categories, type];
      return { ...prevData, categories: updatedCategories };
    });
  };

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Profile</Text>
        <LabeledInput
          label="Your Name"
          value={accountDetails.name}
          onChangeText={(text: string) =>
            setAccountDetails({ ...accountDetails, name: text })
          }
        />
        <LabeledInput
          label="Company Name"
          value={accountDetails.companyName}
          onChangeText={(text: string) =>
            setAccountDetails({ ...accountDetails, companyName: text })
          }
        />
        <LabeledInput
          label="Designation"
          value={accountDetails.designation}
          onChangeText={(text: string) =>
            setAccountDetails({ ...accountDetails, designation: text })
          }
        />
        <LabeledInput
          label="Phone Number"
          value={accountDetails.phoneNumber}
          onChangeText={(text: string) =>
            setAccountDetails({
              ...accountDetails,
              phoneNumber: text.replace(/[^0-9]/g, ""),
            })
          }
          keyboardType="phone-pad"
        />

        <Pressable onPress={handleDropdownToggle} style={[styles.dropdownBox]}>
          <Text>
            {accountDetails.categories.length > 0
              ? accountDetails.categories.join(", ")
              : "Industry Type"}
          </Text>
          <Ionicons
            name={showDropdown ? "arrow-up" : "arrow-down"}
            size={24}
            color="black"
            style={styles.icon}
          />
        </Pressable>

        {showDropdown && (
          <ScrollView style={styles.dropdown}>
            {categories.map((type) => (
              <View key={type} style={styles.checkboxContainer}>
                <Checkbox
                  status={
                    accountDetails.categories.includes(type)
                      ? "checked"
                      : "unchecked"
                  }
                  onPress={() => handleTypeChange(type)}
                />
                <Text>{type}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
          Company Address{" "}
          <Text style={{ fontSize: 12, color: "#966440" }}>
            (Fill it correctly)
          </Text>
        </Text>
        <LabeledInput
          label="Landmark"
          value={accountDetails.landmark}
          onChangeText={(text: string) =>
            setAccountDetails({ ...accountDetails, landmark: text })
          }
        />
        <LabeledInput
          label="Village / City"
          value={accountDetails.village_city}
          onChangeText={(text: string) =>
            setAccountDetails({ ...accountDetails, village_city: text })
          }
        />
        <LabeledInput
          label="Pin Code"
          value={accountDetails.pinCode}
          onChangeText={(text: string) =>
            setAccountDetails({ ...accountDetails, pinCode: text })
          }
          keyboardType="number-pad"
        />
        <LabeledInput
          label="Block"
          value={accountDetails.block}
          onChangeText={(text: string) =>
            setAccountDetails({ ...accountDetails, block: text })
          }
        />

        <LabeledInput
          label="District"
          value={accountDetails.district}
          onChangeText={(text: string) =>
            setAccountDetails({ ...accountDetails, district: text })
          }
        />
        <LabeledInput
          label="State"
          value={accountDetails.state}
          onChangeText={(text: string) =>
            setAccountDetails({ ...accountDetails, state: text })
          }
        />

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
              Toast.show({
                type: 'error',
                text1: 'Vehicle Required',
                text2: 'Please arrange a vehicle first'
              });
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
              { backgroundColor: canSignUp() ? "#966440" : "#aaa" },
            ]}
            onPress={handleSignUp}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
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
    marginTop: 300,
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
    color: "#000",
    fontWeight: "bold",
  },
  dropdownBox: {
    borderWidth: 1,
    borderColor: "#966440",
    padding: 13,
    borderRadius: 7,
    width: "100%",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 4,
    maxHeight: 200,
    width: "100%",
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  icon: {
    marginLeft: 10,
  },
});

export default DistributorSignUp;
