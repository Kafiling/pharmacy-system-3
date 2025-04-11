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
