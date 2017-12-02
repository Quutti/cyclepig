import { combineReducers } from "redux";

import auth from "./auth";
import notifications from "./notifications";
import bikes from "./bikes";

export default combineReducers({
    auth,
    notifications,
    bikes,
});