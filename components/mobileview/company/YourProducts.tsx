import ItemCard from "@/components/mobileview/global/ItemCards";
import { useAuth } from "@/context/authContext";
import { useCompany } from "@/context/companyContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AddProductModal from "../global/ProductAddModal";

const CompanyProducts = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { access_token }: any = useAuth();
  const { setDistributorCompanyStocks, distributorCompanyStocks }: any =
    useCompany();

  useEffect(() => {
    const fetchProducts = async () => {
      await loadcompanyProducts();
    };
    fetchProducts();
  }, [access_token]);

  const loadcompanyProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://3.110.56.148:5000/api/distributor_company_stocks",
        {
          headers: { Authorization: `${access_token}` },
        }
      );
      setDistributorCompanyStocks(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error loading products:", error);
    }
  };
  const [loading, setLoading] = useState(false);
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadcompanyProducts();
    setRefreshing(false);
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
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        )}
        <FlatList
          data={distributorCompanyStocks}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <ItemCard product={item} />
            </View>
          )}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginVertical: 20 }}>
              You do not have any products yet.
            </Text>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      </View>
      <AddProductModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setLoading={setLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    margin: 3,
  },
  columnWrapper: {
    justifyContent: "space-between", // Ensure spacing between columns
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 6,
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
    marginTop: 8,
    marginHorizontal: 10,
  },
  headerTitle: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#270e45",
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
  loadingContainer: { paddingVertical: 10, alignItems: "center" },
});

export default CompanyProducts;
