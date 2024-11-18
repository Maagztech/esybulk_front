import axios from "axios";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { toast } from "react-toastify";

export const OrderNotChangeCard = ({ order }: any) => {
  console.log("order", order);
  const [status, setStatus] = useState(order.status);

  const cancelOrder = () => {
    const url = "http://localhost:5000/api/ordercancel";
    axios
      .post(url, {
        orderId: order.id,
      })
      .then((response) => {
        if (response.status === 200) {
          setStatus("cancelled");
          toast.success("Status updated successfully.");
        } else {
          toast.error("Unable to update status.");
        }
      })
      .catch(() => {
        toast.error("Unable to update status.");
      });
  };

  return (
    <View
      style={[
        styles.card,
        status === "completed" && styles.completedCard,
        status === "cancelled" && styles.cancelledCard,
      ]}
    >
      <Image source={{ uri: order.imageUrl }} style={styles.productImage} />
      <Text style={styles.productName}>{order.productName}</Text>
      <View style={styles.buttonAndInfo}>
        <View style={styles.infoContainer}>
          <Text style={styles.productInfo}>
            Quantity Deliver:{" "}
            <Text style={styles.quantity}>{order.quantityToDeliver}</Text>
          </Text>
          <Text style={styles.productInfo}>
            Price: <Text style={styles.price}>${order.price}</Text>
          </Text>
          <Text style={styles.productInfo}>
            Shop: <Text style={styles.shop}>{order.companyName}</Text>
          </Text>
          <Text style={styles.productInfo}>
            Location: <Text style={styles.location}>{order.location}</Text>
          </Text>
        </View>
        {status !== "completed" && status !== "cancelled" && (
          <View style={styles.buttons}>
            {status === "ordered" && (
              <Pressable
                style={styles.complete_button}
                onPress={() => cancelOrder()}
              >
                <Text style={styles.addButtonText}>Cancel Order</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>

      {/* Delivery process (status circles) */}
      <View style={styles.deliveryProcess}>
        <View style={styles.circleFilled} />
        <View
          style={
            status === "shipped" || status === "delivered"
              ? styles.horizontalBarFilled
              : styles.horizontalBar
          }
        />
        <View
          style={
            status === "shipped" ? styles.circleFilled : styles.circleVacant
          }
        />
        <View
          style={
            status === "delivered"
              ? styles.horizontalBarFilled
              : styles.horizontalBar
          }
        />
        <View
          style={
            status === "delivered" ? styles.circleFilled : styles.circleVacant
          }
        />
      </View>

      {status !== "completed" && status !== "cancelled" && (
        <View style={styles.deliveryProcessButtons}>
          <Text style={styles.addButtonText}>Ordered</Text>
          <Text style={styles.addButtonText}>Shipped</Text>
          <Text style={styles.addButtonText}>Delivered</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  completedCard: {
    borderColor: "green",
    borderWidth: 2,
  },
  cancelledCard: {
    borderColor: "red",
    borderWidth: 2,
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
  quantity: {
    color: "#FF5733",
  },
  price: {
    fontWeight: "bold",
    color: "#2A7EFF",
  },
  shop: {
    fontStyle: "italic",
  },
  location: {
    color: "#555",
  },
  buttonAndInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  complete_button: {
    backgroundColor: "#2A7EFF",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginHorizontal: 5,
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  incomplete_button: {
    backgroundColor: "gray",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  infoContainer: {
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  deliveryProcess: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
  },
  circleFilled: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "green",
  },
  circleVacant: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "red",
  },
  horizontalBar: {
    flex: 1,
    height: 4,
    backgroundColor: "gray",
  },
  horizontalBarFilled: {
    flex: 1,
    height: 4,
    backgroundColor: "green",
  },
  deliveryProcessButtons: {
    width: "100%",
    flexDirection: "row",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
