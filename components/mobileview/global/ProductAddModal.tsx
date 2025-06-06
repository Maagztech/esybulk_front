import { useAuth } from "@/context/authContext";
import { useCompany } from "@/context/companyContext";
import { useLoading } from "@/context/loadingContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";
import Toast from "react-native-toast-message";
import LabeledInput from "./LabeledInput";
import LabeledMultilineInput from "./LabeledMultilineInput";

type AddProductModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setLoading?: (loading: boolean) => void; // Optional setLoading prop
};
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const AddProductModal = ({
  isOpen,
  setIsOpen,
  setLoading,
}: AddProductModalProps) => {
  const modalHeight = useRef(new Animated.Value(SCREEN_HEIGHT * 0.8)).current;
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

  const uploadImages = async (eventData: any) => {
    const uploadedImageUrls = await Promise.all(
      eventData.images.map(async (image: string) => {
        if (image.startsWith("http")) return image;
        try {
          const formData = new FormData();
          formData.append("file", {
            uri: image,
            name: `${eventData.title}.jpg`,
            type: "image/jpeg",
          } as any);
          formData.append("upload_preset", "esybulk");
          formData.append("cloud_name", "dv5daoaut");
          const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dv5daoaut/image/upload",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          return response.data.secure_url;
        } catch (error) {
          console.error("Error uploading image:", error);
          return null; // Handle failed uploads gracefully
        }
      })
    );
    return uploadedImageUrls.filter(Boolean); // Filter out null values
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
  const [productData, setProductData] = useState({
    title: "",
    about: "",
    images: [] as string[],
    type: [] as string[],
    quantity: "",
    mrp: "",
    proporties: [{ question: "", answer: "" }],
    buyOptions: [{ quantity: "", price: "" }],
  });

  useEffect(() => {
    if (selectedProduct) {
      setProductData({
        title: selectedProduct.title,
        about: selectedProduct.about,
        images: selectedProduct.images,
        quantity: String(selectedProduct.quantity), // Convert to string
        mrp: String(selectedProduct.mrp), // Convert to string
        type: selectedProduct.type,
        proporties: selectedProduct.proporties
          ? selectedProduct.proporties.map((option: any) => ({
            question: String(option.question), // Convert to string
            answer: String(option.answer), // Convert to string
          }))
          : [{ quantity: "", price: "" }],
        buyOptions: selectedProduct.buyOptions
          ? selectedProduct.buyOptions.map((option: any) => ({
            quantity: String(option.quantity), // Convert to string
            price: String(option.price), // Convert to string
          }))
          : [{ quantity: "", price: "" }],
      });
    } else {
      setProductData({
        title: "",
        about: "",
        images: [],
        type: [],
        quantity: "",
        mrp: "",
        proporties: [{ question: "", answer: "" }],
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
      Number(productData.quantity) > 0
    );
  };

  const handleAddProduct = async () => {
    // Call canSignUp function to properly check if all fields are filled

    if (!canSignUp()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Details are missing or invalid. Please check again.",
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
      if (selectedProduct) {
        Toast.show({
          type: "info",
          text1: "Adding",
          text2: "Adding the product details.",
        });
      }
      const uploadedImageUrls = await uploadImages(productData);
      const productPayload = {
        title: productData.title,
        about: productData.about,
        proporties: productData.proporties
          .filter(
            (option) =>
              typeof option.question === "string" &&
              option.question.trim() !== "" &&
              typeof option.answer === "string" &&
              option.answer.trim() !== ""
          )
          .map((option) => ({
            question: option.question,
            answer: option.answer,
          })),
        images: uploadedImageUrls,
        mrp: productData.mrp,
        type: productData.type,
      };
      if (selectedProduct) {
        Toast.show({
          type: "info",
          text1: "Editing",
          text2: "Updating the product details.",
        });
        await axios.post(
          `https://api.esybulk.store/api/companyregisterproductedit/${selectedProduct.id}`,
          productPayload,
          { headers: { Authorization: `${access_token}` } }
        );
        await axios.post(
          "https://api.esybulk.store/api/distributor_or_company_add_quantity",
          {
            product: selectedProduct.id,
            price: productData.buyOptions
              .filter(
                (option) =>
                  option.quantity != null &&
                  option.price != null &&
                  option.quantity !== "" &&
                  option.price !== ""
              )
              .map((option) => ({
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
        if (setLoading) {
          setLoading(true);
        }
        const productResponse = await axios.post(
          "https://api.esybulk.store/api/company_or_ditsributor_registerproduct",
          productPayload,
          { headers: { Authorization: `${access_token}` } }
        );
        const productId = productResponse.data._id;
        await axios.post(
          "https://api.esybulk.store/api/distributor_or_company_add_quantity",
          {
            product: productId,
            price: productData.buyOptions
              .filter(
                (option) =>
                  option.quantity != null &&
                  option.price != null &&
                  option.quantity !== "" &&
                  option.price !== ""
              )
              .map((option) => ({
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
        if (setLoading) {
          setLoading(false);
        }
      }
      setProductData({
        title: "",
        about: "",
        images: [],
        type: [],
        quantity: "",
        mrp: "",
        proporties: [{ question: "", answer: "" }],
        buyOptions: [{ quantity: "", price: "" }],
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong. Please try again.",
      });
    }
    const response = await axios.get(
      "https://api.esybulk.store/api/distributor_company_stocks",
      {
        headers: { Authorization: `${access_token}` },
      }
    );
    setDistributorCompanyStocks(response.data);
    closeModal();
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

  const addProporties = () => {
    const lastOption =
      productData.proporties[productData.proporties.length - 1];
    if (lastOption && !lastOption.question && !lastOption.answer) {
      Toast.show({
        type: "info",
        text1: "Error",
        text2: "Please fill in the previous option before adding a new one.",
      });
      return;
    }
    setProductData((prevData) => ({
      ...prevData,
      proporties: [...prevData.proporties, { question: "", answer: "" }],
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

  const updateProductProporties = (
    index: number,
    key: "question" | "answer",
    value: string
  ) => {
    const updatedOptions = [...productData.proporties];
    updatedOptions[index][key] = value;
    setProductData((prevData) => ({
      ...prevData,
      proporties: updatedOptions,
    }));
  };

  const handleDeleteProporties = (index: number) => {
    const updatedOptions = productData.proporties.filter((_, i) => i !== index);
    setProductData((prevData) => ({
      ...prevData,
      proporties: updatedOptions,
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
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.background} onPress={closeModal} />
        <Animated.View style={[styles.modalContainer, { height: modalHeight }]}>
          <View style={styles.handleBar} />
          <ScrollView contentContainerStyle={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Product</Text>
              <Pressable style={styles.imageButton} onPress={pickImages}>
                <Text style={styles.buttonText}>
                  {productData.images.length > 0
                    ? `${productData.images.length} Photos Selected`
                    : "Select Photos"}
                </Text>
              </Pressable>
              <FlatList
                horizontal
                data={productData.images}
                renderItem={({ item, index }) => (
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: item }}
                      style={styles.imageThumbnail}
                    />
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
              <Text style={styles.subTitle}>
                Product Proporties{" "}
                <Text style={styles.subsubTitle}>
                  {" "}
                  (Brand,Size,Weight etc.)
                </Text>
              </Text>
              {productData.proporties.map((option, index) => (
                <View key={index} style={styles.buyOptionContainer}>
                  <View style={{ position: "relative", width: "43%" }}>
                    <Text style={styles.inputLabel}>Questions</Text>
                    <TextInput
                      style={styles.buyOptionInput}
                      placeholder="Size"
                      value={option.question}
                      onChangeText={(value) =>
                        updateProductProporties(index, "question", value)
                      }
                    />
                  </View>
                  <View style={{ position: "relative", width: "43%" }}>
                    <Text style={styles.inputLabel}>Answer</Text>
                    <TextInput
                      style={styles.buyOptionInput}
                      placeholder="Medium"
                      value={option.answer}
                      onChangeText={(value) =>
                        updateProductProporties(index, "answer", value)
                      }
                    />
                  </View>
                  <Pressable
                    onPress={() => handleDeleteProporties(index)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash" size={24} color="white" />
                  </Pressable>
                </View>
              ))}

              <Pressable onPress={addProporties} style={{ marginBottom: 20 }}>
                <Ionicons name="add-circle-outline" size={24} color="#3498DB" />
              </Pressable>

              <Pressable
                onPress={handleDropdownToggle}
                style={styles.dropdownBox}
              >
                <Text style={styles.inputLabel}>Product Category</Text>
                <Text>
                  {productData.type.length > 0
                    ? productData.type.join(", ")
                    : ""}
                </Text>
                <Ionicons
                  name={showDropdown ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="black"
                  style={styles.icon}
                />
              </Pressable>

              {showDropdown && (
                <View style={styles.dropdownContainer}>
                  <ScrollView style={styles.dropdown}>
                    {types.map((type) => (
                      <View key={type} style={styles.checkboxContainer}>
                        <Checkbox
                          status={
                            productData.type.includes(type)
                              ? "checked"
                              : "unchecked"
                          }
                          onPress={() => handleTypeChange(type)}
                        />
                        <Text>{type}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
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
                  setProductData((prevData) => ({
                    ...prevData,
                    quantity: value.replace(/[^0-9]/g, ""),
                  }))
                }
              />

              <Text style={styles.subTitle}>Sell Options</Text>
              {productData.buyOptions.map((option, index) => (
                <View key={index} style={styles.buyOptionContainer}>
                  <View style={{ position: "relative", width: "43%" }}>
                    <Text style={styles.inputLabel}>quantity</Text>
                    <TextInput
                      style={styles.buyOptionInput}
                      placeholder="Quantity"
                      value={option.quantity}
                      keyboardType="numeric"
                      onChangeText={(value) =>
                        updateBuyOption(
                          index,
                          "quantity",
                          value.replace(/[^0-9]/g, "")
                        )
                      }
                    />
                  </View>
                  <View style={{ position: "relative", width: "43%" }}>
                    <Text style={styles.inputLabel}>Price / Piece</Text>
                    <TextInput
                      style={styles.buyOptionInput}
                      placeholder="Price"
                      value={option.price}
                      keyboardType="decimal-pad"
                      onChangeText={(value) =>
                        updateBuyOption(
                          index,
                          "price",
                          value
                            .replace(/[^0-9.]/g, "")
                            .replace(/(\..*?)\./g, "$1")
                        )
                      }
                    />
                  </View>
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
        </Animated.View>
        <Toast />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 2.5,
    alignSelf: "center",
    marginVertical: 4,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    overflow: "hidden",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  background: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalOverlay: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
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
    backgroundColor: "#270e45",
    paddingVertical: 16,
    borderRadius: 5,
    marginBottom: 15,
    width: "100%",
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
    fontSize: 15,
    fontWeight: "bold",
    marginVertical: 10,
    marginBottom: 20,
  },
  subsubTitle: {
    fontSize: 10,
  },
  buyOptionContainer: {
    flexDirection: "row",
    marginBottom: 10,
    width: "100%",
  },
  buyOptionInput: {
    borderWidth: 1,
    borderColor: "#966440",
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 5,
    marginRight: 10,
    flex: 1,
  },
  inputLabel: {
    position: "absolute",
    top: -10,
    left: 15,
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    fontSize: 12,
    color: "#966440",
    zIndex: 1,
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
  deleteButton: {
    backgroundColor: "#ff4d4d",
    padding: 8,
    borderRadius: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownBox: {
    borderWidth: 1,
    borderColor: "#966440",
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 7,
    width: "100%",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    marginTop: 10,
  },
  dropdownContainer: {
    maxHeight: 500, // Limits height of the dropdown container
    width: "100%", // Ensures the dropdown takes full width
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    backgroundColor: "#fff",
    overflow: "scroll", // Ensures scroll view respects container bounds
    marginBottom: 14,
  },

  dropdown: {
    width: "100%", // Matches parent width
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    position: "absolute",
    right: 10,
  },
});

export default AddProductModal;
