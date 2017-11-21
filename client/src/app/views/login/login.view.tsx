import * as React from 'react';
import * as Redux from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { RootState } from '../../store/types';

interface StoreProps {
    isLoggedIn: boolean;
    dispatch?: Redux.Dispatch<RootState>;
}

interface OwnState {
    username: string;
    usernameError: string;
    password: string;
    passwordError: string;
}

const mapStateToProps = (state: RootState): StoreProps => {
    return {
        isLoggedIn: false
    }
}


class LoginViewImpl extends React.Component<StoreProps, OwnState> {

    public render(): JSX.Element {

        if (this.props.isLoggedIn) {
            return <Redirect exact to="/" />
        }

        return (
            <div />
        );
    }

}

export const LoginView = connect<StoreProps, any, any>(mapStateToProps)(LoginViewImpl);
