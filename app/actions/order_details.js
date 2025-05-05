import { supabase } from "@/lib/supabaseClient";

export async function getOrderDetails(orderId) {
  const { data, error } = await supabase
    .from("order_details")
    .select(
      `
      order_detail_id,
      order_id,
      quantity,
      payment,
      medicine:medicine_id (
        medicine_name,
        price
      )
    `
    )
    .eq("order_id", orderId);

  if (error) {
    console.error("Error fetching order details:", {
      message: error.message,
      details: error.details,
      code: error.code,
    });
    return [];
  }

  return data.map((detail) => ({
    medicineName: detail.medicine?.medicine_name || "Unknown",
    quantity: detail.quantity,
    price: detail.medicine?.price || 0,
    subtotal: detail.quantity * (detail.medicine?.price || 0),
  }));
}

export async function addOrderDetails(orderData) {
  const { data, error } = await supabase
    .from("order_details")
    .insert([orderData]);
  console.log("Data:", data);
  console.log("Error:", error);
  return { data, error };
}
