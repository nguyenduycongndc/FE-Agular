import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationParametersGradeService {

constructor(private httpClient: HttpClient) { }
//list grid
  listGrade(formData: FormData){
    return this.httpClient.post(`${environment.apiUrl}/grade/list`, formData)
      .pipe(map(res => {
        return res;
      }));
  }
  //thêm grade
  createGrade( year_id:any, name: string, school_id: any, description: string, level: any){
    return this.httpClient.post(`${environment.apiUrl}/grade/create`, { year_id,name,school_id,description, level})
    .pipe(map(res => {
      return res;
    }));
  }
  //show dữ liệu modal sửa
  getByIdGrade(id: any){
    return this.httpClient.get<any>(`${environment.apiUrl}/grade/show/${id}`)
    .pipe(map(res=>{
      return res;
    }));
  }
  //Sửa grade
  updateGrade(id: any, school_id: any, name: any, description: any, status: number){
    return this.httpClient.put<any>(`${environment.apiUrl}/grade/update/${id}`,{id, school_id, name, description, status})
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  //Xóa grade
  deleteGrade(id: number){
    return this.httpClient.delete<any>(`${environment.apiUrl}/grade/delete/${id}`)
    .pipe(
      map(res => {
        return res;
      })
    )
  }
  getYears() {
    return this.httpClient.get<any>(`${environment.apiUrl}/year/dropdownlist`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  getYearsAdd() {
    return this.httpClient.get<any>(`${environment.apiUrl}/year/dropdownlist_add`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
}
