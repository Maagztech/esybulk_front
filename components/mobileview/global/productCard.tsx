import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type ProductCardProps = {
  product: {
    id: number;
    name: string;
    mrp: number;
    images: string[];
  };
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: product.images[0] }} style={styles.productImage} />
      <View>
        <Text style={styles.title}>{product.name}</Text>
        <Text>MRP: ${product.mrp}</Text>
        <Pressable
          onPress={() => alert("Added to cart!")}
          style={styles.button}
        >
          <Text style={styles.buttontext}>Sell</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    display: "flex",
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttontext: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
