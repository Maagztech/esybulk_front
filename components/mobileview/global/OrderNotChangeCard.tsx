import { useAuth } from "@/context/authContext";
import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import ConfirmModal from "./BuyNowConfirmModal";

export const OrderNotChangeCard = ({ order }: any) => {
  const { access_token } = useAuth();
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [product, setProduct] = useState(order.product);
  const cancelOrder = async () => {
    try {
      const response = await axios.post(
        "https://api.esybulk.store/api/cancelorder",
        {
          orderId: order._id,
        },
        { headers: { Authorization: `${access_token}` } }
      );
      setStatus("cancelled");
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Ordered cancelled successfully.",
      });
      setVisible(false);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Unable to update status.",
      });
    }
  };

  return (
    <View
      style={[
        styles.card,
        status === "delivered" && styles.completedCard,
        status === "cancelled" && styles.cancelledCard,
      ]}
    >
      <Pressable
        onPress={() => {
          router.push(`/product/${product._id}`);
        }}
      >
        <Image
          source={{ uri: product.images[0] }}
          style={styles.productImage}
        />
        <Text style={styles.productName}>{product.title}</Text>
      </Pressable>

      <View style={styles.buttonAndInfo}>
        <View style={styles.infoContainer}>
          <Text style={styles.productInfo}>
            Quantity:{" "}
            <Text style={styles.quantity}>{order.quantity}</Text>
          </Text>
          <Text style={styles.productInfo}>
            Cost:{" "}
            <Text style={styles.quantity}>
              ₹ {order.price * order.quantity}
            </Text>
          </Text>
        </View>
        {status !== "delivered" && status !== "cancelled" && (
          <View style={styles.buttons}>
            {status === "ordered" && (
              <Pressable
                style={styles.complete_button}
                onPress={() => setVisible(true)}
              >
                <Text style={styles.addButtonText}>Cancel Order</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
      <ConfirmModal
        text1="Cancel Order"
        text2="Are you sure you want to cancel this order?"
        onConfirm={() => cancelOrder()}
        onCancel={() => {
          setVisible(false);
        }}
        visible={visible}
      />

      {/* Delivery process (status circles) */}
      <View style={styles.deliveryContainer}>
        <View style={styles.deliveryProcess}>
          <View style={styles.circleFilled} />
          <View style={styles.horizontalBarFull} />
          <View style={status === "shipped" || status === "delivered" ? styles.circleFilled : styles.circleVacant} />
          <View style={styles.horizontalBarFull} />
          <View style={status === "delivered" ? styles.circleFilled : styles.circleVacant} />
        </View>
      </View>
      <View style={styles.deliveryProcessButtons}>
        <Text style={styles.addButtonText}>Ordered</Text>
        <Text style={styles.addButtonText}>Shipped</Text>
        <Text style={styles.addButtonText}>Delivered</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    width: "100%",
  },
  completedCard: {
    borderColor: "#28C76F",
    borderWidth: 1,
  },
  cancelledCard: {
    borderColor: "#FF4D4F",
    borderWidth: 1,
  },
  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  buttonAndInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  infoContainer: {
    flex: 1,
  },
  productInfo: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  quantity: {
    fontWeight: "bold",
    color: "#222",
  },
  buttons: {
    flexDirection: "row",
  },
  complete_button: {
    backgroundColor: "#FF4D4F",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  addButtonText: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
  },
  deliveryContainer: {
    alignItems: "center",
    width: "100%",
  },
  deliveryProcess: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    width: "90%",
  },
  deliveryProcessButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  circleFilled: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#28C76F",
  },
  circleVacant: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#BFBFBF",
    backgroundColor: "#fff",
  },
  horizontalBar: {
    width: 30,
    height: 4,
    backgroundColor: "#BFBFBF",
  },
  horizontalBarFilled: {
    width: 30,
    height: 4,
    backgroundColor: "#28C76F",
  },
  horizontalBarFull: {
    flex: 1,
    height: 4,
    backgroundColor: "lightgray",
    marginHorizontal: 5,
  },
});
