import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const nearbyProducts = [
  {
    id: 1,
    name: "Product 1",
    image: "https://via.placeholder.com/150",
    mrp: 10,
    price: 5,
    rating: 4.5,
  },
  {
    id: 2,
    name: "Product 2",
    image: "https://via.placeholder.com/150",
    price: 10,
    mrp: 15,
    rating: 4.0,
  },
  {
    id: 3,
    name: "Product 3",
    image: "https://via.placeholder.com/150",
    price: 10,
    mrp: 20,
    rating: 4.7,
  },
];

export const ProductsToBuyNearbydistributor = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={nearbyProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <TouchableOpacity>
              <Image source={{ uri: item.image }} style={styles.productImage} />
            </TouchableOpacity>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
              <Pressable
                onPress={() => alert("Added to cart!")}
                style={styles.button}
              >
                <Text>Add to cart</Text>
              </Pressable>
              <Pressable
                style={styles.button}
                onPress={() => router.push(`product/${item.id}` as never)}
              >
                <Text>Buy Now</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f3f3f3" },
  title: { fontSize: 24, marginBottom: 15, fontWeight: "bold", color: "#333" },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  productImage: { width: 100, height: 100, borderRadius: 5 },
  productInfo: { flex: 1, marginLeft: 10, justifyContent: "space-between" },
  productName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  productPrice: { fontSize: 16, color: "#B12704", marginVertical: 4 },
  button: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#966440",
    color: "white",
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
  },
});
