import { useAuth } from "@/context/authContext";
import { useDistributor } from "@/context/distributorContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import BuySellButton from "../global/BuySellButton";
import AddProductModal from "../global/ProductAddModal";

export const ProductsToBuyNearbydistributor = () => {
  const { access_token } = useAuth();
  const [visible, setVisible] = useState(false);
  const { products, loading, fetchProducts, currentPage, totalPages }: any =
    useDistributor();
  const handleLoadMore = () => {
    if (!loading && currentPage < totalPages) {
      fetchProducts(currentPage + 1);
    }
  };

  return (
    <>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <BuySellButton item={item} />}
        contentContainerStyle={styles.container}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#0000ff" />
            </View>
          ) : null
        }
      />
      <AddProductModal isOpen={visible} setIsOpen={setVisible} />
      {currentPage === totalPages && (
        <Pressable
          style={{
            flexDirection: "row",
            gap: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setVisible(true)}
        >
          <Ionicons name="add" size={24} color="#966440" />
          <Text style={{ color: "#966440", fontWeight: "bold" }}>
            Add A product
          </Text>
        </Pressable>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: "#f3f3f3" },
  loadingContainer: { paddingVertical: 10, alignItems: "center" },
});
