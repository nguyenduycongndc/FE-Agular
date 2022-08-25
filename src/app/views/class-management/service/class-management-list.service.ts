import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClassManagementListService {

  constructor(private http: HttpClient) { }
  //dropdown gradelist
  // getGradeList() {
  //   return this.http.post<any>(`${environment.apiUrl}/grade/dropdownlist`, null)
  //   .pipe(map(res => {
  //     return res;
  //   }));
  // }

  getAllYear() {
    return this.http.get<any>(`${environment.apiUrl}/year/dropdownlist`)
    .pipe(
      map((res) => {
        return res;
      })
    );
  }

  yearList() {
    return this.http.get<any>(`${environment.apiUrl}/year/dropdownlist_all_year`)
    .pipe(
      map((res) => {
        return res;
      })
    );
  }

  getGradeList(years: any) {
    return this.http.post<any>(`${environment.apiUrl}/grade/dropdownlist_update`, {years})
      .pipe(map(res => {
        return res;
      }));
  }
  //dropdown gradelist khi thêm sửa
  getGradeListInsert() {
    return this.http.get<any>(`${environment.apiUrl}/grade/current_year_grade`)
      .pipe(map(res => {
        return res;
      }));
  }
  //thêm lớp học
  createClassList(formData: FormData){
    return this.http.post<any>(`${environment.apiUrl}/class/create`, formData)
    .pipe(map(res =>{
      return res;
    }));
  }
  //show dữ liệu lên form sửa
  getIdClass(id: any){
    return this.http.get<any>(`${environment.apiUrl}/class/show/${id}`)
    .pipe(map(res =>{
      return res;
    }));
  }
  // sửa dữ liệu lớp
  updateClass(id: any,formData: FormData){
    return this.http.post<any>(`${environment.apiUrl}/class/update/${id}`, formData)
    .pipe(map(res => {
      return res;
    }));
  }
  // xóa
  deleteClass(id: any){
    return this.http.delete<any>(`${environment.apiUrl}/class/delete/${id}`)
    .pipe(map(res=>{
      return res;
    }))
  }
  //Tìm kiếm
  searchByKeyWord(search: any,status: boolean) {
    return this.http
    .post<any>(`${environment.apiUrl}/class/list`, {search, status})
      .pipe(delay(1000), map(res => {
        return res;
      }));
    }
    //loc
    searchByInput( grades: any, status: boolean, years:any) {
      return this.http
      .post<any>(`${environment.apiUrl}/class/list`, {grades, status,years})
        .pipe(delay(1000), map(res => {
          return res;
        }));
      }
}
