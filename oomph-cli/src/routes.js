import React from "react"
import { Route, Switch } from "react-router-dom"
import FirstPage from "./FirstPage.js";
import App from "./App.js";
import { Navbar } from "./components/Navbar/Navbar.js";
//import Website from "/Users/samkofi/Desktop/ooomph/oomph-cli/src/oomphSite.js"
import Home from "./components/pages/Home.js";
import Safety from "./components/pages/Safety.js";
import Drive from "./components/pages/Drive.js";
import AboutUs from "./components/pages/AboutUs.js";
import WebNavbar from "./components/WebNavbar.js";
import { Navbar } from "./components/login/Navbar/Navbar.js";

const Routes = () => {
  return ( 
  <div>
      <Route exact path="/" component={Navbar} />
      <Route exact path="/" component={App} />
      <Route exact path="/FirstPage" component={FirstPage} />
      <Route exact path="/Website" component={WebNavbar} />
      <Route exact path="/Website" component={Home} />
      <Route exact path="/AboutUs" component={WebNavbar} />
      <Route exact path='/AboutUs' component={AboutUs} />
      <Route exact path="/Drive" component={WebNavbar} />
      <Route exact path='/Drive' component={Drive} />
      <Route exact path="/Safety" component={WebNavbar} />
      <Route exact path='/Safety' component={Safety} />
  </div>
  )
};


export default Routes