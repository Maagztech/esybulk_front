import { useAuth } from "@/context/authContext";
import { useDistributor } from "@/context/distributorContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import AddQuantityModal from "../distributer/componenets/AddQuantityModal";

const BuySellButton = ({ item }: { item: any }) => {
  const { userInfo }: any = useAuth();
  const { cart, addToCart, selectForSell, setSelectForSell }: any = useDistributor();

  const [visible, setVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // Check if item is already in the cart
  useEffect(() => {
    setIsFavorite(cart.some((cartItem: any) => cartItem.product._id === item._id));
  }, [cart, item._id]);

  const toggleFavorite = () => {
    if (isFavorite) {
      // Remove item from cart if already added
      addToCart(item._id, "remove");
    } else {
      // Add item to cart
      addToCart(item._id, "add");
    }
    setIsFavorite(!isFavorite); // Toggle the heart icon
  };

  return (
    <View style={styles.productCard}>
      <Pressable onPress={() => router.push(`product/${item._id}` as never)}>
        <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      </Pressable>
      <View style={styles.productInfo}>
        <Pressable onPress={() => router.push(`product/${item._id}` as never)}>
          <Text style={styles.productName}>{item.title}</Text>
        </Pressable>
        <Text style={styles.productPrice}>MRP: {item.mrp}</Text>
        <View style={styles.buttonContainer}>
          <Pressable onPress={toggleFavorite}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color="#966440"
            />
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => router.push(`product/${item._id}` as never)}
          >
            <Text style={styles.buttonText}>Buy</Text>
          </Pressable>
          {userInfo?.role === "distributor" && (
            <Pressable
              style={styles.button}
              onPress={() => {
                setSelectForSell(item);
                setVisible(true);
              }}
            >
              <Text style={styles.buttonText}>Sell</Text>
            </Pressable>
          )}
        </View>
      </View>
      <AddQuantityModal visible={visible} setVisible={setVisible} />
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
    gap: 10,
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
