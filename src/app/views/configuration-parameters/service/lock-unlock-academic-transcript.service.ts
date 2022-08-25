import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LockUnlockAcademicTranscriptService {

constructor(private httpClient: HttpClient) { }
listYear() {
  return this.httpClient
    .get<any>(`${environment.apiUrl}/year/dropdownlist`)
    .pipe(
      map((res) => {
        return res;
      })
    );
}

dropSemester(year_id: any, level: any){
  let params = new HttpParams()
    .set("year_id", year_id)
    .set("level", level);
  return this.httpClient
  .get<any>(`${environment.apiUrl}/block/drop_semester?` + params)
  .pipe(
    map((res) => {
      return res;
    }));
}

filter(formData: FormData) {
  return this.httpClient
    .post<any>(`${environment.apiUrl}/block/`, formData)
    .pipe(map(res => {
      return res;
    }));
}

create(formData: FormData){
  return(this.httpClient.post(`${environment.apiUrl}/block/create`, formData))
  .pipe(map(res => {
    return res;
  }));
}



}
