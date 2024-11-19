import { useDistributor } from "@/context/distributorContext";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import BuySellButton from "../global/BuySellButton";
const ProductsToBuyNearby = () => {
  const {
    products,
    loading,
    fetchProducts,
    currentPage,
    totalPages,
    setQuery,
  }: any = useDistributor();
  const types = [
    "Grocery",
    "Clothing and Apparel",
    "Electronics and Technology",
    "Home and Furniture",
    "Pharmacy and Health",
    "Beauty and Personal Care",
    "Bookstores and Stationery",
    "Sports",
    "Automotive and Transportation",
  ];
  const handleLoadMore = () => {
    if (!loading && currentPage < totalPages) {
      fetchProducts(currentPage + 1);
    }
  };
  return (
    <>
      <View style={styles.scrollViewContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          // contentContainerStyle={styles.flatListContainer}
          style={styles.scrollView} // Apply height constraint here
        >
          {types.map((item) => (
            <Pressable
              onPress={() => setQuery(item)}
              style={{
                margin: 5,
                backgroundColor: "gray",
                paddingHorizontal: 15,
                paddingVertical: 5,
                borderRadius: 50,
              }}
              key={item}
            >
              <Text style={{ color: "white", fontSize: 15 }}>{item}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
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
    </>
  );
};

const styles = {
  container: { padding: 10, backgroundColor: "#f3f3f3" },
  loadingContainer: { paddingVertical: 10, alignItems: "center" as "center" },
  flatListContainer: {
    flexDirection: "row",
    alignItems: "center" as "center",
    justifyContent: "flex-start",
  },
  scrollView: {
    height: 2, // Fixed height to prevent taking extra vertical space
  },
  scrollViewContainer: {
    height: 50,
  },
};

export default ProductsToBuyNearby;
