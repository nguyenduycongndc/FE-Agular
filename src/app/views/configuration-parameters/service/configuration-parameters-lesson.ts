import { Lessons } from "./../../../_models/lesson";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ConfigurationParametersLessonService {
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };
  constructor(private httpClient: HttpClient) {}

  getAll() {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/lesson_config/list_active`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  getYears() {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/year/dropdownlist`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  // Tìm kiếm cấu hình nhóm người sử dụng theo mã nhóm và tên nhóm
  searchByCheckbox(status: any) {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/lesson_config/list?status=${status}`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  searchByFilter(formData: FormData) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/lesson_config/list`, formData)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  create(formData: FormData) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}` + "/lesson_config/create/", formData)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  getIdLesson(id: number) {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/lesson_config/show/${id}`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  update(
    id: number,
    start_date: any,
    end_date: any,
    start_time: any,
    end_time: any,
    description: any,
    name: any
  ) {
    return this.httpClient
      .put<any>(`${environment.apiUrl}/lesson_config/update/${id}`, {
        start_date,
        end_date,
        start_time,
        end_time,
        description,
        name,
      })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  // update(id: number, formData: FormData) {
  //   return this.httpClient
  //     .post<any>(`${environment.apiUrl}/lesson_config/update/${id}`, formData)
  //     .pipe(map(res => {
  //       return res;
  //     }));
  // }

  delete(id) {
    return this.httpClient
      .delete<any>(`${environment.apiUrl}/lesson_config/delete/${id}`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
}
