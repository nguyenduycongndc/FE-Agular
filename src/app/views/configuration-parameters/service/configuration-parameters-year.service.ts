import { Years } from './../../../_models/year';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationParametersYearService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(
    private httpClient: HttpClient
  ) { }
  getAll(): Observable<Years[]> {
    return this.httpClient.get<Years[]>(`${environment.apiUrl}` + '/year/list')
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  StatusActive(id: number) {
    return this.httpClient.get<any>(`${environment.apiUrl}/year/active/${id}`)
      .pipe(map(res => {
        return res;
      }))
  }
  // Tìm kiếm cấu hình nhóm người sử dụng theo mã nhóm và tên nhóm
  searchByKeyWord(search: any) {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/year/list?search=${search}`)
      .pipe(map(res => {
        return res;
      }));
  }

  create(formData: FormData) {
    return this.httpClient.post<any>(`${environment.apiUrl}` + '/year/create/', formData)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getIdYear(id: number) {
    return this.httpClient.get<any>(`${environment.apiUrl}/year/show/${id}`)
      .pipe(map(res => {
        return res;
      }));
  }

  update(id: number, formData: FormData) {
    return this.httpClient.post<any>(`${environment.apiUrl}/year/update/${id}`, formData)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  delete(id) {
    return this.httpClient.delete<Years>(`${environment.apiUrl}` + '/year/delete/' + id, this.httpOptions)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
}
