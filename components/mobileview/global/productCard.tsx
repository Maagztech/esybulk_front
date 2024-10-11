import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

type ProductCardProps = {
  product: {
    id: number;
    name: string;
    price: number;
    discount: number;
  };
  onShowModal: () => void;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onShowModal,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{product.name}</Text>
      <Text>Price: ${product.price}</Text>
      <Text>Discount: {product.discount}%</Text>
      <Button title="Show More Details" onPress={onShowModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
