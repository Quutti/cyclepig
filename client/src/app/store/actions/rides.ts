import axios from "axios";

import {
    Ride,
    RIDES_ADD,
    RIDES_FETCHING,
    RIDES_RECEIVED,
    RIDES_FAILURE
} from "../types";

export const ridesFetch = () => {
    return dispatch => {
        dispatch(fetching());
        axios.get("/api/v1/rides")
            .then(res => dispatch(received(res.data.payload)))
            .catch(err => dispatch(failure(err)))
    }
}

const fetching = () => {
    return {
        type: RIDES_FETCHING
    }
}

const received = (items: Ride[]) => {
    return {
        type: RIDES_RECEIVED,
        items
    }
}

const failure = (error: any) => {
    console.error(error);
    return { type: RIDES_FAILURE }
}