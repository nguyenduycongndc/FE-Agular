import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import { AnyCnameRecord } from 'dns';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentManagementAddAccountInformationService {

constructor(private HttpClient: HttpClient) { }

updateAccount(id: any, formData: FormData){
  return this.HttpClient
  .post<any>(`${environment.apiUrl}/student/update/${id}`,formData)
    .pipe(
      map(res => {
        return res;
    })
  );
}
}


