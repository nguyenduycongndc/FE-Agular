import { OfficialsListComponent } from "./officials-list/officials-list.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Quản lý cán bộ",
    },
    children: [
      {
        path: "",
        redirectTo: "officials-management",
      },
      {
        path: "officials-list",
        component: OfficialsListComponent,
        data: {
          title: "Danh sách cán bộ",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfficialsManagementRoutingModule {}
