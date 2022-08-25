import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Subjects } from '../../../_models/subject';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationParametersDeclareSubjectService {

  constructor(
    private httpClient: HttpClient
  ) { }
  getAll(): Observable<Subjects[]> {
    return this.httpClient.get<Subjects[]>(`${environment.apiUrl}` + '/subject/list')
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  filterSubject(grades: any, status: any ,years:any) {
    return this.httpClient.post(`${environment.apiUrl}/subject/list`, { grades, status, years })
      .pipe(map(res => {
        return res;
      }));
  }
  // Tìm kiếm cấu hình nhóm người sử dụng theo mã nhóm và tên nhóm
  // searchByKeyWord(search: any) {
  //   return this.httpClient
  //     .post<any>(`${environment.apiUrl}/subject/list?search=${search}`, null)
  //     .pipe(map(res => {
  //       return res;
  //     }));
  // }
  //Tìm kiếm
  searchByKeyWord(search: any, grades: any, status: any) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/subject/list`, { search, grades, status })
      .pipe(delay(1000), map(res => {
        return res;
      }));
  }

  create(formData: FormData) {
    return this.httpClient.post<Subjects>(`${environment.apiUrl}` + '/subject/create/', formData)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getSchoolTime(years: any, level:any) {
    return this.httpClient.post<any>(`${environment.apiUrl}/semester/dropdownlist`,{years, level})
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  getAllSemester(years:any) {
    return this.httpClient.post<any>(`${environment.apiUrl}/semester/dropdownlist_all_semester`,{years})
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getYears() {
    return this.httpClient.get<any>(`${environment.apiUrl}/year/dropdownlist`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  findByIdSubject(id: number) {
    return this.httpClient.get<any>(`${environment.apiUrl}/subject/show/${id}`)
      .pipe(map(res => {
        return res;
      }));
  }

  getSemesterCurrentYear() {
    return this.httpClient.get<any>(`${environment.apiUrl}/semester/current_year_semester`)
      .pipe(map(res => {
        return res;
      }));
  }

  update(id: number, formData: FormData) {
    return this.httpClient.post<any>(`${environment.apiUrl}/subject/update/${id}`, formData)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  delete(id) {
    return this.httpClient.delete<Subjects>(`${environment.apiUrl}/subject/delete/${id}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }


  semesterList(years: any) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/semester/dropdownlist`, {years})
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  // getGradeList() {
  //   return this.httpClient.post<any>(`${environment.apiUrl}/grade/dropdownlist`, null)
  //     .pipe(map(res => {
  //       return res;
  //     }));
  // }

  getGradeList(years: any,) {
    return this.httpClient.post<any>(`${environment.apiUrl}/grade/dropdownlist_update`, {years})
      .pipe(map(res => {
        return res;
      }));
  }

  downloadTemplate() {
    return this.httpClient.get(`${environment.apiUrl}/subject/get_sample_file`, { responseType: 'blob' as 'json' });
  }
  importExcel(formData: FormData) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const httpOptions = { headers: headers };
    return this.httpClient.post<any>(`${environment.apiUrl}/subject/import`, formData, httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  exportExcel(search: any, grades: any, status: any, export_subject: any) {
    return this.httpClient.post(`${environment.apiUrl}/subject/list`, { search, grades, status, export_subject }, { responseType: 'blob' })
      .pipe(map(res => {
        return res;
      }));
  }

  exportErrorExcel(data_export:any){
    return this.httpClient.post(`${environment.apiUrl}/subject/export_error`, {data_export}, { responseType: 'blob'})
      .pipe(map(res=>{
        return res;
      }));
  }
}
