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

  const [buyOptions, setBuyOptions] = useState<BuyOptionType[]>([]);

  useEffect(() => {
    if (access_token) fetchProductDetails();
  }, [id, access_token]);

  const fetchProductDetails = async () => {
    try {
      let response;
      if (userInfo?.role === "distributor") {
        response = await axios.get(
          `https://esybulk-back.onrender.com/api/distributor/buyoptions?product=${id}`,
          { headers: { Authorization: `${access_token}` } }
        );
      } else {
        response = await axios.get(
          `https://esybulk-back.onrender.com/api/distributor/buyoptionsshopkeeper?product=${id}`,
          { headers: { Authorization: `${access_token}` } }
        );
      }
      setProductDetails(response.data.product);
      setBuyOptions(response.data.buyOptions);
    } catch (error) {}
  };

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
        `https://esybulk-back.onrender.com/api/distributor/addorder`,
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

  if (!productDetails && !buyOptions)
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
        <Text style={styles.productPrice}>MRP: {productDetails?.mrp} Rs.</Text>
        <Text style={styles.productDescription}>{productDetails?.about}</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={[styles.address, { marginBottom: 10, maxWidth: "65%" }]}>
            Delivery Address:{userInfo?.village_city}, {userInfo?.district},{" "}
            {userInfo?.state} - {userInfo?.pinCode}
          </Text>
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
        {buyOptions.map((option, index) => (
          <View key={index} style={styles.distributorSection}>
            <Text style={styles.distributorName}>{option.companyName}</Text>
            {option.price.map((priceOption, priceIndex) => (
              <View key={priceIndex} style={styles.optionContainer}>
                <RadioButton
                  selected={
                    selectedOption?.order_from === option.companyUserId &&
                    selectedOption?.quantity === priceOption.quantity
                  }
                  onPress={() =>
                    handleSelectOption({
                      order_from: option.companyUserId,
                      product: id,
                      quantity: priceOption.quantity,
                      price: priceOption.price,
                    })
                  }
                />
                <Text style={styles.optionText}>
                  Quantity: {priceOption.quantity}, Price: Rs.{" "}
                  {priceOption.price} ,profit: Rs.
                  {(productDetails?.mrp ?? 0) * priceOption.quantity -
                    priceOption.price}
                </Text>
              </View>
            ))}
          </View>
        ))}
        {buyOptions.length === 0 && (
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    backgroundColor: "#f3f3f3",
  },
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
    marginVertical: 5,
    fontWeight: "bold",
  },
  productDescription: {
    fontSize: 16,
    color: "#333",
    marginVertical: 10,
  },
  buyOptions: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
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
});
