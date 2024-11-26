import { useAuth } from "@/context/authContext";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import RadioButton from "../shopkeeper/components/RadioButton";
import BuyNowConfirmModal from "./BuyNowConfirmModal";
import BuySellButton from "./BuySellButton";

export default function ProductDetails({ id }: { id: string }) {
  const { userInfo, access_token }: any = useAuth();
  type ProductDetailsType = {
    images: string[];
    title: string;
    mrp: number;
    about: string;
  };

  const [productDetails, setProductDetails] =
    useState<ProductDetailsType | null>(null);

  type BuyOptionType = {
    companyName: string;
    companyUserId: string;
    price: { quantity: number; price: number }[];
  };

  type combinedBuyOptionsType = {
    companyName: string;
    companyUserId: string;
    quantity: number;
    price: number;
  }[];

  const [buyOptions, setBuyOptions] = useState<BuyOptionType[]>([]);
  const [combinedBuyOptions, setCombinedBuyOptions] = useState<
    combinedBuyOptionsType[]
  >([]);
  useEffect(() => {
    if (access_token) fetchProductDetails();
  }, [id, access_token]);

  const fetchProductDetails = async () => {
    try {
      let response;
      if (userInfo?.role === "distributor") {
        response = await axios.get(
          `https://esybulkback-production.up.railway.app/api/distributor/buyoptions?product=${id}`,
          { headers: { Authorization: `${access_token}` } }
        );
      } else {
        response = await axios.get(
          `https://esybulkback-production.up.railway.app/api/distributor/buyoptionsshopkeeper?product=${id}`,
          { headers: { Authorization: `${access_token}` } }
        );
      }
      setProductDetails(response.data.product);
      setBuyOptions(response.data.buyOptions);
    } catch (error) {}
  };
  const [simmilarProducts, setSimmilarProducts]: any = useState([]);
  useEffect(()=>{

  },[simmilarProducts,productDetails])
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const loadSimmilarProducts = async () => {
      if (productDetails) {
        try {
          setLoading(true);
          const response = await axios.get(
            `https://esybulkback-production.up.railway.app/api/search?search=${productDetails?.title}&page=1`,
            {
              headers: { Authorization: `${access_token}` },
            }
          );
          setSimmilarProducts(response.data.products);
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      }
    };
    loadSimmilarProducts();
  }, [productDetails]);
  type SelectedOption = {
    quantity: number;
    price: number;
    order_from: string;
    product: string;
  } | null;

  const [selectedOption, setSelectedOption] = useState<SelectedOption>(null);

  const handleSelectOption = (option: any) => setSelectedOption(option);

  const [confirmModal, setConfirmModal] = useState(false);

  const handleBuyNow = () => {
    try {
      const reponse = axios.post(
        `https://esybulkback-production.up.railway.app/api/shopkeeperorder`,
        selectedOption,
        { headers: { Authorization: `${access_token}` } }
      );
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Order placed successfully",
      });
      setConfirmModal(false);
      router.push("/orders");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to place order.",
      });
    }
  };

  useEffect(() => {
    if (buyOptions) {
      const aggregatedOptions = buyOptions.map((option) =>
        option.price
          .map((priceOption) => ({
            companyUserId: option.companyUserId,
            companyName: option.companyName,
            quantity: priceOption.quantity,
            price: priceOption.price * priceOption.quantity,
          }))
          .sort((a, b) => a.quantity - b.quantity)
      );
      setCombinedBuyOptions(aggregatedOptions);
    }
  }, [buyOptions]);

  if (!productDetails || !buyOptions)
    return <ActivityIndicator size="small" color="#0000ff" />;
  return (
    <View style={styles.container}>
      <FlatList
        data={productDetails?.images}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.productImage} />
        )}
        contentContainerStyle={styles.flatListContainer}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{productDetails?.title}</Text>
        <Text style={styles.productPrice}>MRP: {productDetails?.mrp} ₹</Text>
        <Text style={styles.productDescription}>{productDetails?.about}</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={[styles.address, { maxWidth: "65%" }]}>
              Your Address:
            </Text>
            <Text
              style={[
                styles.address,
                { marginBottom: 10, maxWidth: "65%", color: "#966440" },
              ]}
            >
              {userInfo?.village_city}, {userInfo?.district}, {userInfo?.state}{" "}
              - {userInfo?.pinCode}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              router.push("/profile");
            }}
          >
            <Text
              style={{ color: "#966440", fontSize: 16, fontWeight: "bold" }}
            >
              Change Address
            </Text>
          </Pressable>
        </View>
        <Text style={styles.buyOptions}>Buy Options</Text>
        {combinedBuyOptions.length > 0 ? (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Quantity</Text>
              <Text style={styles.tableHeaderText}>Price</Text>
              <Text style={styles.tableHeaderText}>Profit</Text>
              <Text style={styles.tableHeaderText}>Select</Text>
            </View>
            {combinedBuyOptions.map((options, index) =>
              options.map((option, subIndex) => (
                <View key={`${index}-${subIndex}`} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{option.quantity}</Text>
                  <Text style={styles.tableCell}>₹{option.price}</Text>
                  <Text style={styles.tableCell}>
                    ₹
                    {(productDetails?.mrp ?? 0) * option.quantity -
                      option.price}
                  </Text>
                  <View style={styles.tableCell}>
                    <RadioButton
                      selected={
                        selectedOption?.order_from === option.companyUserId &&
                        selectedOption?.quantity === option.quantity
                      }
                      onPress={() =>
                        handleSelectOption({
                          order_from: option.companyUserId,
                          product: id,
                          quantity: option.quantity,
                        })
                      }
                    />
                  </View>
                </View>
              ))
            )}
          </View>
        ) : (
          <Text style={{ fontSize: 14, textAlign: "center" }}>
            No buy options available in your region.
          </Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={[
            styles.button,
            selectedOption ? styles.buttonEnabled : styles.buttonDisabled,
          ]}
          onPress={() => setConfirmModal(true)}
          disabled={!selectedOption}
        >
          <Text style={styles.buttonText}>Buy Now</Text>
        </Pressable>
      </View>
      <BuyNowConfirmModal
        visible={confirmModal}
        onConfirm={handleBuyNow}
        onCancel={() => setConfirmModal(false)}
        text1="Confirm Purchase"
        text2="Are you sure you want to buy this item?"
      />
      <Toast />
      <FlatList
        data={simmilarProducts}
        keyExtractor={(item: { _id: string }) => item._id}
        renderItem={({ item }) => <BuySellButton item={item} />}
        ListFooterComponent={
          <>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#0000ff" />
              </View>
            ) : null}
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  loadingContainer: { paddingVertical: 10, alignItems: "center" },
  flatListContainer: {
    paddingVertical: 10,
  },
  productImage: {
    width: 300,
    height: 300,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  infoContainer: {
    padding: 15,
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
  },
  productPrice: {
    fontSize: 20,
    color: "#B12704",
    marginVertical: 5,
  },
  address: {
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
  },
  productDescription: {
    fontSize: 16,
    color: "#333",
    marginVertical: 10,
  },
  buyOptions: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
    textAlign:"center"
  },
  distributorSection: {
    marginVertical: 10,
    marginLeft: 20,
  },
  distributorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  buttonContainer: {
    padding: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
  },
  buttonEnabled: {
    backgroundColor: "#966440",
  },
  buttonDisabled: {
    backgroundColor: "gray",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f7f7f7",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    display: "flex",
    justifyContent: "center",
  },
});
