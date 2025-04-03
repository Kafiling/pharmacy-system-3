import { getAllStock } from "@/actions/stock";

export default function page() {
  const stock = getAllStock();
  return <p>{stock}</p>;
}
