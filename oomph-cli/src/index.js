import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Routes from "./routes";
import { BrowserRouter } from "react-router-dom"
import reportWebVitals from './reportWebVitals';
import history from "./utils/history";
import App from "./App.js";

// ReactDOM.render(
//   <React.StrictMode>
//     <FirstPage />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

ReactDOM.render(
  <BrowserRouter history={history}>
    <Routes />
  </BrowserRouter>,
  document.getElementById('root')
);

reportWebVitals();
