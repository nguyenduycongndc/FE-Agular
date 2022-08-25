import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationCommentFormService {

  constructor(private http: HttpClient) { }
  //tìm kiếm
  search(search: any){
    return this.http.post(`${environment.apiUrl}/comment/list`,{search})
      .pipe(delay(1000),map(res =>{
        return res;
      }));
  }
  //lọc
  filter(formData : FormData) {
    return this.http.post(`${environment.apiUrl}/comment/list`,formData)
      .pipe(map(res => {
        return res;
      }));
  }
  //thêm mới
  create(formData: FormData){
    return this.http.post<any>(`${environment.apiUrl}/comment/create`, formData)
      .pipe(map(res => {
        return res;
      }));
  }
  //show dữ liệu lên form sửa
  showData(id: any){
    return this.http.get<any>(`${environment.apiUrl}/comment/show/${id}`)
    .pipe(map(res =>{
      return res;
    }));
  }
  //cập nhật
  update(id: any, formData: FormData){
    return this.http.post<any>(`${environment.apiUrl}/comment/update/${id}`, formData)
      .pipe(map(res => {
        return res;
      }));
  }
  //xóa
  delete(id: any){
    return this.http.delete<any>(`${environment.apiUrl}/comment/delete/${id}`)
      .pipe(
        map(res => {
          return res;
        }));
  }
  // Tải file mẫu
  public downloadSampleFile(){
    return this.http.get(`${environment.apiUrl}/comment/download_sample_file_excel`, { responseType: 'blob'});
  }
  //Nhập tệp
  importExcel(formData: FormData) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const httpOptions = { headers: headers };
    return this.http.post<any>(`${environment.apiUrl}/comment/import`, formData, httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }
  //file lỗi
  exportExcelErrors(data_export : any) {
    return this.http.post(`${environment.apiUrl}/comment/export_errors`,{data_export},{ responseType:'blob' })
      .pipe(map(res => {
        return res;
      }));
  }
  //Xuất tệp
  exportExcel(formData: FormData) {
    return this.http.post(`${environment.apiUrl}/comment/list`, formData ,{ responseType: 'blob' })
      .pipe(map(res => {
        return res;}
    ));
  }
}
