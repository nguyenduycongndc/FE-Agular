import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map, timeout, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AddressSevice {
    constructor(private http: HttpClient) { }
    getProvince() {
        return this.http.get<any>(`${environment.apiUrl}/province/dropdownlist`)
        .pipe(map(res => {
            return res;
        }));
    }
    getDistrict(province_id: number) {
        return this.http.get<any>(`${environment.apiUrl}/district/dropdownlist/${province_id}`)
            .pipe(map(res => {
                return res;
            }));
    }
    getWard(district_id: number) {
        return this.http.get<any>(`${environment.apiUrl}/ward/dropdownlist/${district_id}`)
            .pipe(map(res => {
                return res;
            }));
    }
}
