import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import Toasts from "./components/layout/Toasts";
import Landing from "./components/layout/Landing";
import NotFound from "./components/layout/NotFound";
import Register from "./components/auth/Register";
import VerifyLinkSent from "./components/auth/VerifyLinkSent";
import VerifyAccount from "./components/auth/VerifyAccount";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import PasswordResetLinkSent from "./components/auth/PasswordResetLinkSent";
import ResetPassword from "./components/auth/ResetPassword";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import Account from "./components/auth/Account";

import { Provider } from "react-redux";
import store from "./store";
import Navbar from "./components/layout/Navbar";

// Check for token to keep user logged in
if (localStorage.jwtToken) {

    // Set auth token header auth
    const token = localStorage.jwtToken;
    setAuthToken(token);

    // Decode token and get user info and exp
    const decoded = jwt_decode(token);

    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));

    // Check for expired token
    const currentTime = Date.now() / 1000; // to get in milliseconds
    if (decoded.exp < currentTime) {
      // Logout user
      store.dispatch(logoutUser());
      // Redirect to login
      window.location.href = "./login";
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Toasts />
          <Switch>
            <Route exact path="/" component={Landing} />           
            <Route exact path="/register" component={Register} />
            <Route exact path="/register/verify-link-sent" component={VerifyLinkSent} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/login/forgot-password" component={ForgotPassword} />
            <Route exact path="/login/password-reset-link-sent" component={PasswordResetLinkSent} />
            <Route exact path="/password-reset/:token" component={ResetPassword} />
            <Route exact path="/verify/:token" component={VerifyAccount} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/account" component={Account} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
