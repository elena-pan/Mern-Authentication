import {
  ADD_TOAST
} from "./types";

export const addToast = (message, type) => {
    return {
        type: ADD_TOAST,
        payload: { message: message, type: type }
    }
};