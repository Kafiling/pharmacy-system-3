// filepath: /Users/kafiling/Projects/pharmacy-system-3/app/api/render-pdf/route.js
import ReactPDF from "@react-pdf/renderer";
import { MyDocument } from "@/Documents/Prescription";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
  try {
    // Define the path where the PDF will be saved
    const pdfPath = path.join(process.cwd(), "public", "example.pdf");

    // Render the PDF and save it to the specified path
    await ReactPDF.render(<MyDocument />, pdfPath);

    // Return a success response with the PDF URL
    return NextResponse.json({
      message: "PDF generated successfully",
      pdfUrl: "/example.pdf",
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { message: "Failed to generate PDF", error: error.message },
      { status: 500 }
    );
  }
}
