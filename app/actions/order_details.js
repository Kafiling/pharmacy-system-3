import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getOrderDetails(orderId) {
  const { data, error } = await supabase
    .from("order_detail")
    .select(`
      quantity,
      medicine_id,
      medicine:medicine_id (
        name,
        price
      )
    `)
    .eq("order_id", orderId); // filter by order_id

  if (error) {
    console.error("Error fetching order details:", error);
    return [];
  }

  // Return the enriched details with medicine info
  return data.map(detail => ({
    medicineName: detail.medicine?.name || "Unknown", // Default in case medicine is not found
    quantity: detail.quantity,
    price: detail.medicine?.price || 0,
    subtotal: detail.quantity * (detail.medicine?.price || 0),
  }));
}


export async function addOrderDetails(orderData) {
    const { data, error } = await supabase.from("order_details").insert([orderDetailData]);
    console.log("Data:", data);
    console.log("Error:", error);
    return { data, error };
  }