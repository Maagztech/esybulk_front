import ItemCard from "@/components/mobileview/global/ItemCards";
import { useAuth } from "@/context/authContext";
import { useCompany } from "@/context/companyContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AddProductModal from "../global/ProductAddModal";

export const CompanyProducts = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { access_token }: any = useAuth();
  const {
    setDistributorCompanyStocks,
    distributorCompanyStocks,
    setSelectedProduct,
  }: any = useCompany();
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
    setDistributorCompanyStocks(response.data);
  };
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Products</Text>
          <Pressable style={styles.addButton} onPress={() => setIsOpen(true)}>
            <Text style={styles.addButtonText}>Add Product</Text>
          </Pressable>
        </View>
        <ScrollView style={styles.scrollContainer}>
          {distributorCompanyStocks.map((order: any) => (
            <ItemCard product={order} key={order.id} />
          ))}
          {distributorCompanyStocks.length === 0 && (
            <Text>You do not have any products yet.</Text>
          )}
        </ScrollView>
      </View>
      <AddProductModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  innerContainer: {
    width: "100%",
    maxWidth: 800,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    color: "black",
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
  scrollContainer: {
    flex: 1,
    paddingBottom: 20,
  },
});

export default CompanyProducts;
