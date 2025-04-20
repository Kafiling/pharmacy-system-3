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
      "public/documents/PaymentReceipt.pdf"
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
      data.orderData.customers.firstname +
        " " +
        data.orderData.customers.lastname,
      400,
      height - 169,
      thSarabunFont,
      14
    );

    drawTextOnPage(
      firstPage,
      data.orderData.customer_id,
      415,
      height - 190,
      thSarabunFont,
      14
    );
    let total_price = 0;
    for (let i = 0; i < data.orderDetails.length; i++) {
      const orderDetail = data.orderDetails[i];
      const yPosition = height - 285 - i * 30; // Adjust the y position for each item
      total_price += orderDetail.medicine.price * orderDetail.quantity;
      drawTextOnPage(
        firstPage,
        orderDetail.medicine.medicine_name,
        60,
        yPosition,
        thSarabunFont,
        14
      );
      drawTextOnPage(
        firstPage,
        orderDetail.quantity,
        290,
        yPosition,
        thSarabunFont,
        14
      );
      drawTextOnPage(
        firstPage,
        orderDetail.medicine.price.toFixed(2),
        380,
        yPosition,
        thSarabunFont,
        14
      );
      drawTextOnPage(
        firstPage,
        (orderDetail.medicine.price * orderDetail.quantity).toFixed(2),
        465,
        yPosition,
        thSarabunFont,
        14
      );
    }

    drawTextOnPage(
      firstPage,
      total_price.toFixed(2) + " THB",
      430,
      height - 565,
      thSarabunFont,
      14
    );
    drawTextOnPage(firstPage, "0.00 THB", 430, height - 592, thSarabunFont, 14);
    drawTextOnPage(
      firstPage,
      total_price.toFixed(2) + " THB",
      430,
      height - 620,
      thSarabunFont,
      14
    );

    drawTextOnPage(
      firstPage,
      data.orderData.order_id,
      160,
      height - 680,
      thSarabunFont,
      14
    );

    // Save the modified PDF
    const pdfBytes = await pdfDoc.save();
    const outputPath = path.resolve(
      process.cwd(),
      "public/documents/completed/paymentreceipt.pdf"
    );
    fs.writeFileSync(outputPath, pdfBytes);

    return new Response(
      JSON.stringify({
        message: "PDF generated successfully",
        path: "public/documents/completed/paymentreceipt.pdf",
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
