import React, {useEffect,useContext, useState} from "react";
import { AccountContext } from "./Account";
import ChangePasswordForm from "./ChangePasswordForm";

const Settings = () => {

    const { getSession } = useContext(AccountContext);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        getSession().then(()=>{
            setLoggedIn(true);
        })
        .catch( err =>{
            console.error("not logged in");
        });

    },[]);


    function display(){
        let settingsDiv;
        if(loggedIn){
            settingsDiv = <div><h2>You are logged in to see this</h2><h3>Change Password</h3><ChangePasswordForm/></div>
        }else{
            settingsDiv = <div><h2>Log in to see a password form</h2></div>
        } 
        return settingsDiv
    }
    return (
        display()
    );
};

export default Settings;