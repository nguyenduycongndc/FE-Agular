import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class StudentManagementShareDataService {

  private defaultNumberData = new BehaviorSubject(0);
  currentNumberData = this.defaultNumberData.asObservable();

  constructor() { }

  changeNumberData(id: number) {
    this.defaultNumberData.next(id);
  }
}
