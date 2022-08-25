import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})

export class SubjectRegistrationService {
  constructor(private httpClient: HttpClient) {}

  getAllYear(){
    return this.httpClient.get<any>(`${environment.apiUrl}/year/dropdownlist`).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getClassFLYear(id: any){
    return this.httpClient.get<any>(`${environment.apiUrl}/class/list_fl_year/${id}`).pipe(
      map((res)=>{
      return res;
      })
    )
  }

  getSemesterFLLevel(year_id: any, level:any){
    return this.httpClient.get<any>(`${environment.apiUrl}/semester/dropdownlist_wt_year/${year_id}/${level}`).pipe(
      map((res)=>{
        return res;
      })
    )
  }

  getOption2(class_id:any, semester_id:any){
    return this.httpClient.get<any>(`${environment.apiUrl}/class_study_program/registration_list/${class_id}/${semester_id}`).pipe(
      map((res)=>{
        return res;
      })
    )
  }

  getStudent(class_id:any){
    return this.httpClient.get<any>(`${environment.apiUrl}/class_student/list_fl_student/${class_id}`).pipe(
      map((res)=>{
        return res;
      })
    )
  }

  getRegistrationList(class_id:any, semester_id:any){
    return this.httpClient.get<any>(`${environment.apiUrl}/class_study_program/show_registration_list/${class_id}/${semester_id}`).pipe(
      map((res)=>{
        return res;
      })
    )
  }

  postRegistrationList(class_id:any,semester_id:any,data:any){
    return this.httpClient.post<any>(`${environment.apiUrl}/class_study_program/create_registraion_list`,{class_id,semester_id,data}).pipe(
      map((res)=>{
        return res;
      })
    )
  }

}
