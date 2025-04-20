import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";
import page from "@/app/(dashborad)/test/page";
var fontkit = require("fontkit");

export async function POST(req) {
  try {
    const data = await req.json(); // Get the data from the request body

    // Load the font
    const fontPath = path.resolve(process.cwd(), "public/THSarabunNew.ttf");
    if (!fs.existsSync(fontPath)) {
      throw new Error(`Font file not found at ${fontPath}`);
    }
    const fontBytes = fs.readFileSync(fontPath);

    // Load the existing PDF
    const pdfPath = path.resolve(
      process.cwd(),
      "public/documents/MedLabel.pdf"
    );
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`PDF file not found at ${pdfPath}`);
    }
    const existingPdfBytes = fs.readFileSync(pdfPath);

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Register fontkit
    pdfDoc.registerFontkit(fontkit);

    // Embed the custom font
    const thSarabunFont = await pdfDoc.embedFont(fontBytes);
    // Copy the first page of the PDF

    // Insert a new page for each order detail
    for (let i = 0; i < data.orderDetails.length; i++) {
      const copiedPages = await pdfDoc.copyPages(pdfDoc, [0]);
      pdfDoc.addPage(copiedPages[0]); // Insert the first copied page
    }

    // Remove the original first page
    pdfDoc.removePage(0);

    // Get the pages of the PDF
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    // Helper function to draw text on the page
    const drawTextOnPage = (
      page,
      text,
      x,
      y,
      font = thSarabunFont,
      size = 14,
      color = rgb(0, 0, 0)
    ) => {
      if (text !== undefined && text !== null) {
        page.drawText(String(text), {
          x,
          y,
          size,
          font,
          color,
        });
      }
    };
    for (let i = 0; i < data.orderDetails.length; i++) {
      const orderDetail = data.orderDetails[i];
      const orderData = data.orderData;
      // Add text to the PDF
      drawTextOnPage(
        pages[i],
        orderData.customers.firstname + " " + orderData.customers.lastname,
        93,
        height - 95,
        thSarabunFont,
        14
      );
      drawTextOnPage(
        pages[i],
        orderData.customer_id,
        325,
        height - 95,
        thSarabunFont,
        14
      );
      drawTextOnPage(
        pages[i],
        orderDetail.medicine.medicine_name,
        93,
        height - 124,
        thSarabunFont,
        14
      );
      drawTextOnPage(
        pages[i],
        orderDetail.medicine.description,
        93,
        height - 150,
        thSarabunFont,
        14
      );
    }

    // Save the modified PDF
    const pdfBytes = await pdfDoc.save();
    const outputPath = path.resolve(
      process.cwd(),
      "public/documents/completed/medlabel.pdf"
    );
    fs.writeFileSync(outputPath, pdfBytes);

    return new Response(
      JSON.stringify({
        message: "PDF generated successfully",
        path: "/documents/completed/medlabel.pdf",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to generate PDF",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
