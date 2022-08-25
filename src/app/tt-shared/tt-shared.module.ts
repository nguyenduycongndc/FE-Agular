import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TtColHeaderComponent } from '../util-components/tt-col-header/tt-col-header.component';
import { TtColFilterComponent } from '../util-components/tt-col-filter/tt-col-filter.component';
import { TtPagesizeSelectorComponent } from '../util-components/tt-pagesize-selector/tt-pagesize-selector.component';
import { TtPaginatorComponent } from '../util-components/tt-paginator/tt-paginator.component';
import { TtDropdownTableComponent } from '../util-components/tt-dropdown-table/tt-dropdown-table.component';
import { TtNgSelectHeaderSelectallComponent } from '../util-components/tt-ng-select-header-selectall/tt-ng-select-header-selectall.component';
import { TtNgSelectMultiLabelComponent } from '../util-components/tt-ng-select-multi-label/tt-ng-select-multi-label.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TtColHeaderComponent,
    TtPagesizeSelectorComponent,
    TtPaginatorComponent,
    TtColFilterComponent,
    TtDropdownTableComponent,
    TtNgSelectHeaderSelectallComponent,
    TtNgSelectMultiLabelComponent,
  ],
  exports: [
    TtColHeaderComponent,
    TtColFilterComponent,
    TtPagesizeSelectorComponent,
    TtPaginatorComponent,
    TtDropdownTableComponent,
    TtNgSelectHeaderSelectallComponent,
    TtNgSelectMultiLabelComponent,
  ]
})
export class TtSharedModule { }
