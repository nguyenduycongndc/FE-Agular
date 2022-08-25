import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { UtilityService } from '../../_services/utils.service';

@Component({
  selector: 'tt-paginator',
  templateUrl: './tt-paginator.component.html',
  styleUrls: ['./tt-paginator.component.scss']
})
export class TtPaginatorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() tableId: string = '';
  @Input() data: any[] = [];
  @Input() dataPaged: any[] = [];
  @Input() pageSize: number = 10;
  @Input() totalPages: number = 0;
  @Input() currentPage: number = 1;

  @Output() dataPagedChange = new EventEmitter<any>();
  @Output() totalPagesChange = new EventEmitter<number>();
  @Output() currentPageChange = new EventEmitter<number>();

  rowNumberFrom: number = 1;
  rowNumberTo: number = 1;

  pagingButtons: any[] = [];

  initialized = false;
  firstTime = true;

  filterString: string = '';
  filterField: string = '';
  dataFiltered: any[] = [];

  subscriptionOnSortColumnCompleted: Subscription;
  subscriptionOnFilterColumn: Subscription;

  constructor(private _utilsService: UtilityService) { }

  ngOnInit() {
    this.subscriptionOnSortColumnCompleted = this._utilsService.onSortColumnCompleted.subscribe((newData) => {
      if (newData && newData.tableId == this.tableId && newData.data && newData.data.length > 0) {
        this.onDataChanged();
      }
    });
    this.subscriptionOnFilterColumn = this._utilsService.onFilterColumn.subscribe((filteringData) => {
      if (filteringData && filteringData.tableId == this.tableId) {
        this.filterField = filteringData.field || '';
        this.filterString = filteringData.filterString || '';
        this.onDataChanged();
      }
    });
    this.onDataChanged();
    this.initialized = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.initialized) {
      if (changes.data) {
        this.onDataChanged();
      }
      if (changes.pageSize) {
        this.onDataChanged();
      }
    }
  }

  ngOnDestroy() {
    // this._utilsService.onSortColumnCompleted.unsubscribe();
    // this._utilsService.onFilterColumn.unsubscribe();
    this.subscriptionOnSortColumnCompleted.unsubscribe();
    this.subscriptionOnFilterColumn.unsubscribe();
  }

  onDataChanged() {
    this.filterData();
    this.resetProps(this.dataFiltered);
    this.selectPage(this.currentPage);
  }

  filterData() {
    if (this.filterString) {
      var regex = new RegExp(this.filterString, "i");
      this.dataFiltered = this.data.filter(p => regex.test(p[this.filterField]));
    } else {
      this.dataFiltered = this.data;
    }
    this.addRowNumber(this.dataFiltered);
  }

  resetProps(data: any[]) {
    this.dataPaged = [];
    if (data) {
      this.totalPages = Math.ceil((data.length / this.pageSize));
    } else {
      this.totalPages = 1;
    }
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    if (this.currentPage <= 0) this.currentPage = 1;
  };

  addRowNumber(data: any[]) {
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        data[i]._rowNumber = i + 1;
      }
    }
  }

  selectPage(pageNumber: number) {
    // if (this.data && this.data.length > 0) {
    if (this.dataFiltered) {
      this.currentPage = pageNumber;
      this.rowNumberFrom = (this.currentPage - 1) * this.pageSize + 1;
      this.rowNumberTo = this.currentPage * this.pageSize;
      // if (this.rowNumberTo > this.data.length) this.rowNumberTo = this.data.length;
      if (this.rowNumberTo > this.dataFiltered.length) this.rowNumberTo = this.dataFiltered.length;
      this.genPagingButtons();
      // this.dataPaged = this.data.filter(p => p._rowNumber >= this.rowNumberFrom && p._rowNumber <= this.rowNumberTo);
      this.dataPaged = this.dataFiltered.filter(p => p._rowNumber >= this.rowNumberFrom && p._rowNumber <= this.rowNumberTo);
      if (this.firstTime) {
        setTimeout(() => {
          this.firstTime = false;
          this.currentPageChange.emit(this.currentPage);
          this.dataPagedChange.emit(this.dataPaged);
        }, 100);
      } else {
        setTimeout(() => {
          this.currentPageChange.emit(this.currentPage);
          this.dataPagedChange.emit(this.dataPaged);
        }, 20);
      }
    }
  }

  genPagingButtons() {
    this.pagingButtons = [];
    let prePage = this.currentPage - 1;
    if (prePage < 1) prePage = 1;
    let nextPage = this.currentPage + 1;
    if (nextPage > this.totalPages) nextPage = this.totalPages;

    this.pagingButtons.push({
      value: prePage,
      label: '<',
      disabled: this.currentPage <= 1,
      isPrevious: true
    });

    this.pagingButtons.push({
      value: 1,
      label: '1',
      selected: this.currentPage == 1,
    });

    if (this.totalPages <= 7) {
      for (let i = 2; i <= this.totalPages - 1; i++) {
        this.pagingButtons.push({
          value: i,
          label: i.toString(),
          selected: this.currentPage == i,
        });
      }
    } else {
      if (this.currentPage >= 5 && this.currentPage <= this.totalPages - 4) {
        this.pagingButtons.push({
          value: this.currentPage - 2,
          label: '...'
        });

        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          this.pagingButtons.push({
            value: i,
            label: i.toString(),
            selected: this.currentPage == i,
          });
        }

        this.pagingButtons.push({
          value: this.currentPage + 2,
          label: '...'
        });
      } else if (this.currentPage <= 4) {
        for (let i = 2; i <= 5; i++) {
          this.pagingButtons.push({
            value: i,
            label: i.toString(),
            selected: this.currentPage == i,
          });
        }

        this.pagingButtons.push({
          value: 6,
          label: '...'
        });
      } else {
        this.pagingButtons.push({
          value: this.totalPages - 5,
          label: '...'
        });

        for (let i = this.totalPages - 4; i <= this.totalPages - 1; i++) {
          this.pagingButtons.push({
            value: i,
            label: i.toString(),
            selected: this.currentPage == i,
          });
        }
      }
    }

    if (this.totalPages > 1) {
      this.pagingButtons.push({
        value: this.totalPages,
        label: this.totalPages.toString(),
        selected: this.currentPage == this.totalPages,
      });
    }

    this.pagingButtons.push({
      value: nextPage,
      label: '>',
      disabled: this.currentPage >= this.totalPages,
      isNext: true
    });
  }

}
