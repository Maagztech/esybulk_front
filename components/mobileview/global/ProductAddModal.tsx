import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { toast } from "react-toastify";

const AddProductModal = ({ isOpen, setIsOpen }: any) => {
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [quantity, setQuantity] = useState("");
  const [mrp, setMrp] = useState("");
  const [cost, setCost] = useState("");
  const [buyOptions, setBuyOptions] = useState([{ quantity: "", price: "" }]);

  const closeModal = () => setIsOpen(false);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });
    if (!result.canceled && result.assets) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImages((prevImages) => [...prevImages, ...selectedImages]);
    }
  };

  const handleAddProduct = async () => {
    try {
      const uploadedImageUrls = [];
      for (const image of images) {
        const formData = new FormData();
        const response = await fetch(image);
        const blob = await response.blob();
        formData.append("file", blob, "product-image.jpg");
        formData.append("upload_preset", "esybulk");
        formData.append("cloud_name", "dv5daoaut");
        const cloudinaryResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dv5daoaut/image/upload",
          formData
        );
        uploadedImageUrls.push(cloudinaryResponse.data.secure_url);
      }
      console.log(uploadedImageUrls);
      const productResponse = await axios.post(
        "http://localhost:5000/api/companyregisterproduct",
        {
          name,
          about,
          images: uploadedImageUrls,
        }
      );

      const productId = productResponse.data.productId;

      await axios.post(
        "http://localhost:5000/api/distributor_or_company_add_quantity",
        {
          productId,
          quantity: buyOptions.map((option) => ({
            quantity: option.quantity,
            price: option.price,
          })),
        }
      );

      console.log("Product added successfully!");
      closeModal();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const addBuyOption = () => {
    const lastOption = buyOptions[buyOptions.length - 1];
    if (lastOption && !lastOption.quantity && !lastOption.price) {
      toast.warn("Please fill in the previous option before adding a new one.");
      return;
    }
    setBuyOptions([...buyOptions, { quantity: "", price: "" }]);
  };

  const updateBuyOption = (
    index: number,
    key: "quantity" | "price",
    value: string
  ) => {
    const updatedOptions = [...buyOptions];
    updatedOptions[index][key] = value;
    setBuyOptions(updatedOptions);
  };

  const handleDeleteOption = (index: number) => {
    const updatedOptions = buyOptions.filter((_, i) => i !== index);
    setBuyOptions(updatedOptions);
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
          <Pressable style={styles.imageButton} onPress={pickImages}>
            <Text style={styles.buttonText}>
              {images.length > 0
                ? `${images.length} Images Selected`
                : "Pick Images"}
            </Text>
          </Pressable>
          <FlatList
            horizontal
            data={images}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.imageThumbnail} />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <TextInput
            style={styles.input}
            placeholder="Product Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="About Product"
            value={about}
            onChangeText={setAbout}
            multiline
            numberOfLines={3}
          />

          <TextInput
            style={styles.input}
            placeholder="MRP"
            value={mrp}
            keyboardType="decimal-pad"
            onChangeText={setMrp}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantity Available"
            value={quantity}
            keyboardType="numeric"
            onChangeText={setQuantity}
          />

          <Text style={styles.subTitle}>Sell Options</Text>
          {buyOptions.map((option, index) => (
            <View key={index} style={styles.buyOptionContainer}>
              <TextInput
                style={styles.buyOptionInput}
                placeholder="Quantity"
                value={option.quantity}
                keyboardType="numeric"
                onChangeText={(value) =>
                  updateBuyOption(index, "quantity", value)
                }
              />
              <TextInput
                style={styles.buyOptionInput}
                placeholder="Price"
                value={option.price}
                keyboardType="decimal-pad"
                onChangeText={(value) => updateBuyOption(index, "price", value)}
              />
              <Pressable
                onPress={() => handleDeleteOption(index)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash" size={24} color="white" />
              </Pressable>
            </View>
          ))}
          <Pressable onPress={addBuyOption} style={{ marginBottom: 20 }}>
            <Ionicons name="add-circle-outline" size={24} color="#3498DB" />
          </Pressable>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.fullButton, styles.cancelButton]}
              onPress={closeModal}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.fullButton, styles.addButton]}
              onPress={handleAddProduct}
            >
              <Text style={styles.buttonText}>Add</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "95%",
    maxWidth: 700,
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
  imageButton: {
    backgroundColor: "#8E44AD",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
  },
  fullButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#2980B9",
  },
  addButton: {
    backgroundColor: "#966440",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  imageThumbnail: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  buyOptionContainer: {
    flexDirection: "row",
    marginBottom: 10,
    width: "100%",
  },
  buyOptionInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    flex: 1,
    width: "50%",
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    padding: 8,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AddProductModal;
