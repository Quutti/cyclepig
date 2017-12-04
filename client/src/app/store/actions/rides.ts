import axios from "axios";

import {
    Ride,
    RIDES_ADD,
    RIDES_FETCHING,
    RIDES_RECEIVED,
    RIDES_RECEIVED_ONE,
    RIDES_FAILURE
} from "../types";

import { addNotification } from "./notifications";

export const fetchRides = () => {
    return dispatch => {
        dispatch(fetching());
        axios.get("/api/v1/rides")
            .then(res => dispatch(received(res.data.payload)))
            .catch(err => dispatch(failure(err)))
    }
}

export const addRide = (ride: Ride) => {
    return dispatch => {
        axios.post("/api/v1/rides", ride)
            .then(res => {
                dispatch(receivedOne(res.data.payload));
                dispatch(addNotification({ title: "Saved" }));
            })
            .catch(err => dispatch(failure(err)));
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

const receivedOne = (item: Ride) => {
    return {
        type: RIDES_RECEIVED_ONE,
        item
    }
}

const failure = (error: any) => {
    console.error(error);
    return { type: RIDES_FAILURE }
}