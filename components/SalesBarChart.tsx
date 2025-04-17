"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export function SalesBarChart({
  data,
}: {
  data: { date: string; total: number }[];
}) {
  const chartData = {
    labels: data.map((item) => item.date), // Dates
    datasets: [
      {
        label: "Total Sales (฿)",
        data: data.map((item) => item.total), // Total sales
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Total Sales (฿)",
        },
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
