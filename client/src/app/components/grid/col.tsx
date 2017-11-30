import * as React from "react";
import * as classNames from "classnames";

interface OwnProps {
    xl?: number;
    lg?: number;
    md?: number;
    sm?: number;
    xs?: number;
}

export class Col extends React.Component<OwnProps, {}> {

    static defaultProps: Partial<OwnProps> = {
        xl: 12,
        lg: 12,
        md: 12,
        sm: 12,
        xs: 12
    }

    public render(): JSX.Element {
        const { xl, lg, md, sm, xs } = this.props;

        const classes = [
            "col",
            `col-${xs}`,
            `col-sm-${sm}`,
            `col-md-${md}`,
            `col-lg-${lg}`,
            `col-xl-${xl}`
        ].join(" ");

        return <div className={classes}>{this.props.children}</div>
    }

}