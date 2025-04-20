import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function stockBuilder() {
  // Fetch stock data from Supabase
  const { data: Data, error: Error } = await supabase
    .from("stock")
    .select(`*, medicine(medicine_id,medicine_name)`); // Include customer_name from the related customer table

  if (Error) {
    console.error("Error fetching data:", Error);
    return null;
  }
  console.log("Stock Data:", Data);

  // Call the API route to generate the PDF
  const response = await fetch("/api/stock", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Data), // Send combined data to the API
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error generating PDF:", errorData.message, errorData.error);
    return null;
  }

  const result = await response.json();
  console.log("PDF generated successfully:", result);
  return result;
}
