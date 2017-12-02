import * as React from 'react';
import * as Redux from 'redux';
import { connect } from 'react-redux';

import { RootState, Ride, Bike } from '../../store/types';
import { bikesFetch } from "../../store/actions/bikes";
import { ridesFetch } from "../../store/actions/rides";
import { authSignOut } from "../../store/actions/auth";

import { getRidesSummary } from "../../utils/rides-summary";
import * as dateUtils from "@shared/date-utils";

import { Container, Col, Row, Card, Summary, LoadingContent } from "../../components";

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

        this.props.dispatch(ridesFetch());
        this.props.dispatch(bikesFetch());
    }

    public render(): JSX.Element {

        const { rides } = this.props;

        let startDate = new Date();
        if (rides.length > 0) {
            startDate = dateUtils.jsonDateToDate(rides[0].date);
        }

        const res = getRidesSummary(rides, {
            interval: "all",
            startDate: startDate,
            endDate: new Date()
        });

        const allRidesSummary = res[0];

        return (
            <div>
                <LoadingContent loading={this.props.isFetching}>
                    <Container>
                        <Row>
                            <Col xl={8} lg={8} md={8}>
                            </Col>
                            <Col xl={4} lg={4} md={4}>
                                <Card heading="Summary" className="mb-3">
                                    <Summary label={"Total rides"} value={`${allRidesSummary.rides}`} />
                                    <Summary label={"Total kms"} value={allRidesSummary.distance.toFixed(2)} />
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
