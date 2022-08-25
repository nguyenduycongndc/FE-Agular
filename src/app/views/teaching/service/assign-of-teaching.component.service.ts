import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AssignOfTeachingService {
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
  getGradeList(years: any,) {
    return this.httpClient.post<any>(`${environment.apiUrl}/grade/dropdownlist_update`, { years })
      .pipe(map(res => {
        return res;
      }));
  }
  classListInsert() {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/class_student/class_list`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  classListSearch(grades: any) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/class/dropdownlist`, { grades })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  //list teacher
  getAllTeacher() {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/teaching_assignment/list_teacher`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  //list môn học theo khối
  listSubjectGrade(grade_id: number) {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/teaching_assignment/drop_subject_grade?grade_id=${grade_id}`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  //list clas theo môn
  listClassSubject(subject_id: number) {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/teaching_assignment/drop_class_subject?subject_id=${subject_id}`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  //list học kỳ theo môn
  listSemesterSubject(subject_id: number) {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/teaching_assignment/drop_semester_subject?subject_id=${subject_id}`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  //list
  listTeachingAssignment(years: any, grades: any, classes: any, teachers: any, e: any) {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/teaching_assignment/?` + years + e + grades + e + classes + e + teachers)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  //thêm mới
  create(year_id: any, teacher_id: any, grade_id: any, class_id: any, subject_id: any, semester_id: number[],) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/teaching_assignment/create`, { year_id, teacher_id, grade_id, class_id, subject_id, semester_id })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  //cập nhật
  update(ids: any, year_id: any, teacher_id: any, grade_id: any, class_id: any, subject_id: any, semester_id: number[],) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/teaching_assignment/update`, {ids, year_id, teacher_id, grade_id, class_id, subject_id, semester_id })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  // Xóa
  delete(id: number) {
    return this.httpClient
      .put<any>(`${environment.apiUrl}/teaching_assignment/delete/${id}`, { id })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  // Xóa nhiều
  deleteMany(ids: number[]) {
    return this.httpClient
      .put<any>(`${environment.apiUrl}/teaching_assignment/delete_many`, { ids: ids })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  //drop tất cả học kỳ
  getAllSemester(years: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}/semester/dropdownlist_all_semester`, { years })
      .pipe(
        map(res => {
          return res;
        })
      );
  }
}
