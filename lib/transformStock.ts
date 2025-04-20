import { Medicine } from "@/lib/data";

export function transformStockData(stockData: any[]): Medicine[] {
  return stockData.map((item) => ({
    id: item.medicine?.medicine_id || "Unknown ID",
    name: item.medicine?.medicine_name || "Unknown Medicine",
    category: item.medicine?.categories?.category_name || "Uncategorized",
    stock: item.quantity_in_stock,
    price: item.medicine?.price || 0,
    expiryDate: item.expiration_date,
    supplier: item.supplier?.supplier_name || "Unknown Supplier",
    reorderLevel: 10, 
    description: "" 
  }));
}