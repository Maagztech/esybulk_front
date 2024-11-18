import { useAuth } from "@/context/authContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CompnayPendingOrders } from "./components/CompanyPendingOrders";
import CompletedOrders from "./components/CompletedOrders";

const PendingOrders = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const { access_token } = useAuth();

  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  useEffect(() => {
    loadOrderedProducts();
  }, []);

  const loadOrderedProducts = async () => {
    const response = await axios.get(
      "http://localhost:5000/api/distributor_or_company_orders",
      {
        headers: { Authorization: `${access_token}` },
      }
    );
    const orders = response.data;
    setPendingOrders(
      orders.filter(
        (order: any) => order.status === "ordered" || order.status === "shipped"
      )
    );
    setCompletedOrders(
      orders.filter(
        (order: any) =>
          order.status === "delivered" || order.status === "cancelled"
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Pending" && styles.activeTab]}
            onPress={() => setActiveTab("Pending")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Pending" && styles.activeTabText,
              ]}
            >
              Pending Orders
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "Completed" && styles.activeTab]}
            onPress={() => setActiveTab("Completed")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Completed" && styles.activeTabText,
              ]}
            >
              Completed Orders
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {activeTab === "Pending" ? (
            <CompnayPendingOrders orders={pendingOrders} />
          ) : (
            <CompletedOrders orders={completedOrders} />
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
    marginBottom: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    maxWidth: "100%",
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
  },
  tabText: {
    fontSize: 16,
    color: "#555",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  ordersContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  ordersText: {
    fontSize: 18,
    fontWeight: "bold",
    flexShrink: 1, // Ensures text does not wrap onto multiple lines
  },
});

export default PendingOrders;
