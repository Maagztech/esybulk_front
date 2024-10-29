import ItemCard from "@/components/mobileview/global/ItemCards";
import { useAuth } from "@/context/authContext";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import AddProductModal from "./components/addProductsModal";

export const PendingFromDistributor = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const { isLoggedIn, dummyFunction } = useAuth();
  const products = [
    {
      id: "1",
      productName: "Sample Product 1",
      price: 100,
      cost: 80,
      totalSold: 100,
      expiryDates: {
        "2027-12-31": 10,
        "2028-01-31": 5,
      },
      imageUrl:
        "https://images.ctfassets.net/hrltx12pl8hq/0GknQrU9I6xwOAFnKiQoa/fb659b4e8c4e9683bc38e37b94e6a28d/shutterstock_649114309-opt2.jpg",
    },
    {
      id: "2",
      productName: "Sample Product 2",
      price: 150,
      cost: 100,
      totalSold: 200,
      expiryDates: {
        "2027-12-31": 15,
        "2028-01-31": 10,
      },
      imageUrl:
        "https://images.ctfassets.net/hrltx12pl8hq/0GknQrU9I6xwOAFnKiQoa/fb659b4e8c4e9683bc38e37b94e6a28d/shutterstock_649114309-opt2.jpg",
    },
    {
      id: "3",
      productName: "Sample Product 3",
      price: 200,
      cost: 120,
      totalSold: 50,
      expiryDates: {
        "2027-12-31": 5,
        "2028-01-31": 2,
      },
      imageUrl:
        "https://images.ctfassets.net/hrltx12pl8hq/0GknQrU9I6xwOAFnKiQoa/fb659b4e8c4e9683bc38e37b94e6a28d/shutterstock_649114309-opt2.jpg",
    },
  ];

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>{isLoggedIn}</Text>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Products</Text>
        <Pressable style={styles.addButton} onPress={() => setIsOpen(true)}>
          <Text style={styles.addButtonText}>Add Product</Text>
        </Pressable>
      </View>
      <ScrollView>
        {products.map((order) => (
          <Pressable key={order.id} onPress={() => handleProductClick(order)}>
            <ItemCard product={order} />
          </Pressable>
        ))}
      </ScrollView>
      <AddProductModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 800,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#2A7EFF",
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
  },
});

export default PendingFromDistributor;
