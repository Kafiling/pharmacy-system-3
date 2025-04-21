import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getOrderDetails() {
  const { data, error } = await supabase
    .from("order")
    .select("order_detail_id, order_id, medicine_id, quantity");

  if (error) {
    console.error("Error fetching order:", error);
    return;
  }

  if (data) {
    console.log("Orders Details:");
    data.forEach((details) => {
      console.log("Order details ID:", details.order_detail_id);
      console.log("Order ID:", details.order_id);
      console.log("Employee ID:", details.medicine_id);
      console.log("Order Date:", details.quantity);
      console.log("-----");
    });
  }

  return data;
}

export async function addOrderDetails(orderData) {
    const { data, error } = await supabase.from("order_details").insert([orderDetailData]);
    console.log("Data:", data);
    console.log("Error:", error);
    return { data, error };
  }