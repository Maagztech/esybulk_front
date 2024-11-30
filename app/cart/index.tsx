import BuySellButton from "@/components/mobileview/global/BuySellButton";
import { useDistributor } from "@/context/distributorContext";
import React from "react";
import { FlatList, StyleSheet, Text } from "react-native";

const Cart = () => {
  const { cart }: any = useDistributor();

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={cart}
      keyExtractor={(item: any) => item.product._id.toString()}
      renderItem={({ item }) => (
        <BuySellButton item={item.product}/>
      )}
      ListEmptyComponent={
        <Text
          style={{
            marginVertical: 10,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Your wishlist cart is empty.
        </Text>
      }
    />
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
