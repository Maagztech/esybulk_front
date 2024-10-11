import React from "react";
import { StyleSheet, View } from "react-native";

const OrderFromShop = () => {
  const products = [
    {
      id: "1",
      productName: "Sample Product 1",
      price: 100,
      cost: 80,
      totalSold: 100,
      quantityToDeliver: 50,
      shopName: "Shop A",
      location: "Downtown",
      expiryDates: {
        "2027-12-31": 10,
        "2028-01-31": 5,
      },
      imageUrl:
        "https://images.ctfassets.net/hrltx12pl8hq/0GknQrU9I6xwOAFnKiQoa/fb659b4e8c4e9683bc38e37b94e6a28d/shutterstock_649114309-opt2.jpg",
    },
    {
      id: "2",
      productName: "Sample Product 2",
      price: 150,
      cost: 120,
      totalSold: 200,
      quantityToDeliver: 20,
      shopName: "Shop B",
      location: "Uptown",
      expiryDates: {
        "2027-12-31": 20,
        "2028-01-31": 15,
      },
      imageUrl:
        "https://images.ctfassets.net/hrltx12pl8hq/4he89YjaitaQt2RCedkDbE/4cd695554d7459171e8cef7b108ee994/texttures-6.gif",
    },
    {
      id: "3",
      productName: "Sample Product 3",
      price: 200,
      cost: 160,
      totalSold: 150,
      quantityToDeliver: 30,
      shopName: "Shop C",
      location: "Midtown",
      expiryDates: {
        "2027-12-31": 30,
        "2028-01-31": 10,
      },
      imageUrl:
        "https://images.ctfassets.net/hrltx12pl8hq/0GknQrU9I6xwOAFnKiQoa/fb659b4e8c4e9683bc38e37b94e6a28d/shutterstock_649114309-opt2.jpg",
    },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <h1>Order From Shop</h1>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    maxWidth: 800,
  },
});
export default OrderFromShop;
