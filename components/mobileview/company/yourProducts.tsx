import ItemCard from "@/components/mobileview/global/ItemCards";
import { useAuth } from "@/context/authContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AddProductModal from "./components/addProductsModal";

export const CompanyProducts = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState<any[]>([]);
  const { access_token } = useAuth();
  useEffect(() => {
    loadcompanyProducts();
  }, []);

  const loadcompanyProducts = async () => {
    const response = await axios.get(
      "http://localhost:5000/api/distributor_company_stocks",
      {
        headers: { Authorization: `${access_token}` },
      }
    );
    setProducts(response.data);
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  return (
    <ScrollView style={styles.container}>
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
        {products.length === 0 && <Text>You donot have any products Yet.</Text>}
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
