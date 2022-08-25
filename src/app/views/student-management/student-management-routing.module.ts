import { AttendanceComponent } from "./attendance/attendance.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ExemptionListComponent } from "./exemption-list/exemption-list.component";
import { StudentManagementAddComponent } from "./student-management-add/student-management-add.component";
import { StudentManagementListComponent } from "./student-management-list/student-management-list.component";
import { SubjectRegistrationComponent } from "./subject-registration/subject-registration.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Tham số cấu hình",
    },
    children: [
      {
        path: "",
        redirectTo: "student-management",
      },
      {
        path: "attendance",
        component: AttendanceComponent,
        data: {
          title: "Điểm danh",
        },
      },
      {
        path: "student-management-list",
        component: StudentManagementListComponent,
        data: {
          title: "Danh sách học sinh",
        },
      },
      {
        path: "student-management-add",
        component: StudentManagementAddComponent,
        data: {
          title: "Tạo mới học sinh",
        },
      },
      {
        path: "subject-registration",
        component: SubjectRegistrationComponent,
        data: {
          title: "Đăng ký môn học tự chọn",
        },
      },
      {
        path: "exemption-list",
        component: ExemptionListComponent,
        data: {
          title: "Danh sách miễn môn",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentManagementRoutingModule {}
