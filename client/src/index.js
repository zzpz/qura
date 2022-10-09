import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Item from './routes/ItemRoute'; //a sub path of browse
import Browse from './routes/BrowseRoute';
import Upload from './routes/UploadRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>}>
      <Route path="item" element={<Item/>} />
        <Route path="browse" element={<Browse/>} />      
        <Route path="upload" element={<Upload/>} />
        <Route path="*" element={<h2>not found</h2>} />
      </Route>
    </Routes>
    </BrowserRouter>
</React.StrictMode>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
