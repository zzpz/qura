import './App.css';
import { Link, Outlet} from "react-router-dom";
import NavBar from './components/NavBar';



export default function App() {
  document.title = "QURA"
  return (   
    <div className="App" borderBottom="1px">
      <header className="App-header">
        <NavBar></NavBar>
      </header>
      <body>
      <Outlet />
      </body>
    </div>
  );
}

