import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getAllStock() {
  const { data, error } = await supabase.from("test").select();
  console.log("Data:", data);
  console.log("Error:", error);
  return data;
}
