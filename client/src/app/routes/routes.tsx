import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';

import { RootState } from '../store/types';
import { PrivateRoute } from './private-route';

/* Views */
import {
    LoginView,
    DashboardView
} from '../views';


interface StoreProps {
    isLoggedIn: boolean;
    dispatch?: redux.Dispatch<RootState>;
}

const mapStateToProps = (state: RootState): StoreProps => {
    return {
        isLoggedIn: false
    }
}


class RoutesImpl extends React.Component<StoreProps, {}> {

    constructor(props) {
        super(props);
    }

    public render() {

        const { isLoggedIn } = this.props;

        return (
            <Switch>
                <Route path="/login" component={LoginView} />

                <PrivateRoute exact path="/" component={DashboardView} isLoggedIn={isLoggedIn} />
            </Switch>
        );
    }
}

export const Routes = withRouter<any>(connect<StoreProps, {}, {}>(mapStateToProps)(RoutesImpl));