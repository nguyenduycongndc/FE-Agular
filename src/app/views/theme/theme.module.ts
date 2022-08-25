// Angular
import { CommonModule } from '@angular/common';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { ColorsComponent } from './colors.component';
import { TypographyComponent } from './typography.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
// Theme Routing
import { ThemeRoutingModule } from './theme-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeRoutingModule,
    HttpClientModule
  ],
  declarations: [
  ],
  providers: [
  ]
})
export class ThemeModule { }
