import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { delay, map } from "rxjs/operators";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AcademicTranscriptService {
  constructor(private httpClient: HttpClient) {}

  // Lấy danh sách năm
  yearList() {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/year/dropdownlist`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  // Lấy danh sách lớp
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

  // Lấy danh sách học kỳ
  semesterList(year_id: any, level: number) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/class_study_program/semester_list`, {
        year_id,
        level,
      })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  // Lấy đầu điểm từ cấu hình chương trình học để sinh cột tương ứng
  regularExamConfigList(
    study_program_id: number,
    detail_study_program_id: number
  ) {
    return this.httpClient
      .post<any>(
        `${environment.apiUrl}/class_study_program/student_mark_board`,
        { study_program_id, detail_study_program_id }
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  subjectList(filterData) {
    return this.httpClient
      .post<any>(
        `${environment.apiUrl}/class_study_program/mark_board`,
        filterData
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  studentList(filterData: FormData) {
    return this.httpClient
      .post<any>(
        `${environment.apiUrl}/class_study_program/student`,
        filterData
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  coefficientSubjectTypeList(filterData) {
    return this.httpClient
      .post<any>(
        `${environment.apiUrl}/class_study_program/student_mark_board`,
        filterData
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  markBoardList(filterData) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/mark_board/list`, filterData)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  createMarkBoard(formData: FormData) {
    return this.httpClient
      .post<any>(
        `${environment.apiUrl}/class_study_program/create_mark_board`,
        formData
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
}
