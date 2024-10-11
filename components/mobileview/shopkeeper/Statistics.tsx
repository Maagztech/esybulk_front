import React, { useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { ProductCard } from "../global/productCard"; // Separate Card Component

const products = [
  { id: 1, name: "Product 1", price: 100, discount: 10 },
  { id: 2, name: "Product 2", price: 200, discount: 15 },
  { id: 3, name: "Product 3", price: 300, discount: 20 },
];

const Home: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleShowModal = (product: any) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onShowModal={() => handleShowModal(item)}
          />
        )}
      />

      <Modal
        transparent={true}
        visible={showModal}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedProduct?.name}</Text>
            <Text>Price: ${selectedProduct?.price}</Text>
            <Text>Discount: {selectedProduct?.discount}%</Text>
            <Text>
              Final Price: $
              {selectedProduct
                ? selectedProduct.price * (1 - selectedProduct.discount / 100)
                : 0}
            </Text>

            <Pressable style={styles.Pressable} onPress={handleCloseModal}>
              <Text style={styles.PressableText}>Close</Text>
            </Pressable>
            <Pressable
              style={styles.Pressable}
              onPress={() => alert("Added to cart")}
            >
              <Text style={styles.PressableText}>Add to Cart</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  Pressable: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  PressableText: {
    color: "#fff",
  },
});
