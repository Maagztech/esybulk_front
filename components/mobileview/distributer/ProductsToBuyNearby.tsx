import { useDistributor } from "@/context/distributorContext";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

export const ProductsToBuyNearbydistributor = () => {
  const { products }: any = useDistributor();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* {products.map((item: any) => (
        <BuySellButton key={item._id} item={item} />
      ))} */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f3f3f3" },
});
