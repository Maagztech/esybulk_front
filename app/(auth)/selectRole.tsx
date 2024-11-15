import { useAuth } from "@/context/authContext";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Paths to your images
const companyImage = require("@/assets/images/company.webp");
const distributorImage = require("@/assets/images/distributor.jpg");
const shopkeeperImage = require("@/assets/images/shopkeeper.jpg");

const SelectRoleScreen = () => {
  const { selectRole }: any = useAuth();
  const navigation = useNavigation(); 

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Select Your Role</Text>
        <View style={styles.cardContainer}>
          <Pressable
            style={styles.card}
            onPress={() => {
              try {
                selectRole("company");
                navigation.navigate("companySignUp" as never);
              } catch (error: any) {
              }
            }}
          >
            <ImageBackground
              source={companyImage}
              style={styles.imageBackground}
              imageStyle={{ borderRadius: 10 }}
            >
              <Text style={styles.cardTitle}>Business</Text>
            </ImageBackground>
          </Pressable>

          <Pressable
            style={styles.card}
            onPress={() => {
              try {
                selectRole("distributor");
                navigation.navigate("distributorSignUp" as never);
              } catch (error) {}
            }}
          >
            <ImageBackground
              source={distributorImage}
              style={styles.imageBackground}
              imageStyle={{ borderRadius: 10 }}
            >
              <Text style={styles.cardTitle}>Distributor</Text>
            </ImageBackground>
          </Pressable>

          <Pressable
            style={styles.card}
            onPress={() => {
              try {
                selectRole("shopkeeper");
                navigation.navigate("shopKeeperSignUp" as never);
              } catch (error) {}
            }}
          >
            <ImageBackground
              source={shopkeeperImage}
              style={styles.imageBackground}
              imageStyle={{ borderRadius: 10 }}
            >
              <Text style={styles.cardTitle}>Shopkeeper</Text>
            </ImageBackground>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
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
    color: "#333",
    textAlign: "center",
  },
  cardContainer: {
    width: "100%",
    marginTop: 50,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageBackground: {
    width: "100%",
    height: 120,
    justifyContent: "flex-end", // Pushes text to the bottom
    alignItems: "flex-end", // Aligns text to the right
    padding: 10, // Adds some space from the edge
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Background for text visibility
    padding: 5,
    borderRadius: 5,
  },
});

export default SelectRoleScreen;
