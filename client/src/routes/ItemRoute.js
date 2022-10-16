import ItemCard from "../components/ItemCard";
import { Item as Itemm } from "../components/Item";

export default function Item() {
  const fileURL = "01GCR45CG2SRR6NNGQ887AMEMY"
  const props = { fileURL }
  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>An item is displayed within a card with details</h2>
      <ItemCard {...props}></ItemCard>
      <Itemm></Itemm>
    </main>
  );
}