import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EthnicService {
    constructor(private http: HttpClient) { }
    getEthnic() {
        return this.http.get<any>(`${environment.apiUrl}/ethnic/dropdownlist`)
        .pipe(map(res => {
            return res;
        }));
    }
}
