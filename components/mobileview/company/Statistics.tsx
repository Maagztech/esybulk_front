import ProductSalesChart from "@/components/mobileview/company/components/productSoldChart";
import React from "react";
import { ScrollView, View } from "react-native";
import RevenueChart from "./components/CompanyRevenueChart";
import ProfitCreated from "./components/ProfitChart";

const Stats = () => {
  return (
    <ScrollView style={{ padding: 20 }}>
      <ProductSalesChart />
      <View style={{ height: 50 }} />
      <RevenueChart />
      <View style={{ height: 50 }} />
      <ProfitCreated />
    </ScrollView>
  );
};

export default Stats;
