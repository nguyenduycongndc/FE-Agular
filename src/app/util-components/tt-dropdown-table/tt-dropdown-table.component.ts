import {
  Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild
} from '@angular/core';

@Component({
  selector: 'tt-dropdown-table',
  templateUrl: './tt-dropdown-table.component.html',
  styleUrls: ['./tt-dropdown-table.component.scss']
})
export class TtDropdownTableComponent implements OnInit, OnChanges {

  @Input() placeholder: string = 'Chọn...';
  @Input() data: any[];
  @Input() dataAll: any[];
  @Input() cols: any[] = [
    { field: 'value', header: 'Value' },
    { field: 'label', header: 'Label' }
  ];
  @Input() valueField: string = 'value';
  @Input() displayField: string = 'label';
  @Input() searchFields: string[] = ['label'];

  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();
  @Output() onBeforeClearValue = new EventEmitter<any>();

  @Input() displayValue: string = '';
  @Output() displayValueChange = new EventEmitter<string>();

  @ViewChild('filterInput') filterInput: ElementRef

  filterString: string = '';

  isShowTable: boolean = false;
  isFocusOutSide: boolean = true;
  selectedRowId: number = -1;
  selectingRowIndex: number = -1;

  dataFiltered: any[] = [];

  initialized: boolean = false;

  constructor() { }

  ngOnInit() {
    this.initialized = true;
    setTimeout(() => {
      this.processOnChangeValue();
      this.processOnChangeData();
    }, 200);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.initialized) {
      if (changes.data) {
        this.processOnChangeData();
      }
      if (changes.value) {
        this.processOnChangeValue();
      }
    }
  }

  processOnChangeData() {
    this.setRowId(this.data);
    this.setSearchField(this.data);
    this.filterData();
    this.setSelectedRowIdByValue();
    if (!this.dataAll || this.dataAll.length == 0 && this.data) {
      this.dataAll = JSON.parse(JSON.stringify(this.data));
    }
  }

  processOnChangeValue() {
    this.setSelectedRowIdByValue();
    this.setDisplayValue();
  }

  setSearchField(data) {
    if (data) {
      if (this.searchFields && this.searchFields.length > 0) {
        data.forEach(e => {
          e.searchField = '';
          this.searchFields.forEach(sf => {
            e.searchField += (e[sf] || '') + ' ';
          });
          e.searchField = e.searchField.trim();
        });
      }
    }
  }

  setRowId(data) {
    if (data) {
      for (let i = 0; i < data.length; i++) {
        data[i]._rowId = i;
      }
    }
  }

  filterData() {
    if (this.data) {
      let tempFiltered = [];
      if (this.filterString && this.filterString.length > 1) {
        // tempFiltered = this.data.filter(p => p.searchField.includes(this.filterString));
        var regex = new RegExp(this.filterString, "i");
        tempFiltered = this.data.filter(p => regex.test(p.searchField));
        this.dataFiltered = JSON.parse(JSON.stringify(tempFiltered));
      } else {
        this.dataFiltered = this.data;
      }
      this.setRowIndex(this.dataFiltered);
    }
  }

  setRowIndex(data) {
    if (data) {
      for (let i = 0; i < data.length; i++) {
        data[i]._rowIndex = i;
      }
    }
  }

  onFocusIn() {
    this.isFocusOutSide = false;
    this.showTable();
  }

  onFocusOut() {
    this.isFocusOutSide = true;
    setTimeout(() => {
      if (this.isFocusOutSide) {
        this.hideTable();
      }
      this.isFocusOutSide = true;
    }, 200);
  }

  onKeyUp(event) {
    switch (event.key) {
      case 'ArrowUp':
        this.processKeyArrowUp();
        break;
      case 'ArrowDown':
        this.processKeyArrowDown();
        break;
      case 'Enter':
        this.processKeyEnter();
        break;
      default:
        let regex = /^[a-z0-9]$/i;
        if (event.key.match(regex)) {
          this.filterInput.nativeElement.focus();
          if (!this.filterString) this.filterString = '';
          this.filterString += event.key;
          this.filterData();
        }
        break;
    }
  }

  onFilterKeyUp(event) {
    // alert(event.key);
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'Enter':
        this.onKeyUp(event);
        break;
      default:
        this.filterData();
        break;
    }
  }

  onClickToTable() {
    this.isFocusOutSide = false;
  }

  showTable() {
    this.isShowTable = true;
  }

  hideTable() {
    this.isShowTable = false;
    this.filterString = '';
    this.filterData();
  }

  processKeyArrowUp() {
    if (!this.isShowTable) this.isShowTable = true;
    this.selectingRowIndex--;
    if (this.dataFiltered) {
      if (this.selectingRowIndex < 0) this.selectingRowIndex = 0;
    } else {
      this.selectingRowIndex = -1;
    }
  }

  processKeyArrowDown() {
    if (!this.isShowTable) this.isShowTable = true;
    this.selectingRowIndex++;
    if (this.dataFiltered) {
      if (this.selectingRowIndex >= this.dataFiltered.length) this.selectingRowIndex = this.dataFiltered.length - 1;
    } else {
      this.selectingRowIndex = -1;
    }
  }

  processKeyEnter() {
    if (this.dataFiltered) {
      let item = this.dataFiltered.find(p => p._rowIndex == this.selectingRowIndex);
      if (item) {
        this.selectItem(item);
      }
    }
  }

  selectItem(item) {
    this.value = item[this.valueField];
    this.displayValue = item[this.displayField];
    this.selectedRowId = item._rowId;
    this.selectingRowIndex = -1;
    this.valueChange.emit(this.value);
    this.displayValueChange.emit(this.displayValue);
    this.isFocusOutSide = true;
    this.hideTable();
  }

  setSelectedRowIdByValue() {
    if (this.dataFiltered && this.value != null) {
      let item = this.dataFiltered.find(p => p[this.valueField] == this.value);
      if (item) {
        this.selectedRowId = item._rowId;
        // this.displayValue = item[this.displayField];
        // this.displayValueChange.emit(this.displayValue);
      } else {
        this.selectedRowId = -1;
      }
    } else {
      this.selectedRowId = -1;
    }
  }

  setDisplayValue() {
    if (this.dataAll && this.value != null) {
      let item = this.dataAll.find(p => p[this.valueField] == this.value);
      if (item) {
        this.displayValue = item[this.displayField];
        this.displayValueChange.emit(this.displayValue);
      } else {
        this.displayValue = '';
        this.displayValueChange.emit(this.displayValue);
      }
    } else {
      this.displayValue = '';
      this.displayValueChange.emit(this.displayValue);
    }
  }

  clearValue() {
    this.onBeforeClearValue.emit(this.value);
    this.value = null;
    this.displayValue = '';
    this.selectedRowId = -1;
    this.selectingRowIndex = -1;
    this.valueChange.emit(this.value);
    this.displayValueChange.emit(this.displayValue);
  }

  onFilterChanged(evt) {
    this.filterData();
  }

  isValueNotNullOrEmpty() {
    return this.value != null;
  }
}
