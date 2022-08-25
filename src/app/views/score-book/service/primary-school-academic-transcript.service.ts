import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PrimarySchoolAcademicTranscriptService {
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
  //List môn học + danh sách học sinh + điểm + Đánh giá
  listAll(class_id: any, year_id: any, semester_id: any) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/summary/list_subject`, { class_id, year_id, semester_id })
      .pipe(
        map((ress) => {
          return ress;
        })
      );
  }
  //Thêm mới + Update
  save(formData: FormData) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/summary/create`, formData)
      .pipe(
        map((ress) => {
          return ress;
        })
      );
  }
  //Drop năng lực
  dropCapacity(){
    return this.httpClient
      .get<any>(`${environment.apiUrl}/mark_board/list_comment_capacity`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  //Drop phẩm chất
  dropQuality(){
    return this.httpClient
      .get<any>(`${environment.apiUrl}/mark_board/list_comment_quality`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
}
