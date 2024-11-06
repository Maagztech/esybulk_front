import React, { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import RadioButton from "./radioButton"; // import RadioButton component or use any custom solution

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
  type SelectedOption = {
    DistributorCompany: string;
    quantity: number;
    price: number;
  } | null;

  const [selectedOption, setSelectedOption] = useState<SelectedOption>(null);

  const handleSelectOption = (option: any) => setSelectedOption(option);

  const handleBuyNow = () => {
    if (selectedOption) {
      // Navigate to the product page with selected option
      console.log("Selected Option:", selectedOption);
      // navigation.navigate('/product', { selectedOption }); // example navigation
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
      />
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{productDetails.name}</Text>
        <Text style={styles.productPrice}>MRP: {productDetails.price} Rs.</Text>
        <Text style={styles.productDescription}>{productDetails.about}</Text>
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
    flex: 1,
    position: "static",
    backgroundColor: "#f3f3f3",
  },
  scrollContainer: {
    paddingBottom: 120,
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f3f3f3",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
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
