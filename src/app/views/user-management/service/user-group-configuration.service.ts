import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserGroupConfigurationService {

  constructor(private http: HttpClient) { }

  getYears() {
    return this.http.get<any>(`${environment.apiUrl}/year/dropdownlist`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  // Lấy danh sách khối
  getGradeByYear(years: string) {
    return this.http.post<any>(`${environment.apiUrl}/grade/dropdownlist_update`, {years})
      .pipe(map(res => {
        return res;
      }));
  }

  // Lấy danh sách lớp
  listDmLop(grades: any) {
    return this.http.post<any>(`${environment.apiUrl}/class/dropdownlist`, { grades })
      .pipe(map(res => {
        return res;
      }));
  }

  // Lấy danh sách cấu hình nhóm người sử dụng
  listUserGroupConfig() {
    return this.http.post<any>(`${environment.apiUrl}/group_user_configuration/list`, null)
      .pipe(map(res => {
        return res;
      }));
  }
  // Tải file mẫu
  public downloadSampleFile() {
    return this.http.get(`${environment.apiUrl}/group_user_configuration/download_sample_file_excel`, { responseType: 'blob' as 'json' });
  }

  // Import excel cấu hình nhóm người sử dụng
  importFile(formData: FormData) {
    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    const httpOptions = { headers: headers };

    return this.http.post<any>(`${environment.apiUrl}/group_user_configuration/import`, formData, httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  // Export file Excel cấu hình nhóm người sử dụng
  public exportFile(formData: FormData) {
    return this.http.post(`${environment.apiUrl}/group_user_configuration/list`, formData, { observe: 'response', responseType: 'blob' as 'json' })
      .pipe(map(res => {
        return res;
      }));
  }

  // Thêm mới cấu hình nhóm người sử dụng
  addUserGroupConfig(formData: FormData) {
    return this.http
      .post<any>(`${environment.apiUrl}/group_user_configuration/create`, formData)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  // GetById cấu hình nhóm người sử dụng, sử dụng cho form cập nhật cấu hình nhóm người sử dụng
  getByIdUserGroupConfig(id: number) {
    return this.http
      .get<any>(`${environment.apiUrl}/group_user_configuration/show/${id}`)
      .pipe(map(res => {
        return res;
      }));
  }

  // Cập nhật cấu hình nhóm người sử dụng
  updateUserGroupConfig(id: number, formData: FormData) {
    return this.http
      .post<any>(`${environment.apiUrl}/group_user_configuration/update/${id}`, formData)
      .pipe(map(res => {
        return res;
      }));
  }

  // Xóa cấu hình nhóm người sử dụng
  deleteUserGroupConfig(id: number) {
    return this.http
      .delete<any>(`${environment.apiUrl}/group_user_configuration/delete/${id}`)
      .pipe(map(res => {
        return res;
      }));
  }

  // Tìm kiếm cấu hình nhóm người sử dụng theo mã nhóm và tên nhóm
  searchByKeyWord(search: any) {
    return this.http
      // .get(`${environment.apiUrl}/group_user_configuration/list?search=/${search}')
      .post<any>(`${environment.apiUrl}/group_user_configuration/list`, { search })
      .pipe(map(res => {
        return res;
      }));
  }

  searchByInput(formData: FormData) {
    return this.http.post(`${environment.apiUrl}/group_user_configuration/list`, formData)
      .pipe(map(res => {
        return res;
      }));
  }
}
