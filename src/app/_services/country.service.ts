import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
    constructor(private http: HttpClient) { }
    getCountry() {
        return this.http.get<any>(`${environment.apiUrl}/country/list`)
        .pipe(map(res => {
            return res;
        }));
    }
}
