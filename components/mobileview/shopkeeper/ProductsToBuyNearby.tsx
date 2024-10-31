import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const nearbyProducts = [
  {
    id: "1",
    name: "Product 1",
    image: "https://via.placeholder.com/150",
    price: "$10",
    rating: 4.5,
  },
  {
    id: "2",
    name: "Product 2",
    image: "https://via.placeholder.com/150",
    price: "$15",
    rating: 4.0,
  },
  {
    id: "3",
    name: "Product 3",
    image: "https://via.placeholder.com/150",
    price: "$20",
    rating: 4.7,
  },
  {
    id: "4",
    name: "Product 4",
    image: "https://via.placeholder.com/150",
    price: "$10",
    rating: 4.5,
  },
  {
    id: "5",
    name: "Product 5",
    image: "https://via.placeholder.com/150",
    price: "$15",
    rating: 4.0,
  },
  {
    id: "6",
    name: "Product 6",
    image: "https://via.placeholder.com/150",
    price: "$20",
    rating: 4.7,
  },
];

const ProductsToBuyNearby = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products Available Nearby</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={nearbyProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <TouchableOpacity
            // onPress={() =>
            //   navigation.navigate("ProductDetails", { productId: item.id })
            // }
            >
              <Image source={{ uri: item.image }} style={styles.productImage} />
            </TouchableOpacity>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
              <Text style={styles.productRating}>
                ⭐ {item.rating.toFixed(1)}
              </Text>
              <Button
                title="Buy Now"
                color="#FFA41B"
                onPress={() => alert("Proceed to buy!")}
              />
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
  productRating: { fontSize: 14, color: "#FFA41B", marginBottom: 8 },
});

export default ProductsToBuyNearby;
