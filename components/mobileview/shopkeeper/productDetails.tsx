import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";

const productDetails = {
  id: "1",
  name: "Product 1",
  images: [
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300/FF0000",
    "https://via.placeholder.com/300/00FF00",
  ],
  price: "$10",
  rating: 4.5,
  description:
    "This is a detailed description of the product. It has high quality and many features to meet your needs.",
};

export default function ProductDetails({ route, navigation }: any) {
  const { productId } = route.params;

  return (
    <ScrollView style={styles.container}>
      <FlatList
        data={productDetails.images}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.productImage} />
        )}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{productDetails.name}</Text>
        <Text style={styles.productPrice}>{productDetails.price}</Text>
        <Text style={styles.productRating}>
          ⭐ {productDetails.rating.toFixed(1)}
        </Text>
        <Text style={styles.productDescription}>
          {productDetails.description}
        </Text>
        <Button
          title="Buy Now"
          color="#FFA41B"
          onPress={() => alert("Proceed to checkout!")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f3f3" },
  productImage: {
    width: 300,
    height: 300,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  infoContainer: { padding: 15 },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
  },
  productPrice: { fontSize: 20, color: "#B12704", marginVertical: 5 },
  productRating: { fontSize: 16, color: "#FFA41B", marginVertical: 5 },
  productDescription: { fontSize: 16, color: "#333", marginVertical: 10 },
});
