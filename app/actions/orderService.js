import { supabase } from "@/lib/supabaseClient";
import { getOrderDetails } from "./order_details";

export async function getOrdersWithDetails() {
  const { data: ordersData, error: ordersError } = await supabase.from("order")
    .select(`
      *,
      customers:customer_id (firstname, lastname)
    `);

  if (ordersError) throw ordersError;

  const enrichedOrders = await Promise.all(
    ordersData.map(async (order) => {
      const orderDetails = await getOrderDetails(order.order_id);
      return {
        ...order,
        customer_name: `${order.customers?.firstname || ""} ${
          order.customers?.lastname || ""
        }`.trim(),
        order_details: orderDetails,
      };
    })
  );

  return enrichedOrders;
}
