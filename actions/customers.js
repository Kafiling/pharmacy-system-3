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
