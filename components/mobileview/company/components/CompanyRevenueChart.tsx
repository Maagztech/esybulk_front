import React, { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

interface ProductPriceChartProps {
  data: {
    product: string;
    ordersByDate: { date: string; price: number }[];
    ordersByWeek: { week: number; price: number }[];
    ordersByMonth: { month: number; price: number }[];
  }[];
}

const ProductPriceChart: React.FC<ProductPriceChartProps> = ({ data }) => {
  const [view, setView] = useState<"daily" | "weekly" | "monthly">("daily");

  const filteredData = data.map((item) => {
    if (view === "daily") {
      const lastThreeDays = item.ordersByDate.slice(-3);
      return {
        product: item.product,
        prices: lastThreeDays.map((entry) => entry.price),
        labels: lastThreeDays.map((entry) => entry.date),
      };
    } else if (view === "weekly") {
      const lastThreeWeeks = item.ordersByWeek.slice(-3);
      return {
        product: item.product,
        prices: lastThreeWeeks.map((entry) => entry.price),
        labels: lastThreeWeeks.map((entry) => `Week ${entry.week}`),
      };
    } else if (view === "monthly") {
      const lastThreeMonths = item.ordersByMonth.slice(-3);
      return {
        product: item.product,
        prices: lastThreeMonths.map((entry) => entry.price),
        labels: lastThreeMonths.map((entry) => `Month ${entry.month}`),
      };
    }
    return { product: "", prices: [], labels: [] };
  });

  const chartLabels = filteredData[0]?.labels || [];
  const datasets = filteredData.map((item) => ({
    data: item.prices,
    color: () => "rgba(255, 99, 132, 1)", // Change color for price chart
  }));

  const chartData = {
    labels: chartLabels,
    datasets,
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {["daily", "weekly", "monthly"].map((option) => (
          <Pressable
            key={option}
            onPress={() => setView(option as "daily" | "weekly" | "monthly")}
            style={[
              styles.button,
              view === option && styles.selectedButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                view === option && styles.selectedButtonText,
              ]}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>
      {chartLabels.length > 0 ? (
        <BarChart
          data={chartData}
          width={screenWidth - 40}
          height={300}
          fromZero
          showBarTops={false}
          yAxisLabel="$"
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#f9fafb",
            backgroundGradientTo: "#f3f4f6",
            color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
            barPercentage: 0.5,
            labelColor: () => "#374151",
          }}
          style={styles.chart}
        />
      ) : (
        <Text style={styles.noDataText}>No data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: "#FF6384",
  },
  buttonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "500",
  },
  selectedButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  chart: {
    borderRadius: 10,
    padding: 10,
  },
  noDataText: {
    marginTop: 50,
    color: "#9ca3af",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ProductPriceChart;
