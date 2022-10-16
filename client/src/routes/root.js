import { Account } from "../components/Account";
import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";

// our root route
export default function Root() {
    document.title = "QUR Association"
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
