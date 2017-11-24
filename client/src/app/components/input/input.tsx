import * as React from "react";
import * as _ from "lodash";
import * as classNames from "classnames";
import { ChangeEvent } from "react";

const styles: any = require("./input.css");

type InputTypes = "text" | "password" | "number" | "integer";

export type InputChangeHandler = (error: string, value: string, name: string) => void;

/**
 * InputValidator should return error message as a string
 * if error occurs. If not, then return empty string.
 */
export type InputValidator = (value: string) => string;

interface OwnProps {
    label: string;
    name: string;
    type?: InputTypes;
    isRequired?: boolean;
    value?: string;
    className?: string;
    customValidator?: InputValidator;
    onChange: InputChangeHandler;
}

interface OwnState {
    value: string;
    error: string;
}

export class Input extends React.Component<OwnProps, OwnState> {

    static defaultProps: Partial<OwnProps> = {
        type: "text",
        value: "",
        className: ""
    }

    private _id: string = _.uniqueId("input");

    constructor(props) {
        super(props);

        this.state = {
            value: "",
            error: ""
        };
    }

    public render(): JSX.Element {
        const { label, type, name, className } = this.props;
        const { error, value } = this.state;
        const hasError = !!error;

        const rootClasses = ["form-group", styles.root, ...className.split(" ")];
        const labelClasses = `form-control-label ${styles.label}`;
        const feedbackClasses = `form-control-feedback ${styles.feedback}`;
        const inputClasses = classNames({
            "form-control": true,
            [styles.input]: true,
            "is-invalid": hasError
        });

        const internalType = (type === "password") ? "password" : "text";

        return (
            <div className={rootClasses.join(" ")}>
                <label htmlFor={this._id} className={labelClasses}>{label}</label>
                <input
                    name={name}
                    id={this._id}
                    value={value}
                    className={inputClasses}
                    type={internalType}
                    onChange={(evt) => this._handleOnChange(evt.target.value)}
                />
                {hasError && <div className={feedbackClasses}>{error}</div>}
            </div>
        )
    }

    public componentWillReceiveProps(newProps: OwnProps) {
        // Update value if it is modified elsewhere
        // and passed as a prop for this component
        const newValue = newProps.value;
        if (newValue !== this.props.value && newValue !== this.state.value) {
            this._handleOnChange(newValue);
        }
    }

    private _handleOnChange(value: string = "") {
        const { name } = this.props;
        const error = this._getInputError(value);

        // Update state with original value and error
        this.setState({ value, error });

        this.props.onChange(
            error,
            error ? "" : value,
            name
        );
    }

    private _getInputError(value: string): string {
        const { isRequired, customValidator, type } = this.props;

        if (isRequired && !value) {
            return "This field is required";
        } else if (typeof customValidator === "function") {
            return customValidator(value);
        } else if (type in internalValidators) {
            return internalValidators[type](value);
        } else {
            return "";
        }
    }


}

const internalValidators: { [key: string]: InputValidator } = {

    "number": (value: string): string => {
        if (!/^(([0-9]*)|(([0-9]*)\.([0-9]*)))$/.test(value)) {
            return "Value should be a number with . (dot) as a separator";
        }
        return "";
    },

    "integer": (value: string): string => {
        if (!/^\d+$/.test(value)) {
            return "Value should be a whole number";
        }
        return "";
    }

}