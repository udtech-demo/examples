import { Reducer } from "redux";
import ActionTypes, { TUserState } from "./types";

export const initialState: TUserState = {
  data: null,
  isLoggedIn: false,
  loading: false,
  errors: undefined,
};

const reducer: Reducer<TUserState> = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_S:
      return {
        ...state,
        loading: false,
        data: action.payload,
        errors: undefined,
        isLoggedIn: true,
      };

    default:
      return state;
  }
};

export { reducer as UserReducer };
