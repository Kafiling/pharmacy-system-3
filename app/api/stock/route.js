import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";

var fontkit = require("fontkit");

export async function POST(req) {
  try {
    const data = await req.json(); // Get the data from the request body
    console.log("LOK:", data);
    // Load the font
    const fontPath = path.resolve(process.cwd(), "public/THSarabunNew.ttf");
    if (!fs.existsSync(fontPath)) {
      throw new Error(`Font file not found at ${fontPath}`);
    }
    const fontBytes = fs.readFileSync(fontPath);

    // Load the existing PDF
    const pdfPath = path.resolve(
      process.cwd(),
      "public/documents/StockReport.pdf"
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

    drawTextOnPage(
      firstPage,
      new Date().toLocaleString(),
      380,
      height - 169,
      thSarabunFont,
      14
    );

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const yPosition = height - 260 - i * 30; // Adjust the y position for each item

      drawTextOnPage(
        firstPage,
        item.stock_id,
        60,
        yPosition,
        thSarabunFont,
        14
      );
      drawTextOnPage(
        firstPage,
        item.medicine.medicine_id,
        160,
        yPosition,
        thSarabunFont,
        14
      );
      drawTextOnPage(
        firstPage,
        item.medicine.medicine_name,
        240,
        yPosition,
        thSarabunFont,
        14
      );
      drawTextOnPage(
        firstPage,
        item.quantity_in_stock,
        380,
        yPosition,
        thSarabunFont,
        14
      );
      drawTextOnPage(
        firstPage,
        item.expiration_date,
        447,
        yPosition,
        thSarabunFont,
        14
      );
    }

    // Save the modified PDF
    const pdfBytes = await pdfDoc.save();
    const outputPath = path.resolve(
      process.cwd(),
      "public/documents/completed/stockreport.pdf"
    );
    fs.writeFileSync(outputPath, pdfBytes);

    return new Response(
      JSON.stringify({
        message: "PDF generated successfully",
        path: "public/documents/completed/stockreport.pdf",
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
