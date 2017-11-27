import * as React from "react";

import { Loading } from "./loading";

interface OwnProps {
    loading: boolean;
    spinnerSize?: number;
}

export class LoadingContent extends React.Component<OwnProps, {}> {

    public render(): JSX.Element {

        const { loading, spinnerSize } = this.props;

        if (loading) {
            return <Loading size={spinnerSize} />
        }

        return <div>{this.props.children}</div>
    }

}