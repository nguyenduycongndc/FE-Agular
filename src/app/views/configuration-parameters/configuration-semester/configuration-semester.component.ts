import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NotificationService } from '../../../_services/notification.service';
import { ConfigurationParametersSemesterService } from '../service/configuration-parameters-semester.service';
import { semesterConfiguration } from '../../../_models/semester-configuration';
import { CommonService } from '../../../_services/common.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';
declare var $: any;
@Component({
  selector: 'app-configuration-semester',
  templateUrl: './configuration-semester.component.html',
  styleUrls: ['./configuration-semester.component.css']
})
export class ConfigurationSemesterComponent implements OnInit {
  @ViewChild('selectSemesterInsert') selectSemesterInsert: ElementRef;
  @ViewChild('selectSemesterUpdate') selectSemesterUpdate: ElementRef;
  form: FormGroup;
  years: semesterConfiguration[] = [];
  p: number = 1;
  countPage: number = 10;
  totalItems = 0;
  submitted = false;
  checkSemesterConfigurationData = true;
  // checkStatus : any;
  semesterConfigurationData: any;
  //dữ liệu không tồn tại
  headerSemesterConfiguration = false;
  //drop năm học
  // dropdownListYear: any = [];
  selectedYearSearch = []; currentYear = [];
  selectedFormAdd = [];
  dropdownSettings = {};
  //drop năm học
  //drop năm học khi thêm
  selectedInsertYear = [];
  dropdownInsertSettings = {};
  dropdownUpdateSettings = {};
  yearsData: any;
  yearsDataUpdate: any;

  semestersName: any;
  exam_times: any;
  addExam_time: any;
  semestersEndDate: any;
  semestersStartDate: any;
  //drop năm học
  yearData = [];
  //drop năm học khi thêm
  yearDataInsert = [];
  //drop năm học khi sửa
  yearDataUpdate = [];
  ddlLevel = [];
  selectedLevel = [];
  selectedLevelUpdate= [];
  semesterResult = [];
  statusActive: number;
  idActive: number;
  disableStatus = true;
  disableExamTime = true;

  minDate: string;
  maxDate: string;
  perPageSelected(id: number) {
    this.countPage = id;
    this.p = 1;
  }
  get code() {
    return this.form.get('code');
  }
  get year_id() {
    return this.form.get('year_id');
  }
  get name() {
    return this.form.get('name');
  }
  get end_date() {
    return this.form.get('end_date');
  }
  get start_date() {
    return this.form.get('start_date');
  }
  get status(): any {
    return this.form.get('status');
  }
  get statusFilter(): any {
    return this.form.get('statusFilter');
  }
  get checkStatus(): any {
    return this.form.get('checkStatus');
  }
  get f() { return this.form.controls; }

  // Validate form

  onSubmit() {

  }
  semesterConfigurationGetById: any;
  //data grid cứng

  constructor(
    private fb: FormBuilder,
    private notifyService: NotificationService,
    private semesterService: ConfigurationParametersSemesterService,
    private yearService: CommonService,
  ) { }

  ngOnInit(): void {

    this.ddlLevel = [
      { id: 1, name: 'Tiểu học' },
      { id: 2, name: 'Trung học cơ sở' },
      { id: 3, name: 'Trung học phổ thông' },
    ];

    this.form = this.fb.group({
      level: new FormControl('', [Validators.required]),
      levelUpdate: new FormControl('', [Validators.required]),
      semesterCode: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      code: new FormControl(''),
      school_year: new FormControl(''),
      start_date: new FormControl('', [Validators.required]),
      end_date: new FormControl('', [Validators.required]),
      status: new FormControl(''),
      statusActive: new FormControl(true),
      checkStatus: new FormControl(true),
      addExamTime: new FormControl(true),
      updateExamTime: new FormControl(true),
      year_id: new FormControl('', [Validators.required]),
      listYear: new FormControl('')
    },
      // {validator: DateValidator}
    );
    //setting dropdown năm học
    this.semesterService.List()
      .pipe()
      .subscribe((data) => {
        const selectedYearData = [];
        const fullYear = [];
        const limitYear = [];
        const idCurrentYear = data['id_current_year'];
        let currentYearData;
        let currentArrYearData;
        // const currentArrYearData = [];
        data['years'].forEach(function (item) {
          fullYear.push({ id: item['id'], name: item['start_year'] + ' - ' + item['end_year'] });
        });
        data['limit_year'].forEach(function (item) {
          limitYear.push({ id: item['id'], name: item['start_year'] + ' - ' + item['end_year'] });
          if (item['id'] === idCurrentYear) {
            currentYearData = { id: item['id'], name: item['start_year'] + ' - ' + item['end_year'] };
            currentArrYearData = { id: item['id'], name: item['start_year'] + ' - ' + item['end_year'] };
            // currentArrYearData.push({id: item['id'],name: item['start_year'] + ' - ' + item['end_year']});
          }

        });
        this.yearData = fullYear;
        // this.yearDataInsert = limitYear;
        this.yearDataUpdate = limitYear;
        this.selectedYearSearch = currentArrYearData;
        // this.selectedFormAdd = currentYearData;
        this.currentYear = currentYearData;
        this.mapYear([idCurrentYear]);
        const minYear = currentArrYearData.name.substring(0, 4);
        const maxYear = currentArrYearData.name.substring(currentArrYearData.name.length - 4, currentArrYearData.name.length);
        this.minDate = minYear + '-01-01';
        this.maxDate = maxYear + '-12-31';
      });

    //Lấy năm hiện tại và tương lai ở form thêm
    this.yearService.getCurrentFutureYear()
      .pipe()
      .subscribe((data) => {
        const yearInsert = [];
        let currentYearData;
        data['query'].forEach(function (item) {
          yearInsert.push({ id: item['id'], name: item['start_year'] + ' - ' + item['end_year'], });
          if (item['status'] === 1) {
            currentYearData = { id: item['id'], name: item['start_year'] + ' - ' + item['end_year'] };
          }
        });

        this.yearDataInsert = yearInsert;
        this.selectedFormAdd = currentYearData;
      });
  }
  mapYear(id: any) {
    this.semesterService.searchByInput(id)
      .subscribe(
        result => {
          if (result['count'] === 0) {
            this.semesterConfigurationData = [];
            this.headerSemesterConfiguration = true;//hiện header
            this.checkSemesterConfigurationData = false;//dữ liệu không tồn tại
            this.p = 1;
            this.totalItems = 1;
          } else {
            this.p = 1;
            this.semesterConfigurationData = [];
            this.headerSemesterConfiguration = true;//hiện header
            this.checkSemesterConfigurationData = true;//dữ liệu tồn tại
            this.semesterConfigurationData = result['semesters'][0];
            this.totalItems = result['count'];
            this.searchInput = id;
            this.searchKeyWord = null;
          }
        });
  }

  selectAllYear(items: any) {
    this.selectedYearSearch = items;
  }
  deSelectAllYear() {
    this.selectedYearSearch = [];
  }
  onDeSelectYearInsert() {
    this.selectedFormAdd = this.currentYear;
  }
  //chọn 1
  onSelectYear = [];
  onSelectYearSearch(item: any) {
    // const listValue = this.form.controls['listYear'].value;
    const listForEach = [];
    listForEach.push(item);

    // const listForEach = [];
    // item.forEach(function (item) {
    //   listForEach.push(item['id']);
    // });

    this.searchInput = [listForEach[0]['id']];
    this.semesterService.searchByInput([listForEach[0]['id']])
      .subscribe(
        result => {
          if (result['count'] === 0) {
            this.semesterConfigurationData = [];
            this.headerSemesterConfiguration = true;//hiện header
            this.checkSemesterConfigurationData = false;//dữ liệu không tồn tại
            this.p = 1;
            this.totalItems = 1;
          } else {
            this.p = 1;
            this.semesterConfigurationData = [];
            this.headerSemesterConfiguration = true;//hiện header
            this.checkSemesterConfigurationData = true;//dữ liệu tồn tại
            this.semesterConfigurationData = result['semesters'][0];
            this.totalItems = result['count'];
            this.searchKeyWord = null;
          }
        }
      )
  }
  onItemSelectYear(item: any) {
    const minYear = item['name'].substring(0, 4);
    const maxYear = item['name'].substring(item['name'].length - 4, item['name'].length);
    this.minDate = minYear + '-01-01';
    this.maxDate = maxYear + '-12-31';
  }
  searchInput: any;
  //chọn tất cả
  onSelectAll(items: any) {
    const listValue = items;
    const listForEach = [];
    listValue.forEach(function (item) {
      listForEach.push(item['item_id']);
    });
    this.searchInput = listForEach;
    this.semesterService.searchByInput(listForEach)
      .subscribe(
        result => {
          if (result['count'] === 0) {
            this.semesterConfigurationData = [];
            this.headerSemesterConfiguration = true;//hiện header
            this.checkSemesterConfigurationData = false;//dữ liệu không tồn tại
            this.p = 1;
            this.totalItems = 1;
          } else {
            this.p = 1;
            this.semesterConfigurationData = [];
            this.headerSemesterConfiguration = true;//hiện header
            this.checkSemesterConfigurationData = true;//dữ liệu tồn tại
            this.semesterConfigurationData = result['semesters'][0];
            this.totalItems = result['count'];
            this.searchKeyWord = null;
          }
        }
      )
  }
  //chọn tất cả
  //bỏ chọn 1
  onItemDeSelect() {
    const listValue = this.form.controls['listYear'].value;
    const listForeach = [];
    listValue.forEach(function (item) {
      listForeach.push(item['item_id']);
    });
    this.searchInput = listForeach;
    if (listForeach.length > 0) {
      this.semesterService.searchByInput(listForeach)
        .subscribe(
          result => {
            if (result['count'] === 0) {
              this.semesterConfigurationData = [];
              this.headerSemesterConfiguration = true;//hiện header
              this.checkSemesterConfigurationData = false;//dữ liệu không tồn tại
              this.p = 1;
              this.totalItems = 1;
            } else {
              this.p = 1;
              this.semesterConfigurationData = [];
              this.headerSemesterConfiguration = true;//hiện header
              this.checkSemesterConfigurationData = true;//dữ liệu tồn tại
              this.semesterConfigurationData = result['semesters'][0];
              this.totalItems = result['count'];
            }
          }
        )
    } else {
      this.headerSemesterConfiguration = false;//xóa header
      this.checkSemesterConfigurationData = true;//dữ liệu tồn tại
      this.semesterConfigurationData = [];
    }
  }
  //bỏ chọn 1
  //bỏ chọn tất cả
  onItemDeSelectAll(items: any) {
    this.semesterConfigurationData = [];
    this.searchInput = [];
    this.headerSemesterConfiguration = false;//hiện header
    this.checkSemesterConfigurationData = true;//dữ liệu không tồn tại
    this.p = 1;
    this.totalItems = 1;

  }
  //bỏ chọn tất cả

  //reset form click Thêm mới
  resetSemesterConfigurationForm() {
    // this.selectedFormAdd = [];
    this.checkDate = true;
    this.valueCheck = undefined;
    this.valueBoolen = undefined;
    this.valueDate = undefined;
    this.checkDate2 = true;
    this.valueCheck2 = undefined;
    this.valueBoolen2 = undefined;
    this.valueDate2 = undefined;
    this.submitted = false;
    this.form.get('name').clearValidators();
    this.form.get('name').setValue('');
    this.form.get('start_date').clearValidators();
    this.form.get('start_date').setValue('');
    this.form.get('end_date').clearValidators();
    this.form.get('end_date').setValue('');
    this.form.get('level').clearValidators();
    this.selectedLevel= [];
    this.selectedFormAdd = this.currentYear;
  }
  //tìm kiếm
  searchKeyWord: any;
  searchByKeyWord(search: any) {
    this.semesterConfigurationData = [];

    if (search.trim() === '') {
      this.notifyService.showError('Vui lòng điền từ khóa tìm kiếm!', 'Thông báo lỗi');
      this.checkSemesterConfigurationData = false;
      this.headerSemesterConfiguration = true;
      this.semesterConfigurationData = [];
      this.p = 1;
      this.totalItems = 1;
    } else {
      if (this.searchInput) {
        this.semesterService.searchByKeyWord(search, this.searchInput)
          .subscribe(
            result => {
              this.headerSemesterConfiguration = true;
              if (result['count'] !== 0) {
                this.p = 1;
                this.semesterConfigurationData = [];
                this.headerSemesterConfiguration = true;
                this.checkSemesterConfigurationData = true;//dữ liệu tồn tại
                this.semesterConfigurationData = result['semesters'][0];
                this.totalItems = result['count'];
                this.searchKeyWord = search;
              } else {
                this.semesterConfigurationData = [];
                this.checkSemesterConfigurationData = false;
                this.p = 1;
                this.totalItems = 1;
              }
            }, error => {
              this.notifyService.showError(error, 'Thông báo lỗi');
            }
          );
      } else {
        this.semesterService.searchByKeyWord(search, null)
          .subscribe(
            result => {
              this.headerSemesterConfiguration = true;
              if (result['count'] !== 0) {
                this.p = 1;
                this.semesterConfigurationData = [];
                this.headerSemesterConfiguration = true;
                this.checkSemesterConfigurationData = true;//dữ liệu tồn tại
                this.semesterConfigurationData = result['semesters'][0];
                this.totalItems = result['count'];
                this.searchKeyWord = search;
              } else {
                this.semesterConfigurationData = [];
                this.checkSemesterConfigurationData = false;
                this.p = 1;
                this.totalItems = 1;
              }
            }, error => {
              this.notifyService.showError(error, 'Thông báo lỗi');
            }
          );
      }
    }
  }


  //button sửa
  getByIdSemesterConfiguration(id: any) {
    this.valueCheckUpdate = undefined;
    this.valueBoolenUpdate = undefined;
    this.valueDateUpdate = undefined;
    this.checkDateUpdate = true;

    this.valueCheckUpdate2 = undefined;
    this.valueBoolenUpdate2 = undefined;
    this.valueDateUpdate2 = undefined;
    this.checkDateUpdate2 = true;

    this.submitted = false;

    this.resetSemesterConfigurationForm();
    this.semesterService.getByIdSemesterConfiguration(id)
      .subscribe(
        result => {
          const arrayData = result['semester']

          let check = arrayData['status'];
          if (check === 1) {
            this.form.controls['checkStatus'].setValue(true);
            this.disableStatus = true;
          }
          else {
            this.form.controls['checkStatus'].setValue(false);
            this.disableStatus = false;
          }
          if (arrayData['exam_time'] === 1) {
            this.form.value.updateExamTime = true;
          }
          else {
            this.form.value.updateExamTime = false;
          }
          // let checkTime = arrayData['exam_time'];
          // if (checkTime === 1) {
          //   this.form.controls['updateExamTime'].setValue(true);
          //   this.disableExamTime = true;
          // }
          // else {
          //   this.form.controls['updateExamTime'].setValue(false);
          //   this.disableExamTime = false;
          // }
          
          // let levelUd = arrayData['level'];
          // this.selectedLevelUpdate = levelUd;
          
          let et = arrayData['exam_time'];
          this.exam_times = et;
          let semesterName = arrayData['name'];
          this.semestersName = semesterName;
          let startDate = arrayData['start_date'];
          let convertStartDate = startDate.substr(0, 10);
          this.semestersStartDate = convertStartDate;
          let endDate = arrayData['end_date'];
          let convertEndDate = endDate.substr(0, 10);
          this.semestersEndDate = convertEndDate;
          let yearsId = arrayData['year_id'];
          this.semesterConfigurationGetById = arrayData;
          var position;
          var i = 0;
          for (i = 0; i < this.yearDataUpdate.length; i++) {
            if (this.yearDataUpdate[i]['id'] === yearsId) {
              position = i;
              break;
            }
          }
          let semesterUpdate: any;
          let selectedLevelUpdate = [];
          const mapLevel = this.ddlLevel.map(function (x) { return x.id }).indexOf(result['semester']['level']);
          if (mapLevel > -1) {
            semesterUpdate = {
              id: this.ddlLevel[mapLevel]['id'],
              name: this.ddlLevel[mapLevel]['name'],
            }
           selectedLevelUpdate.push(semesterUpdate);
          }
          this.selectedLevelUpdate = semesterUpdate;

          const dataYears = this.yearDataUpdate[position];
          this.selectedFormAdd = dataYears;

          const minYear = dataYears.name.substring(0, 4);
          const maxYear = dataYears.name.substring(dataYears.name.length - 4, dataYears.name.length);
          this.minDate = minYear + '-01-01';
          this.maxDate = maxYear + '-12-31';
        });

  }
  //button xóa
  deleteSemesterConfiguration(id: number) {
    let isDelete = confirm('Bạn chắc chắn muốn xóa dữ liệu này?');
    if (isDelete) {
      this.semesterService.deleteSemesterConfiguration(id).subscribe(res => {
        this.notifyService.showSuccess('Xóa dữ liệu học kỳ thành công', 'Thông báo');
        // this.searchByYearId();
        if (this.searchKeyWord && !this.searchInput) {
          this.semesterService.searchByKeyWord(this.searchKeyWord, null)
            .subscribe(
              result => {
                this.headerSemesterConfiguration = true;
                if (result['count'] !== 0) {
                  // this.p = 1;
                  this.semesterConfigurationData = [];
                  this.headerSemesterConfiguration = true;
                  this.checkSemesterConfigurationData = true;//dữ liệu tồn tại
                  this.semesterConfigurationData = result['semesters'][0];
                  this.totalItems = result['count'];

                } else {
                  this.semesterConfigurationData = [];
                  this.checkSemesterConfigurationData = false;
                  // this.p = 1;
                  // this.totalItems = 1;
                }
              }, error => {
                if (error.messages) {
                  if (error.messages['name']) {
                    this.notifyService.showError(error.messages['name'], 'Thông báo lỗi');
                  } else if (error.messages['year_id']) {
                    this.notifyService.showError(error.messages['year_id'], 'Thông báo lỗi');
                  } else if (error.messages['start_date']) {
                    this.notifyService.showError(error.messages['start_date'], 'Thông báo lỗi');
                  } else if (error.messages['end_date']) {
                    this.notifyService.showError(error.messages['end_date'], 'Thông báo lỗi');
                  }
                } else if (error.message) {
                  if (error.message['year']) {
                    this.notifyService.showError(error.message['year'], 'Thông báo lỗi');
                  }
                  else if (error.message['semester']) {
                    this.notifyService.showError(error.message['semester'], 'Thông báo lỗi');
                  }
                }
              }
            );
        }
        else if (this.searchInput && !this.searchKeyWord) {
          this.semesterService.searchByInput(this.searchInput)
            .subscribe(
              result => {
                if (result['count'] === 0) {
                  this.semesterConfigurationData = [];
                  this.headerSemesterConfiguration = true;//hiện header
                  this.checkSemesterConfigurationData = false;//dữ liệu không tồn tại
                  this.p = 1;
                  this.totalItems = 1;
                } else {
                  // this.p = 1;
                  this.semesterConfigurationData = [];
                  this.headerSemesterConfiguration = true;//hiện header
                  this.checkSemesterConfigurationData = true;//dữ liệu tồn tại
                  this.semesterConfigurationData = result['semesters'][0];
                  this.totalItems = result['count'];

                }
              }
            )
        }
        else if (this.searchKeyWord && this.searchInput) {
          this.semesterService.searchByKeyWord(this.searchKeyWord, this.searchInput)
            .subscribe(
              result => {
                this.headerSemesterConfiguration = true;
                if (result['count'] !== 0) {
                  // this.p = 1;
                  this.semesterConfigurationData = [];
                  this.headerSemesterConfiguration = true;
                  this.checkSemesterConfigurationData = true;//dữ liệu tồn tại
                  this.semesterConfigurationData = result['semesters'][0];
                  this.totalItems = result['count'];

                } else {
                  this.semesterConfigurationData = [];
                  this.checkSemesterConfigurationData = false;
                  this.p = 1;
                  this.totalItems = 1;
                }
              }, error => {
                this.notifyService.showError(error, 'Thông báo lỗi');
              }
            );
        }
      }, error => {
        if (error.message['year']) {
          this.notifyService.showError(error.message['year'], 'Thông báo lỗi');
        }
        else {
          Object.keys(error.message).forEach(function (key) {
            this.notifyService.showError(error.message[key], 'Thông báo lỗi');
          });
        }
      });
    }
  }

  searchByYearId() {
    let arrYearId = [];
    this.form.value['listYear'].forEach(items => {
      arrYearId.push(items['id']);
    });

    this.semesterService.searchByInput(arrYearId)
      .subscribe(
        result => {
          if (result['count'] === 0) {
            this.semesterConfigurationData = [];
            this.headerSemesterConfiguration = true;//hiện header
            this.checkSemesterConfigurationData = false;//dữ liệu không tồn tại
            this.p = 1;
            this.totalItems = 1;
          } else {
            this.p = 1;
            this.semesterConfigurationData = [];
            this.headerSemesterConfiguration = true;//hiện header
            this.checkSemesterConfigurationData = true;//dữ liệu tồn tại
            this.semesterConfigurationData = result['semesters'][0];
            this.totalItems = result['count'];
            this.searchInput = arrYearId;
            this.searchKeyWord = null;
          }
        }
      )
  }
  valueCheck: any;
  valueBoolen: any;
  valueDate: any;
  checkDate: boolean;
  changeDate($event) {
    this.valueCheck = $event.target.validationMessage;
    this.valueBoolen = $event.target.validity.valid;
    this.valueDate = $event.target.value;
    var myDate = /^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/;
    if (this.valueCheck === '' && this.valueBoolen === true && this.valueDate !== '') {
      this.checkDate = myDate.test(this.valueDate);
    }
  }

  valueCheck2: any;
  valueBoolen2: any;
  valueDate2: any;
  checkDate2: boolean;
  changeDate2($event) {
    this.valueCheck2 = $event.target.validationMessage;
    this.valueBoolen2 = $event.target.validity.valid;
    this.valueDate2 = $event.target.value;
    var myDate = /^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/;
    if (this.valueCheck2 === '' && this.valueBoolen2 === true && this.valueDate2 !== '') {
      this.checkDate2 = myDate.test(this.valueDate2);
    }
  }
  //Thêm mới modal
  addSemesterConfiguration() {
    this.form.get('year_id').setValidators([Validators.required]);
    this.form.get('year_id').updateValueAndValidity();
    this.form.get('name').setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
    this.form.get('name').updateValueAndValidity();
    this.form.get('start_date').setValidators([Validators.required,]);
    this.form.get('start_date').updateValueAndValidity();
    this.form.get('end_date').setValidators([Validators.required]);
    this.form.get('end_date').updateValueAndValidity();
    this.form.get('level').setValidators([Validators.required]);
    this.form.get('level').updateValueAndValidity();
    this.submitted = true;
    if (this.form.controls['year_id'].invalid || this.form.controls['name'].invalid || this.form.controls['start_date'].invalid || this.form.controls['end_date'].invalid|| this.form.controls['level'].invalid) {
      return;
    }
    if (this.checkDate === false || this.checkDate2 === false) {
      return;
    }

    var uploadData = new FormData();
    // var year_id = this.form.controls['year_id'].value[0]['id'];
    if (this.selectedFormAdd) {
      uploadData.append('year_id', this.selectedFormAdd['id']);
    }
    if (this.form.value.name) {
      uploadData.append('name', this.form.value.name);
    }
    if (this.form.value.start_date) {
      uploadData.append('start_date', this.form.value.start_date);
    }
    if (this.form.value.end_date) {
      uploadData.append('end_date', this.form.value.end_date);
    }
    if(this.form.value.level){
      uploadData.append('level', this.form.value.level['id'])
    }
    
    var valueExamTime = this.form.value.addExamTime;
    if (valueExamTime == true) {
      valueExamTime = 1;
    } else {
      valueExamTime = 0;
    }
    uploadData.append('exam_time', valueExamTime)
    

    // var name = this.form.controls['name'].value;
    // var start_date = this.form.controls['start_date'].value;
    // var end_date = this.form.controls['end_date'].value;
    // this.semesterService.addSemesterConfiguration(year_id, name, start_date, end_date)
    this.semesterService.addSemesterConfiguration(uploadData)
      .subscribe(
        result => {
          this.resetSemesterConfigurationForm();
          $('#addSemesterConfigurationModal').modal('hide');
          $('.modal-backdrop').remove();
          this.notifyService.showSuccess('Thêm mới thành công', 'Thông báo');
          if (this.searchKeyWord && !this.searchInput) {
            this.semesterService.searchByKeyWord(this.searchKeyWord, null)
              .subscribe(
                result => {
                  this.headerSemesterConfiguration = true;
                  if (result['count'] !== 0) {
                    this.p = 1;
                    this.semesterConfigurationData = [];
                    this.headerSemesterConfiguration = true;
                    this.checkSemesterConfigurationData = true;//dữ liệu tồn tại
                    this.semesterConfigurationData = result['semesters'][0];
                    this.totalItems = result['count'];

                  } else {
                    this.semesterConfigurationData = [];
                    this.checkSemesterConfigurationData = false;
                    this.p = 1;
                    this.totalItems = 1;
                  }
                }, error => {
                  if (error.message['semester']) {
                    this.notifyService.showError(error.message['semester'], 'Thông báo lỗi');
                  }
                  else if (error.message['year']) {
                    this.notifyService.showError(error.message['year'], 'Thông báo lỗi');
                  }
                  else if (error.messages['start_date']) {
                    this.notifyService.showError(error.messages['start_date'], 'Thông báo lỗi');
                  }
                  else if (error.messages['end_date']) {
                    this.notifyService.showError(error.messages['end_date'], 'Thông báo lỗi');
                  }
                  else {
                    Object.keys(error.message).forEach(function (key) {
                      this.notifyService.showError(error.message[key], 'Thông báo lỗi');
                    });
                  }
                }
              );
          }
          else if (this.searchInput && !this.searchKeyWord) {
            this.semesterService.searchByInput(this.searchInput)
              .subscribe(
                result => {
                  if (result['count'] === 0) {
                    this.semesterConfigurationData = [];
                    this.headerSemesterConfiguration = true;//hiện header
                    this.checkSemesterConfigurationData = false;//dữ liệu không tồn tại
                    this.p = 1;
                    this.totalItems = 1;
                  } else {
                    this.p = 1;
                    this.semesterConfigurationData = [];
                    this.headerSemesterConfiguration = true;//hiện header
                    this.checkSemesterConfigurationData = true;//dữ liệu tồn tại
                    this.semesterConfigurationData = result['semesters'][0];
                    this.totalItems = result['count'];

                  }
                }
              )
          }
          else if (this.searchKeyWord && this.searchInput) {
            this.semesterService.searchByKeyWord(this.searchKeyWord, this.searchInput)
              .subscribe(
                result => {
                  this.headerSemesterConfiguration = true;
                  if (result['count'] !== 0) {
                    this.p = 1;
                    this.semesterConfigurationData = [];
                    this.headerSemesterConfiguration = true;
                    this.checkSemesterConfigurationData = true;//dữ liệu tồn tại
                    this.semesterConfigurationData = result['semesters'][0];
                    this.totalItems = result['count'];

                  } else {
                    this.semesterConfigurationData = [];
                    this.checkSemesterConfigurationData = false;
                    this.p = 1;
                    this.totalItems = 1;
                  }
                }, error => {
                  this.notifyService.showError(error, 'Thông báo lỗi');
                }
              );
          }

        },
        error => {
          if (error.messages) {
            if (error.messages['name']) {
              this.notifyService.showError(error.messages['name'], 'Thông báo lỗi');
            } else if (error.messages['year_id']) {
              this.notifyService.showError(error.messages['year_id'], 'Thông báo lỗi');
            } else if (error.messages['start_date']) {
              this.notifyService.showError(error.messages['start_date'], 'Thông báo lỗi');
            } else if (error.messages['end_date']) {
              this.notifyService.showError(error.messages['end_date'], 'Thông báo lỗi');
            }
          } else if (error.message) {
            if (error.message['year']) {
              this.notifyService.showError(error.message['year'], 'Thông báo lỗi');
            }
            else if (error.message['semester']) {
              this.notifyService.showError(error.message['semester'], 'Thông báo lỗi');
            }
          }
          this.searchByYearId();
        }
      );
  }
  valueCheckUpdate: any;
  valueBoolenUpdate: any;
  valueDateUpdate: any;
  checkDateUpdate: boolean;
  changeDateUpdate($event) {
    this.valueCheckUpdate = $event.target.validationMessage;
    this.valueBoolenUpdate = $event.target.validity.valid;
    this.valueDateUpdate = $event.target.value;
    var myDate = /^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/;
    if (this.valueCheckUpdate === '' && this.valueBoolenUpdate === true && this.valueDateUpdate !== '') {
      this.checkDateUpdate = myDate.test(this.valueDateUpdate);
    }
  }

  valueCheckUpdate2: any;
  valueBoolenUpdate2: any;
  valueDateUpdate2: any;
  checkDateUpdate2: boolean;
  changeDateUpdate2($event) {
    this.valueCheckUpdate2 = $event.target.validationMessage;
    this.valueBoolenUpdate2 = $event.target.validity.valid;
    this.valueDateUpdate2 = $event.target.value;
    var myDate = /^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/;
    if (this.valueCheckUpdate2 === '' && this.valueBoolenUpdate2 === true && this.valueDateUpdate2 !== '') {
      this.checkDateUpdate2 = myDate.test(this.valueDateUpdate2);
    }
  }
  //Cập nhật
  updateSemesterConfiguration(id: number) {
    this.form.get('levelUpdate').setValidators([Validators.required]);
    this.form.get('levelUpdate').updateValueAndValidity();
    this.form.get('year_id').setValidators([Validators.required]);
    this.form.get('year_id').updateValueAndValidity();
    this.form.get('name').setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
    this.form.get('name').updateValueAndValidity();
    this.form.get('start_date').setValidators([Validators.required,]);
    this.form.get('start_date').updateValueAndValidity();
    this.form.get('end_date').setValidators([Validators.required]);
    this.form.get('end_date').updateValueAndValidity();
    this.submitted = true;
    if (this.form.controls['year_id'].invalid 
    || this.form.controls['name'].invalid 
    || this.form.controls['start_date'].invalid 
    || this.form.controls['end_date'].invalid
    || this.form.controls['levelUpdate'].invalid) {
      return;
    }
    if (this.valueCheckUpdate === false || this.valueCheckUpdate2 === false) {
      return;
    }
    var year_id = this.form.controls['year_id'].value['id'];
    var name = this.form.controls['name'].value;
    var start_date = this.form.controls['start_date'].value;
    var end_date = this.form.controls['end_date'].value;
    var valueStatus = this.form.controls['checkStatus'].value;
    if (valueStatus == true) {
      var status = 1;
    } else {
      var status = 0;
    }
    var valueExamTime = this.form.controls['updateExamTime'].value;
    if (valueExamTime == true) {
      var exam_time = 1;
    } else {
      var exam_time = 0;
    }
    // var level_update=  this.form.value.levelUpdate['id']
    
    this.semesterService.updateSemesterConfiguration(id, year_id, name, start_date, end_date, status, exam_time)
      // this.semesterService.updateSemesterConfiguration(id,uploadData)
      .subscribe(result => {
        $('#editSemesterConfigurationModal').modal('hide');
        $('.modal-backdrop').remove();
        this.notifyService.showSuccess('Dữ liệu đã được cập nhật thành công', 'Thông báo');
        this.resetSemesterConfigurationForm();
        if (this.searchKeyWord && !this.searchInput) {
          this.semesterService.searchByKeyWord(this.searchKeyWord, null)
            .subscribe(
              result => {
                this.headerSemesterConfiguration = true;
                if (result['count'] !== 0) {
                  // this.p = 1;
                  this.semesterConfigurationData = [];
                  this.headerSemesterConfiguration = true;
                  this.checkSemesterConfigurationData = true;//dữ liệu tồn tại
                  this.semesterConfigurationData = result['semesters'][0];
                  this.totalItems = result['count'];

                } else {
                  this.semesterConfigurationData = [];
                  this.checkSemesterConfigurationData = false;
                  // this.p = 1;
                  // this.totalItems = 1;
                }
              }, error => {
                if (error.messages) {
                  if (error.messages['name']) {
                    this.notifyService.showError(error.messages['name'], 'Thông báo lỗi');
                  } else if (error.messages['year_id']) {
                    this.notifyService.showError(error.messages['year_id'], 'Thông báo lỗi');
                  } else if (error.messages['start_date']) {
                    this.notifyService.showError(error.messages['start_date'], 'Thông báo lỗi');
                  } else if (error.messages['end_date']) {
                    this.notifyService.showError(error.messages['end_date'], 'Thông báo lỗi');
                  }
                } else if (error.message) {
                  if (error.message['year']) {
                    this.notifyService.showError(error.message['year'], 'Thông báo lỗi');
                  }
                  else if (error.message['semester']) {
                    this.notifyService.showError(error.message['semester'], 'Thông báo lỗi');
                  }
                }
              }
            );
        }
        else if (this.searchInput && !this.searchKeyWord) {
          this.semesterService.searchByInput(this.searchInput)
            .subscribe(
              result => {
                if (result['count'] === 0) {
                  this.semesterConfigurationData = [];
                  this.headerSemesterConfiguration = true;//hiện header
                  this.checkSemesterConfigurationData = false;//dữ liệu không tồn tại
                  this.p = 1;
                  this.totalItems = 1;
                } else {
                  // this.p = 1;
                  this.semesterConfigurationData = [];
                  this.headerSemesterConfiguration = true;//hiện header
                  this.checkSemesterConfigurationData = true;//dữ liệu tồn tại
                  this.semesterConfigurationData = result['semesters'][0];
                  this.totalItems = result['count'];

                }
              }
            )
        }
        else if (this.searchKeyWord && this.searchInput) {
          this.semesterService.searchByKeyWord(this.searchKeyWord, this.searchInput)
            .subscribe(
              result => {
                this.headerSemesterConfiguration = true;
                if (result['count'] !== 0) {
                  // this.p = 1;
                  this.semesterConfigurationData = [];
                  this.headerSemesterConfiguration = true;
                  this.checkSemesterConfigurationData = true;//dữ liệu tồn tại
                  this.semesterConfigurationData = result['semesters'][0];
                  this.totalItems = result['count'];

                } else {
                  this.semesterConfigurationData = [];
                  this.checkSemesterConfigurationData = false;
                  this.p = 1;
                  this.totalItems = 1;
                }
              }, error => {
                this.notifyService.showError(error, 'Thông báo lỗi');
              }
            );
        }
      }, error => {
        if (error.messages) {
          if (error.messages['name']) {
            this.notifyService.showError(error.messages['name'], 'Thông báo lỗi');
          } else if (error.messages['year_id']) {
            this.notifyService.showError(error.messages['year_id'], 'Thông báo lỗi');
          } else if (error.messages['start_date']) {
            this.notifyService.showError(error.messages['start_date'], 'Thông báo lỗi');
          } else if (error.messages['end_date']) {
            this.notifyService.showError(error.messages['end_date'], 'Thông báo lỗi');
          }
        } else if (error.message) {
          if (error.message['year']) {
            this.notifyService.showError(error.message['year'], 'Thông báo lỗi');
          }
          else if (error.message['semester']) {
            this.notifyService.showError(error.message['semester'], 'Thông báo lỗi');
          }
        }
      }
      );
  }
  //chọn 1 năm khi thêm
  onItemSelectInsert() {

  }
  //xóa 1 năm khi thêm
  onItemDeSelectInsert() {

  }
  //chọn 1 năm khi sửa
  onItemSelectUpdate() {

  }
  //xóa 1 năm khi sửa
  onItemDeSelectUpdate() {

  }
  // sort
  //sort năm học
  firstYear = 1;
  timesYear: any;
  sortSchoolYear() {
    this.firstYear = 0;
    this.firstSemesterName = 1;
    this.timesName = 0;
    const array = this.semesterConfigurationData;
    if (this.timesYear === 1) {
      array.sort(function (a, b) {
        let str = a.school_year;

        str = str.replace(/\s+/g, ' ');
        // loại bỏ toàn bộ dấu space (nếu có) ở 2 đầu của chuỗi
        str = str.trim();
        // bắt đầu xóa dấu tiếng việt  trong chuỗi
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");

        // var A = this.loc_xoa_dau(a.fullname);
        // var B = this.loc_xoa_dau(b.fullname);
        var nameA = str.toUpperCase(); // bỏ qua hoa thường

        let str2 = b.school_year;


        str2 = str2.replace(/\s+/g, ' ');
        // loại bỏ toàn bộ dấu space (nếu có) ở 2 đầu của chuỗi
        str2 = str2.trim();
        // bắt đầu xóa dấu tiếng việt  trong chuỗi
        str2 = str2.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str2 = str2.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str2 = str2.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str2 = str2.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str2 = str2.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str2 = str2.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str2 = str2.replace(/đ/g, "d");
        str2 = str2.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str2 = str2.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str2 = str2.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str2 = str2.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str2 = str2.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str2 = str2.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str2 = str2.replace(/Đ/g, "D");

        var nameB = str2.toUpperCase(); // bỏ qua hoa thường
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // name trùng nhau
        return 0;
      });
      this.timesYear++;
    } else {
      array.sort(function (a, b) {
        let str = a.school_year;

        str = str.replace(/\s+/g, ' ');
        // loại bỏ toàn bộ dấu space (nếu có) ở 2 đầu của chuỗi
        str = str.trim();
        // bắt đầu xóa dấu tiếng việt  trong chuỗi
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");

        // var A = this.loc_xoa_dau(a.fullname);
        // var B = this.loc_xoa_dau(b.fullname);
        var nameA = str.toUpperCase(); // bỏ qua hoa thường

        let str2 = b.school_year;


        str2 = str2.replace(/\s+/g, ' ');
        // loại bỏ toàn bộ dấu space (nếu có) ở 2 đầu của chuỗi
        str2 = str2.trim();
        // bắt đầu xóa dấu tiếng việt  trong chuỗi
        str2 = str2.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str2 = str2.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str2 = str2.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str2 = str2.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str2 = str2.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str2 = str2.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str2 = str2.replace(/đ/g, "d");
        str2 = str2.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str2 = str2.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str2 = str2.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str2 = str2.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str2 = str2.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str2 = str2.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str2 = str2.replace(/Đ/g, "D");

        var nameB = str2.toUpperCase(); // bỏ qua hoa thường
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }
        // name trùng nhau
        return 0;
      });
      this.timesYear = 1
    }
    this.semesterConfigurationData = array;
  }

  // //sort mã học kỳ
  // firstSemesterCode = 1;
  // timesCode: any;
  // sortSemesterCode() {
  //   this.firstYear = 1;
  //   this.firstSemesterCode = 0;
  //   this.timesYear = 0;
  //   this.timesName = 0;
  //   const array = this.semesterConfigurationData;
  //   if (this.timesCode === 1) {
  //     array.sort(function (a, b) {
  //       let str = a.code;

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

  //       // var A = this.loc_xoa_dau(a.fullname);
  //       // var B = this.loc_xoa_dau(b.fullname);
  //       var nameA = str.toUpperCase(); // bỏ qua hoa thường

  //       let str2 = b.code;


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
  //       // code trùng nhau
  //       return 0;
  //     });
  //     this.timesCode++;
  //   } else {
  //     array.sort(function (a, b) {
  //       let str = a.code;

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

  //       // var A = this.loc_xoa_dau(a.fullname);
  //       // var B = this.loc_xoa_dau(b.fullname);
  //       var nameA = str.toUpperCase(); // bỏ qua hoa thường

  //       let str2 = b.code;


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
  //       // code trùng nhau
  //       return 0;
  //     });
  //     this.timesCode = 1
  //   }
  //   this.semesterConfigurationData = array;
  // }
  //sort tên học kỳ
  firstSemesterName = 1;
  timesName: any;
  sortSemesterName() {
    this.firstYear = 1;
    this.firstSemesterName = 0;
    this.timesYear = 0;
    const array = this.semesterConfigurationData;
    if (this.timesName === 1) {
      array.sort(function (a, b) {
        let str = a.name;

        str = str.replace(/\s+/g, ' ');
        // loại bỏ toàn bộ dấu space (nếu có) ở 2 đầu của chuỗi
        str = str.trim();
        // bắt đầu xóa dấu tiếng việt  trong chuỗi
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");

        // var A = this.loc_xoa_dau(a.fullname);
        // var B = this.loc_xoa_dau(b.fullname);
        var nameA = str.toUpperCase(); // bỏ qua hoa thường

        let str2 = b.name;


        str2 = str2.replace(/\s+/g, ' ');
        // loại bỏ toàn bộ dấu space (nếu có) ở 2 đầu của chuỗi
        str2 = str2.trim();
        // bắt đầu xóa dấu tiếng việt  trong chuỗi
        str2 = str2.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str2 = str2.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str2 = str2.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str2 = str2.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str2 = str2.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str2 = str2.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str2 = str2.replace(/đ/g, "d");
        str2 = str2.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str2 = str2.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str2 = str2.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str2 = str2.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str2 = str2.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str2 = str2.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str2 = str2.replace(/Đ/g, "D");

        var nameB = str2.toUpperCase(); // bỏ qua hoa thường
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // name trùng nhau
        return 0;
      });
      this.timesName++;
    } else {
      array.sort(function (a, b) {
        let str = a.name;

        str = str.replace(/\s+/g, ' ');
        // loại bỏ toàn bộ dấu space (nếu có) ở 2 đầu của chuỗi
        str = str.trim();
        // bắt đầu xóa dấu tiếng việt  trong chuỗi
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");

        // var A = this.loc_xoa_dau(a.fullname);
        // var B = this.loc_xoa_dau(b.fullname);
        var nameA = str.toUpperCase(); // bỏ qua hoa thường

        let str2 = b.name;


        str2 = str2.replace(/\s+/g, ' ');
        // loại bỏ toàn bộ dấu space (nếu có) ở 2 đầu của chuỗi
        str2 = str2.trim();
        // bắt đầu xóa dấu tiếng việt  trong chuỗi
        str2 = str2.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str2 = str2.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str2 = str2.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str2 = str2.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str2 = str2.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str2 = str2.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str2 = str2.replace(/đ/g, "d");
        str2 = str2.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str2 = str2.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str2 = str2.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str2 = str2.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str2 = str2.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str2 = str2.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str2 = str2.replace(/Đ/g, "D");

        var nameB = str2.toUpperCase(); // bỏ qua hoa thường
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }
        // name trùng nhau
        return 0;
      });
      this.timesName = 1
    }
    this.semesterConfigurationData = array;
  }
  // sort
}
