import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

import { RootState } from './store/types';
import { Routes } from './routes/routes';

import { NavigationBar } from './components';

const styles: any = require("./app.css");

interface AppStoreProps {
    dispatch?: redux.Dispatch<RootState>;
}

const mapStateToProps = (state: RootState): AppStoreProps => {
    return {}
}


class AppImpl extends React.Component<AppStoreProps, {}> {

    public render() {
        return (
            <div className={styles.root}>
                <NavigationBar title="Cyclepig" />
                <div className={styles.content}>
                    <Routes />
                </div>
            </div>
        )
    }

}

export const App = withRouter<any>(connect<AppStoreProps, {}, {}>(mapStateToProps)(AppImpl));