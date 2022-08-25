import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})

export class StudyTimeHolidayService{
  constructor(private httpClient: HttpClient) {}
  listWeekdays(year_id: any){
    return this.httpClient.get(`${environment.apiUrl}/weekday_schedule/list?year_id=${year_id}`)
    .pipe(
      map((res)=>{
        return res;
      })
    )
  }
  listHolidays(year_id: any){
    return this.httpClient.get(`${environment.apiUrl}/holiday_schedule/list?year_id=${year_id}`)
    .pipe(
      map((res)=>{
        return res;
      })
    )
  }
  createWeekdays(formData: FormData){
    return this.httpClient.post<any>(`${environment.apiUrl}/weekday_schedule/create`,formData)
    .pipe(
      map((res)=>{
        return res;
      })
    );
  }

  getAllYear(){
    return this.httpClient.get(`${environment.apiUrl}/year/dropdownlist`)
    .pipe(
      map(
        (res)=>{
          return res;
        }
      )
    )
  }

  createHolidays(formData: FormData){
    return this.httpClient.post(`${environment.apiUrl}/holiday_schedule/create`,formData)
    .pipe(
      map(
        (res)=>{
          return res;
        }
      )
    )
  }

  updateHoliday(id:any,name:any,start_date:any,end_date:any,repeat:any,status:any){
    return this.httpClient.put<any>(`${environment.apiUrl}/holiday_schedule/update/${id}`,
    {name:name,start_date:start_date,end_date:end_date,repeat:repeat,status:status})
    .pipe(
      map(
        (res)=>{
          return res;
        }
      )
    )
  }

  activeHoliday(id:any, status:any){
    return this.httpClient.put<any>(`${environment.apiUrl}/holiday_schedule/active/${id}`,{status: status})
    .pipe(
      map(
        (res)=>{
          return res;
        }
      )
    )
  }

  deleteHoliday(id:any){
    return this.httpClient.put<any>(`${environment.apiUrl}/holiday_schedule/delete/${id}`,{})
    .pipe(
      map(
        (res)=>{
          return res;
        }
      )
    )
  }
}
