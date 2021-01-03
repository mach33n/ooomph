import React from "react"
import { Route, Switch } from "react-router-dom"
import FirstPage from "./FirstPage.js";
import App from "./App.js";
import { Navbar } from "/Users/samkofi/Desktop/ooomph/oomph-cli/src/components/login/Navbar/Navbar.js";

const Routes = () => {
  return ( 
  <div>
      <Route exact path="/" component={Navbar} />
      <Route exact path="/" component={App} />
      <Route exact path="/FirstPage" component={FirstPage} />
  </div>
  )
};


export default Routes