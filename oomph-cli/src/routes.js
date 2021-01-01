import React from "react"
import { Route, Switch } from "react-router-dom"
import FirstPage from "./FirstPage.js";
import App from "./App.js";

const Routes = () => {
  return ( 
  <div>
      <Route exact path="/" component={App} />
      <Route exact path="/map" component={App} />
      <Route component={FirstPage} />

  </div>
  )
};

export default Routes