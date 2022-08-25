import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ClassManagementListComponent } from './class-management-list/class-management-list.component';
import { ClassManagementStudentComponent } from './class-management-student/class-management-student.component';
import { ClassManagementSubjectComponent } from './class-management-subject/class-management-subject.component';
import { ClassManagementRoutingModule } from './class-management-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TtSharedModule } from '../../tt-shared/tt-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgMultiSelectDropDownModule.forRoot(),
    ClassManagementRoutingModule,
    TtSharedModule
  ],
  declarations: [
    ClassManagementListComponent,
    ClassManagementStudentComponent,
    ClassManagementSubjectComponent
  ],
  exports: [
  ], providers: [
  ]
})
export class ClassManagementModule { }
