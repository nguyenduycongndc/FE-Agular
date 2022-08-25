import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AssignHomeroomTeachingService {
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
  //list khối
  getGradeList(years: any,) {
    return this.httpClient.post<any>(`${environment.apiUrl}/grade/dropdownlist_update`, { years })
      .pipe(map(res => {
        return res;
      }));
  }
  //Lọc khi có Giáo viên
  listAssignHomeroomTeaching(search: any, years: any, grades: any, x: any) {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/assign_homeroom_teacher/list?search=${search}` + x + years + x + grades)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  //Lọc khi có Giáo viên
  // searchAssignHomeroomTeaching(search: any) {
  //   return this.httpClient
  //     .get<any>(`${environment.apiUrl}/assign_homeroom_teacher/list?search=${search}`)
  //     .pipe(
  //       map((res) => {
  //         return res;
  //       })
  //     );
  // }
  //loc lớp + khối
  listClass(years: any, grades: any, status: number) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/class/list`, { years, grades, status })
      .pipe(map(res => {
        return res;
      }));
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
  getTeachersNotAssigned() {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/assign_homeroom_teacher/list_teacher`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  //Thêm +Lưu
  // saveTeacher(formData: FormData) {
  //   return this.httpClient
  //     .post<any>(
  //       `${environment.apiUrl}/assign_homeroom_teacher/create`,
  //       formData
  //     )
  //     .pipe(
  //       map((res) => {
  //         return res;
  //       })
  //     );
  // }
  saveTeacher(data: any) {
    return this.httpClient
      .post<any>(
        `${environment.apiUrl}/assign_homeroom_teacher/create`,
        data
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
}
