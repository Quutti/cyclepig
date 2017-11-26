import * as objectAssign from 'object-assign';
import * as Redux from 'redux'

import {
    NotificationsState,
    NOTIFICATIONS_ADD,
    NOTIFICATIONS_REMOVE,
    Notification
} from '../types';

const initialState: NotificationsState = {
    items: []
};

const notifications: Redux.Reducer<NotificationsState> = (state = initialState, action): NotificationsState => {

    switch (action.type) {

        case NOTIFICATIONS_ADD: {
            return objectAssign({}, state, {
                items: [...state.items, action.notification]
            });
        }

        case NOTIFICATIONS_REMOVE: {
            const index = state.items.map((n) => n.id).indexOf(action.notificationId);
            const items = [...state.items];

            items.splice(index, 1);

        return objectAssign({}, state, { items });
        }

        default:
            return state;
    }
}

export default notifications;