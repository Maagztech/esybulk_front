import { useAuth } from "@/context/authContext";
import { useLoading } from "@/context/loadingContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ShopkeeperCompletedOrders from "../global/ShopkeeperCompletedOrders";
import ShopkeeperPendingOrders from "../global/ShopkeeperPendingOrders";

const OrderFromShop = () => {
  const [pending, setPending] = useState("Pending");
  const { access_token } = useAuth();
  const { setIsLoading }: any = useLoading();
  const [pendingBuy, setPendingBuy] = useState<any[]>([]);
  const [completedBuy, setCompletedBuy] = useState<any[]>([]);
  useEffect(() => {
    const loadBuyOrdereds = async () => {
      await loadBuyOrdered();
    };
    loadBuyOrdereds();
  }, [access_token]);

  const loadBuyOrdered = async () => {
    setIsLoading(true);
    const response = await axios.get(
      "https://api.esybulk.store/api/distributor_or_shopkeeper_orders",
      {
        headers: { Authorization: `${access_token}` },
      }
    );

    const orders = response.data;
    setPendingBuy(
      orders.filter(
        (order: any) => order.status === "ordered" || order.status === "shipped"
      )
    );
    setCompletedBuy(
      orders.filter(
        (order: any) =>
          order.status === "delivered" || order.status === "cancelled"
      )
    );
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, pending === "Pending" && styles.activeTab]}
            onPress={() => setPending("Pending")}
          >
            <Text
              style={[
                styles.tabText,
                pending === "Pending" && styles.activeTabText,
              ]}
            >
              Pending Orders
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tab, pending === "Completed" && styles.activeTab]}
            onPress={() => setPending("Completed")}
          >
            <Text
              style={[
                styles.tabText,
                pending === "Completed" && styles.activeTabText,
              ]}
            >
              Completed Orders
            </Text>
          </Pressable>
        </View>
        <View style={styles.content}>
          {pending === "Pending" && (
            <ShopkeeperPendingOrders
              loadBuyOrdered={loadBuyOrdered}
              orders={pendingBuy}
            />
          )}
          {pending === "Completed" && (
            <ShopkeeperCompletedOrders
              loadBuyOrdered={loadBuyOrdered}
              orders={completedBuy}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
  innerContainer: {
    width: "100%",
    maxWidth: 800,
    flex: 1
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: "#4CAF50",
  },
  tabText: {
    fontSize: 16,
    color: "#555",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  simpleTabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  simpleTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 4,
    marginHorizontal: 5,
  },
  activeSimpleTab: {
    borderColor: "#4CAF50",
    backgroundColor: "#e8f5e9",
  },
  simpleTabText: {
    fontSize: 14,
    color: "#555",
  },
  activeSimpleTabText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
});

export default OrderFromShop;
