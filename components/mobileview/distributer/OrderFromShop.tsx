import { useAuth } from "@/context/authContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ItemCard } from "../global/orderItemCard";

export const OrderFromShop = () => {
  const { access_token } = useAuth();
  interface Product {
    id: string;
    imageUrl: string;
    productName: string;
    cost: number;
    quantityToDeliver: number;
    shopName: string;
    location: string;
    pinCode: number;
    contact: number;
    status: string;
  }

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadOrderedProducts();
  }, []);

  const loadOrderedProducts = async () => {
    const response = await axios.get(
      "http://localhost:5000/api/distributor_or_company_orders",
      {
        headers: { Authorization: `${access_token}` },
      }
    );
    setProducts(response.data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Pending Orders</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardContainer}>
          {products.map((product, index) => (
            <View style={styles.row} key={product.id}>
              <ItemCard product={product} />
            </View>
          ))}
          {products.length === 0 && (
            <View>
              <Text>You donot have any orders Yet.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  cardContainer: {
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});
