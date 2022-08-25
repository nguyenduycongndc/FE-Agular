import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "../../../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class ExemptionListService {
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
  listClass(year_id: any) {
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
  // getClassFLYear(id: any){
  //   return this.httpClient.get<any>(`${environment.apiUrl}/class/list_fl_year/${id}`).pipe(
  //     map((res)=>{
  //     return res;
  //     })
  //   )
  // }
  // getSemesterFLLevel(year_id: any, level:any){
  //   return this.httpClient.get<any>(`${environment.apiUrl}/semester/dropdownlist_wt_year/${year_id}/${level}`).pipe(
  //     map((res)=>{
  //       return res;
  //     })
  //   )
  // }
  //danh sách học kỳ
  listSemester(year_id: any, level: any) {
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
  //danh sách học sinh theo class
  listStudent(class_id: any) {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/subject_exemption/student?class_id=${class_id}`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  //danh sách môn học
  listSubject(class_id: any, semester_id: any, student_id: any) {
    const params = new HttpParams()
      .set('class_id', class_id.toString())
      .set('semester_id', semester_id.toString())
      .set('student_id', student_id.toString());
    return this.httpClient
      .get<any>(`${environment.apiUrl}/subject_exemption/subject?` + params)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  //thêm mới
  create(class_id: any, student_id: any, semester_id: any, detail_study_program_id: any, description: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}/subject_exemption/create`, { class_id, student_id, semester_id, detail_study_program_id, description })
      .pipe(map((res) => {
        return res;
      }))
  }
  //list grid
  listGrid(search: any, year_id: any, class_id: any, semester_id: any, e) {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/subject_exemption/list?search=${search}&year_id=${year_id}` + e + class_id + e + semester_id)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  //show dữ liệu form sửa
  show(id: any) {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/subject_exemption/show/` + id)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  //xóa
  delete(id: any) {
    return this.httpClient
      .put<any>(`${environment.apiUrl}/subject_exemption/delete/${id}`, { id })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  update(id: any, semester_id: any, detail_study_program_id: any, description: string) {
    return this.httpClient
      .put<any>(`${environment.apiUrl}/subject_exemption/update/${id}`, { id, semester_id, detail_study_program_id, description })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
}
