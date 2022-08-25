import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

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
      .get(`${environment.apiUrl}/study_program/dropdownlist_semester/${year_id}/${level}`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  listTreeSchedule(year_id: number){
    return this.httpClient
    .get(`${environment.apiUrl}/schedule/?year_id=${year_id}`)
    .pipe(
      map((res) => {
        return res;
      })
    );
  }
  //thêm cây thư mục
  createTreeSchedule(formdata: FormData){
    return this.httpClient.post<any>(`${environment.apiUrl}/schedule/create`, formdata)
    .pipe(map(res => {
      return res;
    }));
  }
  //sửa
  editTree(id: number,data: any){
    return this.httpClient.put<any>(`${environment.apiUrl}/schedule/update/${id}`, data)
    .pipe(map(res => {
      return res;
    }));
  }
  //sao chép
  copyTree(id : number,data: any){
    return this.httpClient.post<any>(`${environment.apiUrl}/schedule/coppy/?schedule_id=${id }`, data)
    .pipe(map(res => {
      return res;
    }));
  }
  //xóa cây
  deleteTree(id: number){
    return this.httpClient.delete<any>(`${environment.apiUrl}/schedule/delete/${id}`)
    .pipe(map(res => {
      return res;
    }));
  }
  //chi tiết thời khóa biểu
  detailSchedule(schedule_id: any, mor_or_after: any, grade_id: any, semester_id: any, level: any, year_id:any){
    let params = new HttpParams()
      .set("schedule_id", schedule_id)
      .set("mor_or_after", mor_or_after)
      .set("grade_id", grade_id)
      .set("semester_id", semester_id)
      .set("level",level)
      .set("year_id",year_id)
    return this.httpClient.get<any>(`${environment.apiUrl}/detail_schedule/?` + params )
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
     //list
  listTeachingAssignment(years: any, grades: any) {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/teaching_assignment/?years[0] =${years}&grade[0]=${grades}`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
}
