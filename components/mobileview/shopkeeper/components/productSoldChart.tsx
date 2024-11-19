import React, { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

interface ProductQuantityChartProps {
  data: {
    product: string;
    ordersByDate: { date: string; quantity: number }[];
    ordersByWeek: { week: number; quantity: number }[];
    ordersByMonth: { month: number; quantity: number }[];
  }[];
}

const ProductQuantityChart: React.FC<ProductQuantityChartProps> = ({ data }) => {
  const [view, setView] = useState<"daily" | "weekly" | "monthly">("daily");

  const filteredData = data.map((item) => {
    if (view === "daily") {
      const lastThreeDays = item.ordersByDate.slice(-3);
      return {
        product: item.product,
        quantities: lastThreeDays.map((entry) => entry.quantity),
        labels: lastThreeDays.map((entry) => entry.date),
      };
    } else if (view === "weekly") {
      const lastThreeWeeks = item.ordersByWeek.slice(-3);
      return {
        product: item.product,
        quantities: lastThreeWeeks.map((entry) => entry.quantity),
        labels: lastThreeWeeks.map((entry) => `Week ${entry.week}`),
      };
    } else if (view === "monthly") {
      const lastThreeMonths = item.ordersByMonth.slice(-3);
      return {
        product: item.product,
        quantities: lastThreeMonths.map((entry) => entry.quantity),
        labels: lastThreeMonths.map((entry) => `Month ${entry.month}`),
      };
    }
    return { product: "", quantities: [], labels: [] };
  });

  const chartLabels = filteredData[0]?.labels || [];
  const datasets = filteredData.map((item) => ({
    data: item.quantities,
    color: () => "rgba(75, 192, 192, 1)",
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
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#f3f4f6",
            backgroundGradientTo: "#e5e7eb",
            color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
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
    backgroundColor: "#4CAF50",
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

export default ProductQuantityChart;
