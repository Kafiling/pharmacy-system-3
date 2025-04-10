"use client";
import { useEffect, useState } from "react";
import { getAllStock } from "@/actions/stock";
import { MyDocument } from "@/Documents/MedicieneLabel";
import { PDFViewer } from "@react-pdf/renderer";

export default function Page() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure this code runs only on the client side
    setIsClient(true);
  }, []);

  /* This Download "EXPORTED" PDF file from the server side
  useEffect(() => {
    // Trigger the file download on the client side
    const link = document.createElement("a");
    link.href = "/example.pdf"; // Adjust the path to your generated PDF
    link.download = "ORDERDETAIL_Presciption.pdf"; // Set the desired file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []); // Runs only once after the component mounts
*/

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {isClient && (
        <PDFViewer style={{ height: "100%", width: "100%" }}>
          <MyDocument />
        </PDFViewer>
      )}
    </div>
  );
}
