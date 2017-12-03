import * as React from "react";
import * as classNames from "classnames";

const styles: any = require("./button.css");

type ButtonClickHandler = () => void;

interface OwnProps {
    text?: string;
    icon?: string;
    primary?: boolean;
    disabled?: boolean;
    disabledTooltip?: string;
    className?: string;
    onClick: ButtonClickHandler;
}

/**
 * @todo Toggleable property
 * @todo Add functionality to show the state of the action in button (i.e. spinner)
 */

export class Button extends React.Component<OwnProps, {}> {

    constructor(props) {
        super(props);

        this._handleClick = this._handleClick.bind(this);
    }

    public render(): JSX.Element {
        const { text, icon, primary, disabled, className, disabledTooltip } = this.props;

        let buttonClasses = classNames({
            [styles.button]: true,
            "btn": true,
            "btn-primary": primary
        });

        if (className) {
            buttonClasses += ` ${className}`;
        }

        const iconClasses = (icon) ? `${styles.icon} fa fa-${icon}` : "";

        // Show tooltip only if button is disabled
        const tooltip = (disabled && disabledTooltip) ? disabledTooltip : null;

        return (
            <button
                className={buttonClasses}
                onClick={this._handleClick}
                title={tooltip}
                disabled={disabled}>
                {iconClasses && <i className={iconClasses}></i>}
                <span className={styles.buttonText}>{text}</span>
            </button>
        )

    }


    private _handleClick(evt: React.MouseEvent<HTMLButtonElement>) {
        evt.preventDefault();
        if (!this.props.disabled) {
            this.props.onClick();
        }
    }

}