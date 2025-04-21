import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getCustomer() {
  const { data, error } = await supabase
    .from("order")
    .select("customer_id, firstname, lastname");

  if (error) {
    console.error("Error fetching order:", error);
    return;
  }

  if (data) {
    console.log("Customer:");
    data.forEach((customer) => {
      console.log("Customer ID:", customer.customer_id);
      console.log("firstname:", customer.firstname);
      console.log("lastname:", customer.lastname);
      console.log("-----");
    });
  }

  return data;
}