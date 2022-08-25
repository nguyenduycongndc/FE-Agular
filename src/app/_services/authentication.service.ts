﻿import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { User } from "../_models";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private router: Router, private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string, remember_me: boolean) {
    return this.http
      .post<any>(`${environment.apiUrl}/login`, {
        email,
        password,
        remember_me,
      })
      .pipe(
        map((user) => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  send_mail(email: string, host: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/send_mail`, { email, host })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  change_password(token: string, password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/update` + '/' + token, { token, password, })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  check_password(token: string) {
    return this.http.post<any>(`${environment.apiUrl}/mail/check_password`, { token })
      .pipe(map(data => {
        return data;
      }));
  }

  user_update(email: string, old_password: string, new_password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/user/update`, { email, old_password, new_password })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getAccountInformation() {
    return this.http
      .get<any>(`${environment.apiUrl}/user/show_infor_user`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  getPictureUser() {
    return this.http.get(`${environment.apiUrl}/user/show_picture_infor_user`, { responseType: 'blob' });
  }
  showSchoolInfo(id: number) {
    return this.http.get(`${environment.apiUrl}/school/show/${id}`);
  }
  showSchoolLogo(id: number) {
    return this.http.get(`${environment.apiUrl}/school/show_logo/${id}`, { responseType: 'blob' });
  }
}
