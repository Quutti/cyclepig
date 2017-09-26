import { Component, Input } from "@angular/core";

import { Ride } from "../../rides";
import { LineChartLine, LineChartData } from "../../shared/line-chart";

@Component({
    selector: "hm-rides-burnup",
    templateUrl: "./rides-burnup.component.html"
})
export class RidesBurnupComponent {

    public chartLines: LineChartLine[];


    private _rides: Ride[];

    @Input()
    set rides(value: Ride[]) {
        this._rides = value;

        const chartData = createLabelDistancePairs(this._rides);

        this.chartLines = [
            { data: chartData }
        ]
    }
    get rides(): Ride[] {
        return this._rides;
    }

}

/**
 * @param rides Rides
 */
const createLabelDistancePairs = (rides: Ride[]): LineChartData[] => {

    // Clone array and stay immutable
    let rideArray = [...rides];
    rideArray.sort((r1: Ride, r2: Ride) => {
        if (r1.date === r2.date) {
            return 0;
        } else {
            return (r1.date < r2.date) ? -1 : 1;
        }
    });

    let endDate = new Date();
    endDate.setHours(0, 0, 0, 0);

    let runningDate = new Date(rides[0].date);
    runningDate.setHours(0, 0, 0, 0);

    let lastIndex = 0;
    let distance = 0;
    let rideCount = rides.length;
    let res: LineChartData[] = [];

    while (runningDate <= endDate) {

        if (lastIndex < rideCount) {
            for (let i = lastIndex; i < rideCount; i++) {
                const ride = rides[i];

                if (!ride) {
                    break;
                }

                lastIndex = i;

                if (datesMatch(new Date(ride.date), runningDate)) {
                    distance += ride.distance;
                } else {
                    break;
                }
            }
        }

        res.push({
            date: new Date(runningDate.valueOf()),
            point: distance
        });

        runningDate.setDate(runningDate.getDate() + 1);
    }

    return res;
}


const datesMatch = (date1: Date, date2: Date) => {
    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    )
}