import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, timeout, delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
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
    selectedYear(){
      return this.http.get<any>(`${environment.apiUrl}/year/selected_year`)
      .pipe(map(res=>{
          return res;
      }));
    }
}
