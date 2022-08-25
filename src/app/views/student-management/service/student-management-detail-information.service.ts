import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentManagementDetailInformationService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(
    private httpClient: HttpClient
  ) { }

//danh sách tôn giáo (religion)
list_religion() {
  return this.httpClient.get<any>(`${environment.apiUrl}/religion/dropdownlist`)
    .pipe(
      map(res => {
        return res;
      })
    );
}

getProvince() {
  return this.httpClient
    .get<any>(`${environment.apiUrl}/province/list`)
    .pipe(map(res => {
      return res;
    }));
}
getDistrict(id: number) {
  return this.httpClient
    .get<any>(`${environment.apiUrl}/district/dropdownlist/${id}`)
    .pipe(map(res => {
      return res;
    }));
}
getWard(id: number) {
  return this.httpClient
    .get<any>(`${environment.apiUrl}/ward/dropdownlist/${id}`)
    .pipe(map(res => {
      return res;
    }));
}

getStudentById(id: number) {
  return this.httpClient
    .get<any>(`${environment.apiUrl}/student/show/${id}`)
    .pipe(map(res => {
      return res;
    }));
}

showInforStudent(id: number) {
  return this.httpClient.get(`${environment.apiUrl}/student/show/${id}`);
}

update (id: number, formData: FormData) {
  return this.httpClient.post<any>(`${environment.apiUrl}/student/update/${id}`, formData)
    .pipe(
      map(res => {
        return res;
      })
    );
}

}
