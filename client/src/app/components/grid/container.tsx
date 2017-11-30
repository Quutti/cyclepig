import * as React from "react";
import * as classNames from "classnames";

interface OwnProps {
    fixed?: boolean;
}

export class Container extends React.Component<OwnProps, {}> {

    public render(): JSX.Element {
        const { fixed } = this.props;
        const classes = classNames({
            "container": fixed,
            "container-fluid": !fixed
        });

        return <div className={classes}>{this.props.children}</div>
    }

}