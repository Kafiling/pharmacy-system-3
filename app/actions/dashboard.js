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
    .limit(5);
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
    .lt("quantity_in_stock", 100);
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
    .order("order_date", { ascending: false })
    .limit(10);

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
  //Real implementation to get the first day of last month and the first day of this month
  const today = new Date();
  const firstDayOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );
  const firstDayOfThisMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1
  );

  //For testing purposes, we are using a fixed date range.
  //const firstDayOfLastMonth = new Date(2026, 6, 1); // July 1, 2026 (month is 0-indexed)
  //const firstDayOfThisMonth = new Date(2026, 7, 1); // August 1, 2026

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

export async function getMonthlyRevenue() {
  const currentYear = new Date().getFullYear();
  const firstDayOfYear = new Date(currentYear, 0, 1); // January 1st
  const firstDayOfNextYear = new Date(currentYear + 1, 0, 1); // January 1st of next year

  const { data, error } = await supabase
    .from("order")
    .select("order_date, total_price")
    .gte("order_date", firstDayOfYear.toISOString()) // Filter from January 1st
    .lt("order_date", firstDayOfNextYear.toISOString()); // Filter before January 1st of next year

  if (error) {
    console.error("Error fetching monthly revenue:", error);
    return [];
  }

  // Aggregate revenue by month
  const monthlyData = data.reduce((acc, order) => {
    const month = new Date(order.order_date).getMonth(); // Get month (0-indexed)
    acc[month] = (acc[month] || 0) + order.total_price;
    return acc;
  }, {});

  // Ensure all months (Jan to Dec) are included
  return Array.from({ length: 12 }, (_, i) => ({
    month: new Date(currentYear, i).toLocaleString("en-US", { month: "short" }),
    total: monthlyData[i] || 0, // Default to 0 if no data for the month
  }));
}

export async function getTotalMedicineCount() {
  const { data, error, count } = await supabase
    .from("medicine")
    .select("*", { count: "exact" }); // Use `count: "exact"` to get the total count

  if (error) {
    console.error("Error fetching total medicine count:", error);
    return 0; // Return 0 if there's an error
  }

  return count || 0; // Return the count or 0 if undefined
}

export async function getTodaysOrdersAndRevenue() {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // Calculate tomorrow's date

  console.log("Today:", today);
  console.log("Tomorrow:", tomorrow.toISOString().split("T")[0]);

  const { data, error } = await supabase
    .from("order")
    .select("total_price") // Select only the total_price column
    .gte("order_date", today) // Filter orders from today
    .lt("order_date", tomorrow.toISOString().split("T")[0]); // Filter before tomorrow

  if (error) {
    console.error("Error fetching today's orders and revenue:", error);
    return { orderCount: 0, totalRevenue: 0 }; // Return 0 for both in case of an error
  }

  const orderCount = data.length; // Count the number of orders
  const totalRevenue = data.reduce((sum, order) => sum + order.total_price, 0); // Sum up the total_price

  console.log("Today's Orders Count:", orderCount);
  console.log("Today's Revenue:", totalRevenue);

  return { orderCount, totalRevenue };
}

export async function getYesterdaysOrdersAndRevenue() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1); // Calculate yesterday's date

  const startOfYesterday = yesterday.toISOString().split("T")[0]; // Start of yesterday in YYYY-MM-DD format
  const startOfToday = today.toISOString().split("T")[0]; // Start of today in YYYY-MM-DD format

  console.log("Yesterday:", startOfYesterday);
  console.log("Today:", startOfToday);

  const { data, error } = await supabase
    .from("order")
    .select("total_price") // Select only the total_price column
    .gte("order_date", startOfYesterday) // Filter orders from yesterday
    .lt("order_date", startOfToday); // Filter before today

  if (error) {
    console.error("Error fetching yesterday's orders and revenue:", error);
    return { orderCount: 0, totalRevenue: 0 }; // Return 0 for both in case of an error
  }

  const orderCount = data.length; // Count the number of orders
  const totalRevenue = data.reduce((sum, order) => sum + order.total_price, 0); // Sum up the total_price

  console.log("Yesterday's Orders Count:", orderCount);
  console.log("Yesterday's Revenue:", totalRevenue);

  return { orderCount, totalRevenue };
}
