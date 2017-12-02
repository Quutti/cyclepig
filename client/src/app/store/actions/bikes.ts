import axios from "axios";

import {
    Bike,
    BIKES_ADD,
    BIKES_FAILURE,
    BIKES_FETCHING,
    BIKES_RECEIVED
} from "../types";

export const bikesFetch = () => {
    return dispatch => {
        dispatch(fetching());
        axios.get("/api/v1/bikes")
            .then(res => dispatch(received(res.data.payload)))
            .catch(err => dispatch(failure(err)))
    }
}

const fetching = () => {
    return {
        type: BIKES_FETCHING
    }
}

const received = (items: Bike[]) => {
    return {
        type: BIKES_RECEIVED,
        items
    }
}

const failure = (error: any) => {
    console.error(error);
    return { type: BIKES_FAILURE }
}