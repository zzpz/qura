import React, {useState, useContext} from "react";
import { AccountContext } from "./Account";

const SigninForm = () => {

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const {authenticate} = useContext(AccountContext);
    



    const onSubmit = (event) => {
        event.preventDefault();
        authenticate(email,password)
            .then(data => {
                console.log("ID token should be sent with every request?",data);
            })
            .catch(err => {
                console.error("Failed to login",err)
            })

        // event.preventDefault();

        // //ICognitoUserData
        // var cognitoUserData = {
        //     Username: email,
        //     Pool: UserPool,
        // }

        // //IAuthenticationDetailsData
        // var authDetailsData= {
        //     Username: email,
        //     Password: password,
        // }

        // const user = new CognitoUser(cognitoUserData);

        // const authDetails = new AuthenticationDetails(authDetailsData);

        // user.authenticateUser(authDetails,{
        //     //callbacks
        //     onSuccess: (data) => {
        //         console.log("onSuccess: ", data);
        //     },
        //     onFailure: (err)=> {
        //         console.error("onFailure: ",err);
        //     },
        //     newPasswordRequired: (data) => {
        //         console.log("newPasswordRequired: ", data);
        //     },

        // })

        //we should get a user or an error
        
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
            <button type="submit">Log In</button>
            </form>
        </div>
        </main>
    )
}

export default SigninForm;