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

export const CompanyProducts = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { access_token }: any = useAuth();
  const { setDistributorCompanyStocks, distributorCompanyStocks }: any =
    useCompany();

  useEffect(() => {
    loadcompanyProducts();
  }, []);

  const loadcompanyProducts = async () => {
    const response = await axios.get(
      "https://api.esybulk.store/api/distributor_company_stocks",
      {
        headers: { Authorization: `${access_token}` },
      }
    );
    setDistributorCompanyStocks(response.data);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadcompanyProducts();
    setRefreshing(false);
  };
  const [loading, setLoading] = useState(false);
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
          style={styles.scrollContainer}
          data={distributorCompanyStocks}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <ItemCard product={item} />
            </View>
          )}
          numColumns={2}
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
  container: {
    flex: 1,
    alignItems: "center",
    padding: 5,
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
    marginBottom: 5,
    marginHorizontal: 10,
    paddingBottom: 3
  },
  headerTitle: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 25,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  loadingContainer: { paddingVertical: 10, alignItems: "center" },
});

export default CompanyProducts;
