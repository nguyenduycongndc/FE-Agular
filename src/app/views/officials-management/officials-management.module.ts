import { NgSelectModule } from '@ng-select/ng-select';
import { OfficialsManagementRoutingModule } from "./officials-management-routing.module";
import { OfficialsListComponent } from "./officials-list/officials-list.component";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TtSharedModule } from '../../tt-shared/tt-shared.module';
import { OnlynumberDirective } from './officials-list/onlynumber.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    OfficialsManagementRoutingModule,
    TtSharedModule,
  ],
  declarations: [OfficialsListComponent,OnlynumberDirective],
  exports: [],
  providers: [],
})
export class OfficialsManagementModule {}
