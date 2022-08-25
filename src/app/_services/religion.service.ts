import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReligionService {
    constructor(private http: HttpClient) { }
    getReligion() {
        return this.http.get<any>(`${environment.apiUrl}/religion/dropdownlist`)
        .pipe(map(res => {
            return res;
        }));
    }
}
