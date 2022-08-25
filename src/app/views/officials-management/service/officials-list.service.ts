import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OfficialsListService {

constructor(private httpClient: HttpClient) { }

listDataSource(years: any,) {
  return this.httpClient.post<any>(`${environment.apiUrl}/teacher/list`, { years })
    .pipe(map(res => {
      return res;
    }));
}

create(formData: FormData) {
  return this.httpClient.post<any>(`${environment.apiUrl}` + '/teacher/create/', formData)
    .pipe(
      map(res => {
        return res;
      })
    );
}

update(id: number, formData: FormData) {
  return this.httpClient.post<any>(`${environment.apiUrl}/teacher/update/${id}`, formData)
    .pipe(
      map(res => {
        return res;
      })
    );
}

find(id: number) {
  return this.httpClient.get<any>(`${environment.apiUrl}/teacher/show/${id}`)
    .pipe(
      map((res) => {
        return res;
      })
    );
}

listTeacher(name: any, position_id: any, degree_id: any, status: any, x: any) {
  return this.httpClient
    .get<any>(`${environment.apiUrl}/teacher/list?name=${name}` + x + position_id + x + degree_id + x + status)
    .pipe(
      map((res) => {
        return res;
      })
    );
}

filter(formData: FormData) {
  return this.httpClient
    .post<any>(`${environment.apiUrl}/teacher/list`, formData)
    .pipe(map(res => {
      return res;
    }));
}

delete(id) {
  return this.httpClient
    .delete<any>(`${environment.apiUrl}/teacher/delete/${id}`)
    .pipe(
      map((res) => {
        return res;
      })
    );
}

importExcel(formData: FormData) {
  let headers = new HttpHeaders();

  headers.append('Content-Type', 'multipart/form-data');
  headers.append('Accept', 'application/json');

  const httpOptions = { headers: headers };

  return this.httpClient.post<any>(`${environment.apiUrl}/teacher/import`, formData, httpOptions)
    .pipe(map(res => {
      return res;
    }));
}

exportExcel(formData: FormData) {
  return this.httpClient.post(`${environment.apiUrl}/teacher/list`, formData, {responseType: 'blob'})
    .pipe(map(res => {
      return res;
    }));
}


// exportExcelErrors(data:any) {
//   return this.httpClient.post(`${environment.apiUrl}/teacher/export`, {data},{responseType: 'blob'})
//     .pipe(map(res => {
//       return res;
//     }));
// }
exportExcelErrors(data : any) {
  return this.httpClient.post(`${environment.apiUrl}/teacher/export`,{data},{ responseType:'blob' })
    .pipe(map(res => {
      return res;
    }));
}

 // Tải file mẫu
 public downloadSampleFile(){
  return this.httpClient.get(`${environment.apiUrl}/teacher/get_sample_file`, { responseType: 'blob' as 'json' });
}


}
