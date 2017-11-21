import * as React from "react";
import { Route, Redirect } from "react-router-dom";
import { RouteProps } from "react-router";

interface OwnProps extends RouteProps {
    isLoggedIn: boolean;
}

export class PrivateRoute extends React.Component<OwnProps, {}> {

    public render(): JSX.Element {
        const { component: Component, isLoggedIn, ...rest } = this.props;

        /**
         * If user is logged in, return component spesified for PrivateRoute. 
         * Else return Redirect component targeting to login view.
         */

        return <Route {...rest} render={(props) => {
            return isLoggedIn
                ? <Component {...props} />
                : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }} />;
    }

}