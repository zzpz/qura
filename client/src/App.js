import './App.css';
import { Outlet} from "react-router-dom";
import NavBar from './components/NavBar';
import { Account,AccountContext } from './components/Account';
import Status from './components/Status';


import { useOutletContext } from 'react-router-dom';


const App = () => {
  document.title = "QURA"
  return (   
    <div className="App" borderBottom="1px">

      <Account>
      <header className="App-header">

        <Status></Status>

        <NavBar>      
        </NavBar>
        </header>

      <Outlet/>
      </Account>

    </div>
  );
}

export default App