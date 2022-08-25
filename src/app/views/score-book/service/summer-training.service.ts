import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SummerTrainingService {
  constructor(private httpClient: HttpClient) { }
  //drop year
  listYear() {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/year/dropdownlist`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  //danh sách lớp
  listClass(year_id: number) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/class_study_program/class_list`, {
        year_id,
      })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  filter(class_id: any, year_id: any){
    let params = new HttpParams()
      .set("class_id", class_id)
      .set("year_id", year_id);
    return this.httpClient
    .get<any>(
      `${environment.apiUrl}/retest/list?` + params
    )
    .pipe(
      map((res) => {
        return res;
      })
    );
  }
  save(formData: FormData){
    return this.httpClient
    .post<any>(`${environment.apiUrl}/retest/create`, formData)
    .pipe(
      map((res) => {
        return res;
      })
    );
  }
}
