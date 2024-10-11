import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const ProductDetails = () => {
  const images = [
    { uri: "https://example.com/image1.jpg" },
    { uri: "https://example.com/image2.jpg" },
    { uri: "https://example.com/image3.jpg" },
  ];
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(images[0]);

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageSection}>
        <Image source={selectedImage} style={styles.mainImage} />
        <View style={styles.imageGallery}>
          {images.map((image, index) => (
            <Pressable key={index} onPress={() => setSelectedImage(image)}>
              <Image source={image} style={styles.thumbnail} />
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.detailsSection}>
        <Text style={styles.productTitle}>Amazing Product Title</Text>
        <Text style={styles.productPrice}>$299.99</Text>
        <Text style={styles.productDescription}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
          tristique velit at ipsum facilisis, nec facilisis orci auctor.
          Praesent accumsan ut felis id consequat.
        </Text>

        <View style={styles.quantitySection}>
          <Text style={styles.quantityLabel}>Quantity:</Text>
          <View style={styles.quantityControl}>
            <Pressable onPress={decreaseQuantity}>
              <Text style={styles.quantityButton}>-</Text>
            </Pressable>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <Pressable onPress={increaseQuantity}>
              <Text style={styles.quantityButton}>+</Text>
            </Pressable>
          </View>
        </View>

        <Pressable onPress={() => alert("Added to Cart")}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </Pressable>
        <Pressable onPress={() => alert("Proceed to Checkout")} style={styles.buyNowButton}>
          <Text style={styles.buttonText}>Buy Now</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageSection: {
    alignItems: "center",
    margin: 10,
  },
  mainImage: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  imageGallery: {
    flexDirection: "row",
    marginVertical: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  detailsSection: {
    padding: 15,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 20,
    color: "#B12704",
    marginBottom: 15,
  },
  productDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  quantitySection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    fontSize: 18,
    paddingHorizontal: 10,
  },
  quantityValue: {
    fontSize: 18,
    paddingHorizontal: 10,
  },
buttonText: {
  fontSize: 16,
  color: "#fff",
  textAlign: "center",
  padding: 10,
},
buyNowButton: {
  backgroundColor: "#FF9900",
  marginTop: 10,
},
});

export default ProductDetails;
