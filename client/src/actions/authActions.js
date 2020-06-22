import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { addToast } from "./toastActions";
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING,
  PASSWORD_TOKEN_LOADING,
  PASSWORD_TOKEN_VALID
} from "./types";

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios.post("/api/users/register", userData)
    .then(res => history.push("/register/verify-link-sent")) // re-direct 
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - get user token
export const loginUser = userData => dispatch => {
  axios.post("/api/users/login", userData)
    .then(res => {
        // Save to localStorage

        // Set token to localStorage
        const { token } = res.data;
        localStorage.setItem("jwtToken", token);

        // Set token to Auth header
        setAuthToken(token);

        // Decode token to get user data
        const decoded = jwt_decode(token);

        // Set current user
        dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })}
    );
};

export const verifyUser = (token, history) => dispatch => {
  axios.get(`/api/users/verify/${token}`)
    .then(res => history.replace("/login")) // re-direct to login on successful verification
    .then(() => dispatch(addToast("Account verified!", "success")))
    .catch(err => {
      if (err.response.data.alreadyverified) { // If already verified direct to login
        history.replace("/login");
        dispatch(addToast("Your account has already been verified", "warning"));
      }
      else {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      }
    })
}

export const resendLink = (email, history) => dispatch => {
  axios.post('/api/users/resend-token', { email: email })
    .then(res => history.replace("/register/verify-link-sent")) // re-direct
    .then(() => dispatch(addToast("Email sent!", "success")))
    .catch(err => {
      if (err.response.data.alreadyverified) { // If already verified direct to login
        history.replace("/login");
        dispatch(addToast("Your account has already been verified", "warning"));
      }
      else {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      }
    })
}

export const sendPasswordResetLink = (email, history) => dispatch => {
  axios.post('/api/users/password-reset-token', { email: email })
    .then(res => history.replace("/login/password-reset-link-sent")) // re-direct
    .catch(err => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
    })
}

export const setPasswordTokenLoading = () => {
  return {
    type: PASSWORD_TOKEN_LOADING
  };
}

export const checkPasswordToken = (token) => dispatch => {
  dispatch(setPasswordTokenLoading());
  axios.get(`/api/users/reset-password/${token}`)
    .then(res => {
      dispatch({
        type: PASSWORD_TOKEN_VALID
      })
    })
    .catch(err => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
  })
}

export const resetPassword = (token, userData, history) => dispatch => {
  axios.post(`/api/users/reset-password/${token}`, userData)
    .then(res => history.replace("/login")) // redirect to login
    .then(() => dispatch(addToast("Password changed", "success")))
    .catch(err => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
    })
}

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");

  // Remove auth header for future requests
  setAuthToken(false);
  
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

export const updateUser = (userData) => dispatch => {
  axios.post("/api/users/update-info", userData)
    .then(res => {
      // Save to localStorage

      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);

      // Set token to Auth header
      setAuthToken(token);

      // Decode token to get user data
      const decoded = jwt_decode(token);

      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .then(() => dispatch(addToast("Account updated!", "success")))
    .catch(err => console.log(err));
}

export const deleteUser = history => dispatch => {
  axios.delete("/api/users/user")
    .then(() => dispatch(logoutUser()))
    .then(() => history.replace("/"))
    .then(() => dispatch(addToast("Account deleted", "error")))
    .catch(err => console.log(err))
}