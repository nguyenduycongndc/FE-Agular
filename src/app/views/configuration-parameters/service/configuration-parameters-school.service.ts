import { Years } from './../../../_models/year';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { School } from '../../../_models/school';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationParametersSchoolService {
  constructor(
    private httpClient: HttpClient
  ) { }

  find(id: number){
    return this.httpClient.get<any>(`${environment.apiUrl}/school/show/${id}`)
    .pipe(map(res => {
      return res;
    }));
  }

  show_logo(id: number) {
    return this.httpClient.get(`${environment.apiUrl}/school/show_logo/${id}`, { responseType: 'blob' });
  }

  update(id: number, formData: FormData) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/school/update/${id}`, formData)
      .pipe(map(res => {
        return res;
      }));
  }
}
