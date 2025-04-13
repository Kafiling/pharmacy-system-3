import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getAllSuppliers() {
  const { data, error } = await supabase.from("supplier").select();
  console.log("Data:", data);
  console.log("Error:", error);
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
