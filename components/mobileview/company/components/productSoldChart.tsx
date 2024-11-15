import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface ProductSalesChartProps {
  data: {
    product: string;
    totalOrders: number;
    totalQuantity: number;
    totalPrice: number;
    ordersByDate: any[];
    ordersByWeek: any[];
    ordersByMonth: any[];
  }[];
}

const ProductSalesChart: React.FC<ProductSalesChartProps> = ({ data }) => {
  const labels = data.map((item) => item.product);
  const quantities = data.map((item) => item.totalQuantity);
  const prices = data.map((item) => item.totalPrice);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Quantity Sold",
        data: quantities,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Total Sales ($)",
        data: prices,
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Product Sales Statistics",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Quantity / Sales ($)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Products",
        },
      },
    },
  };

  return <Bar data={chartData} options={options}/>;
};

export default ProductSalesChart;
