import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { logoutUser } from "../../actions/authActions";

class Navbar extends Component {
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    loginLogoutLinks = () => {
        if (this.props.auth.isAuthenticated) {
            return (
                <>
                <li>
                <Link to="/account">
                    <i className="material-icons black-text">account_circle</i>
                </Link>
                </li>
                <li>
                    <Link to="#" className="blue-text" onClick={this.onLogoutClick}>Logout</Link>
                </li>
                </>
            )
        } 
        else {
            return (
                <>
                <li>
                    <Link to="/register" className="blue-text">Register</Link>
                </li>
                <li className="black-text">|</li>
                <li>
                    <Link to="/login" className="blue-text">Login</Link>
                </li>
                </>
            )
        }
    }

    render() {
        return (
            <div className="navbar-fixed">
            <nav className="z-depth-0">
                <div className="nav-wrapper white">
                <div className="container">
                <Link
                    to="/"
                    style={{
                    fontFamily: "monospace"
                    }}
                    className="col s5 brand-logo left black-text"
                >
                    <i className="material-icons">devices</i>
                    Mern Auth
                </Link>
                <ul className="right">
                        { this.loginLogoutLinks() }
                    </ul>
                </div>
                </div>
            </nav>
            </div>
        );
    }
}

Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Navbar);