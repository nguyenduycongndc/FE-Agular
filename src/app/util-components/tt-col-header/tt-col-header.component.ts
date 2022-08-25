import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { UtilityService } from '../../_services/utils.service';

@Component({
  selector: '[tt-col-header]',
  templateUrl: './tt-col-header.component.html',
  styleUrls: ['./tt-col-header.component.scss']
})
export class TtColHeaderComponent implements OnInit, OnDestroy {

  @Input() tableId: string = '';
  @Input() field: string;
  @Input() header: string;
  @Input() fieldType: string = 'string';

  @Input() sortFields: string[] = [];

  @Input() data: any[];
  @Output() dataChange = new EventEmitter<any>();

  subscriptionOnSortColumn: Subscription

  sortDirection: number = 0;

  constructor(private _utilsService: UtilityService) { }

  ngOnInit() {
    this.subscriptionOnSortColumn = this._utilsService.onSortColumn.subscribe((sortingData) => {
      if (sortingData && sortingData.tableId == this.tableId && sortingData.field != this.field) {
        this.sortDirection = 0;
      }
    });
    if (!this.sortFields || this.sortFields.length == 0) {
      if (this.field) {
        this.sortFields = [this.field];
      }
    }
  }

  ngOnDestroy() {
    // this._utilsService.onSortColumn.unsubscribe();
    this.subscriptionOnSortColumn.unsubscribe();
  }

  sort() {
    this._utilsService.onSortColumn.emit({ tableId: this.tableId, field: this.field });
    if (this.sortDirection == 0) this.sortDirection = 1;
    else this.sortDirection = this.sortDirection * -1;
    if (this.data && this.data.length > 0) {
      switch (this.fieldType) {
        case 'number':
          this.data.sort((a, b) => {
            // return this.sortDirection * (a[this.field] || Number.MIN_VALUE) - (b[this.field] || Number.MIN_VALUE);
            return this.sortDirection * this.compareNumber(a, b);
          });
        case 'string':
        case 'boolean':
        default:
          this.data.sort((a, b) => {
            // return this.sortDirection * (('' + (a[this.field] || '')).localeCompare('' + (b[this.field] || '')));
            return this.sortDirection * this.compareDefault(a, b);

          });
      }
      this.dataChange.emit(this.data);
      this._utilsService.onSortColumnCompleted.emit({ tableId: this.tableId, data: this.data });
    }
  }

  compareDefault(a, b): number {
    let rs = 0;
    for (let i = 0; i < this.sortFields.length; i++) {
      let field = this.sortFields[i];
      rs = (('' + (a[field] || '')).localeCompare('' + (b[field] || '')));
      if (rs != 0) {
        break;
      }
    }
    return rs;
  }

  compareNumber(a, b): number {
    let rs = 0;
    for (let i = 0; i < this.sortFields.length; i++) {
      let field = this.sortFields[i];
      rs = (a[field] || Number.MIN_VALUE) - (b[field] || Number.MIN_VALUE);
      if (rs != 0) {
        break;
      }
    }
    return rs;
  }
}
