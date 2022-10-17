import React, { useState, useContext } from "react";
import { AccountContext } from "./Account";
import { TextField } from "@mui/material";

const SigninForm = () => {

    const defaultValues = {
        email: "",
        password: ""
    };

    const [formValues, setFormValues] = useState(defaultValues)
    const { authenticate } = useContext(AccountContext);




    const onSubmit = (event) => {
        event.preventDefault();
        authenticate(formValues.email, formValues.password)
            .then(data => {
                console.log("Signed in!");
            })
            .catch(err => {
                console.error("Failed to login")
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    return (
        <main style={{ padding: "1rem 0" }}>
            <form onSubmit={onSubmit}>
                <TextField
                    InputLabelProps={{ shrink: true }}
                    id="email-input"
                    name="email"
                    label="Email"
                    type="text"
                    placeholder="a@a.com"
                    value={formValues.email}
                    onChange={handleInputChange}
                />
                <TextField
                    InputLabelProps={{ shrink: true }}
                    id="password-input"
                    name="password"
                    label="Password"
                    type="text"
                    placeholder="Password1!"
                    value={formValues.password}
                    onChange={handleInputChange}
                />
                <br></br>
                <br></br>
                <button type="submit">SignIn</button>
            </form>
        </main >
    )
}

export default SigninForm;