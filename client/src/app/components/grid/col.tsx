import * as React from "react";
import * as classNames from "classnames";

interface OwnProps {
    xl?: number;
    lg?: number;
    md?: number;
    sm?: number;
    xs?: number;
    className?: string;
}

export class Col extends React.Component<OwnProps, {}> {

    static defaultProps: Partial<OwnProps> = {
        xl: 12,
        lg: 12,
        md: 12,
        sm: 12,
        xs: 12,
        className: ""
    }

    public render(): JSX.Element {
        const { xl, lg, md, sm, xs, className } = this.props;

        const classes = [
            "col",
            `col-${xs}`,
            `col-sm-${sm}`,
            `col-md-${md}`,
            `col-lg-${lg}`,
            `col-xl-${xl}`,
            ...className.split(" ")
        ].join(" ");

        return <div className={classes}>{this.props.children}</div>
    }

}