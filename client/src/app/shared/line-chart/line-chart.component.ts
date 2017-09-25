import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import * as d3 from "d3";

export interface LineChartLine {
    points: number[];
    color?: string;
}

const MARGIN = 30;

interface AxisSet {
    x: d3.ScaleTime<number, number>;
    y: d3.ScaleLinear<number, number>;
}

interface Path {
    data: DataPoint[];
    color: string;
    linePath: d3.Line<[number, number]>;
}

interface DataPoint {
    label: string;
    point: number;
}

@Component({
    selector: "sh-line-chart",
    templateUrl: "./line-chart.component.html",
    styleUrls: ["./line-chart.component.scss"]
})
export class LineChartComponent implements OnInit, AfterViewInit {

    public paths: Path[] = [];
    private _axis: AxisSet;

    @Input() lines: LineChartLine[] = [];
    @Input() labels: string[] = [];
    @Input() height: number = 250;

    @ViewChild('container') elemContainer: ElementRef;
    @ViewChild('mainGroup') elemMainGroup: ElementRef;
    @ViewChild('svg') elemSvg: ElementRef;
    @ViewChild('xGroup') elemXGroup: ElementRef;
    @ViewChild('yGroup') elemYGroup: ElementRef;
    @ViewChild('yGridLines') elemYGridLines: ElementRef;

    constructor() { }

    public ngOnInit() {
        this._checkInputs();
        this._create();
    }

    public ngAfterViewInit() {
        const mainGroup = this.elemMainGroup.nativeElement as SVGGElement;
        const paths: NodeListOf<SVGPathElement> = mainGroup.querySelectorAll("path");

        for (let i = 0; i < paths.length; i++) {
            const pathElem = paths[i];
            const path = this.paths[i];

            if (pathElem && path) {
                const d3Path = d3.select(pathElem);
                d3Path.datum(path.data);
                d3Path.attr("d", path.linePath);
            }
        }
    }

    private _create() {

        if (this.labels.length === 0) {
            return;
        }

        const dims = this._getDimensions();
        const height = dims.height - MARGIN;
        const width = dims.width - (2 * MARGIN);

        const maxPoints = this._getMax();
        const yMax = maxPoints + (maxPoints * 0.1);
        const d3MainGroup = d3.select(this.elemMainGroup.nativeElement);

        d3.select(this.elemSvg.nativeElement).selectAll('circle').remove();

        this._fixSvgSize();
        this._fixAxisSizes();

        this._axis.x.domain([
            getDateMs(this.labels[0]),
            getDateMs(this.labels[this.labels.length - 1])
        ]);

        this._axis.y.domain([0, yMax]);

        const xGroup = d3.select(this.elemXGroup.nativeElement);
        const yGroup = d3.select(this.elemYGroup.nativeElement);

        xGroup.call(d3.axisBottom(this._axis.x).ticks(4)).select('.domain').remove();
        yGroup.call(d3.axisLeft(this._axis.y).ticks(4)).select('.domain').remove();

        yGroup.selectAll('.tick').each(function (d: number, index: number) {
            d3.select(this).select('line').attr('x2', width);
        });

        this.paths = [];

        for (let i = 0; i < this.lines.length; i++) {
            const line = this.lines[i];
            const { color } = line;
            const linePath = d3.line()
                .x((d: any, index: number) => {
                    const data = d as DataPoint;
                    const date = new Date(data.label).valueOf();
                    return this._axis.x(date);
                })
                .y((d: any) => {
                    const data = d as DataPoint;
                    return this._axis.y(d.point);
                });

            const data: DataPoint[] = this.labels.map((label, index) => {
                return {
                    label,
                    point: line.points[index]
                };
            });

            this.paths.push({
                data,
                linePath,
                color
            });
        }

    }

    private _getDimensions() {
        return {
            width: this.elemContainer.nativeElement.clientWidth,
            height: this.height
        }
    }

    private _getMax(): number {
        return d3.max(this.lines, (line) => d3.max(line.points));
    }

    private _fixSvgSize() {
        const dims = this._getDimensions();
        const svgNative = this.elemSvg.nativeElement;

        svgNative.style.width = dims.width + "px";
        svgNative.style.height = dims.height + "px";
    }

    private _fixAxisSizes() {
        const dims = this._getDimensions();
        const w = dims.width - (2 * MARGIN);
        const h = dims.height - MARGIN - 10;

        // Rebuild axises
        this._axis = {
            x: d3.scaleTime().rangeRound([0, w]),
            y: d3.scaleLinear().rangeRound([h, 0])
        };

        d3.select(this.elemXGroup.nativeElement)
            .attr('transform', `translate(0, ${h})`);
    }

    private _checkInputs() {
        this.lines.forEach(line => {
            if (line.points.length !== this.labels.length) {
                throw new Error("Line count should match label count");
            }
        })

    }

}

const getDateMs = (date: string): number => {
    return new Date(date).valueOf();
}