import { HttpClient } from '@angular/common/http';
// services/common.service.ts
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private http: HttpClient) { }

  getDropDownText(id, object) {
    const selObj = _.filter(object, function (o) {
      return (_.includes(id, o.id));
    });
    return selObj;
  }
  // Lấy dữ liệu dropdown list năm hiện tại và tương lai
  getCurrentFutureYear() {
    return this.http.get<any>(`${environment.apiUrl}/year/dropdownlist_add`)
      .pipe(map(res => {
        return res;
      }));
  }

  // Lấy dữ liệu dropdown list học kỳ hiện tại của năm hiện tại
  getSemesterCurrentYear() {
    return this.http.get<any>(`${environment.apiUrl}/semester/current_year_semester`)
      .pipe(map(res => {
        return res;
      }));
  }

  // Lấy dữ liệu dropdown list khối theo năm
  getGradeList(years: any) {
    return this.http.post<any>(`${environment.apiUrl}/grade/dropdownlist_update`, { years })
      .pipe(map(res => {
        return res;
      }));
  }

}
