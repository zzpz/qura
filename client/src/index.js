import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';


import {
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";

//errors
import ErrorPage from "./error-page";

//routes
import Root from "./routes/root";

import Item from './routes/ItemRoute'; //a sub path of browse
import Browse from './routes/browse';
import Upload from './routes/upload';
import Signup from './routes/SignupRoute';
import Signin from './routes/SigninRoute';
import Settings from './routes/SettingsRoute';
import JWTRoute from './routes/JWTRoute';
import Image from './routes/ProtectBrowse';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<Root></Root>}
      errorElement={<ErrorPage />}
    >


      <Route path="Item" element={<Item />} />
      <Route path="browse" element={<Browse />} />
      <Route path="upload" element={<Upload />} />
      <Route path="signup" element={<Signup />} />
      <Route path="signin" element={<Signin />} />
      <Route path="settings" element={<Settings />} />
      <Route path="jwt" element={<JWTRoute />} />
      <Route path="protected" element={<Image />} />
      <Route path="*" element={<h2>This route does not exist</h2>} />

    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
