import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AssignHomeroomTeachingComponent } from "./assign-homeroom-teaching/assign-homeroom-teaching.component";
import { AssignOfTeachingComponent } from "./assign-of-teaching/assign-of-teaching.component";
import { ScheduleComponent } from "./schedule/schedule.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Giảng dạy",
    },
    children: [
      {
        path: "",
        redirectTo: "teaching",
      },
      {
        path: "assign-homeroom-teaching",
        component: AssignHomeroomTeachingComponent,
        data: {
          title: "Phân công chủ nhiệm",
        },
      },
      {
        path: "assign-of-teaching",
        component: AssignOfTeachingComponent,
        data: {
          title: "Phân công giảng dạy",
        },
      },
      {
        path: "schedule",
        component: ScheduleComponent,
        data: {
          title: "Thời khóa biểu",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeachingRoutingModule {}
