import { useAuth } from "@/context/authContext";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const BusinessProfile = () => {
  const { userInfo, role }: any = useAuth();
  const handleContactManager = () => {
    // Use Linking to open the phone dialer with the manager's phone number
    const phoneUrl = `tel:8114694441`;
    Linking.openURL(phoneUrl).catch((err) =>
      Alert.alert("Error", "Unable to open dialer.")
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={{
            uri:
              userInfo?.avatar ||
              "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png",
          }}
          style={styles.logo}
        />
      </View>
      <Text style={styles.businessName}>{userInfo?.name}</Text>
      <Text style={styles.description}>{userInfo?.companyName}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Manager Information</Text>
        <Text style={styles.infoLabel}>Name:</Text>
        <Text style={styles.infoText}>{userInfo?.name}</Text>
        {role != "shopkeeper" && (
          <>
            <Text style={styles.infoLabel}>Designation:</Text>
            <Text style={styles.infoText}>{userInfo?.designation}</Text>
          </>
        )}
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoText}>{userInfo?.account}</Text>

        <Text style={styles.infoLabel}>Phone:</Text>
        <Text style={styles.infoText}>{userInfo?.phoneNumber}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Details</Text>
        <Text style={styles.infoLabel}>Address:</Text>
        <Text style={styles.infoText}>
          {userInfo?.landmark}, {userInfo?.village_city}, {userInfo?.block},{" "}
          {userInfo?.district}, {userInfo?.state}
        </Text>
        <Text style={styles.infoLabel}>Pincode:</Text>
        <Text style={styles.infoText}>{userInfo?.pinCode}</Text>
      </View>

      <Pressable
        style={styles.contactPressable}
        onPress={() => {
          if (role === "shopkeeper") {
            router.push("shopKeeperSignUp" as never);
          } else if (role === "company") {
            router.push("companySignUp" as never);
          } else {
            router.push("distributorSignUp" as never);
          }
        }}
      >
        <Text style={styles.contactPressableText}>Edit Profile</Text>
      </Pressable>
      <Pressable
        style={{ ...styles.contactPressable, backgroundColor: "#966440" }}
        onPress={handleContactManager}
      >
        <Text style={styles.contactPressableText}>Costumer Care</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  businessName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: "#888",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  contactPressable: {
    backgroundColor: "#28C76F",
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  contactPressableText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BusinessProfile;
