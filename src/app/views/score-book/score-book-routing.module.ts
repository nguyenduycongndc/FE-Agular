import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AcademicTranscriptComponent } from "./academic-transcript/academic-transcript.component";
import { ClassSummationsComponent } from "./class-summations/class-summations.component";
import { PeriodicAssessmentComponent } from "./periodic-assessment/periodic-assessment.component";
import { PrimarySchoolAcademicTranscriptComponent } from "./primary-school-academic-transcript/primary-school-academic-transcript.component";
import { SummerTrainingComponent } from "./summer-training/summer-training.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Sổ điểm điện tử",
    },
    children: [
      {
        path: "",
        redirectTo: "score-book",
      },
      {
        path: "periodic-assessment",
        component: PeriodicAssessmentComponent,
        data: {
          title: "Đánh giá định kỳ môn học",
        },
      },
      {
        path: "academic-transcript",
        component: AcademicTranscriptComponent,
        data: {
          title: "Sổ điểm",
        },
      },
      {
        path: "summer-training",
        component: SummerTrainingComponent,
        data: {
          title: "Thi lại rèn luyện trong hè",
        },
      },
      {
        path: "primary-school-academic-transcript",
        component: PrimarySchoolAcademicTranscriptComponent,
        data: {
          title: "Bảng tổng hợp đánh giá kết quả giáo dục",
        },
      },
      {
        path: "class-summations",
        component: ClassSummationsComponent,
        data: {
          title: "Tổng kết theo lớp",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoreBookRoutingModule {}
