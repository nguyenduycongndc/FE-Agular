import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ClassManagementStudentService {
  constructor(private http: HttpClient) {}

  yearList() {
    return this.http.get<any>(`${environment.apiUrl}/year/dropdownlist`)
    .pipe(
      map((res) => {
        return res;
      })
    );
  }

  semesterList(years: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/semester/dropdownlist`, {years})
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  gradeList(years: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/grade/dropdownlist_all_grades`,{years})
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  getGradeList(years: any) {
    return this.http.post<any>(`${environment.apiUrl}/grade/dropdownlist_update`, {years})
      .pipe(map(res => {
        return res;
      }));
  }

  classListInsert() {
    return this.http
      .get<any>(`${environment.apiUrl}/class_student/class_list`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  classListSearch(grades: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/class/dropdownlist`,{grades})
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  studentList() {
    return this.http
      .get<any>(`${environment.apiUrl}/class_student/student_list`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  classStudentList() {
    return this.http
      .post<any>(`${environment.apiUrl}/class_student/list`, null)
      .pipe(
        map((res) => {
          res.genderT = res["query"]["gender"] === 0 ? "Nam" : "Nữ";
          return res;
        })
      );
  }

  searchByKeyWord(search: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/class_student/list`,{search})
      .pipe(map(res => {
        return res;
      }));
  }

  // searchByInput(years: any, grades: any, classes:any,semester:any) {
  //   return this.http.post(`${environment.apiUrl}/class_student/list`, { years, grades, classes, semester })
  //     .pipe(map(res => {
  //       return res;
  //     }));
  // }

  searchByInput(years:any,semester:any,grades:any,classes:any) {
    return this.http.post(`${environment.apiUrl}/class_student/list`, {years,semester,grades,classes})
      .pipe(map(res => {
        return res;
      }));
  }

  // Thêm mới
   insertUserAccount(formData: FormData) {
    return this.http
      .post<any>(`${environment.apiUrl}/class_student/create`, formData)
      .pipe(map(res => {
        return res;
      }));
  }


  delete(formData: FormData){
    return this.http.post<any>(`${environment.apiUrl}/class_student/delete/`,formData)
      .pipe(
        map(res => {
          return res;
        })
      );
  }


  // getId(id: number) {
  //   return this.http.get<any>(`${environment.apiUrl}/class_student/show/${id}`)
  //     .pipe(map(res => {
  //       return res;
  //     }));
  // }


  // Import excel cấu hình nhóm người sử dụng
  importExcel(formData: FormData) {
    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    const httpOptions = { headers: headers };

    return this.http.post<any>(`${environment.apiUrl}/class_student/import`, formData, httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  exportExcel(formData: FormData) {
    return this.http.post(`${environment.apiUrl}/class_student/list`, formData, {responseType: 'blob'})
      .pipe(map(res => {
        return res;
      }));
  }


  exportExcelErrors(data_error:any) {
    return this.http.post(`${environment.apiUrl}/class_student/export_errors`, {data_error},{responseType: 'blob'})
      .pipe(map(res => {
        return res;
      }));
  }

   // Tải file mẫu
   public downloadSampleFile(){
    return this.http.get(`${environment.apiUrl}/class_student/download_sample_file_excel`, { responseType: 'blob' as 'json' });
  }

}
