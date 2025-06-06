import { useAuth } from "@/context/authContext";
import { useCompany } from "@/context/companyContext";
import { useDistributor } from "@/context/distributorContext";
import { useLoading } from "@/context/loadingContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import LabeledInput from "../../global/LabeledInput";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const AddQuantityModal = ({ visible, setVisible }: any) => {
  const modalHeight = useRef(new Animated.Value(SCREEN_HEIGHT * 0.7)).current;
  const { access_token }: any = useAuth();
  const { setIsLoading }: any = useLoading();
  const { selectForSell, setSelectForSell }: any = useDistributor();
  const { setDistributorCompanyStocks }: any = useCompany();
  const [productData, setProductData] = useState({
    quantity: "",
    buyOptions: [{ quantity: "", price: "" }],
  });

  useEffect(() => {
    if (visible && selectForSell) {
      fetchSellOptions();
    }
  }, [visible, selectForSell]);

  const fetchSellOptions = async () => {
    const response = await axios.get(
      `https://api.esybulk.store/api/distributor_or_company_get_quantity/${selectForSell?.id}`,
      { headers: { Authorization: `${access_token}` } }
    );
    const options = response.data;
    setProductData({
      quantity: String(options.quantity),
      buyOptions: options.price.map((option: any) => ({
        quantity: String(option.quantity),
        price: String(option.price),
      })),
    });
  };
  const closeModal = () => {
    setVisible(false);
    setSelectForSell(null);
    setProductData({ quantity: "", buyOptions: [{ quantity: "", price: "" }] });
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
      Toast.show({
        type: "info",
        text1: "Adding Product",
        text2: "Please wait while we add your product.",
      });
      return;
    }
    setVisible(false);
    try {
      await axios.post(
        "https://api.esybulk.store/api/distributor_or_company_add_quantity",
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
      Toast.show({
        type: "success",
        text1: "Updated",
        text2: "Sell option updated successfully.",
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
    setIsLoading(false);
  };

  const addBuyOption = () => {
    const lastOption =
      productData.buyOptions[productData.buyOptions.length - 1];
    if (lastOption && !lastOption.quantity && !lastOption.price) {
      Toast.show({
        type: "error",
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

  return (
    <Modal
      visible={visible}
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
              <Text style={styles.modalTitle}>Update Quantity</Text>
              <Text style={styles.subTitle}>{selectForSell?.title}</Text>
              <Text
                style={styles.subAbout}
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                {selectForSell?.about}
              </Text>
              <Text style={{ marginBottom: 20, fontWeight: "bold" }}>
                MRP:{selectForSell?.mrp}
              </Text>
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
    width: "95%",
    maxWidth: 700,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
    marginBottom: 10,
  },
  subAbout: {
    fontSize: 15,
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
  deleteButton: {
    backgroundColor: "#ff4d4d",
    padding: 8,
    borderRadius: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
