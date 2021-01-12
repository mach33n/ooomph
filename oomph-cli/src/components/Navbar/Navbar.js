import React, { Component } from 'react';
import { MenuItems } from "./MenuItems"
import { Button } from "../Button"
import './Navbar.css'
import FirstPage from "../../../FirstPage.js";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

export class Navbar extends Component {
    state = { clicked: false }

    handleClick = () => {
        this.setState({ clicked: !this.state.clicked })
    }
    render() {
        return(
            <nav className="NavbarItems">
                <h1 className="navbar-logo">OOMPH<i className="fab fa-react"></i></h1>
                <div className="menu-icon" onClick={this.handleClick}>
                    <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>
                <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
                    {MenuItems.map((item, index) => {
                        return (
                            <li key={index}>
                                <a className={item.cName} href='/Website'>
                                {item.title}
                                </a>
                            </li>
                        )
                    })}
                </ul>
                <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu2'}>
                    <a className="nav-links" href="/FirstPage">Log in</a>
                </ul>
            </nav>
        )
    }
}

export default Navbar