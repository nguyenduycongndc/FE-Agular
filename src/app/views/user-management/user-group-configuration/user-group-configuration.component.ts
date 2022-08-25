import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserGroupConfiguration } from '../../../_models/user-group-configuration';
import { NotificationService } from '../../../_services/notification.service';
import { UserGroupConfigurationService } from '../service/user-group-configuration.service';

declare var $: any;

@Component({
  selector: "app-user-group-configuration",
  templateUrl: "./user-group-configuration.component.html",
  styleUrls: ["./user-group-configuration.component.css"]
})
export class UserGroupConfigurationComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  @Input()
  maxNumberOfCharactersDescription = 150;
  counter = true;
  numberOfCharactersDescription = 0;

  fileURL: any;
  loadingDownload = false; loadingImport = false; loadingExport = false; loadingFilter = false;
  selectedFile: File;
  userGroupConfiguration: Observable<UserGroupConfiguration>;
  form: FormGroup;
  ddlYearSearchData = []; selectedYear = [];
  ddlGradeSearchData = []; ddlClassSearchData = []; selectedGradeSearch = []; selectedClassSearch = [];
  ddlGrade = []; ddlClass = []; selectedGrade = []; selectedClass = [];
  // ddlGradeUpdate = []; ddlClassUpdate = []; selectedGradeUpdate = []; selectedClassUpdate = [];

  checkUserConfigData = true;

  // Pagination parameters.
  p: number = 1;
  countPage: number = 10;
  totalItems = 0;

  submitted = false;
  userConfigData: any; userConfigGetById: any; // GetById cấu hình người sử dụng fill lên form update

  requiredGradeSearchField = true; headerUserGroupConfig = false;

  constructor(
    private fb: FormBuilder,
    private userGroupConfigurationService: UserGroupConfigurationService,
    private notifyService: NotificationService
  ) { }

  // Lấy id dropdown selected Grade
  perPageSelected(id: number) {
    this.countPage = id;
  }

  get f() { return this.form.controls; }
  uploadFile(files) {
    if (files.length === 0) {
      return;
    }
    this.selectedFile = files[0];
    const mimeType = files[0].type;
    if (mimeType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && mimeType !== 'application/vnd.ms-excel') {
      this.notifyService.showError('Chỉ hỗ trợ định dạng .xls, .xlsx, .csv', 'Thông báo lỗi');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.fileURL = this.selectedFile['name'];
    };
  }

  onKeyUp(event: any): void {
    this.numberOfCharactersDescription = event.target.value.length;
    if (this.numberOfCharactersDescription > this.maxNumberOfCharactersDescription) {
      event.target.value = event.target.value.slice(0, this.maxNumberOfCharactersDescription);
      this.numberOfCharactersDescription = this.maxNumberOfCharactersDescription;
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      code: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]),
      name: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]),
      description: new FormControl(''),
      status: new FormControl(true),
      yearSearch: new FormControl(''),
      statusActive: new FormControl(true),
      grade: new FormControl(''),
      class: new FormControl(''),
      gradeSearch: new FormControl(''),
      classSearch: new FormControl('')
    });

    this.userGroupConfigurationService.getYears()
      .pipe()
      .subscribe((data) => {
        const fullYear = [];
        const limitYear = [];
        const idCurrentYear = data['id_current_year'];
        let currentYearData;
        const currentArrYearData = [];
        data['years'].forEach(function (item) {
          fullYear.push({ id: item['id'],name: item['start_year'] + ' - ' + item['end_year'] });
        });
        data['limit_year'].forEach(function (item) {
          limitYear.push({ id: item['id'],name: item['start_year'] + ' - ' + item['end_year'] });
          if(item['id'] === idCurrentYear){
            currentYearData = {id: item['id'],name: item['start_year'] + ' - ' + item['end_year']};
            currentArrYearData.push({id: item['id'],name: item['start_year'] + ' - ' + item['end_year']});
          }

        });
        this.ddlYearSearchData = fullYear;
        this.selectedYear = currentArrYearData[0];

        this.userGroupConfigurationService.getGradeByYear(this.selectedYear['id'])
        .pipe(first())
        .subscribe(
          (data) => {
            const gradeObj = [];
            const gradeData = data.query;
            gradeData.forEach(function (item) {
              gradeObj.push({ id: item['id'], name: item['name'] })
            });
            this.ddlGradeSearchData = gradeObj;
            this.ddlGrade = gradeObj;
          });

      });
  }

  onSelectYear(item: any) {
    this.selectedGradeSearch = [];
    this.selectedClassSearch = [];
    this.ddlGradeSearchData = [];
    this.ddlClassSearchData = [];
    if(item) {
      this.userGroupConfigurationService.getGradeByYear(item.id)
      .pipe(first())
      .subscribe(
        (data) => {
          const gradeObj = [];
          const gradeData = data.query;
          gradeData.forEach(function (item) {
            gradeObj.push({ id: item['id'], name: item['name'] })
          });
          this.ddlGradeSearchData = gradeObj;
          this.ddlGrade = gradeObj;
        });
    } else{
      this.userGroupConfigurationService.getYears()
      .pipe()
      .subscribe((data) => {
        const fullYear = [];
        const limitYear = [];
        const idCurrentYear = data['id_current_year'];
        let currentYearData;
        const currentArrYearData = [];
        data['years'].forEach(function (item) {
          fullYear.push({ id: item['id'],name: item['start_year'] + ' - ' + item['end_year'] });
        });
        data['limit_year'].forEach(function (item) {
          limitYear.push({ id: item['id'],name: item['start_year'] + ' - ' + item['end_year'] });
          if(item['id'] === idCurrentYear){
            currentYearData = {id: item['id'],name: item['start_year'] + ' - ' + item['end_year']};
            currentArrYearData.push({id: item['id'],name: item['start_year'] + ' - ' + item['end_year']});
          }

        });
        this.selectedYear = currentArrYearData[0];
      });
    }
  }

  // Sử lý sự kiện binding dữ liệu cho class search dropdown list
  selectGradeSearch(items: any) {
    this.ddlClassSearchData = [];
    const arrSearch = [];
    items.forEach(function (item) {
      arrSearch.push(item['id']);
    });
    this.userGroupConfigurationService.listDmLop(arrSearch)
      .subscribe(
        (data) => {
          const dmLopObj = []
          data.forEach(function (grades) {
            dmLopObj.push({ id: grades['id'], name: grades['name'] });
          })
          this.ddlClassSearchData = dmLopObj;

          //bắt đầu
          const arrAfterFilter = [];
          const arrSelected = this.selectedClassSearch;
          arrSelected.forEach(function(items){
            let id = items.id;
            let x = dmLopObj.map(function(ite) {return ite.id}).indexOf(id);
            if(x > -1){
              arrAfterFilter.push({id: items.id, name: items.name});
            }
          });
          if(arrAfterFilter.length > 0){
          this.selectedClassSearch = arrAfterFilter;
          }else{
            this.selectedClassSearch = [];
          }
          //kết thúc

        },
        error => {
          return false;
        });
  }
  selectAllGradeSearch(gradeSearchData) {
    if (gradeSearchData) {
      const arrGradeSearch = [];
      this.selectedGradeSearch = gradeSearchData;
      gradeSearchData.forEach(function (item) {
        arrGradeSearch.push(item['id']);
      });
      this.userGroupConfigurationService.listDmLop(arrGradeSearch)
        .subscribe(
          (data) => {
            const dmLopObj = []
            data.forEach(function (grades) {
              dmLopObj.push({ id: grades['id'], name: grades['name'] });
            })
            this.ddlClassSearchData = dmLopObj;
          },
          error => {
            return false;
          });
    } else {
      this.selectedClassSearch = [];
    }
  }
  deSelectAllGradeSearch() {
    this.selectedGradeSearch = [];
    this.ddlClassSearchData = [];
    this.selectedClassSearch = [];
  }
  selectAllClassSearch(classSearchData) {
    if (classSearchData) {
      this.selectedClassSearch = classSearchData;
    }
  }
  deSelectAllClassSearch() {
    this.selectedClassSearch = [];
  }

  // Xử lý sự kiện binding dữ liệu cho class insert dropdown list
  selectGradeInsert(item: any) {
    this.ddlClass = [];
    // this.selectedClass = [];
    this.userGroupConfigurationService.listDmLop([item['id']])
      .subscribe(
        (data) => {
          const classObj = []
          data.forEach(function (items) {
            classObj.push({ id: items['id'], name: items['name'] });
          })
          this.ddlClass = classObj;
        },
        error => {
          return false;
        });
  }
  // Sử lý sự kiện binding dữ liệu cho class update dropdown list
  selectGradeUpdate(item: any) {
    this.ddlClass = [];
    // this.selectedClass = [];
    this.userGroupConfigurationService.listDmLop([item['id']])
      .subscribe(
        (data) => {
          const classObj = []
          data.forEach(function (items) {
            classObj.push({ id: items['id'], name: items['name'] });
          })
          this.ddlClass = classObj;
        },
        error => {
          return false;
        });
  }
  flagKeyWord: any;
  searchByKeyWord(search) {
    this.userConfigData = [];
    if (search.trim() === "") {
      this.notifyService.showError('Vui lòng điền từ khóa tìm kiếm!', 'Thông báo lỗi');
      this.totalItems = 1;
      this.p = 1;
    } else {
      this.userGroupConfigurationService.searchByKeyWord(search)
        .subscribe(
          result => {
            this.headerUserGroupConfig = true;
            let count = result['group_user_configuration'].length;
            if (count > 0) {
              this.userConfigData = [];
              this.checkUserConfigData = true;
              this.userConfigData = result['group_user_configuration'];
              this.totalItems = count;
              this.p = 1;
              this.flagSearch = 1;
              this.flagKeyWord = search;
            } else {
              this.userConfigData = [];
              this.checkUserConfigData = false;
              this.totalItems = 1;
              this.p = 1;
            }
          },
          error => {
            this.notifyService.showError('Lỗi trong quá trình tìm kiếm dữ liệu. Vui lòng thử lại!', 'Thông báo lỗi');
          });
    }
  }

  flagSearch: any;
  //lọc dữ liệu
  onClassSelectObject = []
  searchByInput() {
    this.loadingFilter = true;
    const arrDataGrade = this.form.controls['gradeSearch'].value;
    const arrDataClass = this.form.controls['classSearch'].value;
    const formData = new FormData();
    let i = 0;
    if (arrDataGrade.length > 0) {
      arrDataGrade.forEach(function (item) {
        formData.append('grades' + "[" + i + "]", item['id']);
        i++;
      })
      i = 0;
    }
    if (arrDataClass.length > 0) {
      arrDataClass.forEach(function (item) {
        formData.append('classes' + "[" + i + "]", item['id']);
        i++;
      })
      i = 0;
    }
    if (this.form.value.statusActive) {
      formData.append('status', 'active');
    } else {
      formData.append('status', 'inactive');
    }
    this.userGroupConfigurationService.searchByInput(formData)
      .subscribe(
        result => {
          this.loadingFilter = false;
          let count = result['group_user_configuration'].length;
          if (count > 0) {
            this.headerUserGroupConfig = true;
            this.checkUserConfigData = true;
            this.userConfigData = result['group_user_configuration'];
            this.totalItems = count;
            this.p = 1;
            this.flagSearch = 2;
          } else {
            this.userConfigData = [];
            this.p = 1;
            this.totalItems = 1;
            this.headerUserGroupConfig = true;
            this.checkUserConfigData = false;
          }
        },
        error => {
          this.loadingFilter = false;
          this.notifyService.showError('Lỗi trong quá trình lọc dữ liệu. Vui lòng thử lại!!', 'Thông báo lỗi');
        });
  }

  // Thêm mới cấu hình nhóm người sử dụng
  addUserGroupConfig() {
    this.form.get('code').setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(100)]);
    this.form.get('code').updateValueAndValidity();
    this.form.get('name').setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(100)]);
    this.form.get('name').updateValueAndValidity();
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    var uploadData = new FormData();

    var grade = this.form.controls["grade"].value;
    var class_id = this.form.controls["class"].value;

    if (grade && grade.id) {
      uploadData.append("grade_id", grade.id);
    }

    if (class_id && class_id.id) {
      uploadData.append("class_id", class_id.id);
    }

    if (this.form.value.code) {
      uploadData.append('code', this.form.value.code);
    }
    if (this.form.value.name) {
      uploadData.append('name', this.form.value.name);
    }
    // if (this.selectedGrade && this.selectedGrade.length > 0) {
    //   uploadData.append('grade_id', this.selectedGrade['id']);
    // }
    // if (this.selectedClass && this.selectedClass.length > 0) {
    //   uploadData.append('class_id', this.selectedClass['id']);
    // }
    if (this.form.value.description) {
      uploadData.append('description', this.form.value.description.substring(0, 150));
    }

    this.userGroupConfigurationService.addUserGroupConfig(uploadData).subscribe(
      result => {
        $('#addUserGroupConfigurationModal').modal('hide');
        $('.modal-backdrop').remove();
        this.notifyService.showSuccess('Dữ liệu (' + result.code + ' - ' + result.name + ') đã được thêm thành công', 'Thông báo');
        if (this.flagSearch === 1) {
          this.searchByKeyWord(this.flagKeyWord);
        } else {
          this.searchByInput();
        }
        // this.ngOnDestroy();
      },
      error => {
        if (error.messages) {
          if (error.messages['code']) {
            this.notifyService.showError(error.messages['code'], 'Thông báo lỗi');
          } else if (error.messages['name']) {
            this.notifyService.showError(error.messages['code'], 'Thông báo lỗi');
          } else {
            this.notifyService.showError('Thêm mới cấu hình nhóm người sử dụng không thành công. Vui lòng kiểm tra lại!', 'Thông báo lỗi');
          }
        } else if (error.message) {
          this.notifyService.showError(error.message, 'Thông báo lỗi');
        } else if (error.error) {
          this.notifyService.showError(error.error, 'Thông báo lỗi');
        } else {
          this.notifyService.showError('Thêm mới cấu hình nhóm người sử dụng không thành công. Vui lòng kiểm tra lại!', 'Thông báo lỗi');
        }
      });
  }

  // Cập nhật cấu hình nhóm người sử dụng
  updateUserGroupConfig(id: number) {
    this.form.get('name').setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(50)]);
    this.form.get('name').updateValueAndValidity();
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    var uploadData = new FormData();
    if (this.form.value.code) {
      uploadData.append('code', this.form.value.code);
    }
    if (this.form.value.name) {
      uploadData.append('name', this.form.value.name);
    }
    if (this.selectedGrade) {
      uploadData.append('grade_id', this.selectedGrade['id']);
    }
    if (this.selectedClass) {
      uploadData.append('class_id', this.selectedClass['id']);
    }
    if (this.form.value.description) {
      uploadData.append('description', this.form.value.description.substring(0, 150));
    }
    if (this.form.value.status === true || this.form.value.status === 1) {
      uploadData.append('status', '1');
    } else {
      uploadData.append('status', '0');
    }

    // Call API cập nhật cấu hình nhóm người sử dụng
    this.userGroupConfigurationService.updateUserGroupConfig(id, uploadData).subscribe(
      result => {
        $('#editUserGroupConfigurationModal').modal('hide');
        $('.modal-backdrop').remove();
        this.notifyService.showSuccess('Dữ liệu đã được cập nhật thành công', 'Thông báo');
        if (this.flagSearch === 1) {
          this.searchByKeyWord(this.flagKeyWord);
        } else {
          this.searchByInput();
        }
      },
      error => {
        if (error.messages) {
          if (error.messages['code']) {
            this.notifyService.showError(error.messages['code'], 'Thông báo lỗi');
          } else if (error.messages['name']) {
            this.notifyService.showError(error.messages['code'], 'Thông báo lỗi');
          } else {
            this.notifyService.showError('Thêm mới cấu hình nhóm người sử dụng không thành công. Vui lòng kiểm tra lại!', 'Thông báo lỗi');
          }
        } else if (error.message) {
          this.notifyService.showError(error.message, 'Thông báo lỗi');
        } else if (error.error) {
          this.notifyService.showError(error.error, 'Thông báo lỗi');
        } else {
          this.notifyService.showError('Thêm mới cấu hình nhóm người sử dụng không thành công. Vui lòng kiểm tra lại!', 'Thông báo lỗi');
        }
      });
  }

  // Reset form
  resetUserGroupConfigForm() {
    this.form.get('code').clearValidators();
    this.form.get('name').clearValidators();
    this.form.get('code').setValue('');
    this.form.get('name').setValue('');
    this.form.get('description').setValue('');
    this.selectedGrade = [];
    this.selectedClass = [];
    this.numberOfCharactersDescription = 0;
  }

  // GetById cấu hình nhóm người sử dụng
  getByIdUserGroupConfig(id: number) {
    this.resetUserGroupConfigForm();
    this.userGroupConfigurationService.getByIdUserGroupConfig(id)
      .subscribe(
        result => {
          this.userConfigGetById = result;
          let gradeUpdate: any;
          let selectedGradeUpdate = [];
          const mapGrade = this.ddlGrade.map(function (x) { return x.id }).indexOf(result['grade_id']);
          if (mapGrade > -1) {
            gradeUpdate = {
              id: this.ddlGrade[mapGrade]['id'],
              name: this.ddlGrade[mapGrade]['name'],
            }
            selectedGradeUpdate.push(gradeUpdate);
          }
          this.selectedGrade = selectedGradeUpdate[0]; this.userGroupConfigurationService.listDmLop([result['grade_id']])
            .pipe()
            .subscribe(
              (data) => {
                let classData = data;
                if (classData) {
                  const arrClass = [];
                  classData.forEach(function (item) {
                    arrClass.push({ id: item['id'], name: item['name'] });
                  })
                  this.ddlClass = arrClass;
                }
                let classUpdate: any;
                let selectedClassUpdate = [];
                const mapClass = this.ddlClass.map(function (x) { return x.id }).indexOf(result['class_id']);
                if (mapClass > -1) {
                  classUpdate = {
                    id: this.ddlClass[mapClass]['id'],
                    name: this.ddlClass[mapClass]['name'],
                  }
                  selectedClassUpdate.push(classUpdate);
                }
                this.selectedClass = selectedClassUpdate[0];

                if (result.description) {
                  this.numberOfCharactersDescription = result.description.length;
                } else {
                  this.numberOfCharactersDescription = 0;
                }
              }
            );
          if (result['status'] === 1) {
            this.form.value.status = true;
          }
          else {
            this.form.value.status = false;
          }
          this.form.patchValue(result);
        },
        error => {
          Object.keys(error).forEach(function (key) {
            this.notifyService.showError(error[key], 'Thông báo lỗi');
          });
        });
  }

  // Xóa cấu hình nhóm người sử dụng
  deleteUserGroupConfig(id: number) {
    let isDelete = confirm('Bạn chắc chắn muốn xóa dữ liệu này?');
    if (isDelete) {
      this.userGroupConfigurationService.deleteUserGroupConfig(id)
        .subscribe(
          result => {
            this.notifyService.showSuccess('Dữ liệu đã được xóa thành công!', 'Thông báo');
            this.searchByInput();
            // this.ngOnDestroy();
          },
          error => {
            this.notifyService.showError(error, 'Thông báo lỗi');
            // this.ngOnDestroy();
          });
    }
  }

  // Tải file mẫu cho chức năng cấu hình nhóm người sử dụng
  downloadSampleFile() {
    this.loadingDownload = true;
    this.userGroupConfigurationService.downloadSampleFile()
      .subscribe(res => {
        this.loadingDownload = false;
        // window.open(window.URL.createObjectURL(res));
        var downloadURL = window.URL.createObjectURL(res);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = "FileMau_NhomNguoiSD.xlsx";
        link.click();
      },
      error => {
        this.notifyService.showError('Tải tệp mẫu không thành công.', 'Thông báo lỗi');
      });
  }

  // Import dữ liệu cấu hình nhóm người sử dụng
  importFile() {
    this.loadingImport = true;
    var formData = new FormData();
    formData.append('import_excel', this.fileInput.nativeElement.files[0])
    this.userGroupConfigurationService.importFile(formData)
      .subscribe(
        result => {
          this.loadingImport = false;
          this.fileInput.nativeElement.value = null;
          this.notifyService.showSuccess(result.message + ' Bạn có thể tìm kiếm dữ liệu dựa vào công cụ tìm kiếm', 'Thành công');
          this.fileInput.nativeElement.value = '';
          this.fileURL = '';
        },
        error => {
          this.loadingImport = false;
          if (error.messages != undefined) {
            if (error.messages.import_excel !== undefined) {
              this.notifyService.showError(error.messages.import_excel[0], 'Thông báo lỗi');
            } else if (error.messages.name) {
              this.notifyService.showError(error.messages["name"] + ' - ' + error.position, 'Thông báo lỗi');
            } else if (error.messages.grade_id) {
              this.notifyService.showError(error.messages["grade_id"] + ' - ' + error.position, 'Thông báo lỗi');
            } else if (error.messages.class_id) {
              this.notifyService.showError(error.messages["class_id"] + ' - ' + error.position, 'Thông báo lỗi');
            }
            else {
              this.notifyService.showError(error.messages["code"] + ' - ' + error.position, 'Thông báo lỗi');
            }
          }
          else {
            if (error.message) {
              this.notifyService.showError(error.message, 'Thông báo lỗi');
            } else {
              this.notifyService.showError(error + '\n \ ', 'Thông báo lỗi');
            }
          }
          this.fileInput.nativeElement.value = '';
          this.fileURL = '';
        });
  }

  // Export dữ liệu cấu hình người sử dụng ra file Excel
  exportFile() {
    this.loadingExport = true;
    const formData = new FormData();
    if (this.flagSearch === 1) {
      formData.append('search', this.flagKeyWord);
      formData.append('export_files', '1');
    } else if (this.flagSearch === 2) {
      const arrDataGrade = this.form.controls['gradeSearch'].value;
      const arrDataClass = this.form.controls['classSearch'].value;
      let i = 0;
      if (arrDataGrade.length > 0) {
        arrDataGrade.forEach(function (item) {
          formData.append('grades' + "[" + i + "]", item['item_id']);
          i++;
        })
        i = 0;
      }
      if (arrDataClass.length > 0) {
        arrDataClass.forEach(function (item) {
          formData.append('classes' + "[" + i + "]", item['item_id']);
          i++;
        })
        i = 0;
      }
      if (this.form.value.statusActive) {
        formData.append('status', 'active');
      } else {
        formData.append('status', 'inactive');
      }
      formData.append('export_files', '1');

    } else {
      this.loadingExport = false;
      this.notifyService.showWarning('Vui lòng tìm kiếm dữ liệu cần xuất ra tệp!', 'Thông báo');
      return;
    }
    this.userGroupConfigurationService.exportFile(formData)
      .subscribe(res => {
        this.loadingExport = false;
        // window.open(window.URL.createObjectURL(res.body));
        var downloadURL = window.URL.createObjectURL(res.body);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = "DanhsachNhomNguoiSD.xlsx";
        link.click();
      },
      error => {
        this.notifyService.showError('Xuất ra tệp không thành công. Vui lòng thử lại!', 'Thông báo lỗi');
      });

  }

  alphabetsFather = ["A", "À", "Ả", "Ã", "Á", "Ạ",
  "Ă", "Ằ", "Ẳ", "Ẵ", "Ắ", "Ặ",
  "Â", "Ầ", "Ẩ", "Ẫ", "Ấ", "Ậ",
  "B", "C", "D", "Đ",
  "E", "È", "Ẻ", "Ẽ", "É", "Ẹ",
  "Ê", "Ề", "Ể", "Ễ", "Ế", "Ệ",
  "F", "G", "H",
  "I", "Ì", "Ỉ", "Ĩ", "Í", "Ị",
  "J", "K", "L", "M", "N",
  "O", "Ò", "Ỏ", "Õ", "Ó", "Ọ",
  "Ô", "Ồ", "Ổ", "Ỗ", "Ố", "Ộ",
  "Ơ", "Ờ", "Ở", "Ỡ", "Ớ", "Ợ",
  "P", "Q", "R", "S", "T",
  "U", "Ù", "Ủ", "Ũ", "Ú", "Ụ",
  "Ư", "Ừ", "Ử", "Ữ", "Ứ", "Ự",
  "V", "W", "X",
  "Y", "Ỳ", "Ỷ", "Ỹ", "Ý", "Ỵ",
  "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", " "];

//*1 hàm sort
public CharCompare(a, b, index) {
  var aChar;
  var bChar;
  var alphabets = this.alphabetsFather;
  if (index == a.length || index == b.length) return 0;
  aChar = alphabets.indexOf(a.toUpperCase().charAt(index));
  bChar = alphabets.indexOf(b.toUpperCase().charAt(index));
  if (aChar != bChar) return aChar - bChar;
  else return this.CharCompare(a, b, index + 1);
}


  firstTimeCode = 1;
  timesCode: any;
  sortCode() {
    this.firstTimeCode = 0;
    this.firstTimeName = 1;
    this.timesGroupName = 0;
    const array = this.userConfigData;
    if (this.timesCode === 1) {
      array.sort(function (a, b) {
        let str = a.code
        str = str.substring(1);
        var nameA = Number(str) // bỏ qua hoa thường
        let str2 = b.code;
        str2 = str2.substring(1);
        var nameB = Number(str2); // bỏ qua hoa thường
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // name trùng nhau
        return 0;
      });
      this.timesCode++;
    } else {
      array.sort(function (a, b) {
        let str = a.code;
        str = str.substring(1);
        var nameA = Number(str); // bỏ qua hoa thường
        let str2 = b.code;
        str2 = str2.substring(1);
        var nameB = Number(str2); // bỏ qua hoa thường
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }
        // name trùng nhau
        return 0;
      });
      this.timesCode = 1;
    }
    this.userConfigData = array;
  }
  firstTimeName = 1;
  timesGroupName: any;
  sortGroupName() {
    this.firstTimeCode = 1;
    this.firstTimeName = 0;
    this.timesCode = 0;
    const array = this.userConfigData;
    if (this.timesGroupName === 1) {
      //*2 gọi hàm sort
      array.sort((a, b) => {
        var str1 = a.name;
        str1 = str1.split(" ");
        str1 = str1.reverse();
        str1 = str1.toString();
        str1 = str1.toUpperCase();

        var str2 = b.name;
        str2 = str2.split(" ");
        str2 = str2.reverse();
        str2 = str2.toString();
        str2 = str2.toUpperCase();

        return this.CharCompare(str1, str2, 0);
      });
      this.timesGroupName++;
    } else {
      //*2 gọi hàm sort
      array.sort((a, b) => {
        var str1 = a.name;
        str1 = str1.split(" ");
        str1 = str1.reverse();
        str1 = str1.toString();
        str1 = str1.toUpperCase();

        var str2 = b.name;
        str2 = str2.split(" ");
        str2 = str2.reverse();
        str2 = str2.toString();
        str2 = str2.toUpperCase();

        return this.CharCompare(str2, str1, 0);
      });
      this.timesGroupName = 1
    }
    this.userConfigData = array;
  }

}
