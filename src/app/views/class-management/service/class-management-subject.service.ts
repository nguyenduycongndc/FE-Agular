import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClassManagementSubjectService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(
    private httpClient: HttpClient
  ) { }

  getSchoolYearList() {
    return this.httpClient.get<any>(`${environment.apiUrl}/year/dropdownlist_all_year`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  // getGradeList(years: any) {
  //   return this.httpClient.post<any>(`${environment.apiUrl}/grade/dropdownlist_all_grades`, {years})
  //     .pipe(map(res => {
  //       return res;
  //     }));
  // }

  getGradeList(years: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}/grade/dropdownlist_update`, {years})
      .pipe(map(res => {
        return res;
      }));
  }

  getGradeByCurrentList() {
    return this.httpClient.get<any>(`${environment.apiUrl}/grade/current_year_grade`)
      .pipe(map(res => {
        return res;
      }));
  }

  getClassList(grades:any) {
    return this.httpClient.post<any>(`${environment.apiUrl}/class/dropdownlist`,{grades})
      .pipe(map(res => {
        return res;
      }));
  }

  getClassByGradeId(grades: any) {
    return this.httpClient.get<any>(`${environment.apiUrl}/class/current_year_class/${grades}`)
      .pipe(map(res => {
        return res;
      }));
  }
  getSubjectByClassId(grade: any, classes: any) {
    return this.httpClient.get<any>(`${environment.apiUrl}/class_subject/dropdownlist/${grade}/${classes}`)
      .pipe(map(res => {
        return res;
      }));
  }
  getSubjectDetailByClassId(subject: any) {
    return this.httpClient.get<any>(`${environment.apiUrl}/class_subject/subject/${subject}`)
      .pipe(map(res => {
        return res;
      }));
  }
  getSemesterCurrentYear() {
    return this.httpClient.get<any>(`${environment.apiUrl}/semester/current_year_semester`)
      .pipe(map(res => {
        return res;
      }));
  }

  getSemesterList(years: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}/semester/dropdownlist`, {years})
      .pipe(map(res => {
        return res;
      }));
  }

  // Tìm kiếm cấu hình nhóm người sử dụng theo mã nhóm và tên nhóm
  searchByCheckbox(status: any) {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/lesson_config/list?status=${status}`)
      .pipe(map(res => {
        return res;
      }));
  }

  create(formData: FormData) {
    return this.httpClient.post<any>(`${environment.apiUrl}` + '/class_subject/create', formData)
      .pipe(
        map(res => {
          return res;
        })
      );
  }


  getID(id: number) {
    return this.httpClient.get<any>(`${environment.apiUrl}/class_subject/show/${id}`)
      .pipe(map(res => {
        return res;
      }));
  }

  update(id: number, formData: FormData) {
    return this.httpClient.post<any>(`${environment.apiUrl}/class_subject/update/${id}`, formData)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  // update(id: number, formData: FormData) {
  //   return this.httpClient
  //     .post<any>(`${environment.apiUrl}/lesson_config/update/${id}`, formData)
  //     .pipe(map(res => {
  //       return res;
  //     }));
  // }

  delete(id) {
    return this.httpClient.delete<any>(`${environment.apiUrl}/class_subject/delete/${id}`)
      .pipe(
        map(res => {
          return res;
        })
      );
  }


  // httpClient: any;

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   })
  // };

  // constructor(private http: HttpClient) { }

  // //danh sách tôn giáo (religion)
  // list_religion() {
  //   return this.httpClient.get<any>(`${environment.apiUrl}/religion/dropdownlist`)
  //     .pipe(
  //       map(res => {
  //         return res;
  //       })
  //     );
  // }

  // getStudentById(id: number) {
  //   return this.httpClient
  //     .get<any>(`${environment.apiUrl}/student/show/${id}`)
  //     .pipe(map(res => {
  //       return res;
  //     }));
  // }

  // showInforStudent(id: number) {
  //   return this.httpClient.get(`${environment.apiUrl}/student/show/${id}`);
  // }

  // update (id: number, formData: FormData) {
  //   return this.httpClient.post<any>(`${environment.apiUrl}/student/update/${id}`, formData)
  //     .pipe(
  //       map(res => {
  //         return res;
  //       })
  //     );
  // }
  applyClassList(data: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}/class_subject/apply_class`, data)
      .pipe(map(res => {
        return res;
      }));
  }

  applyGradeAll(data: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}/class_subject/apply_grade`, data)
      .pipe(map(res => {
        return res;
      }));
  }
  filter(years:any,school_time:any,grades:any,classes:any) {
    return this.httpClient.post<any>(`${environment.apiUrl}` + '/class_subject/list', {years,school_time,grades,classes})
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  // filter(formData: FormData) {
  //   return this.httpClient.post<any>(`${environment.apiUrl}` + '/class_subject/list', formData)
  //     .pipe(
  //       map(res => {
  //         return res;
  //       })
  //     );
  // }
  searchByKeyWord(search: any) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/class_subject/list`, { search})
      .pipe(delay(1000), map(res => {
        return res;
      }));
  }

}
function getMockPeople() {
  return [
      {
          'id': '5a15b13c36e7a7f00cf0d7cb',
          'index': 2,
          'isActive': true,
          'picture': 'http://placehold.it/32x32',
          'age': 23,
          'name': 'Karyn Wright',
          'gender': 'female',
          'company': 'ZOLAR',
          'email': 'karynwright@zolar.com',
          'phone': '+1 (851) 583-2547'
      },
      {
          'id': '5a15b13c2340978ec3d2c0ea',
          'index': 3,
          'isActive': false,
          'picture': 'http://placehold.it/32x32',
          'age': 35,
          'name': 'Rochelle Estes',
          'disabled': true,
          'gender': 'female',
          'company': 'EXTRAWEAR',
          'email': 'rochelleestes@extrawear.com',
          'phone': '+1 (849) 408-2029'
      },
      {
          'id': '5a15b13c663ea0af9ad0dae8',
          'index': 4,
          'isActive': false,
          'picture': 'http://placehold.it/32x32',
          'age': 25,
          'name': 'Mendoza Ruiz',
          'gender': 'male',
          'company': 'ZYTRAX',
          'email': 'mendozaruiz@zytrax.com',
          'phone': '+1 (904) 536-2020'
      },
      {
          'id': '5a15b13cc9eeb36511d65acf',
          'index': 5,
          'isActive': false,
          'picture': 'http://placehold.it/32x32',
          'age': 39,
          'name': 'Rosales Russell',
          'gender': 'male',
          'company': 'ELEMANTRA',
          'email': 'rosalesrussell@elemantra.com',
          'phone': '+1 (868) 473-3073'
      },
      {
          'id': '5a15b13c728cd3f43cc0fe8a',
          'index': 6,
          'isActive': true,
          'picture': 'http://placehold.it/32x32',
          'age': 32,
          'name': 'Marquez Nolan',
          'gender': 'male',
          'company': 'MIRACLIS',
          'disabled': true,
          'email': 'marqueznolan@miraclis.com',
          'phone': '+1 (853) 571-3921'
      },
      {
          'id': '5a15b13ca51b0aaf8a99c05a',
          'index': 7,
          'isActive': false,
          'picture': 'http://placehold.it/32x32',
          'age': 28,
          'name': 'Franklin James',
          'gender': 'male',
          'company': 'CAXT',
          'email': 'franklinjames@caxt.com',
          'phone': '+1 (868) 539-2984'
      },
      {
          'id': '5a15b13cc3b9381ffcb1d6f7',
          'index': 8,
          'isActive': false,
          'picture': 'http://placehold.it/32x32',
          'age': 24,
          'name': 'Elsa Bradley',
          'gender': 'female',
          'company': 'MATRIXITY',
          'email': 'elsabradley@matrixity.com',
          'phone': '+1 (994) 583-3850'
      },
      {
          'id': '5a15b13ce58cb6ff62c65164',
          'index': 9,
          'isActive': true,
          'picture': 'http://placehold.it/32x32',
          'age': 40,
          'name': 'Pearson Thompson',
          'gender': 'male',
          'company': 'EZENT',
          'email': 'pearsonthompson@ezent.com',
          'phone': '+1 (917) 537-2178'
      },
      {
          'id': '5a15b13c90b95eb68010c86e',
          'index': 10,
          'isActive': true,
          'picture': 'http://placehold.it/32x32',
          'age': 32,
          'name': 'Ina Pugh',
          'gender': 'female',
          'company': 'MANTRIX',
          'email': 'inapugh@mantrix.com',
          'phone': '+1 (917) 450-2372'
      },
      {
          'id': '5a15b13c2b1746e12788711f',
          'index': 11,
          'isActive': true,
          'picture': 'http://placehold.it/32x32',
          'age': 25,
          'name': 'Nguyen Elliott',
          'gender': 'male',
          'company': 'PORTALINE',
          'email': 'nguyenelliott@portaline.com',
          'phone': '+1 (905) 491-3377'
      },
      {
          'id': '5a15b13c605403381eec5019',
          'index': 12,
          'isActive': true,
          'picture': 'http://placehold.it/32x32',
          'age': 31,
          'name': 'Mills Barnett',
          'gender': 'male',
          'company': 'FARMEX',
          'email': 'millsbarnett@farmex.com',
          'phone': '+1 (882) 462-3986'
      },
      {
          'id': '5a15b13c67e2e6d1a3cd6ca5',
          'index': 13,
          'isActive': true,
          'picture': 'http://placehold.it/32x32',
          'age': 36,
          'name': 'Margaret Reynolds',
          'gender': 'female',
          'company': 'ROOFORIA',
          'email': 'margaretreynolds@rooforia.com',
          'phone': '+1 (935) 435-2345'
      },
      {
          'id': '5a15b13c947c836d177aa85c',
          'index': 14,
          'isActive': false,
          'picture': 'http://placehold.it/32x32',
          'age': 29,
          'name': 'Yvette Navarro',
          'gender': 'female',
          'company': 'KINETICA',
          'email': 'yvettenavarro@kinetica.com',
          'phone': '+1 (807) 485-3824'
      },
      {
          'id': '5a15b13c5dbbe61245c1fb73',
          'index': 15,
          'isActive': false,
          'picture': 'http://placehold.it/32x32',
          'age': 20,
          'name': 'Elisa Guzman',
          'gender': 'female',
          'company': 'KAGE',
          'email': 'elisaguzman@kage.com',
          'phone': '+1 (868) 594-2919'
      },
      {
          'id': '5a15b13c38fd49fefea8db80',
          'index': 16,
          'isActive': false,
          'picture': 'http://placehold.it/32x32',
          'age': 33,
          'name': 'Jodie Bowman',
          'gender': 'female',
          'company': 'EMTRAC',
          'email': 'jodiebowman@emtrac.com',
          'phone': '+1 (891) 565-2560'
      },
      {
          'id': '5a15b13c9680913c470eb8fd',
          'index': 17,
          'isActive': false,
          'picture': 'http://placehold.it/32x32',
          'age': 24,
          'name': 'Diann Booker',
          'gender': 'female',
          'company': 'LYRIA',
          'email': 'diannbooker@lyria.com',
          'phone': '+1 (830) 555-3209'
      }
  ]
}
