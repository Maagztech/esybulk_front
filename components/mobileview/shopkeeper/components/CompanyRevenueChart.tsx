import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React from "react";
import { Line } from "react-chartjs-2";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface RevenueChartProps {
  data: number[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const chartData = {
    labels: ["Last 3 Days", "Last 3 Weeks", "Last 3 Months"], // Assuming data is for those time periods
    datasets: [
      {
        label: "Total Revenue ($)",
        data,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        tension: 0.4,
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
        text: "Company Revenue Over Time",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Revenue ($)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Time Period",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default RevenueChart;
