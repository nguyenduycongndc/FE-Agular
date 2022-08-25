import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Import Containers
import { DefaultLayoutComponent } from "./containers";

import { P404Component } from "./views/error/404.component";
import { P500Component } from "./views/error/500.component";
import { LoginComponent } from "./views/login/login.component";
import { RegisterComponent } from "./views/register/register.component";
import { AuthGuard } from "./_helpers";
import { ChangePasswordComponent } from "./views/change-password/change-password.component";
import { ForgotPasswordComponent } from "./views/forgot-password/forgot-password/forgot-password.component";

export const routes: Routes = [
  // { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  //   { path: 'login', component: LoginComponent },

  //   // otherwise redirect to home
  //   { path: '**', redirectTo: '' },
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "404",
    component: P404Component,
    data: {
      title: "Page 404",
    },
  },
  {
    path: "500",
    component: P500Component,
    data: {
      title: "Page 500",
    },
  },
  {
    path: "login",
    component: LoginComponent,
    data: {
      title: "Login Page",
    },
  },
  {
    path: "register",
    component: RegisterComponent,
    data: {
      title: "Register Page",
    },
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
    data: {
      title: "Forgot-Password Page",
    },
  },
  {
    path: "change-password",
    component: ChangePasswordComponent,
    data: {
      title: "Change-Password Page",
    },
  },
  {
    path: "",
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Dashboard",
    },
    children: [
      {
        path: "base",
        loadChildren: () =>
          import("./views/base/base.module").then((m) => m.BaseModule),
      },
      {
        path: "buttons",
        loadChildren: () =>
          import("./views/buttons/buttons.module").then((m) => m.ButtonsModule),
      },
      {
        path: "charts",
        loadChildren: () =>
          import("./views/chartjs/chartjs.module").then((m) => m.ChartJSModule),
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import("./views/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: "icons",
        loadChildren: () =>
          import("./views/icons/icons.module").then((m) => m.IconsModule),
      },
      {
        path: "notifications",
        loadChildren: () =>
          import("./views/notifications/notifications.module").then(
            (m) => m.NotificationsModule
          ),
      },
      {
        path: "widgets",
        loadChildren: () =>
          import("./views/widgets/widgets.module").then((m) => m.WidgetsModule),
      },
      {
        path: "account",
        loadChildren: () =>
          import("./views/account/account.module").then((m) => m.AccountModule),
      },
      {
        path: "user-management",
        loadChildren: () =>
          import("./views/user-management/user-management.module").then(
            (m) => m.UserManagementModule
          ),
      },
      {
        path: "configuration-parameters",
        loadChildren: () =>
          import(
            "./views/configuration-parameters/configuration-parameters.module"
          ).then((m) => m.ConfigurationParametersModule),
      },
      {
        path: "class-management",
        loadChildren: () =>
          import("./views/class-management/class-management.module").then(
            (m) => m.ClassManagementModule
          ),
      },
      {
        path: "student-management",
        loadChildren: () =>
          import("./views/student-management/student.management.module").then(
            (m) => m.StudentManagementModule
          ),
      },
      {
        path: "officials-management",
        loadChildren: () =>
          import(
            "./views/officials-management/officials-management.module"
          ).then((m) => m.OfficialsManagementModule),
      },
      {
        path: "score-book",
        loadChildren: () =>
          import("./views/score-book/score-book.module").then(
            (m) => m.ScoreBookModule
          ),
      },
      {
        path: "teaching",
        loadChildren: () =>
          import("./views/teaching/teaching.module").then(
            (m) => m.TeachingModule
          ),
      },
    ],
  },
  { path: "**", component: P404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
