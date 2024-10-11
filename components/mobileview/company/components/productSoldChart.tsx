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

const ProductSoldChart = () => {
  const [period, setPeriod] = useState("daily");

  // Dynamic data with indefinite products
  const products = [
    "Product A",
    "Product B",
    "Product C",
    "Product D",
    "Product E",
    "Product F",
    "Product G",
    "Product H",
  ]; // Add as many as needed

  const getData = () => {
    const randomData = products.map(() => Math.floor(Math.random() * 100) + 20); // Random data for each product
    return {
      labels: products, // Use product names as labels
      datasets: [
        {
          label: `Quantity Sold (${
            period.charAt(0).toUpperCase() + period.slice(1)
          })`,
          data: randomData, // Dynamic data
          backgroundColor: generateColors(products.length), // Generate colors for each product
          borderColor: generateColors(products.length),
          borderWidth: 2,
          barThickness: 30, // Set the thickness of the bars
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows for x-axis scroll
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false, // We move the title inline
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Quantity",
        },
      },
      x: {
        title: {
          display: true,
          text: "Products",
        },
        ticks: {
          autoSkip: false, // Ensures all products are shown
          maxRotation: 0, // Prevents labels from rotating
          minRotation: 0, // Ensures labels are horizontal
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "700px",
        overflowX: "scroll",
        overflowY: "scroll",
        textAlign: "center",
      }}
    >
      {/* Heading and buttons container */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        {/* Chart Title */}
        <h2 style={{ margin: 0 }}>Product Sold</h2>

        {/* Buttons for selecting time period */}
        <div>
          <button
            onClick={() => setPeriod("daily")}
            style={{
              margin: "5px",
              padding: "10px",
              cursor: "pointer",
              backgroundColor: period === "daily" ? "#FF5733" : "#f0f0f0", // Highlight selected button
              color: period === "daily" ? "#fff" : "#000", // White text for selected
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
        <Bar data={getData()} options={options} />
      </div>
    </div>
  );
};

export default ProductSoldChart;
