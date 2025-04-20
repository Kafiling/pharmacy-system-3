"use client";
import { useEffect, useState } from "react";
import { stockBuilder } from "@/app/actions/stockBuilder";
import { timeStamp } from "console";

export default function Page() {
  const handleGeneratePDF = async () => {
    // Call the server-side function to generate the PDF
    await stockBuilder();

    // Trigger the download of the generated PDF
    const link = document.createElement("a");
    link.href = "/documents/completed/stockreport.pdf"; // Adjust the path to your generated PDF
    const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
    link.download = `Stockreport_${timestamp}.pdf`; // Set the desired file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <h1 className="text-2xl font-bold">Download PDF : Stock Report</h1>
      <p className="text-lg">Click download to download the PDF.</p>

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
