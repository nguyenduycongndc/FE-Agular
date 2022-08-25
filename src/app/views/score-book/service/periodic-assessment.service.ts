import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PeriodicAssessmentService {
  constructor(private httpClient: HttpClient) {}
  //tab lớp
  tabClass(formData: FormData) {
    return this.httpClient
      .post<any>(
        `${environment.apiUrl}/class_study_program/mark_board`,
        formData
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  //lấy ds học sinh
  listStudent(class_id: number, detail_study_program_id: number) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/class_study_program/student`, {
        class_id,
        detail_study_program_id,
      })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
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
  //danh sách học kỳ
  listSemester(year_id: any, level: number) {
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
  //phổ điểm
  spectralPoint(study_program_id: number, detail_study_program_id: number) {
    return this.httpClient
      .post<any>(
        `${environment.apiUrl}/class_study_program/student_mark_board`,
        { study_program_id, detail_study_program_id }
      )
      .pipe(
        map((ress) => {
          return ress;
        })
      );
  }
  //lưu thêm mới
  savePoint(formData: FormData) {
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
  //list mark_board
  listMarkBoard(
    class_id: any,
    subject_id: any,
    semester_id: any,
    mid_or_last: any,
    detail_study_program_id: any,
    subject_type: any,
  ) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/mark_board/list`, {
        class_id,
        subject_id,
        semester_id,
        mid_or_last,
        detail_study_program_id,
        subject_type,
      })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  //list nhận xét môn học
  listCommentSubject(){
    return this.httpClient
      .get<any>(`${environment.apiUrl}/mark_board/list_comment_subject`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
}
