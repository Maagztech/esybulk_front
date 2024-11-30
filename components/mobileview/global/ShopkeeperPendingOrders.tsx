import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from "react-native";
import { OrderNotChangeCard } from "./OrderNotChangeCard";

const ShopkeeperPendingOrders = ({ loadBuyOrdered, orders }: any) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBuyOrdered();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <FlatList
          contentContainerStyle={styles.cardContainer}
          data={orders}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <OrderNotChangeCard order={item} />
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.headerTitle}>
              You are not having any orders.
            </Text>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 500,
    flexDirection: "row",
    alignItems: "center",
  },
  innerContainer: {
    maxWidth: 800,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  cardContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});

export default ShopkeeperPendingOrders;
