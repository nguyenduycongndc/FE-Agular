import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AttendanceService {
  constructor(private httpClient: HttpClient) {}

  // Danh sách năm học
  yearList() {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/year/dropdownlist`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  // Danh sách lớp học
  classList(year_id: number) {
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
  attendanceList(class_id: any, year_id: any, level: any, date: any) {
    const params = new HttpParams()
      .set("class_id", class_id)
      .set("year_id", year_id)
      .set("level", level)
      .set("date", date);
    return this.httpClient
      .get<any>(`${environment.apiUrl}/attendance/list?` + params)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  createOrUpdate(formData: FormData) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/attendance/create`, formData)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
}
