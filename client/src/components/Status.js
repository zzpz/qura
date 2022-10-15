import React, {useState, useContext, useEffect} from "react";
import { AccountContext } from "./Account";

const Status = () => {

    const [status, setStatus] = useState(false);
    //pull in these vars?props?vals?functions? as context from Account Context
    const {getSession, logout} = useContext(AccountContext);  

    useEffect(() => {
        getSession().then(session =>{
                console.log("Session: ",session);
                setStatus(true);
            })
            .catch(err => {
                setStatus(false);
                console.log("no session");
            });
    },[status]);

    return(
        <div>{status ? <button onClick={logout}>Logout</button> : "login"} </div>
    ) 
    //default to logged out
    //TODO: need to ensure this is in cookies not local storage?... 

}

export default Status;