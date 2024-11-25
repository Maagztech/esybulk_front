import BuySellButton from "@/components/mobileview/global/BuySellButton";
import AddProductModal from "@/components/mobileview/global/ProductAddModal";
import { useAuth } from "@/context/authContext";
import { useDistributor } from "@/context/distributorContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
const search = () => {
  const { searchproducts, loading }: any = useDistributor();
  const [visible, setVisible] = useState(false);
  const { userInfo }: any = useAuth();
  return (
    <>
      <FlatList
        data={searchproducts}
        keyExtractor={(item: { _id: string }) => item._id}
        renderItem={({ item }) => <BuySellButton item={item} />}
        ListFooterComponent={
          <>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#0000ff" />
              </View>
            ) : null}
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
          </>
        }
      />
      <AddProductModal isOpen={visible} setIsOpen={setVisible} />
    </>
  );
};
const styles = StyleSheet.create({
  loadingContainer: { paddingVertical: 10, alignItems: "center" },
});
export default search;
