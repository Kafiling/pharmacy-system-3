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
    );
  console.log("Data:", data);
  console.log("Error:", error);
  return data;
}

export async function getLowStock() {
  // Fetch 10 most recent orders
  const { data, error } = await supabase
    .from("stock")
    .select()
    .lt("quantity", 50);
  console.log("Low Stock Data:", data);
  console.log("Low Stock Data:", error);
  return data;
}
