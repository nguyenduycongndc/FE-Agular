import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserGroupConfigurationComponent } from './User-group-configuration/User-group-configuration.component';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UserAccountManagementComponent } from './user-account-management/user-account-management.component';
import { AddUserAccountManagementComponent } from './add-user-account-management/add-user-account-management.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    UserManagementRoutingModule,
    NgxPaginationModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxIntlTelInputModule
  ],

  declarations: [
    UserGroupConfigurationComponent,
    UserAccountManagementComponent,
    AddUserAccountManagementComponent
  ],
  exports: [
  ], providers: [

  ]
})
export class UserManagementModule { }
