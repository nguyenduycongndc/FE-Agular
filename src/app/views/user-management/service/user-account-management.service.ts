import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map, timeout, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAccountManagementService {

  constructor(private http: HttpClient) { }
  // Tìm kiếm cấu hình nhóm người dùng theo mã nhóm và tên nhóm
  searchByKeyWord(search: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/user/list`, { search})
      .pipe(delay(1000),
        map(res => {
          return res;
        }));
  }
  // deleteUserAccount(id: number) {
  //   return this.http

  // }
// list danh sách dropdown
  searchByInput(formData: FormData) {
    return this.http.post(`${environment.apiUrl}/user/list`, formData)
      .pipe(map(res => {
        return res;
      }));

  }
// list danh sách dropdown

// list danh sách nhóm
  listNhom() {
    return this.http.get<any>(`${environment.apiUrl}/group_user_configuration/dropdownlist`)
      .pipe(map(res => {
        return res;
      }));
  }
// getById tài khoản người dùng
  getByIdUserAccount(id: number) {
    return this.http.get<any>(`${environment.apiUrl}/user/show/${id}`)
      .pipe(map(res => {
        return res;
      }));
  }

  //Get ảnh theo Id
  getPictureUser(id: number) {
    return this.http.get(`${environment.apiUrl}/user/show_picture/${id}`, { responseType: 'blob' });
  }
  // Thêm mới tài khoản người sử dụng
  insertUserAccount(formData: FormData) {
    return this.http
      .post<any>(`${environment.apiUrl}/user/create`, formData)
      .pipe(map(res => {
        return res;
      }));
  }
  // Cập nhật tài khoản người sử dụng
  updateUserAccount(id: number, formData: FormData) {
    return this.http
      .post<any>(`${environment.apiUrl}/user/update/${id}`, formData)
      .pipe(map(res => {
        return res;
      }));
  }


  // Xóa cấu tài khoản người sử dụng
  deleteUserAccount(id: number) {
    return this.http
      .delete<any>(`${environment.apiUrl}/user/delete/${id}`)
      .pipe(map(res => {
        return res;
      }));
  }

  getListUsers() {
    return this.http
      .get<any>(`${environment.apiUrl}/user/dropdownlist`)
      .pipe(map(res => {
        return res;
      }));
  }
  getInfoProfile(code: string) {
    return this.http
      .get<any>(`${environment.apiUrl}/user/show_profile_infor/${code}`)
      .pipe(map(res => {
        return res;
      }));
  }
  getListStudentUsers() {
    return this.http
      .get<any>(`${environment.apiUrl}/student/dropdownlist`)
      .pipe(map(res => {
        return res;
      }));
  }
  getListParentUsers() {
    return this.http
      .get<any>(`${environment.apiUrl}/personal_profile/dropdownlist`)
      .pipe(map(res => {
        return res;
      }));
  }
  getSystemAccess() {
    return this.http
      .get<any>(`${environment.apiUrl}/permission/dropdownlist`)
      .pipe(map(res => {
        return res;
      }));
  }
  // getProvince() {
  //   return this.http
  //     .get<any>(`${environment.apiUrl}/province/dropdownlist`)
  //     .pipe(map(res => {
  //       return res;
  //     }));
  // }
  // getDistrict(id: number) {
  //   return this.http
  //     .get<any>(`${environment.apiUrl}/district/dropdownlist/${id}`)
  //     .pipe(map(res => {
  //       return res;
  //     }));
  // }
  // getWard(id: number) {
  //   return this.http
  //     .get<any>(`${environment.apiUrl}/ward/dropdownlist/${id}`)
  //     .pipe(map(res => {
  //       return res;
  //     }));
  // }
  createUser(formData: FormData) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const httpOptions = { headers: headers };
    return this.http
      .post<any>(`${environment.apiUrl}/user/create`, formData)
      .pipe(map(res => {
        return res;
      }));
  }
  activeUserAccount(id: number) {
    return this.http
      .get<any>(`${environment.apiUrl}/user/active/${id}`)
      .pipe(map(res => {
        return res;
      }));
  }
  inActiveUserAccount(id: number) {
    return this.http
      .get<any>(`${environment.apiUrl}/user/inactive/${id}`)
      .pipe(map(res => {
        return res;
      }));
  }
}
