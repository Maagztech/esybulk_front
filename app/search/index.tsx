import BuySellButton from "@/components/mobileview/global/BuySellButton";
import AddProductModal from "@/components/mobileview/global/ProductAddModal";
import { useAuth } from "@/context/authContext";
import { useDistributor } from "@/context/distributorContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, ScrollView, Text } from "react-native";

const search = () => {
  const { searchproducts }: any = useDistributor();
  const [visible, setVisible] = useState(false);
  const { userInfo }: any = useAuth();
  return (
    <ScrollView>
      {searchproducts?.map((product: any) => (
        <BuySellButton key={product._id} item={product} />
      ))}
      <AddProductModal isOpen={visible} setIsOpen={setVisible} />
      {searchproducts?.length === 0 && (
        <>
          <Text
            style={{
              fontSize: 14,
              textAlign: "center",
              marginVertical: 10,
              fontWeight: "bold",
            }}
          >
            No products found change your search.
          </Text>
          {userInfo?.role === "distributor" && (
            <Pressable
              style={{
                flexDirection: "row",
                gap: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setVisible(true)}
            >
              <Ionicons name="add" size={24} color="#966440" />
              <Text style={{ color: "#966440", fontWeight: "bold" }}>
                Add A product
              </Text>
            </Pressable>
          )}
        </>
      )}
    </ScrollView>
  );
};

export default search;
