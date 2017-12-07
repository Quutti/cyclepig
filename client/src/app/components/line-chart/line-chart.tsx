import * as React from "react";
import * as d3 from "d3";
import * as classNames from "classnames";

const styles: any = require("./line-chart.css");

export interface LineChartLine {
    color: string;
    data: LineChartPoint[];
}

export interface LineChartPoint {
    date: Date;
    value: number;
}

interface OwnProps {
    height?: number;
    lines: LineChartLine[];
}

interface OwnState {
    fading: boolean;
}

interface MinMax<T> {
    min: T;
    max: T;
}

interface XY<t1, t2> {
    x: t1,
    y: t2
}

const MARGIN = 30;

type D3Element = d3.Selection<d3.BaseType, {}, null, undefined>;

export class LineChart extends React.Component<OwnProps, OwnState> {

    static defaultProps: Partial<OwnProps> = {
        height: 250
    }

    private _timeoutHandle: any;

    private _containerRef: HTMLDivElement = null;

    private _svg: D3Element = null;
    private _mainG: D3Element = null;
    private _pathsG: D3Element = null;
    private _scales: XY<d3.ScaleTime<number, number>, d3.ScaleLinear<number, number>> = { x: null, y: null };
    private _axes: XY<D3Element, D3Element> = { x: null, y: null };

    constructor(props) {
        super(props);

        this.state = {
            fading: false
        }

        this._handleWindowResize = this._handleWindowResize.bind(this);
    }

    public render(): JSX.Element {
        const classes = classNames({
            [styles.root]: true,
            [styles.fading]: this.state.fading
        });

        return (
            <div ref={(ref => this._containerRef = ref)} className={classes} style={{ height: this.props.height }}></div>
        );
    }

    public componentDidUpdate() {
        this._updateChart();
    }

    public componentWillMount() {
        window.addEventListener("resize", this._handleWindowResize);
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this._handleWindowResize);
    }

    public componentDidMount() {
        this._createChart();
        this._updateChart();
    }

    private _createChart() {
        const self = this;

        const containerOffsetWidth = this._containerRef.offsetWidth;

        this._svg = d3.select(this._containerRef).append("svg")
            .attr('height', this.props.height)
            .attr('width', "100%");

        this._mainG = this._svg.append("g")
            .attr('transform', `translate(0, 0)`);

        // Group to serve as a wrapper for line paths
        this._pathsG = this._mainG.append("g")
            .attr("transform", `translate(${MARGIN}, 0)`)

        const domains = this._getDomains();
        const width = containerOffsetWidth - MARGIN * 2;
        const height = this._getInnerHeight();

        this._scales.x = d3.scaleTime().domain(domains.x).rangeRound([0, width]);
        this._scales.y = d3.scaleLinear().domain(domains.y).rangeRound([height, 0]);

        this._axes.x = this._mainG.append("g")
            .attr("class", styles.axisGroup)
            .attr("transform", `translate(${MARGIN}, ${height})`)
            .call(d3.axisBottom(this._scales.x).ticks(4));

        this._axes.y = this._mainG.append("g")
            .attr("class", styles.axisGroup)
            .attr("transform", `translate(${MARGIN}, 0)`)
            .call(this._getAxisLeft());
    }

    private _updateChart(animate: boolean = true) {
        const domains = this._getDomains();
        this._scales.x.domain(domains.x);
        this._scales.y.domain(domains.y);

        this._axes.x.transition().call(d3.axisBottom(this._scales.x).ticks(4) as any);
        this._axes.y.transition().call(this._getAxisLeft() as any);

        const data = this.props.lines.map(line => line.data);

        const update = this._pathsG.selectAll(`.${styles.linePath}`).data(data);

        // Remove removed lines
        update.exit().remove();

        // Update existing lines
        const existingLines = this._pathsG.selectAll(`.${styles.linePath}`);
        if (animate) {
            existingLines.transition().duration(750).attr("d", this._getLine());
        } else {
            existingLines.attr("d", this._getLine());
        }

        // Add new lines
        const newLines = update.enter().append("path").attr("class", styles.linePath);
        if (animate) {
            newLines.attr("d", this._getLine(this._getInnerHeight()) as any)
                .transition()
                .duration(750)
                .attr("d", this._getLine() as any)
        } else {
            newLines.attr("d", this._getLine() as any);
        }
    }

    private _removeChart() {
        this._svg.remove();
        this._svg = null;
    }

    private _handleWindowResize() {
        // Fade out the component when resize event is triggered
        if (this._timeoutHandle === null) {
            this.setState({ fading: true });
        }

        // Be lazy
        clearTimeout(this._timeoutHandle);
        this._timeoutHandle = setTimeout(() => {
            this._removeChart();
            this._createChart();
            this._updateChart(false);

            // Show container after resize is over
            this.setState({ fading: false });

            this._timeoutHandle = null;
        }, 200);
    }

    private _getLine(fixedYPos?: number): d3.Line<[number, number]> {
        return d3.line()
            .curve(d3.curveCatmullRom.alpha(1))
            .x((d: any) => {
                const data = d as LineChartPoint;
                return this._scales.x(data.date.valueOf());
            })
            .y((d: any) => {
                if (fixedYPos !== undefined) {
                    return fixedYPos
                }

                const data = d as LineChartPoint;
                return this._scales.y(data.value);
            });
    }

    private _getInnerHeight(): number {
        return this.props.height - MARGIN;
    }

    private _getDomains(): XY<number[], number[]> {
        const dateBoundaries = this._getDateBoundaries();
        const x = [
            dateBoundaries.min.valueOf(),
            dateBoundaries.max.valueOf()
        ];

        const maxPoints = this._getMaxValue() * 1.1;
        const y = [0, maxPoints];

        return { x, y };
    }

    private _getDateBoundaries(): MinMax<Date> {
        const dates: Date[] = [];
        const dateMsMap: number[] = [];

        this.props.lines.forEach(line => {
            line.data.forEach(dataset => {
                const date = new Date(dataset.date.valueOf());
                date.setHours(0, 0, 0, 0);

                const ms = date.valueOf();
                if (dateMsMap.indexOf(ms) === -1) {
                    dates.push(date);
                    dateMsMap.push(ms);
                }
            });
        });

        dates.sort((d1, d2) => d1.valueOf() - d2.valueOf());

        return {
            min: new Date(dates[0].valueOf()),
            max: new Date(dates[dates.length - 1].valueOf())
        }
    }

    private _getMaxValue(): number {
        let max = 0;
        this.props.lines.forEach(line => {
            line.data.forEach(dataset => max = Math.max(dataset.value, max))
        });
        return max;
    }

    private _getAxisLeft(): d3.Axis<number | { valueOf(): number; }> {
        return d3.axisLeft(this._scales.y).tickPadding(7).tickSize(-this._containerRef.offsetWidth + 2 * MARGIN);
    }

}