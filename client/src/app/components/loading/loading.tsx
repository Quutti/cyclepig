import * as React from "react";

const styles: any = require("./loading.css");

interface OwnProps {
    size?: number;
    className?: string;
}

export class Loading extends React.Component<OwnProps, {}> {

    static defaultProps: Partial<OwnProps> = {
        size: 100,
        className: ""
    }

    public render(): JSX.Element {
        const rootClasses = [styles.root, ...this.props.className.split(" ")].join(" ");

        return (
            <div className={rootClasses}>
                <img
                    className={styles.image}
                    src="assets/img/loading.svg"
                    width={this.props.size} />
            </div>
        )
    }

}