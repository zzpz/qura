import { Account } from "../components/Account";
import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";

// our root route
export default function Root() {

    useEffect(() => {
        document.title = "QUR Association Inc"
    })

    return (

        <>
            {/* Exposes Account Context to sub components (outlet)*/}
            <Account>
                <div id="sidebar">
                    <NavBar />
                </div>

                <div id="detail">
                    <Outlet />
                </div>
            </Account>
        </>
    );
}
