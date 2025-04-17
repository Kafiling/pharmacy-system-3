import { customers } from "@/lib/data";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getRecentOrder() {
  // Fetch 10 most recent orders
  const { data, error } = await supabase
    .from("order")
    .select(
      "order_id, employee_id, order_date, total_price, customers(firstname, lastname)"
    )
    .order("order_date", { ascending: false })
    .limit(6);
  console.log("Data:", data);
  console.log("Error:", error);
  return data;
}

export async function getLowStock() {
  const { data, error } = await supabase
    .from("stock")
    .select(
      "stock_id, quantity_in_stock, medicine(medicine_name, categories_id), supplier(supplier_id, supplier_name)"
    )
    .lt("quantity_in_stock", 50);
  console.log("Low Stock Data:", data);
  console.log("Low Stock Error:", error);
  return data;
}

export async function getAllOrder() {
  // Fetch 10 most recent orders
  const { data, error } = await supabase
    .from("order")
    .select()
    .order("order_date", { ascending: false });

  console.log("Data:", data);
  console.log("Error:", error);
  return data;
}

export async function getAllCustomer() {
  const { data, error } = await supabase.from("customers").select();
  return data;
}

export async function getRecentRevenue() {
  const { data, error } = await supabase
    .from("order")
    .select("order_date, total_price")
    .order("order_date", { ascending: true });

  if (error) {
    console.error("Error fetching order data for graph:", error);
    return [];
  }

  // Group data by date and calculate total sales per day
  const groupedData = data.reduce((acc, order) => {
    const date = new Date(order.order_date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + order.total_price;
    return acc;
  }, {});

  return Object.entries(groupedData).map(([date, total]) => ({
    date,
    total,
  }));
}

export async function getWeeklyRevenue() {
  // const today = new Date();
  // const firstDayOfLastMonth = new Date(today.getFullYear(),today.getMonth() - 1,1);
  // const firstDayOfThisMonth = new Date(today.getFullYear(),today.getMonth(),1);

  const firstDayOfLastMonth = new Date(2026, 6, 1); // July 1, 2026 (month is 0-indexed)
  const firstDayOfThisMonth = new Date(2026, 7, 1); // August 1, 2026

  const { data, error } = await supabase
    .from("order")
    .select("order_date, total_price")
    .gte("order_date", firstDayOfLastMonth.toISOString()) // Filter from the first day of last month
    .lt("order_date", firstDayOfThisMonth.toISOString()); // Filter before the first day of this month

  if (error) {
    console.error("Error fetching weekly revenue for last month:", error);
    return [];
  }

  // Aggregate revenue by week
  const weeklyData = data.reduce((acc, order) => {
    const week = getWeek(new Date(order.order_date)); // Helper function to get the week number
    acc[week] = (acc[week] || 0) + order.total_price;
    return acc;
  }, {});

  return Object.entries(weeklyData).map(([week, total]) => ({
    week: `Week ${week}`,
    total,
  }));
}

// Helper function to get the week number
function getWeek(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
