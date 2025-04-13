import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getAllCustomers() {
  const { data, error } = await supabase.from("customers").select();
  console.log("Data:", data);
  console.log("Error:", error);
  return data;
}

//export async function addCustomer(customerData) {
//  const { data, error } = await supabase.from("customers").insert([customerData]);
//  console.log("Data:", data);
//  console.log("Error:", error);
//  return data;
//}

export async function addCustomer(customerData) {
    console.log("addCustomer called with data:", customerData); // Log the data being passed
    const { data, error } = await supabase.from("customers").insert([customerData]);
    console.log("Supabase Data:", data);
    if (error) {
      console.error("Supabase Error during addCustomer:", error); // Log the FULL error object
    }
    return { data, error }; // Return both data and error
  }