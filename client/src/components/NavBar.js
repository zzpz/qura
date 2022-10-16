
import { Link } from "react-router-dom";
import React from "react";

export default function NavBar() {
    return (
        <nav className="NavBar"
            style={{
            }}
        >
            <h1>Queensland University Regiment Association Inc</h1>

            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/item">Item</Link></li>
                <li><Link to="/browse">Browse</Link></li>
                <li><Link to="/upload">Upload</Link></li>
                <li><Link to="/search">Search</Link></li>
                <li><Link to="/signup">Sign Up</Link></li>
                <li><Link to="/signin">Sign In</Link></li>
                <li><Link to="/settings">Settings</Link></li>
                <li><Link to="/jwt">JWT test</Link></li>
                <li><Link to="/protected">Protected Image</Link></li>
            </ul>
        </nav>
    );
}