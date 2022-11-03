import { combineReducers } from "redux";
import { UserReducer } from "./user/reducer";

const rootReducer = combineReducers({
  User: UserReducer,
});

export default rootReducer;
