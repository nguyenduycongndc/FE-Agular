import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class StudyProgramService {
  constructor(private httpClient: HttpClient) {}
  listGrade(year_id: number) {
    return this.httpClient
      .get(`${environment.apiUrl}/study_program/dropdownlist_grade/${year_id}`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  listSemester(year_id: number, level: number) {
    return this.httpClient
      .get(
        `${environment.apiUrl}/study_program/dropdownlist_semester/${year_id}/${level}`
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  listStudyProgram(year_id: number) {
    return this.httpClient
      .post(`${environment.apiUrl}/study_program/list`, { year_id })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  createStudyProgram(formData: FormData) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/study_program/create`, formData)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  updateStudyProgram(id: number, formData: FormData) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/study_program/update/${id}`, formData)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  deleteStudyProgram(id: number) {
    return this.httpClient
      .delete<any>(`${environment.apiUrl}/study_program/delete/${id}`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  studyProgramCopy(formData: FormData) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/study_program/study_program_copy`, formData)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  subjectList(grade_id: number, semester_id: number) {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/detail_study_program/subject_list/${grade_id}/${semester_id}`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  classStudyProgram(grade_id: number) {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/class_study_program/dropdownlist_class/${grade_id}`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  applyClassStudyProgram(study_program_id: number) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/class_study_program/list`, {study_program_id})
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  listStudyProgramDetailHasData(study_program_id: number) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/detail_study_program/list`, {study_program_id})
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  createStudyProgramDetail(data: any) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/detail_study_program/create`, data)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  bilingualList(study_program_id: number) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/detail_study_program/bilingual_list`, {study_program_id})
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  updateBilingual(formData: FormData) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/detail_study_program/update_bilingual`, formData)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  createApplyClassStudyProgram(formData: FormData) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/class_study_program/create`, formData)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
}
