import { useAuth } from "@/context/authContext";
import { useDistributor } from "@/context/distributorContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import BuySellButton from "../global/BuySellButton";
import AddProductModal from "../global/ProductAddModal";
import VerticalBuySellButton from "../global/verticalBuySellButton";

export const ProductsToBuyNearbydistributor = () => {
  const { access_token } = useAuth();
  const [visible, setVisible] = useState(false);
  const {
    products,
    loading,
    fetchProducts,
    currentPage,
    totalPages,
    setQuery,
    query,
    previousProducts,
  }: any = useDistributor();
  const handleLoadMore = () => {
    const fetchProduct = async () => {
      if (!loading && currentPage < totalPages) {
        await fetchProducts(currentPage + 1);
      }
    };
    fetchProduct();
  };
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
  return (
    <>
      <View style={styles.scrollViewContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContainer}
          style={styles.scrollView}
        >
          <Pressable
            onPress={() => setQuery("")}
            style={{
              margin: 5,
              backgroundColor: query === "" ? "black" : "black",
              paddingHorizontal: 15,
              paddingVertical: 5,
              borderRadius: 50,
            }}
          >
            <Text style={styles.text}>All</Text>
          </Pressable>
          {types.map((item) => (
            <Pressable
              onPress={() => setQuery(item)}
              style={{
                margin: 5,
                backgroundColor: query === item ? "black" : "black",
                paddingHorizontal: 15,
                paddingVertical: 5,
                borderRadius: 50,
              }}
              key={item}
            >
              <Text style={styles.text}>{item}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView>
        {previousProducts && previousProducts.length > 0 && (
          <View
            style={[
              styles.container,
              {
                backgroundColor: "white",
                marginHorizontal: 10,
                borderRadius: 10,
              },
            ]}
          >
            <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 5 }}>
              Keep Shopping For
            </Text>
            <FlatList
              data={previousProducts}
              horizontal={true}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <VerticalBuySellButton item={item} />}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
            />
          </View>
        )}

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
      </ScrollView>
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
  flatListContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  scrollView: {
    height: 2, // Fixed height to prevent taking extra vertical space
  },
  scrollViewContainer: {
    height: 50,
  },
  text: {
    color: "white",
    fontSize: 15,
  },
});
