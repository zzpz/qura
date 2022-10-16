import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AccountContext } from "./Account";

const Status = () => {

    const [status, setStatus] = useState(false);
    //pull in these (functions) as context from Account Context
    const { getSession, logout } = useContext(AccountContext);

    useEffect(() => {
        getSession().then(session => {
            console.log("Session: ", session);
            setStatus(true);
        })
            .catch(err => {
                setStatus(false);
                console.log("no session");
            });
    }, [status]);

    return (
        <div>{status ? <button onClick={logout}>Logout</button> : <Link to="/signin"><button>Login</button></Link>} </div>
    )
    //default to logged out
    //TODO: need to ensure this is in cookies not local storage?... 
}

export default Status;