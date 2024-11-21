import React, { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { OrderNotChangeCard } from "./OrderNotChangeCard";

const ShopkeeperPendingOrders = ({ loadBuyOrdered, orders }: any) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Assuming loadSellOrdered is a function that reloads orders
    await loadBuyOrdered();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.scrollContent}>
          <ScrollView
            contentContainerStyle={styles.cardContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {orders.map((order: any, index: number) => (
              <View style={styles.row} key={order.id}>
                <OrderNotChangeCard order={order} />
              </View>
            ))}
            {orders.length === 0 && (
              <View>
                <Text>You are not having any orders.</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    display: "flex",
    alignItems: "center",
  },
  innerContainer: {
    maxWidth: 800,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  cardContainer: {
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});

export default ShopkeeperPendingOrders;
