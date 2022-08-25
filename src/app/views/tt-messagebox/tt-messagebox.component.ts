import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'tt-messagebox',
  templateUrl: './tt-messagebox.component.html',
  styleUrls: ['./tt-messagebox.component.scss']
})
export class TtMessageBoxComponent implements OnInit, OnChanges {

  @Input() isShowConfirm: boolean = false;
  @Input() isShowYNCConfirm: boolean = false;
  @Input() isShowMessage: boolean = false;
  @Input() message: string = '';
  @Input() callback: Function;

  @Output() isShowConfirmChange = new EventEmitter<boolean>();
  @Output() isShowYNCConfirmChange = new EventEmitter<boolean>();
  @Output() isShowMessageChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isShowConfirm) {
      this.isShowConfirmChange.emit(this.isShowConfirm);
    }
    if (changes.isShowYNCConfirm) {
      this.isShowYNCConfirmChange.emit(this.isShowYNCConfirm);
    }
    if (changes.isShowMessage) {
      this.isShowMessageChange.emit(this.isShowMessage);
    }
  }

  confirm() {
    if (this.callback) {
      this.callback(true);
    }
    this.isShowConfirm = false;
    this.isShowConfirmChange.emit(this.isShowConfirm);

    this.isShowYNCConfirm = false;
    this.isShowYNCConfirmChange.emit(this.isShowYNCConfirm);

    this.isShowMessage = false;
    this.isShowMessageChange.emit(this.isShowMessage);
  }

  reject() {
    if (this.callback) {
      this.callback(false);
    }
    this.isShowConfirm = false;
    this.isShowConfirmChange.emit(this.isShowConfirm);

    this.isShowYNCConfirm = false;
    this.isShowYNCConfirmChange.emit(this.isShowYNCConfirm);

    this.isShowMessage = false;
    this.isShowMessageChange.emit(this.isShowMessage);
  }

  cancel() {
    if (this.callback) {
      this.callback(null);
    }
    this.isShowConfirm = false;
    this.isShowConfirmChange.emit(this.isShowConfirm);

    this.isShowYNCConfirm = false;
    this.isShowYNCConfirmChange.emit(this.isShowYNCConfirm);

    this.isShowMessage = false;
    this.isShowMessageChange.emit(this.isShowMessage);
  }
}
