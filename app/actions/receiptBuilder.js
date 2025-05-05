import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function receiptBuilder(orderId) {
  // Fetch order details from Supabase
  const { data: orderDetails, error: orderDetailsError } = await supabase
    .from("order_details")
    .select(`*, medicine(medicine_id, medicine_name,price)`)
    .eq("order_id", orderId);

  if (orderDetailsError) {
    console.error("Error fetching order details:", orderDetailsError);
    return null;
  }

  // Fetch order and customer data
  const { data: orderData, error: orderError } = await supabase
    .from("order")
    .select(`*, customers(customer_id,firstname,lastname)`) // Include customer_name from the related customer table
    .eq("order_id", orderId); // Filter by order_id

  if (orderError) {
    console.error("Error fetching order data:", orderError);
    return null;
  }

  console.log("Order Details:", orderDetails);
  console.log("Order Data:", orderData);

  // Combine order details and order data
  const combinedData = {
    orderDetails,
    orderData: orderData[0], // Assuming one order matches the orderId
  };

  console.log("Combined Data:", combinedData);
  // Call the API route to generate the PDF
  const response = await fetch("/api/receipt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(combinedData), // Send combined data to the API
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
