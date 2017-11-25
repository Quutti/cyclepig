import * as React from "react";

const styles: any = require("./card.css");

interface OwnProps {
    heading: string;
    className?: string;
}

export class Card extends React.Component<OwnProps, {}> {

    static defaultProps: Partial<OwnProps> = {
        className: ""
    }

    public render(): JSX.Element {
        const { heading, children, className } = this.props;

        const rootClasses = [
            styles.root,
            ...className.split(" ")
        ].join(" ");

        return (
            <div className={rootClasses}>
                <div className={styles.heading}>
                    <h2 className={styles.headingText}>{heading}</h2>
                </div>
                <div className={styles.body}>
                    {children}
                </div>
            </div>
        )
    }

}