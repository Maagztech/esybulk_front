import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";

// Register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Function to generate random colors
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Generate an array of random colors based on the number of products
const generateColors = (num: number) =>
  Array.from({ length: num }, () => generateRandomColor());

const RevenueChart = () => {
  const [period, setPeriod] = useState("daily");

  // Dynamic product data
  const products = [
    "Product A",
    "Product B",
    "Product C",
    "Product D",
    "Product E",
    "Product F",
    "Product G",
    "Product H",
  ];

  // Simulated revenue data for different periods
  const getData = () => {
    const randomRevenue = products.map(
      () => Math.floor(Math.random() * 5000) + 1000
    ); // Generate random revenue data

    return {
      labels: products, // Product names as labels
      datasets: [
        {
          label: `Revenue Collected (${
            period.charAt(0).toUpperCase() + period.slice(1)
          })`,
          data: randomRevenue, // Dynamic revenue data
          backgroundColor: generateColors(products.length), // Random colors for each product
          borderColor: generateColors(products.length),
          borderWidth: 2,
          barThickness: 20, // Control bar thickness
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false, // Inline title with buttons
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
          text: "Products",
        },
        ticks: {
          autoSkip: false, // Show all products on the x-axis
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        overflowX: "scroll",
        overflowY: "scroll",
        textAlign: "center",
      }}
    >
      {/* Heading and Buttons Container */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        {/* Chart Title */}
        <h2 style={{ margin: 0 }}>Revenue Collected</h2>

        {/* Buttons for selecting time period */}
        <div>
          <button
            onClick={() => setPeriod("daily")}
            style={{
              margin: "5px",
              padding: "10px",
              cursor: "pointer",
              backgroundColor: period === "daily" ? "#FF5733" : "#f0f0f0",
              color: period === "daily" ? "#fff" : "#000",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Day
          </button>
          <button
            onClick={() => setPeriod("weekly")}
            style={{
              margin: "5px",
              padding: "10px",
              cursor: "pointer",
              backgroundColor: period === "weekly" ? "#FF5733" : "#f0f0f0",
              color: period === "weekly" ? "#fff" : "#000",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Week
          </button>
          <button
            onClick={() => setPeriod("monthly")}
            style={{
              margin: "5px",
              padding: "10px",
              cursor: "pointer",
              backgroundColor: period === "monthly" ? "#FF5733" : "#f0f0f0",
              color: period === "monthly" ? "#fff" : "#000",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Month
          </button>
        </div>
      </div>

      {/* Bar Chart */}
      <div style={{ width: `${products.length * 120}px`, height: "85%" }}>
        {" "}
        {/* Adjust width based on product count */}
        <Bar data={getData()} options={options} />
      </div>
    </div>
  );
};

export default RevenueChart;
