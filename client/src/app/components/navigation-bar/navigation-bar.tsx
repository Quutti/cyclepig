import * as React from "react";
import { Link } from "react-router-dom";

const styles: any = require("./navigation-bar.css");

interface OwnProps {
    title: string;
}

export class NavigationBar extends React.Component<OwnProps, {}> {

    public render(): JSX.Element {
        const { title } = this.props;
        return (
            <nav className={styles.root}>
                <Link className={styles.title} to="/">{title}</Link>
            </nav>
        )

    }

}