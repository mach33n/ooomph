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


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
