import BuySellButton from "@/components/mobileview/global/BuySellButton";
import { useDistributor } from "@/context/distributorContext";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

const Cart = () => {
  const { cart }: any = useDistributor();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {cart.map((item: any) => (
        <BuySellButton item={item.product} key={item.product._id} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f3f3f3",
  },
});

export default Cart;
