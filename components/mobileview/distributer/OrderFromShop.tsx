import { useAuth } from "@/context/authContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CompnayPendingOrders } from "../company/components/CompanyPendingOrders";
import CompletedOrders from "../company/components/CompletedOrders";
import { OrderNotChangeCard } from "../global/OrderNotChangeCard";

const OrderFromShop = () => {
  const [activeTab, setActiveTab] = useState("Sell");
  const [pending, setPending] = useState("Pending");
  const { access_token } = useAuth();

  const [pendingBuy, setPendingBuy] = useState<any[]>([]);
  const [completedBuy, setCompletedBuy] = useState<any[]>([]);
  const [pendingSell, setPendingSell] = useState<any[]>([]);
  const [completedSell, setCompletedSell] = useState<any[]>([]);
  useEffect(() => {
    loadSellOrdered();
    loadBuyOrdered();
  }, []);

  const loadSellOrdered = async () => {
    const response = await axios.get(
      "http://localhost:5000/api/distributor_or_company_orders",
      {
        headers: { Authorization: `${access_token}` },
      }
    );
    const orders = response.data;
    console.log("sell Order", orders);
    setPendingSell(
      orders.filter(
        (order: any) => order.status === "ordered" || order.status === "shipped"
      )
    );
    setCompletedSell(
      orders.filter(
        (order: any) =>
          order.status === "completed" || order.status === "cancelled"
      )
    );
  };

  const loadBuyOrdered = async () => {
    const response = await axios.get(
      "http://localhost:5000/api/distributor_or_shopkeeper_orders",
      {
        headers: { Authorization: `${access_token}` },
      }
    );

    const orders = response.data;
    console.log("buy order", orders);
    setPendingBuy(
      orders.filter(
        (order: any) => order.status === "ordered" || order.status === "shipped"
      )
    );
    setCompletedBuy(
      orders.filter(
        (order: any) =>
          order.status === "completed" || order.status === "cancelled"
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, activeTab === "Sell" && styles.activeTab]}
            onPress={() => setActiveTab("Sell")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Sell" && styles.activeTabText,
              ]}
            >
              Sell Orders
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tab, activeTab === "Buy" && styles.activeTab]}
            onPress={() => setActiveTab("Buy")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Buy" && styles.activeTabText,
              ]}
            >
              Your Buy Orders
            </Text>
          </Pressable>
        </View>

        <View style={styles.simpleTabContainer}>
          <Pressable
            style={[
              styles.simpleTab,
              pending === "Pending" && styles.activeSimpleTab,
            ]}
            onPress={() => setPending("Pending")}
          >
            <Text
              style={[
                styles.simpleTabText,
                pending === "Pending" && styles.activeSimpleTabText,
              ]}
            >
              Pending Orders
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.simpleTab,
              pending === "Completed" && styles.activeSimpleTab,
            ]}
            onPress={() => setPending("Completed")}
          >
            <Text
              style={[
                styles.simpleTabText,
                pending === "Completed" && styles.activeSimpleTabText,
              ]}
            >
              Completed Orders
            </Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          {activeTab === "Sell" && pending === "Pending" && (
            <CompnayPendingOrders order={pendingSell} />
          )}
          {activeTab === "Sell" && pending === "Completed" && (
            <CompletedOrders order={completedSell} />
          )}
          {activeTab === "Buy" && pending === "Pending" && (
            <OrderNotChangeCard order={pendingBuy} />
          )}
          {activeTab === "Buy" && pending === "Completed" && (
            <CompletedOrders order={completedBuy} />
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
