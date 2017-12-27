import * as React from 'react';
import * as Redux from 'redux';
import { connect } from 'react-redux';
import * as d3 from "d3";

import { RootState, Ride, Bike } from '../../store/types';
import { fetchBikes } from "../../store/actions/bikes";
import { fetchRides } from "../../store/actions/rides";
import { authSignOut } from "../../store/actions/auth";

import { getRidesSummary } from "../../utils/rides-summary";
import * as dateUtils from "@shared/date-utils";

import { Card } from "qruut";
import { Container, Col, Row, SummaryCard, LoadingContent } from "../../components";
import { LineChart, LineChartLine, LineChartPoint } from "../../components/line-chart";
import { AddRideForm } from "./components";

interface DashboardStoreProps {
    rides: Ride[];
    bikes: Bike[];
    isFetching: boolean;
    dispatch?: Redux.Dispatch<RootState>;
}

const mapStateToProps = (state: RootState): DashboardStoreProps => {
    return {
        isFetching: state.rides.isFetching || state.bikes.isFetching,
        rides: state.rides.items,
        bikes: state.bikes.items
    }
}


class DashboardViewImpl extends React.Component<DashboardStoreProps, {}> {

    constructor(props) {
        super(props);

        this.props.dispatch(fetchRides());
        this.props.dispatch(fetchBikes());
    }

    public render(): JSX.Element {
        const { rides } = this.props;

        let startDate = new Date();
        if (rides.length) {
            startDate = dateUtils.jsonDateToDate(rides[0].date);
        }

        const res = getRidesSummary(rides, {
            interval: "monthly",
            startDate: startDate,
            endDate: new Date()
        });

        const lastMonthSummary = res[res.length - 1];

        const lines: LineChartLine[] = [{
            color: "red",
            data: res.map(sum => {
                const nums = sum.label.split("/").map(p => parseInt(p), 10);
                nums.unshift(1);
                nums[1] -= 1;

                return {
                    date: new Date(...nums.reverse()),
                    value: sum.distance
                }
            })
        }];

        return (
            <div>
                <div className="mb-5">
                    <button onClick={() => this.props.dispatch(authSignOut())}>Sign out</button>
                </div>


                <LoadingContent loading={this.props.isFetching}>
                    <Container>

                        <Row>
                            <Col xl={8} lg={8} className="mb-4">
                                <Row>
                                    <Col xl={6} lg={6} md={6} sm={6} xs={12} className="mb-4">
                                        <SummaryCard label={"Km's this month"} value={lastMonthSummary.distance.toFixed(2)} backgroundColor="#4e7494" icon="bar-chart" />
                                    </Col>

                                    <Col xl={6} lg={6} md={6} sm={6} xs={12} className="mb-4">
                                        <SummaryCard label={"Rides this month"} value={`${lastMonthSummary.rides}`} backgroundColor="#4e7494" icon="bicycle" />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Card heading="Pulse">
                                            <LineChart
                                                lines={lines}
                                                curve={d3.curveCatmullRom.alpha(1)}
                                            />
                                        </Card>
                                    </Col>

                                </Row>
                            </Col>
                            <Col xl={4} lg={4}>
                                <Card heading="Add ride">
                                    <AddRideForm dispatch={this.props.dispatch} bikes={this.props.bikes} />
                                </Card>
                            </Col>

                        </Row>
                    </Container>
                </LoadingContent>
            </div>
        );
    }

}

export const DashboardView = connect<DashboardStoreProps, any, any>(mapStateToProps)(DashboardViewImpl);
