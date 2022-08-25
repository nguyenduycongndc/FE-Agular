import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ConfigurationSchoolComponent } from "./configuration-school/configuration-school.component";
import { ConfigurationYearComponent } from "./configuration-year/configuration-year.component";
import { ConfigurationSemesterComponent } from "./configuration-semester/configuration-semester.component";
import { ConfigurationParametersRoutingModule } from "./configuration-parameters-routing.module";
import { NgxPaginationModule } from "ngx-pagination";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { ConfigurationLessonComponent } from "./configuration-lesson/configuration-lesson.component";
import { ConfigurationGradeComponent } from "./configuration-grade/configuration-grade.component";
import { DeclareSubjectComponent } from "./declare-subject/declare-subject.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { ConfigurationCommentFormComponent } from "./configuration-comment-form/configuration-comment-form.component";
import { StudyProgramComponent } from "./study-program/study-program.component";
import { StudyTimeHolidayComponent } from "./study-time-holiday/study-time-holiday.component";
import { LockUnlockAcademicTranscriptComponent } from "./lock-unlock-academic-transcript/lock-unlock-academic-transcript.component";
import { HolidayComponent} from "./study-time-holiday/holidays/holidays.component"
import {WeekdayComponent} from "./study-time-holiday/weekdays/weekdays.component"
import { MtConfirmComponent } from "./study-time-holiday/mt-confirm/mt-confirm.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxIntlTelInputModule,
    ConfigurationParametersRoutingModule,
    NgSelectModule,
  ],
  declarations: [
    ConfigurationSchoolComponent,
    ConfigurationYearComponent,
    ConfigurationSemesterComponent,
    ConfigurationLessonComponent,
    ConfigurationGradeComponent,
    DeclareSubjectComponent,
    ConfigurationCommentFormComponent,
    StudyProgramComponent,
    StudyTimeHolidayComponent,
    LockUnlockAcademicTranscriptComponent,
    HolidayComponent,
    WeekdayComponent,
    MtConfirmComponent
  ],
  exports: [],
  providers: [],
})
export class ConfigurationParametersModule {}
