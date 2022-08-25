import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ConfigurationSchoolComponent } from "./configuration-school/configuration-school.component";
import { ConfigurationSemesterComponent } from "./configuration-semester/configuration-semester.component";
import { ConfigurationYearComponent } from "./configuration-year/configuration-year.component";
import { ConfigurationLessonComponent } from "./configuration-lesson/configuration-lesson.component";
import { ConfigurationGradeComponent } from "./configuration-grade/configuration-grade.component";
import { DeclareSubjectComponent } from "./declare-subject/declare-subject.component";
import { ConfigurationCommentFormComponent } from "./configuration-comment-form/configuration-comment-form.component";
import { StudyProgramComponent } from "./study-program/study-program.component";
import { StudyTimeHolidayComponent } from "./study-time-holiday/study-time-holiday.component";
import { LockUnlockAcademicTranscriptComponent } from "./lock-unlock-academic-transcript/lock-unlock-academic-transcript.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Tham số cấu hình",
    },
    children: [
      {
        path: "",
        redirectTo: "configuration-parameters",
      },
      {
        path: "configuration-school",
        component: ConfigurationSchoolComponent,
        data: {
          title: "Cấu hình trường học",
        },
      },
      {
        path: "configuration-year",
        component: ConfigurationYearComponent,
        data: {
          title: "Cấu hình năm học",
        },
      },
      {
        path: "configuration-semester",
        component: ConfigurationSemesterComponent,
        data: {
          title: "Cấu hình học kỳ",
        },
      },
      {
        path: "configuration-lesson",
        component: ConfigurationLessonComponent,
        data: {
          title: "Cấu hình tiết học",
        },
      },
      {
        path: "configuration-grade",
        component: ConfigurationGradeComponent,
        data: {
          title: "Cấu hình khối",
        },
      },
      {
        path: "declare-subject",
        component: DeclareSubjectComponent,
        data: {
          title: "Phân phối môn học",
        },
      },
      {
        path: "study-program",
        component: StudyProgramComponent,
        data: {
          title: "Chương trình học",
        },
      },
      {
        path: "configuration-comment-form",
        component: ConfigurationCommentFormComponent,
        data: {
          title: "Nhận xét mẫu",
        },
      },
      {
        path: "study-time-holiday",
        component: StudyTimeHolidayComponent,
        data: {
          title: "Thời gian học/ngày lễ",
        },
      },
      {
        path: "lock-unlock-academic-transcript",
        component: LockUnlockAcademicTranscriptComponent,
        data: {
          title: "Nhận xét mẫu",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationParametersRoutingModule {}
