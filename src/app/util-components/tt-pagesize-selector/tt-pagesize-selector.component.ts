import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'tt-pagesize-selector',
  templateUrl: './tt-pagesize-selector.component.html',
  styleUrls: ['./tt-pagesize-selector.component.scss']
})
export class TtPagesizeSelectorComponent implements OnInit {

  @Input() tabIndex: number = -1;

  @Input() pageSize: number = 10;
  @Output() pageSizeChange = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  changePageSize(value) {
    this.pageSize = value;
    this.pageSizeChange.emit(this.pageSize);
  }
}
