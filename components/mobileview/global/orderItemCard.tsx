import { useAuth } from "@/context/authContext";
import axios from "axios";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import ConfirmModal from "./ConfirmModal";

export const ItemCard = ({ order }: any) => {
  const { access_token } = useAuth();
  const [status, setStatus] = useState(order.status);
  const [visible, setVisible] = useState(false);
  const handleContactManager = () => {
    const phoneUrl = `tel:${order.contact}`;
    Linking.openURL(phoneUrl).catch(() =>
      Alert.alert("Error", "Unable to open dialer.")
    );
  };

  const updateStatus = (newStatus: string) => {
    const url =
      newStatus === "shipped"
        ? "https://esybulk-back.onrender.com/api/shipped"
        : newStatus === "delivered"
        ? "https://esybulk-back.onrender.com/api/delivered"
        : newStatus === "cancelled"
        ? "https://esybulk-back.onrender.com/api/ordercancel"
        : null;

    if (!url) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Invalid status.",
      });
      return;
    }

    axios
      .post(
        url,
        {
          orderId: order.id,
        },
        { headers: { Authorization: `${access_token}` } }
      )
      .then((response) => {
        if (response.status === 200) {
          setStatus(newStatus);
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Status updated successfully.",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Unable to update status.",
          });
        }
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Unable to update status.",
        });
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
      <Image source={{ uri: order.imageUrl[0] }} style={styles.productImage} />
      <Text style={styles.productName}>{order.productName}</Text>
      <View style={styles.buttonAndInfo}>
        <View style={styles.infoContainer}>
          <Text style={styles.productInfo}>
            Quantity Deliver:{" "}
            <Text style={styles.quantity}>{order.quantityToDeliver}</Text>
          </Text>
          <Text style={styles.productInfo}>
            Price to collect: <Text style={styles.price}>{order.cost} Rs.</Text>
          </Text>
          <Text style={styles.productInfo}>
            Shop: <Text style={styles.shop}>{order.companyName}</Text>
          </Text>
          <Text style={styles.productInfo}>
            Location:{" "}
            <Text style={styles.location}>
              {order.landmark},{order.village_city},{order.block},
              {order.district},{order.state}
            </Text>
          </Text>
          <Text style={styles.productInfo}>
            Pincode: <Text style={styles.location}>{order.pincode}</Text>
          </Text>
          <Text style={styles.productInfo}>
            Contact: <Text style={styles.location}>{order.contact}</Text>
          </Text>
        </View>
        {status !== "completed" && status !== "cancelled" && (
          <View style={styles.buttons}>
            {status === "ordered" && (
              <Pressable
                style={styles.cancelbutton}
                onPress={() => setVisible(true)}
              >
                <Text style={styles.addButtonText}>Cancel Order</Text>
              </Pressable>
            )}
            <ConfirmModal
              text1="Cancel Order"
              text2="Are you sure you want to cancel this order?"
              onConfirm={() => updateStatus("cancelled")}
              onCancel={() => {
                setVisible(false);
              }}
              visible={visible}
            />
            {status != "delivered" && (
              <Pressable
                style={styles.cancelbutton}
                onPress={handleContactManager}
              >
                <Text style={styles.addButtonText}>Contact</Text>
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
            status === "shipped" || status === "delivered"
              ? styles.circleFilled
              : styles.circleVacant
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
      {/* Delivery status buttons */}
      {status !== "completed" && status !== "cancelled" && (
        <View style={styles.deliveryProcessButtons}>
          <Pressable
            style={
              status === "ordered"
                ? styles.complete_button
                : styles.incomplete_button
            }
          >
            <Text style={styles.addButtonText}>Ordered</Text>
          </Pressable>
          <Pressable
            style={
              status === "shipped"
                ? styles.complete_button
                : styles.incomplete_button
            }
            onPress={() => updateStatus("shipped")}
          >
            <Text style={styles.addButtonText}>Shipped</Text>
          </Pressable>
          <Pressable
            style={
              status === "delivered"
                ? styles.complete_button
                : styles.incomplete_button
            }
            onPress={() => updateStatus("delivered")}
          >
            <Text style={styles.addButtonText}>Delivered</Text>
          </Pressable>
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
    paddingHorizontal: 16,
    borderRadius: 5,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  incomplete_button: {
    backgroundColor: "gray",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  cancelbutton: {
    backgroundColor: "#966440",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  infoContainer: {
    flex: 1,
  },
  buttons: {
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
