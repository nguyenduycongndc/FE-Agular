import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { semesterConfiguration } from '../../../_models/semester-configuration';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationParametersSemesterService {

  constructor(private httpClient: HttpClient) { }
  //show dữ liệu lên form sửa
  getByIdSemesterConfiguration(id: any){
    return this.httpClient.get<any>(`${environment.apiUrl}/semester/show/${id}`)
    .pipe(map(res=>{
      return res;
    }));
  }
  //list theo năm
  searchByInput(years: any) {
    return this.httpClient.post(`${environment.apiUrl}/semester/list`, { years })
      .pipe(map(res => {
        return res;
      }));

  }
  //Tìm kiếm
  searchByKeyWord(search: any, years: any){
    return this.httpClient
    .post<any>(`${environment.apiUrl}/semester/list`,{search, years})
    .pipe(delay(1000),map(res => {
      return res;
    }));
  }
  //list
  List() {
    return this.httpClient.get<any>(`${environment.apiUrl}/year/dropdownlist`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  //thêm mới học kỳ
  addSemesterConfiguration(formData: FormData){
    return(this.httpClient.post(`${environment.apiUrl}/semester/create`, formData))
    .pipe(map(res => {
      return res;
    }));
  }
  // addSemesterConfiguration(year_id: any, name: any, start_date: any, end_date: any){
  //   return(this.httpClient.post(`${environment.apiUrl}/semester/create`, { year_id, name, start_date, end_date }))
  //   .pipe(map(res => {
  //     return res;
  //   }));
  // }
  //Cập nhật
  // updateSemesterConfiguration(id: number,formData: FormData){
  //   return this.httpClient
  //     .put<any>(`${environment.apiUrl}/semester/update/${id}`,  formData)
  //     .pipe(map(res => {
  //       return res;
  //     }));
  // }
  updateSemesterConfiguration(id: number,year_id: any, name: any, start_date: any, end_date: any,  status: number, exam_time: number){
    return this.httpClient
      .put<any>(`${environment.apiUrl}/semester/update/${id}`, {   year_id, name, start_date, end_date, status, exam_time})
      .pipe(map(res => {
        return res;
      }));
  }
  deleteSemesterConfiguration(id){
    return this.httpClient
      .delete<any>(`${environment.apiUrl}/semester/delete/${id}`)
      .pipe(map(res => {
        return res;
      }));
  }
  activeSemester(id: number) {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/semester/active/${id}`)
      .pipe(map(res => {
        return res;
      }));
  }
  inActiveSemester(id: number) {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/semester/inactive/${id}`)
      .pipe(map(res => {
        return res;
      }));
  }
}
