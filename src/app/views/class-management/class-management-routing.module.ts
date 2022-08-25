import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClassManagementSubjectComponent } from './class-management-subject/class-management-subject.component';
import { ClassManagementStudentComponent } from './class-management-student/class-management-student.component';
import { ClassManagementListComponent } from './class-management-list/class-management-list.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Quản lý lớp học'
    },
    children: [
      {
        path: '',
        redirectTo: 'class-management'
      },
      {
        path: 'class-management-list',
        component: ClassManagementListComponent,
        data: {
          title: 'Danh sách lớp học'
        }
      },
      {
        path: 'class-management-student',
        component: ClassManagementStudentComponent,
        data: {
          title: 'Danh sách học sinh theo lớp'
        }
      },
      {
        path: 'class-management-subject',
        component: ClassManagementSubjectComponent,
        data: {
          title: 'Danh sách môn học theo lớp'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassManagementRoutingModule {}
