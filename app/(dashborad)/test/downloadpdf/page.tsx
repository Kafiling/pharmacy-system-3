"use client";

import { getAllStock } from "@/actions/stock";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    // Trigger the file download on the client side
    const link = document.createElement("a");
    link.href = "/example.pdf"; // Adjust the path to your generated PDF
    link.download = "_Health_claim.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []); // Runs only once after the component mounts

  const stock = [
    // Mock data for demonstration
    { stock_id: 1, name: "Item A", supplier_id: "Supplier A" },
    { stock_id: 2, name: "Item B", supplier_id: "Supplier B" },
  ];

  return (
    <div>
      {stock.map((item: any) => (
        <div key={item.stock_id}>
          <h2>{item.name}</h2>
          <p>supplier_id: {item.supplier_id}</p>
        </div>
      ))}
    </div>
  );
}