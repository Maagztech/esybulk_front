import { useAuth } from "@/context/authContext";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import RadioButton from "./radioButton";

const productDetails = {
  id: "1",
  name: "Product 1",
  images: [
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300/FF0000",
    "https://via.placeholder.com/300/00FF00",
  ],
  price: 10,
  about:
    "This is a detailed description of the product. It has high quality and many features to meet your needs.",
};

const buyOptions = [
  {
    DistributorCompany: "ABC Limited",
    prices: [
      { quantity: 3, price: 15 },
      { quantity: 10, price: 40 },
      { quantity: 15, price: 50 },
    ],
  },
  {
    DistributorCompany: "CDF Limited",
    prices: [
      { quantity: 3, price: 15 },
      { quantity: 10, price: 40 },
      { quantity: 15, price: 50 },
    ],
  },
];

export default function ProductDetails({ id }: { id: string }) {
  const { userInfo }: any = useAuth();
  type SelectedOption = {
    DistributorCompany: string;
    quantity: number;
    price: number;
  } | null;

  const [selectedOption, setSelectedOption] = useState<SelectedOption>(null);

  const handleSelectOption = (option: any) => setSelectedOption(option);

  const handleBuyNow = () => {
    if (selectedOption) {
      console.log("Selected Option:", selectedOption);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={productDetails.images}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.productImage} />
        )}
        contentContainerStyle={styles.flatListContainer}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{productDetails.name}</Text>
        <Text style={styles.productPrice}>MRP: {productDetails.price} Rs.</Text>
        <Text style={styles.productDescription}>{productDetails.about}</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={[styles.address, { marginBottom: 10 }]}>
            Delivery Address: {userInfo?.landmark}, {userInfo?.village_city},{" "}
            {userInfo?.block}, {userInfo?.district}, {userInfo?.state} -{" "}
            {userInfo?.pinCode}
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
            <Text style={styles.distributorName}>
              {option.DistributorCompany}
            </Text>
            {option.prices.map((priceOption, priceIndex) => (
              <View key={priceIndex} style={styles.optionContainer}>
                <RadioButton
                  selected={
                    selectedOption?.DistributorCompany ===
                      option.DistributorCompany &&
                    selectedOption?.quantity === priceOption.quantity
                  }
                  onPress={() =>
                    handleSelectOption({
                      DistributorCompany: option.DistributorCompany,
                      quantity: priceOption.quantity,
                      price: priceOption.price,
                    })
                  }
                />
                <Text style={styles.optionText}>
                  Quantity: {priceOption.quantity}, Price: Rs.{" "}
                  {priceOption.price} ,profit: Rs.
                  {productDetails.price * priceOption.quantity -
                    priceOption.price}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={[
            styles.button,
            selectedOption ? styles.buttonEnabled : styles.buttonDisabled,
          ]}
          onPress={handleBuyNow}
          disabled={!selectedOption}
        >
          <Text style={styles.buttonText}>Buy Now</Text>
        </Pressable>
      </View>
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
