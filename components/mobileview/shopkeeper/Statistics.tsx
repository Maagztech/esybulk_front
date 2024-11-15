import ProductSalesChart from "@/components/mobileview/company/components/productSoldChart";
import React from "react";
import { ScrollView, View } from "react-native";
import RevenueChart from "../company/components/CompanyRevenueChart";

const ShopStatistics = () => {
  return (
    <ScrollView style={{ padding: 20 }}>
      <ProductSalesChart />
      <View style={{ height: 50 }} />
      <RevenueChart />
    </ScrollView>
  );
};

export default ShopStatistics;
