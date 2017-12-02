import * as React from "react";

const styles: any = require("./summary.css");

interface OwnProps {
    label: string;
    value: string;
}

export class Summary extends React.Component<OwnProps, {}> {

    public render(): JSX.Element {
        const { label, value } = this.props;
        return (
            <div className={styles.root}>
                <div className={styles.label}>{label}</div>
                <div className={styles.value}>{value}</div>
            </div>
        )
    }

}