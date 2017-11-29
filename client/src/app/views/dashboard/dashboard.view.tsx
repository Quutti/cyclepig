import * as React from 'react';
import * as Redux from 'redux';
import { connect } from 'react-redux';

import { RootState } from '../../store/types';
import { authSignOut } from "../../store/actions/auth";

interface DashboardStoreProps {
    dispatch?: Redux.Dispatch<RootState>;
}

const mapStateToProps = (state: RootState): DashboardStoreProps => {
    return {

    }
}


class DashboardViewImpl extends React.Component<DashboardStoreProps, {}> {

    public render(): JSX.Element {
        return (
            <div>
                <button onClick={() => this.props.dispatch(authSignOut())}>Sign out</button>
            </div>
        );
    }

}

export const DashboardView = connect<DashboardStoreProps, any, any>(mapStateToProps)(DashboardViewImpl);
