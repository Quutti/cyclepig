import axios, { AxiosError } from "axios";
import * as Redux from "redux";

import {
    User,
    AUTH_IN_PROGRESS,
    AUTH_SIGNED_IN,
    AUTH_SIGNED_OUT,
    AUTH_FETCHING,
    AUTH_FAILURE,
    RootState
} from '../types';

import * as utils from "../utils";
import { addNotification } from "./notifications";

export const authSignIn = (username: string, password: string) => {
    return dispatch => {
        dispatch(inProgress());
        axios.post("/api/v1/auth", { login: username, password })
            .then(res => dispatch(setUser(res.data.payload)))
            .catch(err => dispatch(failure(handleSignInError(err, dispatch))));
    }
}

export const authSignOut = () => {
    return dispatch => {
        dispatch(inProgress());
        axios.delete("/api/v1/auth")
            .then(res => dispatch(signOut()))
            .catch(err => dispatch(failure(err)));
    }
}

export const authGetUser = () => {
    return dispatch => {
        dispatch(isFetching());
        axios.get("/api/v1/users/me")
            .then(res => dispatch(setUser(res.data.payload)))
            .catch(err => dispatch(failure(err)));
    }
}

const setUser = (user: User) => {
    return { type: AUTH_SIGNED_IN, user };
}

const signOut = () => {
    return { type: AUTH_SIGNED_OUT };
}

const isFetching = () => {
    return { type: AUTH_FETCHING };
}

const inProgress = () => {
    return { type: AUTH_IN_PROGRESS };
}

const failure = (error: any) => {
    console.error(error);
    return { type: AUTH_FAILURE }
}

const handleSignInError = (err: AxiosError, dispatch: Redux.Dispatch<RootState>): { [key: string]: any } => {
    if (err.response && err.response.status === 401) {
        dispatch(addNotification({
            title: "Sign in failed",
            message: "Username or password invalid",
            type: "error"
        }));
    }

    return err;
}