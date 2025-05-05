import { supabase } from "@/lib/supabaseClient";

export async function getOrder() {
  const { data, error } = await supabase.from("order").select(`
    order_id,
    status,
    customer_id,
    employee_id,
    order_date,
    total_price,
    customers (
      firstname,
      lastname
    )
  `);

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  const enrichedOrders = data.map((order) => ({
    ...order,
    customerName: `${order.customers?.firstname ?? ""} ${
      order.customers?.lastname ?? ""
    }`.trim(),
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

    revalidatePath("/orders");
    return { data: { message: "Order deleted successfully." } };
  } catch (err) {
    console.error("Error deleting order:", err);
    return {
      error: { message: "An unexpected error occurred while deleting order." },
    };
  }
}

export async function updateOrder(orderData) {
  const { order_id, customer_id, employee_id, order_date, total_price } =
    orderData;

  try {
    const { data, error } = await supabase
      .from("order")
      .update({
        order_id,
        customer_id,
        employee_id,
        order_date,
        total_price,
      })
      .eq("order_id", order_id);

    if (error) {
      console.error("Supabase Error updating order:", error);
      return { error: { message: "Failed to update order in database." } };
    }

    revalidatePath("/orders");
    return { data: { message: "Order updated successfully." } };
  } catch (err) {
    console.error("Error updating order:", err);
    return {
      error: { message: "An unexpected error occurred while updating order." },
    };
  }
}
