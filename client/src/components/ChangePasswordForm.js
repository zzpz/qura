import React, { useContext, useState } from "react";
import { AccountContext } from "./Account";

const ChangePasswordForm = () => {


    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const {getUserSession} = useContext(AccountContext);

    const onSubmit = (event) => {
        event.preventDefault();

        getUserSession().then(({user}) =>
        {
            user.changePassword(password,newPassword,(err,result)=>{
                if(err){
                    console.error(err);
                }else{
                    console.log(result);
                }
            })
        })
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <label>
                    Password
                </label>
                <input value={password}
                onChange={(event) => setPassword(event.target.value)}
                />
                <label>
                    New Password
                </label>
                <input value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                />

                <button type="submit">Update password</button>


            </form>
        </div>
    )
}

export default ChangePasswordForm;