import { useAuth } from "@/context/authContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { toast } from "react-toastify";

const ShopKeeperSignUp = () => {
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
    designation: userInfo?.designation || "owner",
    categories: userInfo?.categories || [],
  });

  const canSignUp = () => {
    return (
      accountDetails.name &&
      accountDetails.companyName &&
      accountDetails.phoneNumber &&
      accountDetails.landmark &&
      accountDetails.village_city &&
      accountDetails.categories.length > 0 &&
      accountDetails.pinCode &&
      accountDetails.block &&
      accountDetails.district &&
      accountDetails.state
    );
  };
  const handleSignUp = async () => {
    if (!canSignUp()) {
      toast.error("Please fill out all fields");
      return;
    }
    await activeAccount(accountDetails);
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
    <ScrollView style={styles.container}>
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
          placeholder="Shop Name"
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
            // Remove any non-numeric characters
            setAccountDetails({
              ...accountDetails,
              phoneNumber: text.replace(/[^0-9]/g, ""),
            })
          }
          keyboardType="phone-pad"
          style={styles.input}
        />
        <TouchableOpacity
          onPress={handleDropdownToggle}
          style={[styles.dropdownBox, styles.input]}
        >
          <Text>
            {accountDetails.categories.length > 0
              ? accountDetails.categories.join(", ")
              : "Shop types"}
          </Text>
          <Ionicons
            name={showDropdown ? "arrow-up" : "arrow-down"}
            size={24}
            color="black"
            style={styles.icon}
          />
        </TouchableOpacity>

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
          Shop Address{" "}
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
    marginTop: 120,
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
  dropdownBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 4,
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

export default ShopKeeperSignUp;
