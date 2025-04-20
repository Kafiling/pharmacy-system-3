// actions/orders.js
"use server";

import { createClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from 'next/cache';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const getOrderCountsByCustomer = async () => {
  noStore(); 

  try {
    const { data, error } = await supabase
      .from("order") // Ensure this is the correct table name
      .select("customer_id")
      .order("customer_id"); // Order for efficient grouping

    if (error) {
      console.error("Supabase error fetching order customer_ids:", error);
      return []; // Return empty array in case of error
    }

    // Count orders per customer_id
    const orderCountsMap = new Map(); 
    data.forEach(item => {
      const count = orderCountsMap.get(item.customer_id) || 0;
      orderCountsMap.set(item.customer_id, count + 1);
    });

    // Convert the map to the desired array format: { customer_id: string, order_count: number }[]
    const orderCountsArray = Array.from(orderCountsMap, ([customer_id, order_count]) => ({ customer_id, order_count }));

    return orderCountsArray;
  } catch (error) {
    console.error("Unexpected error fetching order counts:", error);
    return []; // Return empty array in case of error
  }
}