import BuySellButton from "@/components/mobileview/global/BuySellButton";
import { useDistributor } from "@/context/distributorContext";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";

const search = () => {
  const { searchproducts }: any = useDistributor();
  return (
    <ScrollView>
      {searchproducts?.map((product: any) => (
        <BuySellButton key={product.id} item={product} />
      ))}
    </ScrollView>
  );
};

export default search;
