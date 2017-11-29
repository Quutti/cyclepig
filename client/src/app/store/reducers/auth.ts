import * as objectAssign from 'object-assign';
import * as Redux from 'redux'

import {
    AuthState,
    AUTH_IN_PROGRESS,
    AUTH_SIGNED_IN,
    AUTH_SIGNED_OUT,
    AUTH_FETCHING,
    AUTH_FAILURE
} from '../types';

const initialState: AuthState = {
    inProgress: false,
    isFetching: false,
    user: null
};

const auth: Redux.Reducer<AuthState> = (state = initialState, action): AuthState => {

    switch (action.type) {

        case AUTH_FETCHING:
            return objectAssign({}, state, { isFetching: true });

        case AUTH_IN_PROGRESS:
            return objectAssign({}, state, { inProgress: true });

        case AUTH_SIGNED_IN: {
            return objectAssign({}, state, {
                isFetching: false,
                inProgress: false,
                user: action.user
            });
        }

        case AUTH_SIGNED_OUT:
        case AUTH_FAILURE:
            return initialState;

        default:
            return state;
    }
}

export default auth;