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

export class Select extends React.Component<OwnProps, {}> {

    private _id: string = _.uniqueId("select");

    constructor(props) {
        super(props);

        this._handleOnChange = this._handleOnChange.bind(this);
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
        this.props.onChange(evt.target.value, this.props.name);
    }

}