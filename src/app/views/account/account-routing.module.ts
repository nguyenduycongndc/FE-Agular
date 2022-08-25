import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountInformationComponent } from './account-information/account-information.component';
import { ChangePassComponent } from './change-pass/change-pass.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Quản lý tài khoản'
    },
    children: [
      {
        path: '',
        redirectTo: 'account-information'
      },
      {
        path: 'account-information',
        component: AccountInformationComponent,
        data: {
          title: 'account-information'
        }
      },
      {
        path: 'change-pass',
        component: ChangePassComponent,
        data: {
          title: 'Thay đổi mật khẩu'
        }
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
