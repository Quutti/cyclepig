import * as React from "react";
import * as classNames from "classnames";

import { Notification } from "../../store/types";

const styles: any = require("./notification-item.css");

export type NotificationCloseRequestHandler = (notificationId: string) => void;

interface OwnProps {
    notification: Notification;
    top: number;
    notificationItemRef: (ref: HTMLDivElement) => void;
    onCloseRequest: NotificationCloseRequestHandler;
}

interface OwnState {
    inited: boolean;
    closing: boolean;
}

export class NotificationItem extends React.Component<OwnProps, OwnState> {

    constructor(props) {
        super(props);

        this.state = {
            inited: false,
            closing: false
        }

        this._handleTransitionEnd = this._handleTransitionEnd.bind(this);
    }

    public render(): JSX.Element {
        const { notification, top } = this.props;
        const { inited, closing } = this.state;

        const type = notification.type || "success";

        const wrapperClasses = classNames({
            [styles.wrapper]: true,
            [styles.success]: type === "success",
            [styles.error]: type === "error"
        });

        const titleClasses = classNames({
            [styles.title]: true,
            [styles.hasMessage]: !!notification.message,
            [styles.titleWithClose]: notification.sticky
        });

        // -110% ensures that notification is hidden from the viewport
        const translateY = (inited && !closing) ? `${top}px` : "-110%";

        return (
            <div ref={this.props.notificationItemRef} className={styles.root} style={{ transform: `translateY(${translateY})` }} onTransitionEnd={this._handleTransitionEnd}>
                <div className={wrapperClasses}>
                    <div className={titleClasses}>
                        {notification.title}
                        {notification.sticky && <button className={styles.close} onClick={() => this._close()}>&times;</button>}
                    </div>
                    {notification.message && <div className={styles.message}>{notification.message}</div>}
                </div>
            </div>
        )
    }

    public componentDidMount() {
        // When component has been mounted, set inited in state
        // to true async so we can be sure that element is already
        // inserted in a dom before animation starts.
        setTimeout(() => this.setState({ inited: true }), 10);

        const { notification, onCloseRequest } = this.props;

        if (!notification.sticky) {
            setTimeout(() => this._close(), notification.timeout);
        }
    }

    private _close() {
        this.setState({ closing: true });
    }

    private _handleTransitionEnd() {
        if (this.state.closing) {
            this.props.onCloseRequest(this.props.notification.id);
        }
    }


}
