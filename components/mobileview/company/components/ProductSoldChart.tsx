import React, { useState } from "react";
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

interface ProductData {
  product: string;
  ordersByDate: { date: string; quantity: number }[];
  ordersByWeek: { week: number; quantity: number }[];
  ordersByMonth: { month: number; quantity: number }[];
}

interface ProductQuantityChartProps {
  data: ProductData[];
}

const ProductQuantityChart: React.FC<ProductQuantityChartProps> = ({ data }) => {
  const [view, setView] = useState<"daily" | "weekly" | "monthly">("daily");
  const [selectedProductIndex, setSelectedProductIndex] = useState<number>(0);

  const selectedProduct = data[selectedProductIndex];

  const chartData = (() => {
    if (!selectedProduct) return { labels: [], datasets: [{ data: [] }] };

    const lastEntries =
      view === "daily"
        ? selectedProduct.ordersByDate.slice(-3)
        : view === "weekly"
          ? selectedProduct.ordersByWeek.slice(-3)
          : selectedProduct.ordersByMonth.slice(-3);

    const labels =
      view === "daily"
        ? lastEntries.map((entry) => {
          if ("date" in entry) return entry.date;
          return "";
        })
        : view === "weekly"
          ? lastEntries.map((entry) => {
            if ("week" in entry) return `Week ${entry.week}`;
            return "";
          })
          : lastEntries.map((entry) => {
            if ("month" in entry) return `Month ${entry.month}`;
            return "";
          });

    const data = lastEntries.map((entry) => entry.quantity);

    return { labels, datasets: [{ data }] };
  })();

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

      <FlatList
        horizontal
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Pressable
            style={[
              styles.productButton,
              index === selectedProductIndex && styles.selectedProductButton,
            ]}
            onPress={() => setSelectedProductIndex(index)}
          >
            <Text
              style={[
                styles.productButtonText,
                index === selectedProductIndex && styles.selectedProductText,
              ]}
            >
              {item.product.length > 20 ? `${item.product.slice(0, 20)}...` : item.product}
            </Text>
          </Pressable>

        )}
        contentContainerStyle={styles.productList}
        showsHorizontalScrollIndicator={false}
      />

      {chartData.labels.length > 0 ? (
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
            formatYLabel: (value) => {
              const intValue = Number(value);
              return intValue % 1 === 0 ? `${intValue}` : "";
            },
          }}

        />
      ) : (
        <Text style={styles.noDataText}>Deliver your first order to unlock the graph!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingTop: 20,
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
  productList: {
    flexDirection: "row",
    marginBottom: 20,
  },
  productButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 5,
  },
  selectedProductButton: {
    backgroundColor: "#4CAF50",
  },
  productButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
  },
  selectedProductText: {
    color: "#ffffff",
    fontWeight: "700",
  },

  noDataText: {
    marginVertical: 50,
    color: "#9ca3af",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ProductQuantityChart;
