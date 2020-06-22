import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import toastReducer from "./toastReducer";
import passwordTokenReducer from "./passwordTokenReducer";

export default combineReducers({
    auth: authReducer,
    errors: errorReducer,
    toasts: toastReducer,
    passwordToken: passwordTokenReducer
});