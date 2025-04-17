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
  const recentData = data.slice(-10); // Get the most recent x days
  const chartData = {
    labels: recentData.map((item) => item.date), // Reverse dates for most recent order to the right
    datasets: [
      {
        label: "Total Sales (฿)",
        data: recentData.map((item) => item.total), // Reverse total sales to match reversed dates
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
        display: false,
        position: "top" as const,
      },
    },
    scales: {
      x: {
        title: {
          display: false,
          text: "Date",
        },
        grid: {
          display: false, // Remove gridlines on the x-axis
        },
      },
      y: {
        title: {
          display: true,
          text: "Value of Dispensed Good (THB)",
        },
        beginAtZero: true,
        grid: {
          // Remove gridlines on the y-axis
          display: false,
        },
        ticks: {
          maxTicksLimit: 6, // Limit the number of steps to 5
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
