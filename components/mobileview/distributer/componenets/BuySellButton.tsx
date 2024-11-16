import { useDistributor } from "@/context/distributorContext";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const BuySellButton = ({ item }: { item: any }) => {
  const { cart } = useDistributor();
  return (
    <View style={styles.productCard}>
      <TouchableOpacity>
        <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      </TouchableOpacity>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.title}</Text>
        <Text style={styles.productPrice}>MRP: {item.mrp}</Text>
        <View style={styles.buttonContainer}>
          <Pressable onPress={() => {}} style={styles.button}>
            {/* {cart.includes(item._id) ? (
              <Ionicons name="heart" size={24} color="red" />
            ) : (
              <Ionicons name="heart" size={24} color="white" />
            )} */}
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => router.push(`product/${item._id}` as never)}
          >
            <Text style={styles.buttonText}>Buy</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => router.push(`product/${item._id}` as never)}
          >
            <Text style={styles.buttonText}>Sell</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  productInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  productPrice: {
    fontSize: 16,
    color: "#B12704",
    marginVertical: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
    width: "100%",
  },
  button: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#966440",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default BuySellButton;
