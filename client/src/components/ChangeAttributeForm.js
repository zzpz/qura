import React, { useContext, useState } from "react";
import { AccountContext } from "./Account";
import { CognitoUserAttribute } from "amazon-cognito-identity-js"; //I don't want this import here

const ChangeAttributeForm = () => {


    //take all the form data and bundle it up to be sent to cognito

    const [given_name, setFirst] = useState("");
    const [family_name, setLast] = useState("");
    const {getUserSession} = useContext(AccountContext);

    const onSubmit = (event) => {
        event.preventDefault();

        const updatedAttr={};

        //this is bad. It's literally just for show. 
        // It should be some kind of formdata->dict->cognitoattrs[]
        updatedAttr["given_name"] = {"Name": "given_name", "Value":given_name};
        updatedAttr["family_name"] = {"Name": "family_name", "Value":family_name}; 

        
        const cognitoUA = Array.from(Object.values(updatedAttr),(attr)=>{
            return new CognitoUserAttribute(attr);
        });


        getUserSession().then((data) => 
            {
                console.log(data)
                data['user'].updateAttributes(cognitoUA,(err,result)=>
                {
                    if(err){
                    console.error(err);
                    }else{
                        console.log(result);
                    }
                })
            })
            .catch( err =>
            {console.error(err)})
    };

    return (
        <div>
            <br></br>
            <h3> This is separate form for changing your details.</h3>
            <h4> You can see it but it will not work if you are logged out.</h4>
            <form onSubmit={onSubmit}>
                <label>
                    First Name
                </label>
                <input value={given_name}
                onChange={(event) => setFirst(event.target.value)}
                />
                <label>
                    Last Name
                </label>
                <input value={family_name}
                onChange={(event) => setLast(event.target.value)}
                />

                <button type="submit">Update First + Last</button>


            </form>
        </div>
    )
}

export default ChangeAttributeForm;