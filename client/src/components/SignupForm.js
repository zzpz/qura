import React, {useState} from "react";
import {UserPool,CognitoUserAttribute,CognitoUser} from "../util/Cognito";

const SignupForm = () => {

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [family_name,setFamilyName] = useState("");
    const [given_name,setGivenName] = useState("");


    const onSubmit = (event) => {
        event.preventDefault();
        // console.log({email,password});

        var attributeList = [];

        var data = {
            Email:{
            Name: 'email',
            Value: email
            },
            FirstName:{
                Name:"given_name",
                Value:given_name
            },
            LastName:{
                Name:"family_name",
                Value:family_name
            }
        };
        console.log(data);

        for(const attr in data){
            attributeList.push(new CognitoUserAttribute(data[attr])) // this is just exploding a list into attribute objects
        }

        console.log(attributeList);

        //username, password, attributeList[],validation
        //attribute list if we have additional attributes to write (like phone number,etc)

        UserPool.signUp(email,password, attributeList,null,(err,result)=>{
            if (err) {
                alert(err.message || JSON.stringify(err));
                return;
            }
            console.log(result);
            var cognitoUser = result.user;
	        console.log('user name is ' + cognitoUser.getUsername());
        });
    };

    return (
        <main style={{padding:"1rem 0"}}>
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
                <label htmlFor="Given Name">Given Name</label>
                <input
                    value={given_name}
                    onChange={(event) => setGivenName(event.target.value)}
                ></input>
                <label htmlFor="Family Name">Family Name</label>
                <input
                    value={family_name}
                    onChange={(event) => setFamilyName(event.target.value)}
                ></input>


            <button type="submit">Signup</button>
            </form>
        </div>
        </main>
    )
}

export default SignupForm;