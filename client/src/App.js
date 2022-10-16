import './App.css';
import { Outlet } from "react-router-dom";
import { useOutletContext } from 'react-router-dom';


const App = () => {
  document.title = "QURA"
  return (
    <div className="App">
      <Outlet />
    </div>
  );
}

export default App