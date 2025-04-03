import { getAllStock } from "@/actions/stock";

export default async function page() {
  const stock = (await getAllStock()) || [];
  return (
    <>
      <div>
        {stock.map((item: any) => (
          <div key={item.stock_id}>
            <h2>{item.name}</h2>
            <p>medicine_id : {item.medicine_id}</p>
            <p>supplier_id : {item.supplier_id}</p>
          </div>
        ))}
      </div>
    </>
  );
}
