import { combineReducers } from "redux";
import userReducer from "./reducers/users";
import customerReducer from "./reducers/customers";

const allReducers = combineReducers({
    users : userReducer,
    customers : customerReducer,
});

export default allReducers;