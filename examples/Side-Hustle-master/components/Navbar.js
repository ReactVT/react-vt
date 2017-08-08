import React, { Component } from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router-dom';


class Navbar extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
        <div className="navbar">
            <button><Link to={{pathname: "/SignUp"}}>Sign Up</Link></button>
            <button><Link to={{pathname: "/LogIn"}}>Log In</Link></button>
            <button><Link to={{pathname: "/PostJob"}}>Post Job</Link></button>
            <button><Link to={{pathname: "/ViewJob"}}>View Job</Link></button>
        </div>
        )
    }
}

export default Navbar;