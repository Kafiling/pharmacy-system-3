import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getOrder() {
  const { data, error } = await supabase
    .from("order")
    .select(`
      order_id,
      status,
      customer_id,
      employee_id,
      order_date,
      total_price,
      customer:customer_id (
        firstname,
        lastname
      )
    `);

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  // Enrich the orders with customerName
  const enrichedOrders = data.map(order => ({
    ...order,
    customerName: `${order.customer?.firstname ?? ""} ${order.customer?.lastname ?? ""}`.trim()
  }));

  return enrichedOrders;
}


export async function addOrder(orderData) {
  const { data, error } = await supabase.from("order").insert([orderData]);
  console.log("Data:", data);
  console.log("Error:", error);
  return { data, error };
}

export async function deleteOrder(order_id) {
  try {
    const { error } = await supabase
      .from("order")
      .delete()
      .eq("order_id", order_id);

    if (error) {
      console.error("Supabase Error deleting order:", error);
      return { error: { message: "Failed to delete order from database." } };
    }

    revalidatePath('/orders'); // Revalidate the orders page to refresh data
    return { data: { message: "Order deleted successfully." } };

  } catch (err) {
    console.error("Error deleting order:", err);
    return { error: { message: "An unexpected error occurred while deleting order." } };
  }
}

// ADD THIS FUNCTION BELOW:
export async function updateOrder(orderData) {
  const { order_id, customer_id, employee_id, order_date, total_price } = orderData; // Destructure orderData

  try {
    const { data, error } = await supabase
      .from("order")
      .update({ // Use update() to modify existing record
        order_id: order_id,
        customer_id: customer_id,
        employee_id: employee_id,
        order_date: order_date,
        total_price: total_price,
        // dateRegistered should likely NOT be updated here, unless you have a specific reason.
        // If you want to update dateRegistered, include it here.
      })
      .eq("order_id", order_id); // Specify which customer to update using customer_id

    if (error) {
      console.error("Supabase Error updating order:", error);
      return { error: { message: "Failed to update order in database." } };
    }

    revalidatePath('/orders'); // Revalidate the orders page to refresh data
    return { data: { message: "Order updated successfully." } };

  } catch (err) {
    console.error("Error updating order:", err);
    return { error: { message: "An unexpected error occurred while updating order." } };
  }
}