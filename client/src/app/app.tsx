import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

import { RootState } from './store/types';
import { authGetUser } from "./store/actions/auth";
import { Routes } from './routes/routes';

import { NavigationBar, Notifications } from './components';

const styles: any = require("./app.css");

interface AppStoreProps {
    isLoggedIn: boolean;
    dispatch?: redux.Dispatch<RootState>;
}

const mapStateToProps = (state: RootState): AppStoreProps => {
    return {
        isLoggedIn: !!state.auth.user
    }
}


class AppImpl extends React.Component<AppStoreProps, {}> {

    constructor(props) {
        super(props);
        this.props.dispatch(authGetUser());
    }

    public render() {
        return (
            <div className={styles.root}>
                <NavigationBar title="Cyclepig" />
                <Notifications />
                <div className={styles.content}>
                    <Routes />
                </div>
            </div>
        )
    }

}

export const App = withRouter<any>(connect<AppStoreProps, {}, {}>(mapStateToProps)(AppImpl));