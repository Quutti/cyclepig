import * as React from 'react';
import * as Redux from 'redux';
import { connect } from 'react-redux';

import { RootState } from '../../store/types';

interface StoreProps {
    dispatch?: Redux.Dispatch<RootState>;
}

const mapStateToProps = (state: RootState): StoreProps => {
    return {

    }
}


class DashboardViewImpl extends React.Component<StoreProps, {}> {

    public render(): JSX.Element {
        return <div />;
    }

}

export const DashboardView = connect<StoreProps, any, any>(mapStateToProps)(DashboardViewImpl);
