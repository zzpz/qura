import React, { useState, useContext } from "react";
import { AccountContext } from "./Account";

const SigninForm = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { authenticate } = useContext(AccountContext);




    const onSubmit = (event) => {
        event.preventDefault();
        authenticate(email, password)
            .then(data => {
                console.log("Signed in!");
            })
            .catch(err => {
                console.error("Failed to login")
            });
    };

    return (
        <main style={{ padding: "1rem 0" }}>
            <div>
                <form onSubmit={onSubmit}>
                    <label htmlFor="email">Email</label>
                    <input
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    ></input>
                    <label htmlFor="password">Password</label>
                    <input
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    ></input>
                    <button type="submit">Log In</button>
                </form>
            </div>
        </main>
    )
}

export default SigninForm;