import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UtilityService } from './_services/utils.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  // template: '<router-outlet></router-outlet>',
  templateUrl: './app.component.html',
  // styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {

  isShowConfirm: boolean = false;
  isShowYNCConfirm: boolean = false;
  isShowMessage: boolean = false;
  message: string = '';
  callback: Function;

  constructor(private router: Router,
    private _utilsService: UtilityService
  ) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
    this._utilsService.onShowConfirm.subscribe(data => {
      this.message = data.message;
      this.callback = data.callback;
      this.isShowConfirm = true;
    });
    this._utilsService.onShowConfirmYesNoCancel.subscribe(data => {
      this.message = data.message;
      this.callback = data.callback;
      this.isShowYNCConfirm = true;
    });
    this._utilsService.onShowMessage.subscribe(data => {
      this.message = data.message;
      this.callback = data.callback;
      this.isShowMessage = true;
    });
  }

  ngOnDestroy() {
    this._utilsService.onShowConfirm.unsubscribe();
    this._utilsService.onShowConfirmYesNoCancel.unsubscribe();
    this._utilsService.onShowMessage.unsubscribe();
  }
}
