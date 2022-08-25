import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'tt-ng-select-multi-label',
  templateUrl: './tt-ng-select-multi-label.component.html',
  styleUrls: ['./tt-ng-select-multi-label.component.scss']
})
export class TtNgSelectMultiLabelComponent implements OnInit {

  @Input() items: any[] = [];
  @Input() valueField: string = 'value';
  @Input() displayField: string = 'label';
  @Input() maxDisplayCount: number = 2;

  @Input() value: any[] = [];
  @Output() valueChange = new EventEmitter<any[]>();

  constructor() { }

  ngOnInit() {
  }

  removeItem(item) {
    if (item && item[this.valueField]) {
      this.value = this.items.filter(p => p[this.valueField] != item[this.valueField]).map(p => p[this.valueField]);
      this.valueChange.emit(this.value);
    }
  }

}
