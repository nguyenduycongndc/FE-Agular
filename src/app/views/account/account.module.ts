import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AccountRoutingModule } from './account-routing.module';
import { AccountInformationComponent } from './account-information/account-information.component';
import { ChangePassComponent } from './change-pass/change-pass.component';

@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    FormsModule,
    ReactiveFormsModule

  ],
  declarations: [
    AccountInformationComponent,
    ChangePassComponent

  ],

})
export class AccountModule { }
