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
  const businessInfo = {
    name: "Tech Solutions Inc.",
    description: "Leading provider of software development and IT consulting.",
    logo: "https://via.placeholder.com/150",
    manager: {
      name: "John Doe",
      position: "Account Manager",
      email: "johndoe@techsolutions.com",
      phone: "+1 555 123 4567",
    },
    address: "123 Business Park, Suite 400, Silicon Valley, CA",
  };

  const handleContactManager = () => {
    // Use Linking to open the phone dialer with the manager's phone number
    const phoneUrl = `tel:${businessInfo.manager.phone}`;
    Linking.openURL(phoneUrl).catch((err) =>
      Alert.alert("Error", "Unable to open dialer.")
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={{ uri: businessInfo.logo }} style={styles.logo} />
      </View>
      <Text style={styles.businessName}>{businessInfo.name}</Text>
      <Text style={styles.description}>{businessInfo.description}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Manager Information</Text>
        <Text style={styles.infoLabel}>Name:</Text>
        <Text style={styles.infoText}>{businessInfo.manager.name}</Text>

        <Text style={styles.infoLabel}>Position:</Text>
        <Text style={styles.infoText}>{businessInfo.manager.position}</Text>

        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoText}>{businessInfo.manager.email}</Text>

        <Text style={styles.infoLabel}>Phone:</Text>
        <Text style={styles.infoText}>{businessInfo.manager.phone}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Details</Text>
        <Text style={styles.infoLabel}>Address:</Text>
        <Text style={styles.infoText}>{businessInfo.address}</Text>

        {/* Removed website as it's not defined in the businessInfo */}
      </View>

      <Pressable style={styles.contactPressable} onPress={handleContactManager}>
        <Text style={styles.contactPressableText}>Contact Manager</Text>
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
