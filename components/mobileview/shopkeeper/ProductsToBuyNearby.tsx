import { useDistributor } from "@/context/distributorContext";
import React from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import BuySellButton from "../global/BuySellButton";
const ProductsToBuyNearby = () => {
  const { products, loading, fetchProducts, currentPage, totalPages }: any =
    useDistributor();

  const handleLoadMore = () => {
    if (!loading && currentPage < totalPages) {
      fetchProducts(currentPage + 1);
    }
  };
  return (
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
  );
};

const styles = {
  container: { padding: 10, backgroundColor: "#f3f3f3" },
  loadingContainer: { paddingVertical: 10, alignItems: "center" as "center" },
};

export default ProductsToBuyNearby;