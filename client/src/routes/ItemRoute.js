import ItemCard from "../components/ItemCard";
import { Item as Itemm } from "../components/Item";
import { useEffect } from "react";

export default function Item() {
  const fileURL = "01GCR45CG2SRR6NNGQ887AMEMY"
  const props = { fileURL }


  useEffect(() => {
    document.title = "Item"
  })


  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>An item is displayed within a card with details</h2>
      <ItemCard {...props}></ItemCard>
      <br></br>
      <h2>A previous iteration:</h2>
      <Itemm></Itemm>
    </main>
  );
}