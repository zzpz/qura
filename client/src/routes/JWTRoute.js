import JWTButton from "../components/JWTButton";

export default function JWTtest(){
    return(
        <main style={{ padding: "1rem 0" }}>
        <h2>Logged in users receive signed cookies to access Cloudfront Resources</h2>
        <JWTButton>Click Me</JWTButton>
      </main>
    );
}