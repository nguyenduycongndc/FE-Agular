import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NotificationService } from '../../../_services/notification.service';
import { ClassManagementListService } from '../service/class-management-list.service';
import { first } from 'rxjs/operators';
import { CommonService } from '../../../_services/common.service';
import { isNull } from 'util';
import { UtilityService } from '../../../_services/utils.service';
declare var $: any;
@Component({
  selector: 'app-class-management-list',
  templateUrl: './class-management-list.component.html',
  styleUrls: ['./class-management-list.component.css']
})
export class ClassManagementListComponent implements OnInit {
  @Input()
  maxNumberOfCharactersDescription = 150;
  counter = true;
  numberOfCharactersDescription = 0;

  form: FormGroup;
  loadingFilter = false;
  headerClass = false;// header grid
  // headerClass = true;// header grid
  checkClassData = true;
  submitted = false;
  classData: any;//data
  dataPaged: any[];

  //Update
  name: any;
  code: any;
  description: any;
  //khối học
  gradeDataSearch = [];//du liệu khối tìm kiếm
  selectedGradeSearch = [];
  ddlYearData = [];
  selectedYear = [];
  gradeDataUpdate = [];

  //khối học khi thêm sửa
  gradeData = [];//du liệu khối
  selectedGrade = [];
  gradeSettings = {};

  //ca học
  studyShiftId: any;
  studyShiftSetting = {};
  studyShiftData: any = [];
  selectedStudyShift = [];

  //year
  selectedYearSearch = [];
  ddlYearSearchData = [];

  currentYear: any;

  p: number = 1;
  countPage: number = 10;
  totalItems = 0;
  // perPageSelected(id: number) {
  //   this.countPage = id;
  //   this.p = 1;
  // }

  get f() {
    return this.form.controls;
  }
  constructor(
    private notifyService: NotificationService,
    private fb: FormBuilder,
    private classService: ClassManagementListService,
    private commonService: CommonService,
    private _utilsService: UtilityService
  ) { }


  ngOnInit() {
    this.studyShiftData = [
      { id: 1, name: 'Cả ngày' },
      { id: 2, name: 'Ca sáng' },
      { id: 3, name: 'Ca chiều' },
    ];
    this.form = this.fb.group({
      code: new FormControl(''),
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      gradeIdSearch: new FormControl(''),
      description: new FormControl(''),
      studyShiftId: new FormControl('', Validators.required),
      grade_id: new FormControl('', Validators.required),
      statusFilter: new FormControl(true),
      search: new FormControl(''),
      yearSearch: new FormControl(''),
      year: new FormControl('', Validators.required)
    });

    //Fill dữ liệu ra drop để tìm kiếm
    this.classService
      .getAllYear()
      // .pipe()
      .subscribe((data) => {
        const getData = [];
        const idCurrentYear = data['id_current_year'];
        let idSelected;
        data['years'].forEach(function (items) {
          getData.push({
            id: items['id'],
            name: items['start_year'] + ' - ' + items['end_year'],
          });
          if (items['id'] === idCurrentYear) {
            idSelected = { id: items['id'], name: items['start_year'] + ' - ' + items['end_year'] };
          }
        });
        this.ddlYearSearchData = getData;
        this.selectedYearSearch = idSelected;

        //Đổ dữ liệu grades
        let current_year_id = idSelected['id'];
        this.classService
          .getGradeList(current_year_id)
          // .pipe()
          .subscribe((datum) => {
            const getGradesData = [];
            datum['query'].forEach(function (items) {
              getGradesData.push({
                id: items['id'],
                name: items['name'],
              });
            });
            this.gradeDataSearch = getGradesData;
          });
      });




    this.commonService.getCurrentFutureYear()
      // .pipe()
      .subscribe((data) => {
        const yearData = [];
        let currentYearData;
        data['query'].forEach(function (item) {
          yearData.push({ id: item['id'], name: item['start_year'] + ' - ' + item['end_year'] });
          if (item['status'] === 1) {
            currentYearData = { id: item['id'], name: item['start_year'] + ' - ' + item['end_year'] };
          }
        });
        // this.ddlYearSearchData = yearData;
        // this.selectedYearSearch = currentYearData;
        this.ddlYearData = yearData;
        this.selectedYear = currentYearData;

        let yearDefault = currentYearData['id'];
        this.classService
          .getGradeList(yearDefault)
          // .pipe()
          .subscribe((datum) => {
            const getGradesData = [];
            datum['query'].forEach(function (items) {
              getGradesData.push({
                id: items['id'],
                name: items['name'],
              });
            });
            // this.gradeDataSearch = getGradesData;
            this.gradeData = getGradesData;
          });
      });
  }

  onKeyUp(event: any): void {
    this.numberOfCharactersDescription = event.target.value.length;
    if (this.numberOfCharactersDescription > this.maxNumberOfCharactersDescription) {
      event.target.value = event.target.value.slice(0, this.maxNumberOfCharactersDescription);
      this.numberOfCharactersDescription = this.maxNumberOfCharactersDescription;
    }
  }

  selectAllGradeSearch(gradeSearchData) {
    this.selectedGradeSearch = gradeSearchData;
  }

  deSelectAllGradeSearch() {
    this.selectedGradeSearch = [];
  }

  //chọn 1 năm học
  onSelectYearSearch(item: any) {
    this.selectedGradeSearch = [];
    if (item !== undefined) {

      const arrSubject = [];
      this.classService
        .getGradeList([item.id])
        // .pipe()
        .subscribe((subjectData) => {
          subjectData['query'].forEach(function (items) {
            arrSubject.push({ id: items['id'], name: items['name'] });
          });
          this.gradeDataSearch = arrSubject;
        });
    } else {
      this.selectedYearSearch = this.currentYear;
      this.gradeDataSearch = [];
      this.selectedGradeSearch = [];
    }
  }

  //select grades search
  onSelectYear(item: any) {
    this.selectedGrade = [];
    if (item !== undefined) {

      const arrSubject = [];
      this.classService
        .getGradeList([item.id])
        // .pipe()
        .subscribe((subjectData) => {
          subjectData['query'].forEach(function (items) {
            arrSubject.push({ id: items['id'], name: items['name'] });
          });
          this.gradeData = arrSubject;
        });
    } else {
      // this.selectedYear = this.currentYear;
      this.gradeData = [];
      this.selectedGrade = [];
    }


    // this.selectedGrade = [];
    // let yearDefault = item['id'];
    // this.classService
    //   .getGradeList(yearDefault)
    //   .pipe()
    //   .subscribe((datum) => {
    //     const getGradesData = [];
    //     datum['query'].forEach(function (items) {
    //       getGradesData.push({
    //         id: items['id'],
    //         name: items['name'],
    //       });
    //     });
    //     this.gradeData = getGradesData;
    //   });
  }
  //Tìm kiếm
  searchByKeyWord(search: any) {
    this.classData = [];
    let status;
    if (this.form.value['statusFilter']) {
      status = '1';
    } else {
      status = '0';
    }
    if (search.trim() === '') {
      this.notifyService.showError('Vui lòng điền từ khóa tìm kiếm!', 'Thông báo lỗi');
      this.checkClassData = false;
      this.headerClass = true;
      this.classData = [];
      this.p = 1;
      this.totalItems = 1;
    } else {
      this.classService.searchByKeyWord(search, status)
        .subscribe(
          res => {
            if (res['classes']['length'] === 0) {
              this.p = 1;
              this.totalItems = 1;
              this.headerClass = true;//hiện header
              this.checkClassData = false;//dữ liệu không tồn tại
              this.classData = [];
            } else {
              this.headerClass = true;
              this.checkClassData = true;
              this.classData = res['classes'];
              this.totalItems = res['classes']['length'];
              this.p = 1;
            }
          }
        )
    }
  }
  //Lọc dữ liệu
  searchByInput() {
    this.form.get('search').clearValidators();
    this.form.get('search').setValue('');
    this.loadingFilter = true;

    const years = [];
    this.selectedYearSearch['id'];
    years.push(this.selectedYearSearch['id']);

    const grades = [];
    if (this.selectedGradeSearch) {
      this.selectedGradeSearch.forEach(function (items) {
        grades.push(items['id']);
      });
    }
    let status;
    if (this.form.value['statusFilter']) {
      status = '1';
    } else {
      status = '0';
    }
    this.classService.searchByInput(grades, status, years)
      .subscribe(
        result => {
          this.loadingFilter = false;
          if (result['classes']['length'] === 0) {
            this.p = 1;
            this.totalItems = 1;
            this.headerClass = true;//hiện header
            this.checkClassData = false;//dữ liệu không tồn tại
            this.classData = [];
          } else {
            this.headerClass = true;
            this.checkClassData = true;
            this.classData = result['classes'];
            this.totalItems = result['classes']['length'];

            this.p = 1;

            this.classData.forEach(e => {
              e.status1 = e.status == 1;
            });
          }
        },
      )
  }
  //nút thêm
  resetForm() {
    this.form.get('year').clearValidators();
    this.form.get('code').clearValidators();
    this.form.get('code').setValue('');
    this.form.get('name').clearValidators();
    this.form.get('name').setValue('');
    this.form.get('grade_id').clearValidators();
    this.form.get('studyShiftId').clearValidators();
    this.form.get('description').clearValidators();
    this.form.get('description').setValue('');
    this.numberOfCharactersDescription = 0;
    this.selectedGrade = [];
    this.selectedStudyShift = [];
  }
  resetFormUpdate() {
    this.form.get('code').clearValidators();
    this.form.get('code').setValue('');
    this.form.get('name').clearValidators();
    this.form.get('name').setValue('');
    this.form.get('grade_id').clearValidators();
    this.form.get('grade_id').setValue('');
    this.form.get('studyShiftId').clearValidators();
    this.form.get('studyShiftId').setValue('');
    this.numberOfCharactersDescription = 0;
  }

  //nút sửa
  idShowClass: any;
  getByIdClass(id: any) {
    this.resetFormUpdate();
    this.classService.getIdClass(id)
      .subscribe(
        result => {
          const arrDataClass = result;
          // this.form.patchValue(result);

          let className = arrDataClass['name'];
          this.name = className;
          let classDescription = arrDataClass['description'];
          this.description = classDescription;
          let classCode = arrDataClass['code'];
          this.code = classCode;
          this.idShowClass = id;
          //Đổ dữ liệu grades Search
          let idCurrentYear = result['year_id'];
          this.classService
            .getGradeList(idCurrentYear)
            // .pipe()
            .subscribe((datum) => {
              const getGradesData = [];
              datum['query'].forEach(function (items) {
                getGradesData.push({
                  id: items['id'],
                  name: items['name'],
                });
              });
              this.gradeDataUpdate = getGradesData;

              var gradeValue = arrDataClass['grade_id'];
              if (gradeValue) {
                const selectGrade = [];
                // let selectGrade;
                const mapGrade = this.gradeDataUpdate.map(function (x) { return x.id; }).indexOf(gradeValue);
                if (mapGrade > -1) {
                  selectGrade.push({ id: this.gradeDataUpdate[mapGrade]['id'], name: this.gradeDataUpdate[mapGrade]['name'] });
                }
                this.selectedGrade = selectGrade[0];
              }

            });
          // const selectGrade = [];
          //   if (arrDataClass['grade_id']) {
          //     const mapGrade = this.gradeData.map(function (x) { return x.id; }).indexOf(arrDataClass['grade_id']);
          //     if (mapGrade > -1) {
          //       selectGrade.push({ 'id': this.gradeData[mapGrade]['id'], 'name': this.gradeData[mapGrade]['name'] });
          //     }
          //     this.selectedGrade = selectGrade;
          //   }
          const studyShiftValue = result;
          const selectStudyShift = [];
          // let selectStudyShift;
          if (studyShiftValue['school_time']) {
            const mapStudyShiftValue = this.studyShiftData.map(function (x) { return x.id; }).indexOf(studyShiftValue['school_time']);
            if (mapStudyShiftValue > -1) {
              selectStudyShift.push({ id: this.studyShiftData[mapStudyShiftValue]['id'], name: this.studyShiftData[mapStudyShiftValue]['name'] });
            }
            this.selectedStudyShift = selectStudyShift[0];
          }
          this.numberOfCharactersDescription = result.description.length;
        }
      )
  }
  //nút xóa
  deleteClass(id: any) {
    this._utilsService.showConfirm('Bạn có chắc chắn muốn xóa bản ghi này không?', (confirm) => {
      if (confirm) {
        this.classService.deleteClass(id).subscribe(res => {
          this.notifyService.showSuccess('Xóa dữ liệu thành công', 'Thông báo');
          let searchKeyWord = this.form.controls['search'].value;
          let status;
          if (this.form.value['statusFilter']) {
            status = '1';
          } else {
            status = '0';
          }
          if (searchKeyWord) {
            if (searchKeyWord.trim() === '') {
              this.notifyService.showError('Vui lòng điền từ khóa tìm kiếm!', 'Thông báo lỗi');
              this.checkClassData = false;
              this.headerClass = true;
              this.classData = [];
              this.p = 1;
              this.totalItems = 1;
            } else {
              this.classService.searchByKeyWord(searchKeyWord, status)
                .subscribe(
                  res => {
                    if (res['classes']['length'] === 0) {
                      this.p = 1;
                      this.totalItems = 1;
                      this.headerClass = true;//hiện header
                      this.checkClassData = false;//dữ liệu không tồn tại
                      this.classData = [];
                    } else {
                      this.headerClass = true;
                      this.checkClassData = true;
                      this.classData = res['classes'];
                      this.totalItems = res['classes']['length'];

                    }
                  }
                )
            }
          } else {
            this.searchByInput();
          }
        }, error => {
          if (error.error) {
            this.notifyService.showError(error.error, 'Thông báo lỗi');
          }
        });
      }
    });
  }
  //nút Lưu lại
  createClass() {
    this.form.get('year').setValidators([Validators.required]);
    this.form.get('year').updateValueAndValidity();
    this.form.get('name').setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
    this.form.get('name').updateValueAndValidity();
    this.form.get('grade_id').setValidators([Validators.required]);
    this.form.get('grade_id').updateValueAndValidity();
    this.form.get('studyShiftId').setValidators([Validators.required]);
    this.form.get('studyShiftId').updateValueAndValidity();
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    var uploadData = new FormData();
    const yearId = this.form.controls['year'].value['id'];
    const nameClass = this.form.controls['name'].value;
    const gradeId = this.form.controls['grade_id'].value['id'];
    const studyShiftId = this.form.controls['studyShiftId'].value['id'];
    const description = this.form.controls['description'].value;

    if (nameClass) {
      uploadData.append('name', nameClass);
    }
    if (gradeId) {
      uploadData.append('grade_id', gradeId);
    }
    if (studyShiftId) {
      uploadData.append('school_time', studyShiftId);
    }
    if (yearId) {
      uploadData.append('year_id', yearId);
    }
    if (description) {
      uploadData.append('description', description.substring(0, 150));
    }
    this.classService.createClassList(uploadData)
      .subscribe(
        result => {
          this.notifyService.showSuccess('Thêm mới thành công', 'Thông báo');
          this.resetForm();
          $('#createClassModal').modal('hide');
          $('.modal-backdrop').remove();
          let searchKeyWord = this.form.controls['search'].value;
          let status;
          if (this.form.value['statusFilter']) {
            status = '1';
          } else {
            status = '0';
          }
          if (searchKeyWord) {
            if (searchKeyWord.trim() === '') {
              this.notifyService.showError('Vui lòng điền từ khóa tìm kiếm!', 'Thông báo lỗi');
              this.checkClassData = false;
              this.headerClass = true;
              this.classData = [];
              this.p = 1;
              this.totalItems = 1;
            } else {
              this.classService.searchByKeyWord(searchKeyWord, status)
                .subscribe(
                  res => {
                    if (res['classes']['length'] === 0) {
                      this.p = 1;
                      this.totalItems = 1;
                      this.headerClass = true;//hiện header
                      this.checkClassData = false;//dữ liệu không tồn tại
                      this.classData = [];
                    } else {
                      this.headerClass = true;
                      this.checkClassData = true;
                      this.classData = res['classes'];
                      this.totalItems = res['classes']['length'];

                    }
                  }
                )
            }
          } else {
            this.searchByInput();
          }
        }, error => {
          if (error.message['error']) {
            this.notifyService.showError(error.message['error'], 'Thông báo lỗi');
          }
          else {
            Object.keys(error.message).forEach(function (key) {
              this.notifyService.showError(error.message[key], 'Thông báo lỗi');
            });
          }
        }
      );
  }
  //cập nhật
  updateClass(id: any) {
    this.form.get('name').setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
    this.form.get('name').updateValueAndValidity();
    this.form.get('grade_id').setValidators([Validators.required]);
    this.form.get('grade_id').updateValueAndValidity();
    this.form.get('studyShiftId').setValidators([Validators.required]);
    this.form.get('studyShiftId').updateValueAndValidity();
    this.submitted = true;
    if (this.form.controls['name'].invalid
      || this.form.controls['grade_id'].invalid
      || this.form.controls['studyShiftId'].invalid
      || this.form.controls['description'].invalid
    ) {
      return;
    }
    let nameClass = this.form.controls['name'].value;
    let gradeId = this.form.controls['grade_id'].value['id'];
    let studyShiftId = this.form.controls['studyShiftId'].value['id'];
    let description = this.form.controls['description'].value;

    var uploadData = new FormData();
    if (nameClass) {
      uploadData.append('name', nameClass);
    }
    if (gradeId) {
      uploadData.append('grade_id', gradeId);
    }
    if (studyShiftId) {
      uploadData.append('school_time', studyShiftId);
    }
    if (description) {
      uploadData.append('description', description.substring(0, 150));
    }
    this.classService.updateClass(id, uploadData)
      .subscribe(
        result => {
          this.notifyService.showSuccess('Cập nhật thành công', 'Thông báo');
          $('#updateClassModal').modal('hide');
          $('.modal-backdrop').remove();
          let searchKeyWord = this.form.controls['search'].value;
          let status;
          if (this.form.value['statusFilter']) {
            status = '1';
          } else {
            status = '0';
          }
          if (searchKeyWord) {
            if (searchKeyWord.trim() === '') {
              this.notifyService.showError('Vui lòng điền từ khóa tìm kiếm!', 'Thông báo lỗi');
              this.checkClassData = false;
              this.headerClass = true;
              this.classData = [];
              this.p = 1;
              this.totalItems = 1;
            } else {
              this.classService.searchByKeyWord(searchKeyWord, status)
                .subscribe(
                  res => {
                    if (res['classes']['length'] === 0) {
                      this.p = 1;
                      this.totalItems = 1;
                      this.headerClass = true;//hiện header
                      this.checkClassData = false;//dữ liệu không tồn tại
                      this.classData = [];
                    } else {
                      this.headerClass = true;
                      this.checkClassData = true;
                      this.classData = res['classes'];
                      this.totalItems = res['classes']['length'];

                    }
                  }
                )
            }
          } else {
            this.searchByInput();
          }
        }, error => {
          if (error.message['error']) {
            this.notifyService.showError(error.message['error'], 'Thông báo lỗi');
          }
        }

      );
  }

  //Sort mã lớp học
  // firstTimeCode = 1;
  // timesCode: any;
  // sortClassCode() {
  //   this.firstTimeCode = 0;
  //   this.firstTimeName = 1;
  //   this.firstTimeGrade = 1;
  //   this.firstTimeStudyShift = 1;
  //   this.timesName = 0;
  //   this.timesGrade = 0;
  //   this.timesStudyShift = 0;
  //   const array = this.classData;
  //   if (this.timesCode === 1) {
  //     array.sort(function (a, b) {
  //       let str = a.code
  //       var nameA = Number(str) // bỏ qua hoa thường
  //       let str2 = b.code;
  //       var nameB = Number(str2); // bỏ qua hoa thường
  //       if (nameA < nameB) {
  //         return -1;
  //       }
  //       if (nameA > nameB) {
  //         return 1;
  //       }
  //       // name trùng nhau
  //       return 0;
  //     });
  //     this.timesCode++;
  //   } else {
  //     array.sort(function (a, b) {
  //       let str = a.code;
  //       var nameA = Number(str); // bỏ qua hoa thường
  //       let str2 = b.code;
  //       var nameB = Number(str2); // bỏ qua hoa thường
  //       if (nameA < nameB) {
  //         return 1;
  //       }
  //       if (nameA > nameB) {
  //         return -1;
  //       }
  //       // name trùng nhau
  //       return 0;
  //     });
  //     this.timesCode = 1;
  //   }
  //   this.classData = array;

  // }
  //sort tên lớp học
  // firstTimeName = 1;
  // timesName: any;
  // sortClassName() {
  //   this.firstTimeCode = 1;
  //   this.firstTimeName = 0;
  //   this.firstTimeGrade = 1;
  //   this.firstTimeStudyShift = 1;
  //   this.timesCode = 0;
  //   this.timesGrade = 0;
  //   this.timesStudyShift = 0;
  //   const array = this.classData;
  //   if (this.timesName === 1) {
  //     array.sort(function (a, b) {
  //       let str = a.name;

  //       str = str.replace(/\s+/g, ' ');
  //       // loại bỏ toàn bộ dấu space (nếu có) ở 2 đầu của chuỗi
  //       str = str.trim();
  //       // bắt đầu xóa dấu tiếng việt  trong chuỗi
  //       str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  //       str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  //       str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  //       str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  //       str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  //       str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  //       str = str.replace(/đ/g, "d");
  //       str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  //       str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  //       str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  //       str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  //       str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  //       str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  //       str = str.replace(/Đ/g, "D");

  //       var nameA = str.toUpperCase(); // bỏ qua hoa thường

  //       let str2 = b.name;
  //       str2 = str2.replace(/\s+/g, ' ');
  //       // loại bỏ toàn bộ dấu space (nếu có) ở 2 đầu của chuỗi
  //       str2 = str2.trim();
  //       // bắt đầu xóa dấu tiếng việt  trong chuỗi
  //       str2 = str2.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  //       str2 = str2.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  //       str2 = str2.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  //       str2 = str2.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  //       str2 = str2.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  //       str2 = str2.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  //       str2 = str2.replace(/đ/g, "d");
  //       str2 = str2.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  //       str2 = str2.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  //       str2 = str2.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  //       str2 = str2.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  //       str2 = str2.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  //       str2 = str2.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  //       str2 = str2.replace(/Đ/g, "D");

  //       var nameB = str2.toUpperCase(); // bỏ qua hoa thường
  //       if (nameA < nameB) {
  //         return -1;
  //       }
  //       if (nameA > nameB) {
  //         return 1;
  //       }
  //       // name trùng nhau
  //       return 0;
  //     });
  //     this.timesName++;
  //   } else {
  //     array.sort(function (a, b) {
  //       let str = a.name;

  //       str = str.replace(/\s+/g, ' ');
  //       // loại bỏ toàn bộ dấu space (nếu có) ở 2 đầu của chuỗi
  //       str = str.trim();
  //       // bắt đầu xóa dấu tiếng việt  trong chuỗi
  //       str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  //       str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  //       str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  //       str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  //       str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  //       str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  //       str = str.replace(/đ/g, "d");
  //       str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  //       str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  //       str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  //       str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  //       str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  //       str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  //       str = str.replace(/Đ/g, "D");

  //       var nameA = str.toUpperCase(); // bỏ qua hoa thường

  //       let str2 = b.name;
  //       str2 = str2.replace(/\s+/g, ' ');
  //       // loại bỏ toàn bộ dấu space (nếu có) ở 2 đầu của chuỗi
  //       str2 = str2.trim();
  //       // bắt đầu xóa dấu tiếng việt  trong chuỗi
  //       str2 = str2.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  //       str2 = str2.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  //       str2 = str2.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  //       str2 = str2.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  //       str2 = str2.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  //       str2 = str2.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  //       str2 = str2.replace(/đ/g, "d");
  //       str2 = str2.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  //       str2 = str2.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  //       str2 = str2.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  //       str2 = str2.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  //       str2 = str2.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  //       str2 = str2.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  //       str2 = str2.replace(/Đ/g, "D");

  //       var nameB = str2.toUpperCase(); // bỏ qua hoa thường
  //       if (nameA < nameB) {
  //         return 1;
  //       }
  //       if (nameA > nameB) {
  //         return -1;
  //       }
  //       // name trùng nhau
  //       return 0;
  //     });
  //     this.timesName = 1;
  //   }
  //   this.classData = array;
  // }
  //sort Khối
  // firstTimeGrade = 1;
  // timesGrade: any;
  // sortGrade() {
  //   this.firstTimeCode = 1;
  //   this.firstTimeName = 1;
  //   this.firstTimeGrade = 0;
  //   this.firstTimeStudyShift = 1;
  //   this.timesName = 0;
  //   this.timesCode = 0;
  //   this.timesStudyShift = 0;
  //   const array = this.classData;
  //   if (this.timesGrade === 1) {
  //     array.sort(function (a, b) {
  //       let str = a.grade_name;

  //       str = str.replace(/\s+/g, ' ');
  //       // loại bỏ toàn bộ dấu space (nếu có) ở 2 đầu của chuỗi
  //       str = str.trim();
  //       // bắt đầu xóa dấu tiếng việt  trong chuỗi
  //       str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  //       str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  //       str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  //       str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  //       str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  //       str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  //       str = str.replace(/đ/g, "d");
  //       str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  //       str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  //       str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  //       str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  //       str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  //       str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  //       str = str.replace(/Đ/g, "D");

  //       var nameA = str.toUpperCase(); // bỏ qua hoa thường

  //       let str2 = b.grade_name;
  //       str2 = str2.replace(/\s+/g, ' ');
  //       // loại bỏ toàn bộ dấu space (nếu có) ở 2 đầu của chuỗi
  //       str2 = str2.trim();
  //       // bắt đầu xóa dấu tiếng việt  trong chuỗi
  //       str2 = str2.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  //       str2 = str2.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  //       str2 = str2.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  //       str2 = str2.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  //       str2 = str2.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  //       str2 = str2.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  //       str2 = str2.replace(/đ/g, "d");
  //       str2 = str2.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  //       str2 = str2.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  //       str2 = str2.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  //       str2 = str2.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  //       str2 = str2.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  //       str2 = str2.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  //       str2 = str2.replace(/Đ/g, "D");

  //       var nameB = str2.toUpperCase(); // bỏ qua hoa thường
  //       if (nameA < nameB) {
  //         return -1;
  //       }
  //       if (nameA > nameB) {
  //         return 1;
  //       }
  //       // name trùng nhau
  //       return 0;
  //     });
  //     this.timesGrade++;
  //   } else {
  //     array.sort(function (a, b) {
  //       let str = a.grade_name;

  //       str = str.replace(/\s+/g, ' ');
  //       // loại bỏ toàn bộ dấu space (nếu có) ở 2 đầu của chuỗi
  //       str = str.trim();
  //       // bắt đầu xóa dấu tiếng việt  trong chuỗi
  //       str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  //       str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  //       str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  //       str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  //       str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  //       str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  //       str = str.replace(/đ/g, "d");
  //       str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  //       str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  //       str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  //       str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  //       str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  //       str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  //       str = str.replace(/Đ/g, "D");

  //       var nameA = str.toUpperCase(); // bỏ qua hoa thường

  //       let str2 = b.grade_name;
  //       str2 = str2.replace(/\s+/g, ' ');
  //       // loại bỏ toàn bộ dấu space (nếu có) ở 2 đầu của chuỗi
  //       str2 = str2.trim();
  //       // bắt đầu xóa dấu tiếng việt  trong chuỗi
  //       str2 = str2.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  //       str2 = str2.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  //       str2 = str2.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  //       str2 = str2.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  //       str2 = str2.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  //       str2 = str2.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  //       str2 = str2.replace(/đ/g, "d");
  //       str2 = str2.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  //       str2 = str2.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  //       str2 = str2.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  //       str2 = str2.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  //       str2 = str2.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  //       str2 = str2.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  //       str2 = str2.replace(/Đ/g, "D");

  //       var nameB = str2.toUpperCase(); // bỏ qua hoa thường
  //       if (nameA < nameB) {
  //         return 1;
  //       }
  //       if (nameA > nameB) {
  //         return -1;
  //       }
  //       // name trùng nhau
  //       return 0;
  //     });
  //     this.timesGrade = 1;
  //   }
  //   this.classData = array;

  // }
  //sort ca học
  // firstTimeStudyShift = 1;
  // timesStudyShift: any;
  // sortStudyShift() {
  //   this.firstTimeCode = 1;
  //   this.firstTimeName = 1;
  //   this.firstTimeGrade = 1;
  //   this.firstTimeStudyShift = 0;
  //   this.timesName = 0;
  //   this.timesCode = 0;
  //   this.timesGrade = 0;
  //   const array = this.classData;
  //   if (this.timesStudyShift !== 1) {
  //     array.sort(function (a, b) {
  //       let str = a.school_time
  //       var nameA = Number(str) // bỏ qua hoa thường
  //       let str2 = b.school_time;
  //       var nameB = Number(str2); // bỏ qua hoa thường
  //       if (nameA < nameB) {
  //         return -1;
  //       }
  //       if (nameA > nameB) {
  //         return 1;
  //       }
  //       // name trùng nhau
  //       return 0;
  //     });
  //     this.timesStudyShift = 1;
  //   } else {
  //     array.sort(function (a, b) {
  //       let str = a.school_time;
  //       var nameA = Number(str); // bỏ qua hoa thường
  //       let str2 = b.school_time;
  //       var nameB = Number(str2); // bỏ qua hoa thường
  //       if (nameA < nameB) {
  //         return 1;
  //       }
  //       if (nameA > nameB) {
  //         return -1;
  //       }
  //       // name trùng nhau
  //       return 0;
  //     });
  //     this.timesStudyShift++;
  //   }
  //   this.classData = array;

  // }
}
