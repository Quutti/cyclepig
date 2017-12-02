import * as objectAssign from 'object-assign';
import * as Redux from 'redux'

import {
    BikesState,
    BIKES_ADD,
    BIKES_FETCHING,
    BIKES_RECEIVED,
    BIKES_FAILURE
} from '../types';

const initialState: BikesState = {
    isFetching: false,
    items: []
};

const bikes: Redux.Reducer<BikesState> = (state = initialState, action): BikesState => {

    switch (action.type) {

        case BIKES_FETCHING:
            return objectAssign({}, state, { isFetching: true });

        case BIKES_RECEIVED:
            return objectAssign({}, state, {
                items: action.items,
                isFetching: false
            });

        case BIKES_FAILURE:
            return initialState;

        default:
            return state;
    }
}

export default bikes;