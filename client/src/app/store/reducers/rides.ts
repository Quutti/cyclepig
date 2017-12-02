import * as objectAssign from 'object-assign';
import * as Redux from 'redux'

import {
    RidesState,
    RIDES_ADD,
    RIDES_FETCHING,
    RIDES_RECEIVED,
    RIDES_FAILURE
} from '../types';

const initialState: RidesState = {
    isFetching: false,
    items: []
};

const rides: Redux.Reducer<RidesState> = (state = initialState, action): RidesState => {

    switch (action.type) {

        case RIDES_FETCHING:
            return objectAssign({}, state, { isFetching: true });

        case RIDES_RECEIVED:
            return objectAssign({}, state, {
                items: action.items,
                isFetching: false
            });

        case RIDES_FAILURE:
            return initialState;

        default:
            return state;
    }
}

export default rides;