import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentManagementAccountInformationService {

  constructor(private httpClient: HttpClient) { }

  updateAccount(id: any, formData: FormData) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/student/update/${id}`, formData)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
}
