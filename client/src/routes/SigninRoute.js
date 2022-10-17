import SigninForm from "../components/SignInForm";
import { useEffect } from "react";

export default function Signin() {

  useEffect(() => {
    document.title = "QUR Association Inc"
  })
  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Sign in (form)</h2>
      <SigninForm />
    </main>
  );
}