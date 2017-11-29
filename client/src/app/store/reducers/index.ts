import { combineReducers } from "redux";

import auth from "./auth";
import notifications from "./notifications";

export default combineReducers({
    auth,
    notifications
});