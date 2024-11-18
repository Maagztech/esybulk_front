import BuySellButton from "@/components/mobileview/global/BuySellButton";
import { useDistributor } from "@/context/distributorContext";
import React from "react";
import { ScrollView, Text } from "react-native";

const search = () => {
  const { searchproducts }: any = useDistributor();
  return (
    <ScrollView>
      {searchproducts?.map((product: any) => (
        <BuySellButton key={product._id} item={product} />
      ))}
      {searchproducts?.length === 0 && (
        <Text style={{ fontSize: 14, textAlign: "center" }}>
          No products found change your search
        </Text>
      )}
    </ScrollView>
  );
};

export default search;
