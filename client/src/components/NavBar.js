import { Link} from "react-router-dom";

export default function NavBar(){
    return(
        <nav className="NavBar"
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "10px",
        }}
        >
            "NavBar"
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/item">Item</Link></li>
                <li><Link to="/browse">Browse</Link></li>
                <li><Link to="/upload">Upload</Link></li>
                <li><Link to="/search">Search</Link></li>
            </ul>
        </nav>
    );
}