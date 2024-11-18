import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ItemCard } from "./orderItemCard";

export const CompnayPendingOrders = ({ orders }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>
        *Please update here about order ststus.
      </Text>
      <View style={styles.innerContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.cardContainer}>
            {orders.map((order: any, index: number) => (
              <View style={styles.row} key={order.id}>
                <ItemCard order={order} />
              </View>
            ))}
            {orders.length === 0 && (
              <View>
                <Text>You are not having any orders.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
