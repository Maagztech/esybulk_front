import { useAuth } from "@/context/authContext";
import { useDistributor } from "@/context/distributorContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import AddQuantityModal from "../distributer/componenets/AddQuantityModal";

const VerticalBuySellButton = ({ item }: { item: any }) => {
  const { userInfo }: any = useAuth();
  const { cart, addToCart, selectForSell, setSelectForSell }: any =
    useDistributor();

  const [visible, setVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const [cartLoading, setCartLoading] = useState(false);
  useEffect(() => {
    if (cartLoading) return;
    setIsFavorite(
      cart.some((cartItem: any) => cartItem.product._id === item._id)
    );
  }, [cart, item._id]);

  const toggleFavorite = async () => {
    setIsFavorite(!isFavorite);
    setCartLoading(true);
    await addToCart(item._id);
    setCartLoading(false);
  };

  return (
    <View style={styles.productCard}>
      <Pressable onPress={() => router.push(`product/${item._id}` as never)}>
        <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      </Pressable>
      <View style={styles.productInfo}>
        <Pressable onPress={() => router.push(`product/${item._id}` as never)}>
          <Text
            style={styles.productName}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>
        </Pressable>
        <Text style={styles.productPrice}>
          ₹{item.lessPrice ? item.lessPrice : item.mrp}
          {"  "}
          {item.lessPrice && (
            <Text style={styles.productDiscount}>
              -{(((item.mrp - item.lessPrice) / item.mrp) * 100).toFixed(0)}%
            </Text>
          )}
        </Text>
        <Text
          style={[
            styles.productPrice,
            { color: "black", textDecorationLine: "line-through" },
          ]}
        >
          MRP: ₹{item.mrp}
        </Text>

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
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    marginRight: 10,
    width: 150,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  productInfo: {
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    lineHeight: 20, // Adjust line height for better readability
  },
  productPrice: {
    fontSize: 16,
    color: "#B12704",
    marginTop: 2,
    fontWeight: "bold",
  },
  productDiscount: {
    fontSize: 12,
    color: "#B12704",
    marginVertical: 4,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "column",
    marginTop: 10,
    width: "100%",
    alignItems: "center",
    gap: 4,
  },
  button: {
    width: "70%",
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#966440",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default VerticalBuySellButton;
