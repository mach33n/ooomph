import React from "react"
import { Route, Switch } from "react-router-dom"
import FirstPage from "./FirstPage.js";
import App from "./App.js";
import { Navbar } from "./components/login/Navbar/Navbar.js";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const promise = loadStripe("pk_test_51I1mxPFIfZqwb5IQ1zKKUk1xgjrsHoea9IqPF9FgV8zpHv4TnY6n8Ja4d8etExvAdu9PV76PRJhlOegWsxSJVJCL00OIi0pL14");

const Routes = () => {
  return ( 
  <Elements stripe={promise}>
    <div>
        <Route exact path="/" component={Navbar} />
        <Route exact path="/" component={App} />
        <Route exact path="/login" component={FirstPage} />
        <Route exact path="/stripe" component={CheckoutForm} />
    </div>
  </Elements>
  )
};


export default Routes