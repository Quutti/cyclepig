
import { Ride } from "../store/types";
import * as dateUtils from "@shared/date-utils";
import { dateInMs } from "@shared/date-utils";

export type RidesSummaryInterval = "daily" | "weekly" | "monthly" | "yearly" | "all";

export interface RidesSummaryOptions {
    interval: RidesSummaryInterval;
    startDate: Date;
    endDate: Date;
    bikeId?: number;
}

export type RidesSummaryLabeler = (date: Date) => string;

export type RidesSummaryModifier = (date: Date) => Date;

export interface RidesSummaryItem {
    label: string;
    distance: number;
    rides: number;
}

export const getRidesSummary = (rides: Ride[], options: RidesSummaryOptions): RidesSummaryItem[] => {
    const res: RidesSummaryItem[] = [];

    const labeler = getLabeler(options.interval);

    const labelMap: string[] = [];
    const endDateMs = dateInMs(options.endDate);

    let currentDate = new Date(options.startDate.valueOf());
    while (dateInMs(currentDate) <= endDateMs) {
        const label = labeler(currentDate);

        if (labelMap.indexOf(label) === -1) {
            res.push({
                label,
                distance: 0,
                rides: 0
            });

            labelMap.push(label);

            // If interval is all break after first iteration
            if (options.interval === "all") {
                break;
            }
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    for (let ride of rides) {
        if (options.bikeId && ride.bikeId !== options.bikeId) {
            continue;
        }

        const label = labeler(dateUtils.jsonDateToDate(ride.date));
        const labelIndex = labelMap.indexOf(label);

        if (labelIndex > -1) {
            res[labelIndex].distance += ride.distance;
            res[labelIndex].rides += 1;
        }
    }

    return res;
}

const getLabeler = (interval: RidesSummaryInterval): RidesSummaryLabeler => {
    const prefix = (value: number): string => (value < 10) ? `0${value}` : `${value}`;

    return (date: Date) => {
        if (interval === "all") {
            return "all";
        } else if (interval === "yearly") {
            return `${date.getFullYear()}`;
        } else if (interval === "monthly") {
            const m = prefix(date.getMonth() + 1);
            return `${m}/${date.getFullYear()}`;
        } else if (interval === "weekly") {
            const w = dateUtils.getWeekNumber(date);
            return `${w}-${date.getFullYear()}`;
        } else {
            const d = prefix(date.getDate());
            const m = prefix(date.getMonth() + 1);
            return `${date.getFullYear()}-${m}-${d}`;
        }
    }
}
