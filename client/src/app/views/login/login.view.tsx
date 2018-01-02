import * as React from 'react';
import * as Redux from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { RootState } from '../../store/types';
import { authSignIn } from "../../store/actions/auth";

import { Input, Card, Button } from "qruut";
import { LoadingContent } from "../../components";

interface StoreProps {
    isLoggedIn: boolean;
    isFetching: boolean;
    inProgress: boolean;
    dispatch?: Redux.Dispatch<RootState>;
}

interface OwnState {
    username: string;
    password: string;
}

const mapStateToProps = (state: RootState): StoreProps => {

    const { isFetching, inProgress, user } = state.auth;

    return {
        isLoggedIn: !!user,
        isFetching,
        inProgress
    }
}


class LoginViewImpl extends React.Component<StoreProps, OwnState> {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: ""
        }

        this._handleSignInClick = this._handleSignInClick.bind(this);
        this._handleInputChange = this._handleInputChange.bind(this);
    }

    public render(): JSX.Element {

        if (this.props.isLoggedIn) {
            return <Redirect exact to="/" />
        }

        return (
            <div style={{ width: 500, margin: "auto" }}>
                <LoadingContent loading={this.props.isFetching}>
                    <Card heading="Login">
                        <Input
                            name="username"
                            onChange={this._handleInputChange}
                            type="text"
                            label="Username"
                            className="mb-4" />

                        <Input
                            name="password"
                            type="password"
                            onChange={this._handleInputChange}
                            label="Password"
                            className="mb-4" />

                        <div className="text-right">
                            <Button onClick={this._handleSignInClick} text="Sign in" />
                        </div>
                    </Card>
                </LoadingContent>
            </div>
        );
    }

    private _handleSignInClick() {
        const { username, password } = this.state;
        this.props.dispatch(authSignIn(username, password));
    }

    private _handleInputChange(error: string, value: string, name: string) {
        const state: Partial<OwnState> = {};
        state[name] = value;
        this.setState(state as OwnState);
    }

}

export const LoginView = connect<StoreProps, any, any>(mapStateToProps)(LoginViewImpl);
