import React, {useState, useContext, useEffect} from "react";
import { AccountContext } from "./Account";

const Status = () => {

    const [status, setStatus] = useState(false);
    const {getSession} = useContext(AccountContext); 

    useEffect(() => {
        getSession().then(session=>{
                console.log("Session: ",session);
                setStatus(true);
            });
    });

    return <div>{status ? "logged in" : "logged out"} </div>;
    //default to logged out
    //TODO: need to ensure this is in cookies not local storage?... 

}

export default Status;