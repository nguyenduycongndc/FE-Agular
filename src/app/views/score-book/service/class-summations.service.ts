import { map } from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ClassSummationsService {
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
  //danh sách học kỳ
  semesterList(year_id: any, level: number) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/class_study_program/semester_list`, {
        year_id,
        level,
      })
      .pipe(
        map((ress) => {
          return ress;
        })
      );
  }

  subjectList(class_id: any, semester_id: any, last_summary: any) {
    let params = new HttpParams()
      .set("class_id", class_id)
      .set("semester_id", semester_id)
      .set("last_summary", last_summary);
    return this.httpClient
      .get<any>(`${environment.apiUrl}/academic_transcript/subject?` + params)
      .pipe(
        map((ress) => {
          return ress;
        })
      );
  }

  classSummationList(class_id: any, last_summary: number) {
    return this.httpClient
      .get<any>(
        `${environment.apiUrl}/academic_transcript/list?class_id=` +
          class_id +
          `&last_summary=` +
          last_summary
      )
      .pipe(
        map((ress) => {
          return ress;
        })
      );
  }

  summaryCreate(formData: FormData) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/academic_transcript/create`, formData)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  summarySave(formData: FormData) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/academic_transcript/update`, formData)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
}
