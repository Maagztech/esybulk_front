import { useCompany } from "@/context/companyContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AddProductModal from "./ProductAddModal";

const ProductDetails = ({ product }: any) => {
  const { setSelectedProduct }: any = useCompany();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.title}</Text>
      <Image source={{ uri: product.images[0] }} style={styles.image} />
      <Text style={styles.about}>{product.about}</Text>

      {/* Display product types above MRP */}
      {product.type && product.type.length > 0 && (
        <Text style={styles.productTypes}>
          Categories: {product.type.join(", ")}
        </Text>
      )}

      <Text style={styles.mrp}>MRP: {product.mrp} Rs.</Text>
      <Text style={styles.quantity}>
        Available Quantity: {product.quantity}
      </Text>

      <Text style={styles.buyOptionsTitle}>Buy Options:</Text>
      <FlatList
        data={product.buyOptions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.buyOption}>
            <Text>Quantity: {item.quantity}</Text>
            <Text>Price: {item.price} Rs.</Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          setSelectedProduct(product);
          setIsOpen(true);
        }}
      >
        <Ionicons name="create-outline" size={24} color="#FFF" />
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
      <AddProductModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    margin: 10,
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  about: {
    fontSize: 16,
    marginBottom: 10,
  },
  productTypes: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "600",
  },
  mrp: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  quantity: {
    fontSize: 16,
    marginBottom: 10,
  },
  buyOptionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
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
    marginTop: 15,
  },
  editButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default ProductDetails;
