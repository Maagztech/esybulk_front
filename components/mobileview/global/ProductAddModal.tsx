import { useAuth } from "@/context/authContext";
import { useCompany } from "@/context/companyContext";
import { useLoading } from "@/context/loadingContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";
import Toast from "react-native-toast-message";
import LabeledInput from "./labeledInput";
import LabeledMultilineInput from "./LabeledMultilineInput";

const AddProductModal = ({ isOpen, setIsOpen }: any) => {
  const { access_token }: any = useAuth();
  const { setIsLoading }: any = useLoading();
  const {
    products,
    setProducts,
    setDistributorCompanyStocks,
    setSelectedProduct,
    selectedProduct,
  }: any = useCompany();
  const [showDropdown, setShowDropdown] = useState(false);
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
  const [productData, setProductData] = useState({
    title: "",
    about: "",
    images: [] as string[],
    type: [] as string[],
    quantity: "",
    mrp: "",
    buyOptions: [{ quantity: "", price: "" }],
  });

  useEffect(() => {
    if (selectedProduct) {
      setProductData({
        title: selectedProduct.title,
        about: selectedProduct.about,
        images: selectedProduct.images,
        quantity: selectedProduct.quantity,
        mrp: selectedProduct.mrp,
        type: selectedProduct.type,
        buyOptions: selectedProduct.buyOptions || [{ quantity: "", price: "" }],
      });
    } else {
      setProductData({
        title: "",
        about: "",
        images: [],
        type: [],
        quantity: "",
        mrp: "",
        buyOptions: [{ quantity: "", price: "" }],
      });
    }
  }, [selectedProduct]);

  const closeModal = () => {
    setSelectedProduct(null);
    setIsOpen(false);
  };

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
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, ...selectedImages],
      }));
    }
  };

  const canSignUp = () => {
    return (
      productData.title &&
      productData.images.length > 0 &&
      !isNaN(Number(productData.mrp)) && // Ensure MRP is a valid number
      Number(productData.mrp) > 0 &&
      productData.type.length > 0 &&
      !isNaN(Number(productData.quantity)) && // Ensure Quantity is a valid number
      Number(productData.quantity) > 0 &&
      productData.buyOptions.every((option) => option.quantity && option.price)
    );
  };

  const handleAddProduct = async () => {
    // Call canSignUp function to properly check if all fields are filled
    setIsLoading(true);
    if (!canSignUp()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill out all fields.",
      });
      return;
    }
    Toast.show({
      type: "info",
      text1: "Wait",
      text2: "Please wait while we add your product.",
    });
    setIsOpen(false);
    try {
      const uploadedImageUrls = [];
      for (const image of productData.images) {
        if (!image.startsWith("http")) {
          // Only upload new images, skip existing ones
          const formData = new FormData();
          const response = await fetch(image);
          const blob = await response.blob();
          formData.append("file", blob, `${productData.title}.jpg`);
          formData.append("upload_preset", "esybulk");
          formData.append("cloud_name", "dv5daoaut");
          const cloudinaryResponse = await axios.post(
            "https://api.cloudinary.com/v1_1/dv5daoaut/image/upload",
            formData
          );
          uploadedImageUrls.push(cloudinaryResponse.data.secure_url);
        } else {
          uploadedImageUrls.push(image); // Add existing image URLs directly
        }
      }
      const productPayload = {
        title: productData.title,
        about: productData.about,
        images: uploadedImageUrls,
        mrp: productData.mrp,
        type: productData.type,
      };
      if (selectedProduct) {
        console.log(selectedProduct);
        await axios.post(
          `https://esybulk-back.onrender.com/api/companyregisterproductedit/${selectedProduct.id}`,
          productPayload,
          { headers: { Authorization: `${access_token}` } }
        );
        await axios.post(
          "https://esybulk-back.onrender.com/api/distributor_or_company_add_quantity",
          {
            product: selectedProduct.id,
            price: productData.buyOptions.map((option) => ({
              quantity: option.quantity,
              price: option.price,
            })),
            quantity: productData.quantity,
          },
          { headers: { Authorization: `${access_token}` } }
        );
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Product updated successfully.",
        });
      } else {
        // Add new product
        const productResponse = await axios.post(
          "https://esybulk-back.onrender.com/api/companyregisterproduct",
          productPayload,
          { headers: { Authorization: `${access_token}` } }
        );
        const productId = productResponse.data._id;
        await axios.post(
          "https://esybulk-back.onrender.com/api/distributor_or_company_add_quantity",
          {
            product: productId,
            price: productData.buyOptions.map((option) => ({
              quantity: option.quantity,
              price: option.price,
            })),
            quantity: productData.quantity,
          },
          { headers: { Authorization: `${access_token}` } }
        );
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Product added successfully.",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong. Please try again.",
      });
    }
    const response = await axios.get(
      "https://esybulk-back.onrender.com/api/distributor_company_stocks",
      {
        headers: { Authorization: `${access_token}` },
      }
    );
    setDistributorCompanyStocks(response.data);
    closeModal();
    setIsLoading(false);
  };

  const addBuyOption = () => {
    const lastOption =
      productData.buyOptions[productData.buyOptions.length - 1];
    if (lastOption && !lastOption.quantity && !lastOption.price) {
      Toast.show({
        type: "info",
        text1: "Error",
        text2: "Please fill in the previous option before adding a new one.",
      });
      return;
    }
    setProductData((prevData) => ({
      ...prevData,
      buyOptions: [...prevData.buyOptions, { quantity: "", price: "" }],
    }));
  };

  const updateBuyOption = (
    index: number,
    key: "quantity" | "price",
    value: string
  ) => {
    const updatedOptions = [...productData.buyOptions];
    updatedOptions[index][key] = value;
    setProductData((prevData) => ({
      ...prevData,
      buyOptions: updatedOptions,
    }));
  };

  const handleDeleteOption = (index: number) => {
    const updatedOptions = productData.buyOptions.filter((_, i) => i !== index);
    setProductData((prevData) => ({
      ...prevData,
      buyOptions: updatedOptions,
    }));
  };

  const removeImage = (index: number) => {
    setProductData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }));
  };

  const handleTypeChange = (type: string) => {
    setProductData((prevData) => {
      const updatedTypes = prevData.type.includes(type)
        ? prevData.type.filter((t) => t !== type)
        : [...prevData.type, type];
      return { ...prevData, type: updatedTypes };
    });
  };

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={closeModal}
    >
      <Toast />
      <ScrollView contentContainerStyle={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Product</Text>
          <Pressable style={styles.imageButton} onPress={pickImages}>
            <Text style={styles.buttonText}>
              {productData.images.length > 0
                ? `${productData.images.length} Images Selected`
                : "Pick Images"}
            </Text>
          </Pressable>
          <FlatList
            horizontal
            data={productData.images}
            renderItem={({ item, index }) => (
              <View style={styles.imageContainer}>
                <Image source={{ uri: item }} style={styles.imageThumbnail} />
                <Pressable
                  style={styles.deleteImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color="white" />
                </Pressable>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <LabeledInput
            label="Product Name"
            value={productData.title}
            onChangeText={(value: string) =>
              setProductData((prevData) => ({ ...prevData, title: value }))
            }
          />
          <LabeledMultilineInput
            label="About Product (optional)"
            value={productData.about}
            onChangeText={(value: string) =>
              setProductData((prevData) => ({ ...prevData, about: value }))
            }
            multiline={3}
          />
          <Pressable
            onPress={handleDropdownToggle}
            style={[styles.dropdownBox]}
          >
            <Text>
              {productData.type.length > 0
                ? productData.type.join(", ")
                : "Product Category"}
            </Text>
            <Ionicons
              name={showDropdown ? "arrow-up" : "arrow-down"}
              size={24}
              color="black"
              style={styles.icon}
            />
          </Pressable>

          {showDropdown && (
            <ScrollView style={styles.dropdown}>
              {types.map((type) => (
                <View key={type} style={styles.checkboxContainer}>
                  <Checkbox
                    status={
                      productData.type.includes(type) ? "checked" : "unchecked"
                    }
                    onPress={() => handleTypeChange(type)}
                  />
                  <Text>{type}</Text>
                </View>
              ))}
            </ScrollView>
          )}
          <LabeledInput
            label="MRP"
            value={productData.mrp}
            keyboardType="decimal-pad"
            onChangeText={(value: any) =>
              setProductData((prevData) => ({ ...prevData, mrp: value }))
            }
          />
          <LabeledInput
            label="Quantity Available"
            value={productData.quantity}
            keyboardType="numeric"
            onChangeText={(value: any) =>
              setProductData((prevData) => ({ ...prevData, quantity: value }))
            }
          />

          <Text style={styles.subTitle}>Sell Options</Text>
          {productData.buyOptions.map((option, index) => (
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
              {!selectedProduct ? (
                <Text style={styles.buttonText}>Add</Text>
              ) : (
                <Text style={styles.buttonText}>Update</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
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
    borderColor: "#966440",
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
    borderColor: "#966440",
    padding: 15,
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
  imageContainer: {
    position: "relative",
    marginRight: 10,
  },
  deleteImageButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
  },
  dropdownBox: {
    borderWidth: 1,
    borderColor: "#966440",
    padding: 13,
    borderRadius: 7,
    width: "100%",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 4,
    maxHeight: 200,
    width: "100%",
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  icon: {
    marginLeft: 10,
  },
});

export default AddProductModal;
