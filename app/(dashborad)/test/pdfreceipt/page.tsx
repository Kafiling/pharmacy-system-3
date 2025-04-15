"use client";
import { useEffect, useState } from "react";
import { receiptBuilder } from "@/app/actions/ReceiptBuilder";

export default function Page() {
  const [orderId, setOrderId] = useState("000001"); // State to manage the input value

  const handleGeneratePDF = async () => {
    // Call the server-side function to generate the PDF
    await receiptBuilder(orderId);

    // Trigger the download of the generated PDF
    const link = document.createElement("a");
    link.href = "/documents/completed/paymentreceipt.pdf"; // Adjust the path to your generated PDF
    link.download = `Order_${orderId}_Label.pdf`; // Set the desired file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <h1 className="text-2xl font-bold">Download PDF : Receipt</h1>
      <p className="text-lg">
        Enter the Order ID and click the button below to download the PDF.
      </p>

      {/* Input field for Order ID */}
      <div className="mt-4">
        <label
          htmlFor="orderId"
          className="block text-sm font-medium text-gray-700"
        >
          Order ID:
        </label>
        <input
          type="text"
          id="orderId"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)} // Update state on input change
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      {/* Button to generate and download the PDF */}
      <button
        onClick={handleGeneratePDF}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Download PDF
      </button>
    </div>
  );
}
