import * as React from "react";
import * as Redux from "redux";

import * as dateUtils from "@shared/date-utils";
import { RootState, Bike, Ride } from "../../../../store/types";
import { addRide } from "../../../../store/actions/rides";
import { addNotification } from "../../../../store/actions/notifications";

import { Select, SelectItem, Input, Button } from "../../../../components";

interface OwnProps {
    bikes: Bike[];
    dispatch: Redux.Dispatch<RootState>;
}

interface OwnState {
    bikeId: number;
    distance: number;
    description: string;
    date: string;
}

export class AddRideForm extends React.Component<OwnProps, OwnState> {

    private _defaultState = {
        bikeId: 0,
        distance: 0,
        description: "",
        date: dateUtils.dateToJsonDate(new Date())
    }

    constructor(props) {
        super(props);

        this.state = { ...this._defaultState };

        this._handleSubmitClick = this._handleSubmitClick.bind(this);
        this._handleInputChange = this._handleInputChange.bind(this);
        this._handleSelectChange = this._handleSelectChange.bind(this);
    }

    public render(): JSX.Element {
        const { bikeId, date, description, distance } = this.state;
        const today = dateUtils.dateToJsonDate(new Date());
        const saveDisabled = !this._isInputDataValid();

        const bikeItems: SelectItem[] = this.props.bikes.map(bike => {
            return { value: `${bike.id}`, caption: bike.name }
        });

        return (
            <form>
                <Select label="Bike" name="bikeId" onChange={this._handleSelectChange} items={bikeItems} />
                <Input label="Description" value={this.state.description} name="description" onChange={this._handleInputChange} />
                <Input label="Distance" value={`${this.state.distance || ""}`} type="number" name="distance" onChange={this._handleInputChange} />
                <Input label="Date" value={this.state.date} name="date" type="date" defaultValue={today} onChange={this._handleInputChange} />
                <div className="text-right">
                    <Button primary={true} text="Save" disabled={saveDisabled} onClick={this._handleSubmitClick} />
                </div>
            </form>
        )

    }

    private _handleInputChange(error: string, value: string, name: string) {
        if (name === "distance") {
            this.setState({ distance: parseFloat(value) });
        } else {
            const obj = {};
            obj[name] = value;
            this.setState(obj);
        }
    }

    private _handleSelectChange(value: string, name: string) {
        this.setState({ bikeId: parseInt(value, 10) });
    }

    private _isInputDataValid(): boolean {
        const { bikeId, date, description, distance } = this.state;
        return !!(bikeId && date && description && distance);
    }

    private _handleSubmitClick() {
        if (this._isInputDataValid()) {
            const ride: Ride = { ...this.state };
            this.setState({ ...this._defaultState });
            this.props.dispatch(addRide(ride));
        }
    }
}