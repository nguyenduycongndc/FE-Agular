import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Subjects } from '../../../_models/subject';

@Injectable({
  providedIn: 'root'
})
export class StudentManagementParentInformationService {

  constructor(
    private httpClient: HttpClient
  ) { }
  // getAll(): Observable<Subjects[]> {
  //   return this.httpClient.get<Subjects[]>(`${environment.apiUrl}` + '/subject/list')
  //     .pipe(
  //       map(res => {
  //         return res;
  //       })
  //     );
  // }

  // filterSubject(grades: any, status: any) {
  //   return this.httpClient.post(`${environment.apiUrl}/subject/list`, { grades, status })
  //     .pipe(map(res => {
  //       return res;
  //     }));
  // }

  // searchByKeyWord(search: any, grades: any, status: any) {
  //   return this.httpClient
  //     .post<any>(`${environment.apiUrl}/subject/list`, { search, grades, status })
  //     .pipe(delay(1000), map(res => {
  //       return res;
  //     }));
  // }


  findByIdParentInformation(id: number) {
    return this.httpClient.get<any>(`${environment.apiUrl}/student/show/${id}`)
      .pipe(map(res => {
        return res;
      }));
  }

  update (id: number, formData: FormData) {
    return this.httpClient.post<any>(`${environment.apiUrl}/student/update/${id}`, formData)
      .pipe(
        map(res => {
          return res;
        })
      );
  }


  // update(id: number, name: string, symbol: string, grade_id: number, subject_kind: number, subject_type: number, lesson: number, description: string, tab: number) {
  //   return this.httpClient.put<any>(`${environment.apiUrl}/subject/update/${id}`, { name, symbol, grade_id, subject_kind, subject_type, lesson, description, tab})
  //     .pipe(
  //       map(res => {
  //         return res;
  //       })
  //     );
  // }

  delete(id) {
    return this.httpClient.delete<Subjects>(`${environment.apiUrl}/subject/delete/${id}`)
      .pipe(
        map(res => {
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

  // downloadTemplate() {
  //   return this.httpClient.get(`${environment.apiUrl}/subject/get_sample_file`, { responseType: 'blob' as 'json' });
  // }
  // importExcel(formData: FormData) {
  //   let headers = new HttpHeaders();
  //   headers.append('Content-Type', 'multipart/form-data');
  //   headers.append('Accept', 'application/json');
  //   const httpOptions = { headers: headers };
  //   return this.httpClient.post<any>(`${environment.apiUrl}/subject/import`, formData, httpOptions)
  //     .pipe(map(res => {
  //       return res;
  //     }));
  // }

  // exportExcel(search: any, grades: any, status: any, export_subject: any) {
  //   return this.httpClient.post(`${environment.apiUrl}/subject/list`, { search, grades, status, export_subject }, { responseType: 'blob' })
  //     .pipe(map(res => {
  //       return res;
  //     }));
  // }
}
