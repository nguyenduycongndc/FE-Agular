import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxPaginationModule } from "ngx-pagination";
import { TtSharedModule } from "../../tt-shared/tt-shared.module";
import { AcademicTranscriptComponent } from "./academic-transcript/academic-transcript.component";
import { ClassSummationsComponent } from "./class-summations/class-summations.component";
import { PeriodicAssessmentComponent } from "./periodic-assessment/periodic-assessment.component";
import { PrimarySchoolAcademicTranscriptComponent } from "./primary-school-academic-transcript/primary-school-academic-transcript.component";
import { ScoreBookRoutingModule } from "./score-book-routing.module";
import { SummerTrainingComponent } from "./summer-training/summer-training.component";
@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    ScoreBookRoutingModule,
    TtSharedModule
  ],
  declarations: [
    PeriodicAssessmentComponent,
    AcademicTranscriptComponent,
    PrimarySchoolAcademicTranscriptComponent,
    SummerTrainingComponent,
    ClassSummationsComponent,
  ],
  exports: [],
  providers: [],
})
export class ScoreBookModule {}
