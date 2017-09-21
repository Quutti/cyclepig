import { Component, OnInit, Input } from "@angular/core";

export type PaginationTableItem = { [key: string]: any };

export type PaginationTableItemRenderer = (item: PaginationTableItem) => string[];

interface PaginationTableRenderedItem {
    item: PaginationTableItem,
    rendered: string[]
}

@Component({
    selector: "sh-pagination-table",
    templateUrl: "./pagination-table.component.html",
    styleUrls: ["./pagination-table.component.scss"]
})
export class PaginationTableComponent implements OnInit {

    private _items: PaginationTableRenderedItem[];
    private _lastPage: number = 0;

    public activeItems: string[][] = [];
    public prevBtnDisabled: boolean = false;
    public nextBtnDisabled: boolean = false;
    public rangeText: string = '';

    @Input() headers: string[];
    @Input() itemRenderer: PaginationTableItemRenderer;
    @Input() itemsPerPage: number;
    @Input() activePage: number;

    @Input()
    set items(items: PaginationTableItem[]) {
        this._items = items.map(item => {
            return { item, rendered: this.itemRenderer(item) }
        });
    }

    constructor() { }

    public ngOnInit() {
        this._setDefaultIfUndefined("activePage", 1);
        this._setDefaultIfUndefined("itemsPerPage", 20);

        this._throwIfUndefined("_items");
        this._throwIfUndefined("headers");
        this._throwIfUndefined("itemRenderer");

        this._lastPage = Math.floor(this._items.length / this.itemsPerPage) + 1;

        this._refreshComponent();
    }

    public onClickPrev() {
        this.activePage = (this.activePage > 1) ? this.activePage - 1 : 1;
        this._refreshComponent();
    }

    public onClickNext() {
        const newPage = this.activePage + 1;

        this.activePage = (newPage <= this._lastPage) ? newPage : this.activePage;
        this._refreshComponent();
    }


    private _refreshComponent() {
        const start = ((this.activePage - 1) * this.itemsPerPage) + 1;
        const end = Math.min(start + this.itemsPerPage, this._items.length);

        this.rangeText = `${start} - ${end} of ${this._items.length}`;

        // Change enablation of prev and next buttons
        this.prevBtnDisabled = (this.activePage <= 1);
        this.nextBtnDisabled = (this.activePage >= this._lastPage);

        this.activeItems = [];

        for (let i = start - 1; i < end; i++) {
            if (this._items[i]) {
                this.activeItems.push(this._items[i].rendered);
            }
        }
    }

    private _throwIfUndefined(attrName: string) {
        if (typeof this[attrName] === "undefined") {
            throw new Error(`PaginationTableComponent: Attribute ${attrName} must be defined`);
        }
    }

    private _setDefaultIfUndefined(attrName: string, defValue: any) {
        if (typeof this[attrName] === "undefined") {
            this[attrName] = defValue;
        }
    }


}