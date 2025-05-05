import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getAllStock() {


  const { data, error } = await supabase.from("stock").select(
    `
    stock_id,
    quantity_in_stock,
    expiration_date,
    medicine (
      medicine_id,
      medicine_name,
      price,
      categories (
        category_name
      )
    ),
    supplier (
      supplier_name
    )
  `
  );

  console.log("Data:", data);
  console.log("Error:", error);
  return data;
}
