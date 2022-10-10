import './App.css';
import { Outlet} from "react-router-dom";
import NavBar from './components/NavBar';
import { Account } from './components/Account';
import Status from './components/Status';



export default function App() {
  document.title = "QURA"
  return (   

    <div className="App" borderBottom="1px">
      <Account> 
      <Status/>
      <header className="App-header">
        <NavBar></NavBar>
      </header>
      <body>
      <Outlet />
      </body>
      </Account>

    </div>
  );
}

