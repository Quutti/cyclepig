import * as React from "react";
import * as _ from "lodash";
import { ChangeEvent } from "react";

const styles: any = require("./select.css");

export interface SelectItem {
    caption: string;
    value: string;
}

interface OwnProps {
    label: string;
    name: string;
    items: SelectItem[];
    selectedItemValue?: string;
    onChange: (value: string, name: string) => void;
}

interface OwnState {
    value: string;
}

export class Select extends React.Component<OwnProps, OwnState> {

    private _id: string = _.uniqueId("select");

    constructor(props) {
        super(props);

        this._handleOnChange = this._handleOnChange.bind(this);

        this.state = {
            value: ""
        }
    }

    public render(): JSX.Element {

        const { label, name, items, selectedItemValue } = this.props;

        const rootClasses = ["form-group", styles.root].join(" ");

        const options = items.map((item, index) => {
            return (
                <option
                    key={index}
                    value={item.value}>
                    {item.caption}
                </option>
            );
        });

        if (!this.state.value) {
            options.unshift(<option key={"empty"} value="0" />);
        }

        return (
            <div className={rootClasses}>
                <label htmlFor={this._id}>{label}</label>
                <select
                    className={styles.select}
                    id={this._id}
                    name={name}
                    onChange={this._handleOnChange}
                    defaultValue={selectedItemValue}>{options}</select>
            </div>
        )

    }

    private _handleOnChange(evt) {
        const { value } = evt.target;
        this.setState({ value });
        this.props.onChange(value, this.props.name);
    }

}