import { AttendanceComponent } from "./attendance/attendance.component";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { NgxPaginationModule } from "ngx-pagination";
import { StudentManagementRoutingModule } from "./student-management-routing.module";
import { StudentManagementAddComponent } from "./student-management-add/student-management-add.component";
import { StudentManagementAddAccountInformationComponent } from "./student-management-add/student-management-add-account-information/student-management-add-account-information.component";
import { StudentManagementAddBasicInformationComponent } from "./student-management-add/student-management-add-basic-information/student-management-add-basic-information.component";
import { StudentManagementAddDetailInformationComponent } from "./student-management-add/student-management-add-detail-information/student-management-add-detail-information.component";
import { StudentManagementAddParentInformationComponent } from "./student-management-add/student-management-add-parent-information/student-management-add-parent-information.component";
import { StudentManagementListComponent } from "./student-management-list/student-management-list.component";
import { StudentManagementUpdateAccountInformationComponent } from "./student-management-list/student-management-update-account-information/student-management-update-account-information.component";
import { StudentManagementUpdateBasicInformationComponent } from "./student-management-list/student-management-update-basic-information/student-management-update-basic-information.component";
import { StudentManagementUpdateDetailComponent } from "./student-management-list/student-management-update-detail/student-management-update-detail.component";
import { StudentManagementUpdateParentInformationComponent } from "./student-management-list/student-management-update-parent-information/student-management-update-parent-information.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { SubjectRegistrationComponent } from "./subject-registration/subject-registration.component";
import { TtSharedModule } from "../../tt-shared/tt-shared.module";
import { ExemptionListComponent } from "./exemption-list/exemption-list.component";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxIntlTelInputModule,
    StudentManagementRoutingModule,
    NgSelectModule,
    TtSharedModule,
  ],
  declarations: [
    StudentManagementAddComponent,
    StudentManagementAddAccountInformationComponent,
    StudentManagementAddBasicInformationComponent,
    StudentManagementAddDetailInformationComponent,
    StudentManagementAddParentInformationComponent,
    StudentManagementListComponent,
    StudentManagementUpdateAccountInformationComponent,
    StudentManagementUpdateBasicInformationComponent,
    StudentManagementUpdateDetailComponent,
    StudentManagementUpdateParentInformationComponent,
    SubjectRegistrationComponent,
    ExemptionListComponent,
    AttendanceComponent,
  ],
  exports: [],
  providers: [],
})
export class StudentManagementModule {}
