import ProductSalesChart from "@/components/mobileview/company/components/productSoldChart";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import RevenueChart from "./components/CompanyRevenueChart";

// Types for the company stats data
interface OrderStats {
  product: string;
  totalOrders: number;
  totalQuantity: number;
  totalPrice: number;
  ordersByDate: {
    date: string;
    quantity: number;
    price: number;
  }[];
  ordersByWeek: {
    week: number;
    quantity: number;
    price: number;
  }[];
  ordersByMonth: {
    month: number;
    quantity: number;
    price: number;
  }[];
}

const CompanyStatistics = () => {
  const [orderStats, setOrderStats] = useState<OrderStats[]>([]);
  const [revenueData, setRevenueData] = useState<number[]>([]);

  // Fetch order statistics from backend API
  const fetchOrderStats = async () => {
    try {
      const response = await axios.get("https://esybulk-back.onrender.com/api/company/stats");
      const data: OrderStats[] = response.data;
      setOrderStats(data);

      // Calculate total revenue (sum of prices) over 3 days, 3 weeks, and 3 months
      const revenue = data.reduce((acc, order) => acc + order.totalPrice, 0);
      setRevenueData([revenue]); // Assuming just one total revenue value for simplicity
    } catch (error) {
      console.error("Error fetching company stats:", error);
    }
  };

  useEffect(() => {
    fetchOrderStats();
  }, []);

  return (
    <ScrollView style={{ padding: 20 }}>
      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
          Product Sales
        </Text>
        <ProductSalesChart data={orderStats} />
      </View>

      <View style={{ height: 50 }} />

      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
          Company Revenue
        </Text>
        <RevenueChart data={revenueData} />
      </View>
    </ScrollView>
  );
};

export default CompanyStatistics;
