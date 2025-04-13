// actions/suppliers.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getAllSuppliers() {
  const { data, error } = await supabase.from("supplier").select();
  return data;
}

export async function deleteSupplier(supplierId) {
  const { data, error } = await supabase
    .from("supplier")
    .delete()
    .eq("supplier_id", supplierId);

  if (error) {
    console.error("Error deleting supplier:", error);
    return { error };
  }
  return { data };
}

// Function to generate a random 3-character ID
function generateSupplierId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 3; i++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return id;
}


export async function addSupplier(supplierData) {
  const supplier_id = generateSupplierId(); // Generate supplier_id here
  const { data, error } = await supabase
    .from("supplier")
    .insert([
      {
        supplier_id: supplier_id, // Use the generated ID
        supplier_name: supplierData.supplierName,
        supplier_phone: supplierData.supplierPhone,
        supplier_email: supplierData.supplierEmail,
        supplier_address: supplierData.supplierAddress,
      },
    ]);

  if (error) {
    console.error("Error adding supplier:", error);
    return { error };
  }
  return { data };
}