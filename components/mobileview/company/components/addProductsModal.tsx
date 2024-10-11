import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const AddProductModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) => {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  const closeModal = () => setIsOpen(false);

  const handleAddProduct = () => {
    // Handle adding the product logic here
    console.log({
      productName,
      quantity,
      price,
      expirationDate,
    });
    // Close the modal after adding the product
    closeModal();
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Product</Text>

          <TextInput
            style={styles.input}
            placeholder="Product Name"
            value={productName}
            onChangeText={setProductName}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            value={quantity}
            keyboardType="numeric"
            onChangeText={setQuantity}
          />
          <TextInput
            style={styles.input}
            placeholder="Price of Sell"
            value={price}
            keyboardType="decimal-pad"
            onChangeText={setPrice}
          />
          <TextInput
            style={styles.input}
            placeholder="Expiration Date (YYYY-MM-DD)"
            value={expirationDate}
            onChangeText={setExpirationDate}
          />
          <TextInput
            style={styles.input}
            placeholder="Cost of manufacturing   (internal use)"
            value={price}
            keyboardType="decimal-pad"
            onChangeText={setPrice}
          />
          <View style={styles.buttonContainer}>
            <Pressable style={styles.addPressable} onPress={handleAddProduct}>
              <Text style={styles.PressableText}>Add</Text>
            </Pressable>
            <Pressable style={styles.closePressable} onPress={closeModal}>
              <Text style={styles.PressableText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%", // Optional: Adjust width
    maxWidth: 700, // Optional: Max width for larger screens
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  closePressable: {
    backgroundColor: "#2A7EFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
  },
  addPressable: {
    backgroundColor: "#28C76F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  PressableText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddProductModal;
