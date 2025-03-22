import { combineReducers } from "redux";
import userReducer from "./reducers/users";


const allReducers = combineReducers({
    users : userReducer,
});

export default allReducers;