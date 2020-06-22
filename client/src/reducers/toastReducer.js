import {
    ADD_TOAST
} from "../actions/types";

const initialState = {
    message: "",
    type: ""
};

export default function(state = initialState, action) {
    switch (action.type) {
      case ADD_TOAST:
        return {
          ...state,
          message: action.payload.message,
          type: action.payload.type
        };
      default:
        return state;
    }
}