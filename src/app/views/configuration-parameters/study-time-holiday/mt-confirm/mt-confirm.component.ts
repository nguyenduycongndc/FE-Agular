import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mt-confirm',
  templateUrl: 'mt-confirm.component.html',
  styleUrls:['mt-confirm.component.scss']
})

export class MtConfirmComponent implements OnInit {
@Input() data_id:any;
@Output() emitData = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  implement(event){
    this.emitData.next(event);
  }
}
