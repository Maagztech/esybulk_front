import { useAuth } from "@/context/authContext";
import { useCompany } from "@/context/companyContext";
import { useDistributor } from "@/context/distributorContext";
import { useLoading } from "@/context/loadingContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { toast } from "react-toastify";
import LabeledInput from "../../global/labeledInput";

const AddQuantityModal = ({ visible, setVisible }: any) => {
  const { access_token }: any = useAuth();
  const { setIsLoading }: any = useLoading();
  const { selectForSell, setSelectForSell }: any = useDistributor();
  const { setDistributorCompanyStocks }: any = useCompany();
  const [productData, setProductData] = useState({
    quantity: "",
    buyOptions: [{ quantity: "", price: "" }],
  });

  useEffect(() => {
    if (selectForSell) fetchSellOptions();
  }, [selectForSell]);

  const fetchSellOptions = async () => {
    const response = await axios.get(
      `http://localhost:5000/api/distributor_or_company_get_quantity/${selectForSell?.id}`,
      { headers: { Authorization: `${access_token}` } }
    );
    const options = response.data;
    if (options.quantity && options.price.length != 0) {
      setProductData({
        quantity: options.quantity,
        buyOptions: options.price.map((option: any) => ({
          quantity: option.quantity,
          price: option.price,
        })),
      });
    }
  };

  const closeModal = () => {
    setSelectForSell(null);
    setVisible(false);
  };

  const canSignUp = () => {
    return (
      !isNaN(Number(productData.quantity)) && // Ensure Quantity is a valid number
      Number(productData.quantity) > 0 &&
      productData.buyOptions.every((option) => option.quantity && option.price)
    );
  };

  const handleAddProduct = async () => {
    setIsLoading(true);
    if (!canSignUp()) {
      toast.error("Please fill out all fields.");
      return;
    }
    toast.info("Please wait while we add your product.");
    setVisible(false);
    try {
      await axios.post(
        "http://localhost:5000/api/distributor_or_company_add_quantity",
        {
          product: selectForSell?.id,
          price: productData.buyOptions.map((option) => ({
            quantity: option.quantity,
            price: option.price,
          })),
          quantity: productData.quantity,
        },
        { headers: { Authorization: `${access_token}` } }
      );
      toast.success("Sell option updated successfully.");
    } catch (error) {
      console.error("Error adding or updating product:", error);
      toast.error("Something went wrong. Please try again.");
    }
    const response = await axios.get(
      "http://localhost:5000/api/distributor_company_stocks",
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
      toast.warn("Please fill in the previous option before adding a new one.");
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

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={closeModal}
    >
      <ScrollView contentContainerStyle={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Update Quantity</Text>
          <Text style={styles.subTitle}>{selectForSell?.title}</Text>
          <Text style={styles.subAbout} numberOfLines={3} ellipsizeMode="tail">
            {selectForSell?.about}
          </Text>
          <Text style={{ marginBottom: 20 }}>MRP:{selectForSell?.mrp}</Text>
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
          <Pressable
            onPress={addBuyOption}
            style={{ alignItems: "center", marginBottom: 20 }}
          >
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
              {!selectForSell ? (
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
    width: "95%",
    maxWidth: 700,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
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
    marginVertical: 3,
  },
  subAbout: {
    fontSize: 18,
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

export default AddQuantityModal;
