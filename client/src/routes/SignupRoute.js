import SignupForm from "../components/SignupForm";
import { useEffect } from "react";

const Signup = () => {

  useEffect(() => {
    document.title = "QUR Association Inc"
  })

  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Signup Form</h2>
      <SignupForm />
    </main>
  );
}

export default Signup