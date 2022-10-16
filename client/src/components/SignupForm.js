import React, { useState } from "react";
import { UserPool, CognitoUserAttribute, CognitoUser } from "../util/Cognito";




//so much material ui

import { TextField } from "@mui/material";


// import FormLabel from "@material-ui/core/FormLabel";




const SignupForm = () => {

    const defaultValues = {
        given_name: "",
        family_name: "",
        email: "",
        password: ""
    };

    const [formValues, setFormValues] = useState(defaultValues)


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };




    const onSubmit = (event) => {
        event.preventDefault();

        let attributeList = [];

        //now we can map this

        var data = {
            Email: {
                Name: 'email',
                Value: formValues.email
            },
            FirstName: {
                Name: "given_name",
                Value: formValues.given_name
            },
            LastName: {
                Name: "family_name",
                Value: formValues.family_name
            }
        };

        for (const attr in data) {
            attributeList.push(new CognitoUserAttribute(data[attr])) // this is just exploding a list into attribute objects
        }

        //username, password, attributeList[],validation is null
        //attribute list if we have additional attributes to write (like phone number,etc)

        UserPool.signUp(formValues.email, formValues.password, attributeList, null, (err, result) => {
            if (err) {
                alert(err.message || JSON.stringify(err));
                return;
            }
            var cognitoUser = result.user; //user:CognitoUser
            console.log('user name is ' + cognitoUser.getUsername());
        });
    };

    return (
        <main style={{ padding: "1rem 0" }}>
            <form onSubmit={onSubmit}>
                <TextField
                    InputLabelProps={{ shrink: true }}
                    id="name-input"
                    name="given_name"
                    label="First"
                    type="text"
                    placeholder="Your first name"
                    value={formValues.given_name}
                    onChange={handleInputChange}
                />
                <TextField
                    InputLabelProps={{ shrink: true }}
                    id="family-name-input"
                    name="family_name"
                    label="Last"
                    type="text"
                    placeholder="Your last name"
                    value={formValues.family_name}
                    onChange={handleInputChange}
                />
                <br></br>
                <br></br>
                <br></br>
                <br></br>

                <TextField
                    InputLabelProps={{ shrink: true }}
                    id="email-input"
                    name="email"
                    label="Email"
                    type="text"
                    placeholder="Your first name"
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
                <button type="submit">Signup</button>
            </form>
        </main >
    )
}

export default SignupForm;