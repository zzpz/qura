import JWTButton from "../components/JWTButton";

export default function JWTtest(){
    return(
        <main style={{ padding: "1rem 0" }}>
        <h2>This is to test posting JWT tokens in the header on submit.</h2>
        <JWTButton>Click Me</JWTButton>
      </main>
    );
}