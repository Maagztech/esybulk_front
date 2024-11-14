import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface Product {
  id: string;
  productName: string;
  price: number;
  cost: number;
  totalSold: number;
  expiryDates: { [expiryDate: string]: number };
  imageUrl: string;
}

const ItemCard = (product: any) => {
  const [quantities, setQuantities] = useState<{
    [expiryDate: string]: number;
  }>(product?.expiryDates);
  const router = useRouter();
  const incrementQuantity = (expiryDate: string) => {
    setQuantities((prev) => ({
      ...prev,
      [expiryDate]: prev[expiryDate] + 1,
    }));
  };

  const decrementQuantity = (expiryDate: string) => {
    if (quantities[expiryDate] > 0) {
      setQuantities((prev) => ({
        ...prev,
        [expiryDate]: prev[expiryDate] - 1,
      }));
    }
  };

  const handleQuantityChange = (expiryDate: any, newValue: any) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [expiryDate]: newValue,
    }));
  };

  return (
    <View style={styles.card}>
      <View style={styles.header_more}>
        <View style={styles.header}>
          <Image source={{ uri: product?.imageUrl }} style={styles.image} />
          <Text style={styles.cardTitle}>{product?.title}</Text>
        </View>
      </View>
      <Text style={styles.cardText}>
        Price: <Text style={styles.highlight}>${product?.price}</Text>
      </Text>
      <Text style={styles.cardText}>
        Cost: <Text style={styles.highlight}>${product?.cost}</Text>
      </Text>
      <Text style={styles.cardText}>
        Total Sold: <Text style={styles.highlight}>{product?.totalSold}</Text>
      </Text>
      {Object.keys(product?.expiryDates).map((expiryDate) => {
        return (
          <View key={expiryDate} style={styles.expirySection}>
            <Text style={styles.expiryDate}>
              Expiry Date: <Text style={styles.highlight}>{expiryDate}</Text>
            </Text>
            <View style={styles.quantity_delete}>
              <Text style={styles.quantity}>
                Quantity:{" "}
                <Pressable
                  style={[styles.Pressable, styles.increment]}
                  onPress={() => incrementQuantity(expiryDate)}
                >
                  <Text style={styles.PressableText}>+</Text>
                </Pressable>
                <TextInput
                  value={String(quantities[expiryDate])}
                  onChangeText={(text) =>
                    handleQuantityChange(expiryDate, text)
                  }
                  keyboardType="numeric"
                  style={{
                    width: 50,
                    textAlign: "center",
                    ...styles.highlight,
                  }}
                />
                <Pressable
                  style={[styles.Pressable, styles.decrement]}
                  onPress={() => decrementQuantity(expiryDate)}
                >
                  <Text style={styles.PressableText}>-</Text>
                </Pressable>
              </Text>
              <Image
                source={{
                  uri: "https://imagecolorpicker.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo-55x55_b.eee47b98.png&w=64&q=75",
                }}
                style={{ width: 20, height: 20, marginBottom: -10 }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(9, 33, 29, 0.5)",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 15,
    maxWidth: 500,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
  },
  header_more: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#666666",
  },
  highlight: {
    color: "#007bff",
    fontWeight: "bold",
  },
  expirySection: {
    marginTop: 10,
    paddingTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  expiryDate: {
    fontSize: 16,
    color: "#666666",
  },
  quantity: {
    fontSize: 16,
    color: "#666666",
    marginTop: 13,
  },
  PressableContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  Pressable: {
    borderRadius: 4,
    paddingHorizontal: 10,
    width: "5%",
    alignItems: "center",
  },
  PressableText: {
    color: "#ffffff",
  },
  increment: {
    backgroundColor: "#28a745",
  },
  decrement: {
    backgroundColor: "#dc3545",
  },
  quantity_delete: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default ItemCard;
