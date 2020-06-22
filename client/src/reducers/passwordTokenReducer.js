import {
    PASSWORD_TOKEN_VALID,
    PASSWORD_TOKEN_LOADING
} from "../actions/types";

const initialState = {
    loading: false,
    valid: false
};

export default function(state = initialState, action) {
    switch (action.type) {
      case PASSWORD_TOKEN_VALID:
        return {
          ...state,
          loading: false,
          valid: true
        };
      case PASSWORD_TOKEN_LOADING:
        return {
          ...state,
          loading: true
        };
      default:
        return state;
    }
}