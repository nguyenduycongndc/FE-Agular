import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'tt-ng-select-header-selectall',
  templateUrl: './tt-ng-select-header-selectall.component.html',
  styleUrls: ['./tt-ng-select-header-selectall.component.scss']
})
export class TtNgSelectHeaderSelectallComponent implements OnInit {

  @Input() items: any[] = [];
  @Input() valueField: string = 'value';

  @Input() value: any[] = [];
  @Output() valueChange = new EventEmitter<any[]>();

  constructor() { }

  ngOnInit() {
  }

  selectAll() {
    if (this.items) {
      this.value = this.items.map(p => p[this.valueField]);
      this.valueChange.emit(this.value);
    } else {
      this.value = [];
      this.valueChange.emit(this.value);
    }
  }

  deSelectAll() {
    this.value = [];
    this.valueChange.emit(this.value);
  }

}
