import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { useFinance } from "../context/FinanceContext";
import { darkModeManager } from "../utils/darkModeManager";

const ChartSpending = ({ timeRange = "month", height = 300 }) => {
  const { getMonthlyData } = useFinance();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [darkMode, setDarkMode] = useState(darkModeManager.getDarkMode());

  useEffect(() => {
    const unsubscribe = darkModeManager.subscribe(setDarkMode);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    const dataRaw = getMonthlyData(timeRange);

    const labels = dataRaw.map((d) => d.month);
    const incomeData = dataRaw.map((d) => d.income);
    const expenseData = dataRaw.map((d) => d.expense);


    const ctx = chartRef.current.getContext("2d");
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Income",
            data: incomeData,
            backgroundColor: "rgba(16,185,129,0.7)",
            borderColor: "rgb(16,185,129)",
            borderWidth: 1,
            borderRadius: 6,
          },
          {
            label: "Expense",
            data: expenseData,
            backgroundColor: "rgba(239,68,68,0.7)",
            borderColor: "rgb(239,68,68)",
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: darkMode ? "#e5e7eb" : "#374151" } },
          tooltip: {
            backgroundColor: darkMode ? "#1f2937" : "#fff",
            titleColor: darkMode ? "#e5e7eb" : "#374151",
            bodyColor: darkMode ? "#e5e7eb" : "#374151",
          },
        },
        scales: {
          x: {
            ticks: { color: darkMode ? "#e5e7eb" : "#374151" },
            grid: { color: darkMode ? "#374151" : "#e5e7eb" },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: darkMode ? "#e5e7eb" : "#374151",
              callback: (val) => "Rp " + Number(val).toLocaleString("id-ID"),
            },
            grid: { color: darkMode ? "#374151" : "#e5e7eb" },
          },
        },
      },
    });

    return () => chartInstance.current?.destroy();
  }, [timeRange, darkMode, getMonthlyData]);

  return <canvas ref={chartRef} style={{ height: `${height}px` }} />;
};

export default ChartSpending;
