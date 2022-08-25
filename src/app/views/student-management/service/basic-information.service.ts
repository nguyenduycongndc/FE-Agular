import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BasicInformationService {

constructor(private http: HttpClient) { }
//get Tỉnh/Thành phố
  getProvince() {
  return this.http
    .get<any>(`${environment.apiUrl}/province/list`)
    .pipe(map(res => {
      return res;
    }));
  }
//get Quận/Huyện
  getDistrict(id: number) {
  return this.http
    .get<any>(`${environment.apiUrl}/district/dropdownlist/${id}`)
    .pipe(map(res => {
      return res;
    }));
  }
//get Phường/Xã
  getWard(id: number) {
    return this.http
      .get<any>(`${environment.apiUrl}/ward/dropdownlist/${id}`)
      .pipe(map(res => {
        return res;
      }));
  }
  //thêm học sinh
  creatStudent(formData: FormData){
    return this.http
    .post<any>(`${environment.apiUrl}/student/create`, formData)
    .pipe(map(res => {
      return res;
    }));
  }
  //show dữ liệu lên form sửa
    getByIdStudent(id: any){
      return this.http.get<any>(`${environment.apiUrl}/student/show/${id}`)
      .pipe(map(res=>{
        return res;
      }));
    }
    //xóa dữ liệu
    deleteStudent(id: any){
      return this.http.delete<any>(`${environment.apiUrl}/student/delete/${id}`)
      .pipe(
        map(res => {
          return res;
        })
      )
    }
    // Cập nhật tài khoản người sử dụng
  updateStudent(id: number, formData: FormData) {
    return this.http
      .post<any>(`${environment.apiUrl}/student/update/${id}`, formData)
      .pipe(map(res => {
        return res;
      }));
  }
  //Get ảnh theo Id
  getPictureStudent(id: number) {
    return this.http.get(`${environment.apiUrl}/student/show_picture/${id}`, { responseType: 'blob' });
  }
  //list grid
  listStudent(){
    return this.http.post(`${environment.apiUrl}/student/list`,{})
      .pipe(map(res => {
        return res;
      }));
  }
   //Tìm kiếm
   searchByKeyWord(search: any){
    return this.http.post(`${environment.apiUrl}/student/list`,{search})
       .pipe(delay(1000),map(res => {
         return res;
       }));
   }
   //Tìm kiếm theo năm
   searchYear(formData: FormData){
     return this.http.post(`${environment.apiUrl}/student/list`, formData)
     .pipe(map(res => {
      return res;
    }));
   }
   //xuất file
    exportFile(formData: FormData) {
      return this.http.post(`${environment.apiUrl}/student/list`, formData ,{ responseType: 'blob' })
        .pipe(map(res => {
          return res;}
      ));
    }
    //dropdown list year
    dropdownYear(){
      return this.http.get(`${environment.apiUrl}/year/dropdownlist`)
      .pipe(map(res=>{
        return res;
      }));
    }
    //nhập file
    importFile(formData: FormData) {
      let headers = new HttpHeaders();
  
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
  
      const httpOptions = { headers: headers };
  
      return this.http.post<any>(`${environment.apiUrl}/student/import`, formData, httpOptions)
        .pipe(map(res => {
          return res;
        }));
    }
    //file lỗi
    exportExcelErrors(data_export : any) {
      return this.http.post(`${environment.apiUrl}/student/export_error`,{data_export},{ responseType:'blob' })
        .pipe(map(res => {
          return res;
        }));
    }
    //tải file mẫu
    public downloadSampleFile(){
      return this.http.get(`${environment.apiUrl}/student/get_sample_file`, { responseType: 'blob' as 'json' })
    }
  }

