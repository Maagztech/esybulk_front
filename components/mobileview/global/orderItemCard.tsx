import React from "react";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export const ItemCard = ({ product }: any) => {
  const handleContactManager = () => {
    const phoneUrl = `tel:${product.contact}`;
    Linking.openURL(phoneUrl).catch((err) =>
      Alert.alert("Error", "Unable to open dialer.")
    );
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
      <Text style={styles.productName}>{product.productName}</Text>
      <View style={styles.buttonAndInfo}>
        <View style={styles.infoContainer}>
          <Text style={styles.productInfo}>
            Quantity to Deliver:{" "}
            <Text style={styles.quantity}>{product.quantityToDeliver}</Text>
          </Text>
          <Text style={styles.productInfo}>
            Price: <Text style={styles.price}>${product.price}</Text>
          </Text>
          <Text style={styles.productInfo}>
            total Collectible:{" "}
            <Text style={styles.price}>
              {product.price * product.quantityToDeliver}
            </Text>
          </Text>
          <Text style={styles.productInfo}>
            Shop: <Text style={styles.shop}>{product.shopName}</Text>
          </Text>
          <Text style={styles.productInfo}>
            Location: <Text style={styles.location}>{product.location}</Text>
          </Text>
        </View>
        <View style={styles.buttons}>
          <View>
            <Pressable
              style={styles.complete_button}
              onPress={() => console.log("Cancel Order")}
            >
              <Text style={styles.addButtonText}>Cancel Order</Text>
            </Pressable>
            <Pressable
              style={styles.complete_button}
              onPress={handleContactManager}
            >
              <Text style={styles.addButtonText}>Contact</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Delivery process (status circles) */}
      <View style={styles.deliveryProcess}>
        <View style={styles.circleFilled} />
        <View style={styles.horizontalBar} />
        <View style={styles.circleVacant} />
        <View style={styles.horizontalBar} />
        <View style={styles.circleVacant} />
      </View>

      {/* Delivery status buttons */}
      <View style={styles.deliveryProcessButtons}>
        <Pressable
          style={styles.complete_button}
          onPress={() => console.log("Ordered")}
        >
          <Text style={styles.addButtonText}>Ordered</Text>
        </Pressable>
        <Pressable
          style={styles.incomplete_button}
          onPress={() => console.log("Out for Delivery")}
        >
          <Text style={styles.addButtonText}>Out for Delivery</Text>
        </Pressable>
        <Pressable
          style={styles.incomplete_button}
          onPress={() => console.log("Delivered")}
        >
          <Text style={styles.addButtonText}>Delivered</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  innerContainer: {
    width: "100%",
    maxWidth: 800,
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  productGridWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  addButton: {
    backgroundColor: "#2A7EFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  productInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: "100%",
    maxWidth: 350,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoContainer: {
    paddingVertical: 5,
  },
  price: {
    fontWeight: "bold",
    color: "#2A7EFF", // Change color to highlight the price
  },
  quantity: {
    color: "#FF5733", // Highlight quantity with a different color
  },
  shop: {
    fontStyle: "italic",
  },
  location: {
    color: "#555", // Slightly darker color for the location
  },
  buttonAndInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    flex: 1,
    width: "100%",
  },
  complete_button: {
    backgroundColor: "#2A7EFF",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginHorizontal: 5,
    marginVertical: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  incomplete_button: {
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginHorizontal: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  buttons: {
    marginTop: 10,
  },
  deliveryProcess: {
    flexDirection: "row", // Align circles and bars in a row
    alignItems: "center", // Vertically center the items
    width: "100%", // Full width of the container
    marginTop: 10,
    marginBottom: 10, // Space between the delivery process and the product
  },
  circleFilled: {
    width: 20, // Circle size
    height: 20,
    borderRadius: 10, // Make it circular
    backgroundColor: "green", // Filled green circle
    padding: 1,
    borderColor: "green",
  },
  circleVacant: {
    width: 20, // Circle size
    height: 20,
    borderRadius: 10, // Make it circular
    backgroundColor: "red", // Vacant red circle
    padding: 5,
    borderColor: "red",
  },
  horizontalBar: {
    flex: 1, // Allows the bar to take up remaining space
    height: 4, // Bar thickness
    backgroundColor: "black", // Bar color
  },
  deliveryProcessButtons: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  button_bar: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 10,
  },
});
