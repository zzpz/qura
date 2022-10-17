import JWTButton from "../components/JWTButton";
import { useEffect } from "react";
export default function JWTtest() {
  useEffect(() => {
    document.title = "QUR Association Inc"
  })
  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Logged in users receive signed cookies to access Cloudfront Resources</h2>
      <JWTButton>Click Me</JWTButton>
    </main>
  );
}