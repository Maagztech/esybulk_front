import LabeledInput from "@/components/mobileview/global/LabeledInput";
import { useAuth } from "@/context/authContext";
import { useLoading } from "@/context/loadingContext";
import { getCurrentLocation } from "@/utils/returnUserLocation";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Checkbox } from "react-native-paper";
import Toast from "react-native-toast-message";
const ShopKeeperSignUp = () => {
  const { setIsLoading }: any = useLoading();
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
    phoneNumber: userInfo?.phoneNumber ? String(userInfo.phoneNumber) : "",
    street: userInfo?.street || "",
    village_city: userInfo?.village_city || "",
    pinCode: userInfo?.pinCode ? String(userInfo?.pinCode) : "",
    district: userInfo?.district || "",
    state: userInfo?.state || "",
    companyName: userInfo?.companyName || "",
    categories: userInfo?.categories || [],
  });

  useEffect(() => {
    const fetchPincodeDetails = async () => {
      if (
        accountDetails &&
        accountDetails?.pinCode &&
        accountDetails?.pinCode?.toString().length === 6
      ) {
        try {
          setIsLoading(true);
          const response = await axios.get(
            `https://api.postalpincode.in/pincode/${accountDetails.pinCode}`
          );
          const postOffice = response.data[0]?.PostOffice[0];
          if (postOffice) {
            setAccountDetails({
              ...accountDetails,
              district: postOffice.District,
              state: postOffice.State,
            });
          }

          setIsLoading(false);
        } catch (error) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Invalid Pincode",
          });
          setIsLoading(false);
        }
      }
    };
    fetchPincodeDetails();
  }, [accountDetails.pinCode]);

  const canSignUp = () => {
    return (
      accountDetails.name &&
      accountDetails.companyName &&
      accountDetails.phoneNumber &&
      accountDetails?.street &&
      accountDetails.village_city &&
      accountDetails.categories.length > 0 &&
      accountDetails.pinCode &&
      accountDetails.district &&
      accountDetails.state
    );
  };
  const handleSignUp = async () => {
    if (!canSignUp()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill out all fields",
      });
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

  const handleUserLocation = async () => {
    try {
      setIsLoading(true);
      const address = await getCurrentLocation();
      if (address) {
        setAccountDetails({
          ...accountDetails,
          street: address[0]?.street,
          village_city: address[0].city,
          pinCode: address[0].postalCode || "",
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
          label="Shop Name"
          value={accountDetails.companyName}
          onChangeText={(text: string) =>
            setAccountDetails({ ...accountDetails, companyName: text })
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

        <Pressable onPress={handleDropdownToggle} style={styles.dropdownBox}>
          <Text style={styles.inputLabel}>Shop Type</Text>
          <Text>
            {accountDetails.categories.length > 0
              ? accountDetails.categories.join(", ")
              : ""}
          </Text>
          <Ionicons
            name={showDropdown ? "chevron-up" : "chevron-down"}
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
                <Text onPress={() => handleTypeChange(type)}>{type}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        <Text style={{ fontWeight: "bold", marginBottom: 15 }}>
          Shop Address{" "}
          <Text style={{ fontSize: 12, color: "#966440" }}>
            (Fill it correctly)
          </Text>
        </Text>
        <Pressable
          style={styles.otpButton}
          onPress={() => {
            handleUserLocation();
          }}
        >
          <Text style={{ fontWeight: "bold", color: "white" }}>
            Automatic Fill Location
          </Text>
        </Pressable>
        <LabeledInput
          label="Street / Sahi / Chowk"
          value={accountDetails?.street}
          onChangeText={(text: string) =>
            setAccountDetails({ ...accountDetails, street: text })
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

        <View style={styles.PressableContainer}>
          <Pressable
            style={[
              styles.signUpButton,
              { backgroundColor: canSignUp() ? "#966440" : "#aaa" },
            ]}
            onPress={handleSignUp}
          >
            {userInfo?.pinCode ? (
              <Text style={styles.signUpButtonText}>Update</Text>
            ) : (
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
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
    borderColor: "#966440",
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 7,
    width: "100%",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
  },
  inputLabel: {
    position: "absolute",
    top: -10,
    left: 15,
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    fontSize: 12,
    color: "#966440",
    zIndex: 1,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 4,
    maxHeight: 500,
    width: "100%",
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  icon: {
    position: "absolute",
    right: 10,
  },
});

export default ShopKeeperSignUp;
