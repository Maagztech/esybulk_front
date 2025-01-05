import { useAuth } from "@/context/authContext";
import { useCompany } from "@/context/companyContext";
import { useDistributor } from "@/context/distributorContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AddQuantityModal from "../distributer/componenets/AddQuantityModal";
import AddProductModal from "./ProductAddModal";

const ProductDetails = ({ product }: any) => {
  const [showMore, setShowMore] = useState(false);
  const { userInfo }: any = useAuth();
  const { setSelectedProduct }: any = useCompany();
  const { selectForSell, setSelectForSell }: any = useDistributor();
  const [isOpen, setIsOpen] = useState(false);
  const [showMoreAbout, setShowMoreAbout] = useState(false);
  const toggleShowMore = () => {
    setShowMoreAbout(!showMoreAbout);
  };
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          router.push(`/product/${product.id}`);
        }}
      >
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {product.title}
        </Text>
        <Image source={{ uri: product.images[0] }} style={styles.image} />
      </Pressable>

      {/* <Text
        style={styles.about}
        numberOfLines={showMoreAbout ? undefined : 2}
        ellipsizeMode="tail"
      >
        {product?.about}
      </Text>
      <Pressable onPress={toggleShowMore}>
        <Text style={styles.showMoreAbout}>
          {showMoreAbout ? "Show Less" : "Show More"}
        </Text>
      </Pressable>

      <Text style={styles.buyOptionsTitle}>Product Proporties</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Question</Text>
          <Text style={styles.tableHeaderCell}>Answer</Text>
        </View>
        <FlatList
          data={product.proporties.slice(0, 3)}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.question}</Text>
              <Text style={styles.tableCell}>{item.answer}</Text>
            </View>
          )}
        />
      </View>
      {product.proporties.length > 3 && (
        <TouchableOpacity
          style={styles.showMoreButton}
          onPress={() => router.push(`/product/${product.id}`)}
        >
          <Text style={styles.showMoreText}>Show More</Text>
        </TouchableOpacity>
      )}
      
      {product.type && product.type.length > 0 && (
        <Text style={styles.productTypes}>
          Categories: {product.type.join(", ")}
        </Text>
      )} */}

      <Text style={styles.mrp}>MRP: {product.mrp} ₹</Text>
      <Text style={styles.quantity}>Quantity: {product.quantity}</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Quantity</Text>
          <Text style={styles.tableHeaderCell}>Price (₹)</Text>
        </View>
        <View>
          <FlatList
            data={
              showMore ? product.buyOptions : product.buyOptions.slice(0, 2)
            }
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.quantity}</Text>
                <Text style={styles.tableCell}>{item.price}</Text>
              </View>
            )}
          />
          {product.buyOptions.length > 2 && (
            <View style={styles.showMoreContainer}>
              <TouchableOpacity
                style={styles.showMoreButton}
                onPress={() => setShowMore(!showMore)}
              >
                <Ionicons
                  name={showMore ? "chevron-up" : "chevron-down"}
                  size={12}
                  color="gray"
                />
                <Text style={styles.showMoreText}>
                  {showMore ? "Show Less" : "Show More"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          if (product.admin === userInfo?._id) setSelectedProduct(product);
          else setSelectForSell(product);
          setIsOpen(true);
        }}
      >
        <Ionicons name="create-outline" size={24} color="#FFF" />
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
      {product.admin === userInfo?._id ? (
        <AddProductModal isOpen={isOpen} setIsOpen={setIsOpen} />
      ) : (
        <AddQuantityModal visible={isOpen} setVisible={setIsOpen} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  showMoreContainer: {
    
    alignItems: "center", // Center align the button
  },
  container: {
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 3,
    maxWidth: 400,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
    lineHeight: 20, // Set line height
    height: 40,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  about: {
    fontSize: 16,
    marginBottom: 4,
  },
  productTypes: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "600",
  },
  mrp: {
    fontSize: 15,
    fontWeight: "600",
  },
  quantity: {
    fontSize: 13,
  },
  buyOptionsTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 5,
    textAlign: "center",
  },
  buyOption: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  table: {
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
  },
  showMoreAbout: {
    alignSelf: "flex-end",
    borderRadius: 5,
    flexDirection: "row",
    gap: 5,
  },
  showMoreButton: {
    alignSelf: "center",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  showMoreText: {
    color: "gray",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default ProductDetails;
