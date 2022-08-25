import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UtilityService } from '../../_services/utils.service';

@Component({
  selector: 'tt-col-filter',
  templateUrl: './tt-col-filter.component.html',
  styleUrls: ['./tt-col-filter.component.scss']
})
export class TtColFilterComponent implements OnInit, OnChanges {

  @Input() tableId: string = '';
  @Input() field: string = '';

  @Output() onFilterChanged = new EventEmitter<any>();

  filterString: string = ''

  constructor(private _utilsService: UtilityService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  onValueChange(value) {
    this.filterString = value;
    this.filterData();
  }

  filterData() {
    let emitData = {
      tableId: this.tableId,
      field: this.field,
      filterString: this.filterString
    };
    this.onFilterChanged.emit(emitData);
    this._utilsService.onFilterColumn.emit(emitData);
  }

  clearValue() {
    this.filterString = '';
    this.filterData();
  }
}
