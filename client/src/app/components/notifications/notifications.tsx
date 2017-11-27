import * as React from "react";
import * as Redux from "redux";
import { connect } from "react-redux";

import { RootState, Notification } from "../../store/types";
import { removeNotification } from "../../store/actions/notifications";

import { NotificationItem } from "./notification-item";

const styles: any = require("./notifications.css");

interface NotificationsStoreProps {
    dispatch?: Redux.Dispatch<RootState>;
    notifications: Notification[];
}

const mapStateToProps = (state: RootState): NotificationsStoreProps => {
    return {
        notifications: state.notifications.items
    }
}

const NOTIFICATION_TOP_BASE = 20;
const NOTIFICATION_SPACE = 20;

class NotificationsImpl extends React.Component<NotificationsStoreProps, {}> {

    private _refs: { [key: string]: HTMLDivElement } = {};

    constructor(props) {
        super(props);

        this._handleNotificationClose = this._handleNotificationClose.bind(this);
    }

    public render(): JSX.Element {

        const notifications = this.props.notifications.map(notification => {

            // Count top value for the notification based on
            // the sum height of already visible components
            let top = NOTIFICATION_TOP_BASE;
            for (let key of Object.keys(this._refs)) {
                if (key === notification.id) {
                    break;
                }

                const ref = this._refs[key];
                if (ref) {
                    top += ref.clientHeight + NOTIFICATION_SPACE;
                }
            }

            return (
                <NotificationItem
                    notificationItemRef={(ref) => { this._refs[notification.id] = ref }}
                    key={notification.id}
                    top={top}
                    notification={notification}
                    onCloseRequest={this._handleNotificationClose}
                />
            );
        });

        return (
            <div className={styles.root}>
                {notifications}
            </div>
        )
    }

    private _handleNotificationClose(notificationId: string) {
        delete this._refs[notificationId];
        this.props.dispatch(removeNotification(notificationId));
    }

}

export const Notifications = connect<NotificationsStoreProps, any, any>(mapStateToProps)(NotificationsImpl);