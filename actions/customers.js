// actions/customers.js
"use server";

import { revalidatePath } from 'next/cache';
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

export async function addCustomer(customerData) {
  const { data, error } = await supabase.from("customers").insert([customerData]);
  console.log("Data:", data);
  console.log("Error:", error);
  return { data, error };
}

export async function deleteCustomer(customer_id) {
  try {
    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("customer_id", customer_id);

    if (error) {
      console.error("Supabase Error deleting customer:", error);
      return { error: { message: "Failed to delete customer from database." } };
    }

    revalidatePath('/customers'); // Revalidate the customers page to refresh data
    return { data: { message: "Customer deleted successfully." } };

  } catch (err) {
    console.error("Error deleting customer:", err);
    return { error: { message: "An unexpected error occurred while deleting customer." } };
  }
}

// ADD THIS FUNCTION BELOW:
export async function updateCustomer(customerData) {
  const { customer_id, firstname, lastname, email, phone, address } = customerData; // Destructure customerData

  try {
    const { data, error } = await supabase
      .from("customers")
      .update({ // Use update() to modify existing record
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone,
        address: address,
        // dateRegistered should likely NOT be updated here, unless you have a specific reason.
        // If you want to update dateRegistered, include it here.
      })
      .eq("customer_id", customer_id); // Specify which customer to update using customer_id

    if (error) {
      console.error("Supabase Error updating customer:", error);
      return { error: { message: "Failed to update customer in database." } };
    }

    revalidatePath('/customers'); // Revalidate the customers page to refresh data
    return { data: { message: "Customer updated successfully." } };

  } catch (err) {
    console.error("Error updating customer:", err);
    return { error: { message: "An unexpected error occurred while updating customer." } };
  }
}