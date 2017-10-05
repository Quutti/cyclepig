import { Component, Input, OnInit, ViewChild, OnChanges, ElementRef, HostListener, TemplateRef, ContentChild } from "@angular/core";
import * as d3 from "d3";

import { DateUtilsService } from "../utils";

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
    @ViewChild("tooltipContainer") private _tooltipContainerRef: ElementRef;
    @ContentChild("tooltip") public tooltipTemplate: TemplateRef<any>;

    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        // set fading flag to fadeout the container
        // during the resize
        if (this._timeoutHandle === null) {
            this.fading = true;
        }

        // Be lazy on resize and trigger action only
        // if user has not triggered two resize events in
        // 200ms interval
        clearTimeout(this._timeoutHandle);
        this._timeoutHandle = setTimeout(() => {
            this._removeChart();
            this._createChart();

            if (this.data) {
                // Update chart but do not animate
                this._updateChart(false);
            }

            // Show container after resize is over
            this.fading = false;

            this._timeoutHandle = null;
        }, 200);
    }

    @Input() data: LineChartLine[];
    @Input() height: number = 250;

    public fading: boolean = false;

    public activeItem: LineChartData = null;

    private _container: HTMLDivElement;
    private _svg: d3.Selection<any, any, any, any> = null;
    private _mainGroup: d3.Selection<any, any, any, any>;
    private _interactionGroup: d3.Selection<any, any, any, any>;

    private _timeoutHandle: any = null;
    private _width: number;
    private _height: number;
    private _scaleX: d3.ScaleTime<number, number>;
    private _scaleY: d3.ScaleLinear<number, number>;
    private _axisX: any;
    private _axisY: any;

    private _pathElems: HTMLCollectionOf<SVGPathElement>;

    constructor(
        private _dateUtilsService: DateUtilsService
    ) { }

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

    public formatDate(date: Date): string {
        return this._dateUtilsService.formatDate(date);
    }

    private _createChart() {
        const self = this;

        this._container = this._containerRef.nativeElement as HTMLDivElement;

        this._width = this._container.offsetWidth - MARGIN * 2;
        this._height = this.height - MARGIN * 2;

        this._svg = d3.select(this._container).append("svg")
            .attr('width', this._container.offsetWidth)
            .attr('height', this.height);

        this._mainGroup = this._svg.append("g")
            .attr('transform', `translate(${MARGIN}, ${MARGIN})`);

        this._mainGroup.append("path")
            .attr("class", "line-chart-mouse-indicator-vertical-line");

        const domains = this._getDomains();

        this._scaleX = d3.scaleTime().domain(domains.x).rangeRound([0, this._width]);
        this._scaleY = d3.scaleLinear().domain(domains.y).rangeRound([this._height, 0]);

        this._axisX = this._svg.append("g")
            .attr("transform", `translate(${MARGIN}, ${MARGIN + this._height})`)
            .call(d3.axisBottom(this._scaleX).ticks(4));

        this._axisY = this._svg.append("g")
            .attr("class", "line-chart-y-group")
            .attr("transform", `translate(${MARGIN}, ${MARGIN})`)
            .call(this._getAxisLeft());

        // Add layer for user interactions with chart, this must be a top
        // layer of the chart (added last to base svg)
        this._interactionGroup = this._svg.append("g")
            .attr("transform", `translate(${MARGIN}, ${MARGIN})`)

        this._interactionGroup.append("rect")
            .attr('width', this._width)
            .attr('height', this._height)
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            .on('mouseout', () => {
                this._changeIndicatorVisibility(false);

                // Set active item to null to hide tooltip
                this.activeItem = null;
            })
            .on('mouseover', () => this._changeIndicatorVisibility(true))
            .on('mousemove', function () {
                const mouse = d3.mouse(this as any);
                const mouseX = mouse[0];

                // Move vertical indicator line to the mouse x position
                self._mainGroup.select(".line-chart-mouse-indicator-vertical-line")
                    .attr("d", () => `M${mouse[0]},${self._height} ${mouseX},0`)

                // Move circles targeting lines to the mouse x + line y position
                self._mainGroup.select(".line-chart-mouse-line-indicator")
                    .attr("transform", function (d: LineChartData[], index: number) {
                        // Get the closest value related to mouse x position from the x scale
                        const date = self._scaleX.invert(mouseX);
                        const line = self._pathElems[index];
                        const bisect = d3.bisector((d: LineChartData) => d.date).right;
                        const itemIdx = bisect(d, date);

                        // Get line y position from the mouse x position
                        const y = self._getYPositionInLine(line, mouseX);

                        const item = d[itemIdx];
                        self.activeItem = (item) ? item : null;

                        return `translate(${mouseX}, ${y})`;
                    });

                if (self._tooltipContainerRef) {
                    let tooltipContainerElm = self._tooltipContainerRef.nativeElement as HTMLDivElement;
                    let container = self._containerRef.nativeElement as HTMLDivElement;
                    let left = (mouseX + MARGIN) - (tooltipContainerElm.clientWidth / 2);

                    tooltipContainerElm.style.left = `${left}px`;
                    tooltipContainerElm.style.top = `-${tooltipContainerElm.clientHeight - MARGIN + 5}px`;
                }
            });
    }

    private _removeChart() {
        this._svg.remove();
        this._svg = null;
    }

    private _updateChart(animate: boolean = true) {
        // Update domains
        const domains = this._getDomains();
        this._scaleX.domain(domains.x);
        this._scaleY.domain(domains.y);

        // Update axises
        this._axisX.transition()
            .call(d3.axisBottom(this._scaleX).ticks(4));
        this._axisY.transition()
            .call(this._getAxisLeft());

        const data = this.data.map(l => l.data);
        const update = this._mainGroup
            .selectAll('.line-chart-path')
            .data(data);

        update.exit().remove();

        // Update existing lines 
        let selection = this._mainGroup.selectAll(".line-chart-path")
        if (animate) {
            selection
                .transition()
                .duration(750)
                .attr('d', this._getLine());
        } else {
            selection.attr('d', this._getLine());
        }

        // When new lines are inserted to the data -array,
        // append new path and draw a line
        selection = update.enter()
            .append("path")
            .attr('class', 'line-chart-path');

        if (animate) {
            selection
                .attr('d', this._getLine(this._height) as any)
                .transition()
                .duration(750)
                .attr('d', this._getLine());
        } else {
            selection.attr('d', this._getLine());
        }

        // Add circle to every new line indicator
        // (Only newly added lines are in mouseLineIndicators variable)
        let mouseLineIndicators = this._mainGroup
            .selectAll(".line-chart-mouse-line-indicator")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "line-chart-mouse-line-indicator");

        mouseLineIndicators.append("circle")
            .attr("r", 7)
            .attr("class", "line-chart-mouse-line-indicator-dot");

        this._pathElems = this._svg.node().getElementsByClassName("line-chart-path") as HTMLCollectionOf<SVGPathElement>;
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

    private _getAxisLeft(): d3.Axis<number | { valueOf(): number; }> {
        return d3.axisLeft(this._scaleY).tickPadding(7).tickSize(-this._container.offsetWidth + 2 * MARGIN)
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

    /**
     * Hides / shows vertical line indicator and line specific indicators
     */
    private _changeIndicatorVisibility(visible: boolean) {
        let value = (visible) ? "1" : "0";

        this._mainGroup.select(".line-chart-mouse-indicator-vertical-line")
            .style("opacity", value);

        this._mainGroup.select(".line-chart-mouse-line-indicator-dot")
            .style("opacity", value);
    }

    /**
     * Returns y position of line in a x position
     */
    private _getYPositionInLine(line: SVGPathElement, x: number): number {
        let start = 0;
        let end = line.getTotalLength();
        let target: number = null;
        let pos: SVGPoint = null;

        while (true) {
            target = Math.floor((start + end) / 2);
            pos = line.getPointAtLength(target);

            if ((target === end || target === start) && pos.x !== x) {
                break;
            }

            if (pos.x > x) {
                end = target;
            } else if (pos.x < x) {
                start = target;
            } else {
                break;
            }
        }

        return pos.y;
    }
}