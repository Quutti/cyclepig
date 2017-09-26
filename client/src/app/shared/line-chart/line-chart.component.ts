import { Component, Input, OnInit, ViewChild, OnChanges, ElementRef } from "@angular/core";
import * as d3 from "d3";

export interface LineChartLine {
    color?: string;
    data: LineChartData[]
}

export interface LineChartData {
    date: Date;
    point: number;
}

const MARGIN = 30;

interface MinMax<T> {
    min: T;
    max: T;
}

interface XY<t1, t2> {
    x: t1,
    y: t2
}

@Component({
    selector: "sh-line-chart",
    templateUrl: "./line-chart.component.html",
    styleUrls: ["./line-chart.component.scss"]
})
export class LineChartComponent implements OnInit, OnChanges {

    @ViewChild("container") private _containerRef: ElementRef;
    @Input() data: LineChartLine[];
    @Input() height: number = 250;

    private _mainGroup: any;
    private _width: number;
    private _height: number;
    private _scaleX: d3.ScaleTime<number, number>;
    private _scaleY: d3.ScaleLinear<number, number>;
    private _axisX: any;
    private _axisY: any;

    constructor() { }

    public ngOnInit() {
        this._createChart();
        if (this.data) {
            this._updateChart();
        }
    }

    public ngOnChanges() {
        if (this._mainGroup) {
            this._updateChart();
        }
    }

    private _createChart() {
        const container = this._containerRef.nativeElement as HTMLDivElement;

        this._width = container.offsetWidth - MARGIN * 2;
        this._height = this.height - MARGIN * 2;

        const svg = d3.select(container).append("svg")
            .attr('width', container.offsetWidth)
            .attr('height', this.height);

        this._mainGroup = svg.append("g").attr('transform', `translate(${MARGIN}, ${MARGIN})`);

        let domains = this._getDomains();

        this._scaleX = d3.scaleTime().domain(domains.x).rangeRound([0, this._width]);
        this._scaleY = d3.scaleLinear().domain(domains.y).rangeRound([this._height, 0]);

        this._axisX = svg.append("g")
            .attr("transform", `translate(${MARGIN}, ${MARGIN + this._height})`)
            .call(d3.axisBottom(this._scaleX));

        this._axisY = svg.append("g")
            .attr("transform", `translate(${MARGIN}, ${MARGIN})`)
            .call(d3.axisLeft(this._scaleY));
    }

    private _updateChart() {
        const domains = this._getDomains();

        this._scaleX.domain(domains.x);
        this._scaleY.domain(domains.y);

        this._axisX.transition().call(d3.axisBottom(this._scaleX));
        this._axisY.transition().call(d3.axisLeft(this._scaleY));

        const data = this.data.map(l => l.data);
        const update = this._mainGroup
            .selectAll('.path')
            .data(data);

        update.exit().remove();

        update.enter()
            .append("path")
            .attr('class', 'path')
            .attr('d', this._getLine(this._height))
            .transition()
            .duration(750)
            .attr('d', this._getLine())
    }

    private _getDomains(): XY<number[], number[]> {
        const dateBoundaries = this._getDateBoundaries();
        const domainX = [
            dateBoundaries.min.valueOf(),
            dateBoundaries.max.valueOf()
        ];

        const maxPoints = this._getMaxPoints() * 1.1;
        const domainY = [0, maxPoints];

        return {
            x: domainX,
            y: domainY
        }
    }

    private _getDateBoundaries(): MinMax<Date> {
        let dates: Date[] = [];
        let dateMsMap: number[] = [];

        this.data.forEach(line => {
            line.data.forEach(dataset => {
                let date = new Date(dataset.date.valueOf());
                date.setHours(0, 0, 0, 0);

                let ms = date.valueOf();
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

    private _getMaxPoints(): number {
        let max = 0;

        this.data.forEach(line => {
            line.data.forEach(dataset => {
                if (dataset.point > max) {
                    max = dataset.point;
                }
            });
        });

        return max;
    }

    private _getLine(fixedYPos?: number): d3.Line<[number, number]> {
        return d3.line()
            .x((d: any, index: number) => {
                const data = d as LineChartData;
                return this._scaleX(data.date.valueOf());
            })
            .y((d: any) => {
                if (fixedYPos !== undefined) {
                    return fixedYPos
                }

                const data = d as LineChartData;
                return this._scaleY(data.point);
            });
    }
}