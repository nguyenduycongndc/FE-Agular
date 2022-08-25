import { ScheduleComponent } from "./schedule/schedule.component";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxPaginationModule } from "ngx-pagination";
import { TtSharedModule } from "../../tt-shared/tt-shared.module";
import { AssignHomeroomTeachingComponent } from "./assign-homeroom-teaching/assign-homeroom-teaching.component";
import { AssignOfTeachingComponent } from "./assign-of-teaching/assign-of-teaching.component";
import { TeachingRoutingModule } from "./teaching-routing.module";
@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    TeachingRoutingModule,
    TtSharedModule,
  ],
  declarations: [
    AssignHomeroomTeachingComponent,
    AssignOfTeachingComponent,
    ScheduleComponent,
  ],
  exports: [],
  providers: [],
})
export class TeachingModule {}
