import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { NotificationService } from "../../../_services/notification.service";
import { BasicInformationService } from "../service/basic-information.service";
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { StudentManagementUpdateParentInformationComponent } from './student-management-update-parent-information/student-management-update-parent-information.component';
import { StudentManagementUpdateDetailComponent } from './student-management-update-detail/student-management-update-detail.component';
import { StudentManagementUpdateBasicInformationComponent } from './student-management-update-basic-information/student-management-update-basic-information.component';
import { StudentManagementUpdateAccountInformationComponent } from './student-management-update-account-information/student-management-update-account-information.component';
import { UtilityService } from '../../../_services/utils.service';
declare var $: any;
@Component({
  selector: "student-management-list",
  templateUrl: "./student-management-list.component.html",
  styleUrls: ["./student-management-list.component.scss"],
})
export class StudentManagementListComponent implements OnInit {
  @ViewChild("searchByKeyWordInput") searchByKeyWordInput: ElementRef;

  @ViewChild(StudentManagementUpdateParentInformationComponent) updateParentComponent: StudentManagementUpdateParentInformationComponent;
  @ViewChild(StudentManagementUpdateDetailComponent) updateDetailComponent: StudentManagementUpdateDetailComponent;
  @ViewChild(StudentManagementUpdateBasicInformationComponent) updateBasicInforComponent: StudentManagementUpdateBasicInformationComponent;
  @ViewChild(StudentManagementUpdateAccountInformationComponent) updateAccountComponent: StudentManagementUpdateAccountInformationComponent;

  @ViewChild('fileInput') fileInput: ElementRef;

  fileURL: any;
  loadingDownload = false; loadingImport = false; loadingExport = false; loadingFilter = false;
  selectedFile: File;
  ngAfterViewInit() {
    // child is set

  }
  flag: any;
  studentId: number;
  basicInfoData: any;
  active = 1;
  showFullname: any;
  form: FormGroup;
  p: number = 1;
  countPage: number = 10;
  totalItems = 0;
  submitted = false;
  checkStudentData = true;
  exportData = false;
  studentData: any[] = [];
  dataPaged: any[] = [];
  studentGetById: any;
  headerStudent = false; //header của gridData

  updateBasicInformationLoaded = false;
  updateDetailInformationLoaded = false;
  updateParentInformationLoaded = false;
  updateAccountInformationLoaded = false;
  activeTab = "";

  oldTab: number;

  ddlYearSearchData = [];
  selectedYearSearch: any;
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
  // callChild() {
  //   this.child.addParentContinue();
  // }
  receiveBasicInformationData($event) {
    this.resetBasicInforData();
    this.reloadStudentData();
    // this.ngOnInit();
    this.basicInfoData = $event;
    if ($event["tab"] === 1) {
      this.activeTab = "updateDetailInformation";
      this.updateDetailInformationLoaded = true;
    } else if ($event["tab"] === 2) {
      this.activeTab = "updateParentInformation";
      this.updateParentInformationLoaded = true;
    } else if ($event["tab"] === 3) {
      this.activeTab = "updateAccountInformation";
      this.updateAccountInformationLoaded = true;
    } else if ($event["tab"] === 4) {
      this.activeTab = "updateAccountInformation";
      this.updateAccountInformationLoaded = true;
    }
  }

  updateBasicInformation(activeTab) {
    const confirmSubmit = confirm('Bạn có muốn lưu dữ liệu trước lúc chuyển tab không?');
    if (confirmSubmit === true) {
      if (this.oldTab === 1) {
        this.updateBasicInforComponent.updateBasicStudent();
      } else if (this.oldTab === 2) {
        this.updateDetailComponent.updateDetailStudent();
      } else if (this.oldTab === 3) {
        this.updateParentComponent.updateParents();
      } else if (this.oldTab === 4) {
        this.updateAccountComponent.updateAccountInfo();
      }
      this.oldTab = 1;
      // this.resetBasicInforData();
      // this.reloadStudentData();
      this.activeTab = 'updateBasicInformation';
      this.updateBasicInformationLoaded = true;
    } else {
      this.oldTab = 1;
      // this.resetBasicInforData();
      // this.reloadStudentData();
      this.activeTab = 'updateBasicInformation';
      this.updateBasicInformationLoaded = true;
    }


    //   if(!this.basicInfoData && this.basicInfoData['tab'] != undefined && this.basicInfoData['tab'] != '')
    //   {

    //     if(this.basicInfoData['tab'] = '1'){
    //       this.updateBasicInformationLoaded = true;
    //     }
    //   }else{
    // const student = this.basicInfoData['student'];
    // const protector = this.basicInfoData['protector'];
    // const address = this.basicInfoData['address'];
    // const data = { 'student': student, 'protector': protector, 'address': address, 'tab': 1 };
    // this.basicInfoData = data;
    // console.log(data);
    // }

    // const classId = $(this)[0].id;
    // if (classId !== undefined && classId === 'basic-information-tab') {
    // if (classId === 'basic-information-tab') {
    //   $(this).tab('show');
    //   this.activeTab = 'updateBasicInformation';
    //   this.updateBasicInformationLoaded = true;
    //   this.router.navigate(['/']);
    // } else if (classId === 'detail-information-tab') {
    //   $(this).tab('show');
    //   this.activeTab = 'updateDetailInformation';
    //   this.updateDetailInformationLoaded = true;
    // } else if (classId === 'parent-information-tab') {
    //   $(this).tab('show');
    //   this.activeTab = 'updateParentInformation';
    //   this.updateParentInformationLoaded = true;
    // } else {
    //   $(this).tab('show');
    //   this.activeTab = 'updateAccountInformation';
    //   this.updateAccountInformationLoaded = true;
    // }
    // }
    // }
    // this.resetBasicInforData();
    // this.reloadStudentData();
    // console.log(activeTab);
    // this.activeTab = activeTab;
    // this.updateBasicInformationLoaded = true;
    // this.oldTab = 1;
  }

  updateDetailInformation(activeTab) {
    // const confirmSubmit = confirm('Bạn có muốn lưu dữ liệu trước lúc chuyển tab không?');
    // if (confirmSubmit === true) {
    //   if(this.basicInfoData && this.basicInfoData['tab'] != undefined && this.basicInfoData['tab'] != '')
    //   {
    //     if(this.basicInfoData['tab'] = '1'){
    //       this.updateBasicInformationLoaded = true;
    //     }
    //   }else{
    //     const student = this.basicInfoData['student'];
    //     const protector = this.basicInfoData['protector'];
    //     const address = this.basicInfoData['address'];
    //     const data = { 'student': student, 'protector': protector, 'address': address, 'tab': 1 };
    //     this.basicInfoData = data;
    //     console.log(data);
    // //   }
    // // }
    // this.resetBasicInforData();
    // this.reloadStudentData();
    // console.log(activeTab);
    // this.activeTab = activeTab;
    // this.updateDetailInformationLoaded = true;
    // $(".nav-tabs #basic-information-tab").addClass('disabled');

    const confirmSubmit = confirm('Bạn có muốn lưu dữ liệu trước lúc chuyển tab không?');
    if (confirmSubmit === true) {
      if (this.oldTab === 1) {
        this.updateBasicInforComponent.updateBasicStudent();
      } else if (this.oldTab === 2) {
        this.updateDetailComponent.updateDetailStudent();
      } else if (this.oldTab === 3) {
        this.updateParentComponent.updateParents();
      } else if (this.oldTab === 4) {
        this.updateAccountComponent.updateAccountInfo();
      }
      this.oldTab = 2;
      // this.resetBasicInforData();
      // this.reloadStudentData();
      this.activeTab = activeTab;
      this.updateDetailInformationLoaded = true;
    } else {
      this.oldTab = 2;
      // this.resetBasicInforData();
      // this.reloadStudentData();
      this.activeTab = activeTab;
      this.updateDetailInformationLoaded = true;
    }

  }

  updateParentInformation(activeTab) {
    // const confirmSubmit = confirm('Bạn có muốn lưu dữ liệu trước lúc chuyển tab không?');
    // if (confirmSubmit === true) {
    // const student = this.basicInfoData['student'];
    // const protector = this.basicInfoData['protector'];
    // const address = this.basicInfoData['address'];
    // const data = { 'student': student, 'protector': protector, 'address': address, 'tab': 3 };
    // this.basicInfoData = data;
    // this.resetBasicInforData();
    // this.reloadStudentData();
    // console.log(activeTab);
    // this.activeTab = activeTab;
    // this.updateParentInformationLoaded = true;
    // }
    // this.resetBasicInforData();
    // this.reloadStudentData();
    // console.log(activeTab);
    // this.activeTab = activeTab;
    // this.updateParentInformationLoaded = true;
    // $(".nav-tabs #detail-information-tab").addClass('disabled');
    const confirmSubmit = confirm('Bạn có muốn lưu dữ liệu trước lúc chuyển tab không?');
    if (confirmSubmit === true) {
      if (this.oldTab === 1) {
        this.updateBasicInforComponent.updateBasicStudent();
      } else if (this.oldTab === 2) {
        this.updateDetailComponent.updateDetailStudent();
      } else if (this.oldTab === 3) {
        this.updateParentComponent.updateParents();
      } else if (this.oldTab === 4) {
        this.updateAccountComponent.updateAccountInfo();
      }
      this.oldTab = 3;
      // this.resetBasicInforData();
      // this.reloadStudentData();
      this.activeTab = activeTab;
      this.updateParentInformationLoaded = true;
    } else {
      this.oldTab = 3;
      // this.resetBasicInforData();
      // this.reloadStudentData();
      this.activeTab = activeTab;
      this.updateParentInformationLoaded = true;
    }

  }

  updateAccountInformation(activeTab) {
    // const confirmSubmit = confirm('Bạn có muốn lưu dữ liệu trước lúc chuyển tab không?');
    // if (confirmSubmit === true) {

    // const student = this.basicInfoData['student'];
    // const protector = this.basicInfoData['protector'];
    // const address = this.basicInfoData['address'];
    // const data = { 'student': student, 'protector': protector, 'address': address, 'tab': 4 };
    // this.basicInfoData = data;
    // }
    // this.resetBasicInforData();
    // this.reloadStudentData();
    // console.log(activeTab);

    // $(".parent-information-tab").addClass('disabled');
    const confirmSubmit = confirm('Bạn có muốn lưu dữ liệu trước lúc chuyển tab không?');
    if (confirmSubmit === true) {
      if (this.oldTab === 1) {
        this.updateBasicInforComponent.updateBasicStudent();
      } else if (this.oldTab === 2) {
        this.updateDetailComponent.updateDetailStudent();
      } else if (this.oldTab === 3) {
        this.updateParentComponent.updateParents();
      } else if (this.oldTab === 4) {
        this.updateAccountComponent.updateAccountInfo();
      }
      this.oldTab = 4;
      // this.resetBasicInforData();
      // this.reloadStudentData();
      this.activeTab = activeTab;
      this.updateAccountInformationLoaded = true;
    } else {
      this.oldTab = 4;
      // this.resetBasicInforData();
      // this.reloadStudentData();
      this.activeTab = activeTab;
      this.updateAccountInformationLoaded = true;
    }

  }

  perPageSelected(id: number) {
    this.countPage = id;
    this.p = 1;
  }
  constructor(
    private notifyService: NotificationService,
    private studentUpdateBasic: BasicInformationService,
    private fb: FormBuilder,
    private _utilsService: UtilityService
  ) {
    this.confirmNextTab();
  }
  ngOnInit() {
    // this.updateBasicInformationLoaded = false;
    this.updateDetailInformationLoaded = false;
    this.updateParentInformationLoaded = false;
    this.updateAccountInformationLoaded = false;
    var selected_year_name;
    //validate
    this.form = this.fb.group({
      searchYear: new FormControl(''),
      search: new FormControl(''),
    });
    this.studentUpdateBasic.dropdownYear()
      .pipe().subscribe((data) => {
        let arr = []; let selected_year;
        data['years'].forEach(function (item) {
          arr.push({ id: item['id'], name: item['start_year'] + '-' + item['end_year'] });
          if (item['status'] === 1) {
            selected_year = { id: item['id'], name: item['start_year'] + '-' + item['end_year'] };
            selected_year_name = item['start_year'] + '-' + item['end_year'];
          }
        }
        );
        this.ddlYearSearchData = arr;
        this.selectedYearSearch = selected_year;

        let formData = new FormData();
        if (selected_year_name) {
          formData.append('years' + '[' + 0 + ']', selected_year_name);
          this.studentUpdateBasic.searchYear(formData)
            .subscribe((data) => {
              if (data['students'].length === 0) {
                this.checkStudentData = false; //dữ liệu không tồn tại
                this.exportData = false;
                this.headerStudent = true;
                this.studentData = [];
                this.p = 1;
                this.totalItems = 1;
              } else {
                this.p = 1;
                this.checkStudentData = true; //dữ liệu tồn tại
                this.exportData = true;
                this.headerStudent = true;
                this.studentData = data["students"];
                this.totalItems = data["students"].length;
                this._utilsService.setReverseFullname(this.studentData, 'fullname', 'reserveFullname');
                this.flag = 1;
              }
            })
        }

      });



  }
  //
  onSelectYear(item: any) {
    var selected_year_name;
    if (this.selectedYearSearch === null) {
      this.form = this.fb.group({
        searchYear: new FormControl('')
      });
      this.studentUpdateBasic.dropdownYear()
        .pipe().subscribe((data) => {
          let arr = []; let selected_year;
          data['years'].forEach(function (item) {
            arr.push({ id: item['id'], name: item['start_year'] + '-' + item['end_year'] });
            if (item['status'] === 1) {
              selected_year = { id: item['id'], name: item['start_year'] + '-' + item['end_year'] };
              selected_year_name = item['start_year'] + '-' + item['end_year'];
            }
          }
          );
          this.ddlYearSearchData = arr;
          this.selectedYearSearch = selected_year;

          let formData = new FormData();
          if (selected_year_name) {
            formData.append('years' + '[' + 0 + ']', selected_year_name);
            this.studentUpdateBasic.searchYear(formData)
              .subscribe((data) => {
                if (data['students'].length === 0) {
                  this.checkStudentData = false; //dữ liệu không tồn tại
                  this.exportData = false;
                  this.headerStudent = true;
                  this.studentData = [];
                  this.p = 1;
                  this.totalItems = 1;
                } else {
                  this.p = 1;
                  this.checkStudentData = true; //dữ liệu tồn tại
                  this.exportData = true;
                  this.headerStudent = true;
                  this.studentData = data["students"];
                  this.totalItems = data["students"].length;
                  this.flag = 1;
                }
              })
          }

        });
    }
    //
    let formData = new FormData();
    if (item['name']) {
      formData.append('years' + '[' + 0 + ']', item['name']);
      this.studentUpdateBasic.searchYear(formData)
        .subscribe((data) => {
          if (data['students'].length === 0) {
            this.checkStudentData = false; //dữ liệu không tồn tại
            this.exportData = false;
            this.headerStudent = true;
            this.studentData = [];
            this.p = 1;
            this.totalItems = 1;
          } else {
            this.p = 1;
            this.checkStudentData = true; //dữ liệu tồn tại
            this.exportData = true;
            this.headerStudent = true;
            this.studentData = data["students"];
            this.totalItems = data["students"].length;
            this.flag = 1;
          }
        })
    } else {
      this.studentUpdateBasic.searchYear(formData)
        .subscribe((data) => {
          if (data["length"] === 0) {
            this.checkStudentData = false; //dữ liệu không tồn tại
            this.exportData = false;
            this.headerStudent = true;
            this.studentData = [];
            this.p = 1;
            this.totalItems = 1;
          } else {
            this.p = 1;
            this.checkStudentData = true; //dữ liệu tồn tại
            this.exportData = true;
            this.headerStudent = true;
            this.studentData = data["students"];
            this.totalItems = data["students"].length;
            this.flag = 1;
          }
        })
    }

  }

  confirmNextTab() {
    $(function () {
      $('#myTab a[data-toggle="tab"]').click(function (e) {
        e.preventDefault();

        // if (!$(this).hasClass('active') && isValid($('#myTab a[data-toggle="tab"].active').data('group'))) {
        // const confirmSubmit = confirm('Trước khi chuyển tab, vui lòng kiểm tra lại và lưu lại dữ liệu!');
        // if (confirmSubmit === true) {
        // this.resetBasicInforData();
        const classId = $(this)[0].id;
        let a = this.data;
        // if (classId !== undefined && classId === 'basic-information-tab') {
        if (classId === 'basic-information-tab') {
          this.updateBasicInforComponent.updateBasicStudent();
          // $(this).tab('show');
          // this.activeTab = 'updateBasicInformation';
          // this.updateBasicInformationLoaded = true;
        } else if (classId === 'detail-information-tab') {
          this.updateDetailComponent.updateDetailStudent();
          // $(this).tab('show');
          // this.activeTab = 'updateDetailInformation';
          // this.updateDetailInformationLoaded = true;
        } else if (classId === 'parent-information-tab') {
          $(this).tab('show');
          // this.activeTab = 'updateParentInformation';
          // this.updateParentInformationLoaded = true;
          this.child.updateParents();
        } else {
          // $(this).tab('show');
          // this.activeTab = 'updateAccountInformation';
          // this.updateAccountInformationLoaded = true;
          this.updateAccountComponent.updateAccountInfo();
        }

        // this.activeTab = 'updateParentInformation';
        // this.updateParentInformationLoaded = true;
        // $('.nav-tabs #detail-information-tab').addClass('disabled');

        // } else if (classId !== undefined && classId === 'account-information-tab') {
        //   $(this).tab('show');
        // this.activeTab = 'updateAccountInformation';
        // this.updateParentInformationLoaded = false;
        // this.updateAccountInformationLoaded = true;
        // $('.nav-tabs #detail-information-tab').addClass('disabled');
        // $('.nav-tabs #parent-information-tab').addClass('disabled');
        // }
        // } else {
        //   return false;
        // }
        // }

        // return false;
      });

      $('.save-data').click(function (e) {
        e.preventDefault();

        if (isValid($(this).data('group'))) {
          // Save data here
        }
      });

      const isValid = group => {
        let valid = true;

        $('[data-group="' + group + '"]:not(button):not(a)').each(function (index, item) {
          $(this).removeClass('is-invalid');
          if (!this.checkValidity()) {
            $(this).addClass('is-invalid');
            valid = false;
          }
        });

        return valid;
      };
    });
  }
  //nut xoa
  deleteStudent(id: any) {
    let isDelete = confirm("Bạn chắc chắn muốn xóa dữ liệu này?");
    if (isDelete) {
      this.studentUpdateBasic.deleteStudent(id).subscribe(
        (res) => {
          this.notifyService.showSuccess(
            "Dữ liệu đã được xóa thành công!",
            "Thông báo"
          );
          // this.resetBasicInforData();
          var selected_year_name;
          this.studentUpdateBasic.dropdownYear()
            .pipe().subscribe((data) => {
              let arr = []; let selected_year;
              data['years'].forEach(function (item) {
                arr.push({ id: item['id'], name: item['start_year'] + '-' + item['end_year'] });
                if (item['status'] === 1) {
                  selected_year = { id: item['id'], name: item['start_year'] + '-' + item['end_year'] };
                  selected_year_name = item['start_year'] + '-' + item['end_year'];
                }
              }
              );
              this.ddlYearSearchData = arr;
              this.selectedYearSearch = selected_year;

              let formData = new FormData();
              if (selected_year_name) {
                formData.append('years' + '[' + 0 + ']', selected_year_name);
                this.studentUpdateBasic.searchYear(formData)
                  .subscribe((data) => {
                    if (data['students'].length === 0) {
                      this.checkStudentData = false; //dữ liệu không tồn tại
                      this.exportData = false;
                      this.headerStudent = true;
                      this.studentData = [];
                      this.p = 1;
                      this.totalItems = 1;
                    } else {

                      this.checkStudentData = true; //dữ liệu tồn tại
                      this.exportData = true;
                      this.headerStudent = true;
                      this.studentData = data["students"];
                      this.totalItems = data["students"].length;
                    }
                  })
              }

            });
        },
        (error) => {
          this.notifyService.showError(error, "Thông báo lỗi");
          // this.resetBasicInforData();
          var selected_year_name;
          this.studentUpdateBasic.dropdownYear()
            .pipe().subscribe((data) => {
              let arr = []; let selected_year;
              data['years'].forEach(function (item) {
                arr.push({ id: item['id'], name: item['start_year'] + '-' + item['end_year'] });
                if (item['status'] === 1) {
                  selected_year = { id: item['id'], name: item['start_year'] + '-' + item['end_year'] };
                  selected_year_name = item['start_year'] + '-' + item['end_year'];
                }
              }
              );
              this.ddlYearSearchData = arr;
              this.selectedYearSearch = selected_year;

              let formData = new FormData();
              if (selected_year_name) {
                formData.append('years' + '[' + 0 + ']', selected_year_name);
                this.studentUpdateBasic.searchYear(formData)
                  .subscribe((data) => {
                    if (data['students'].length === 0) {
                      this.checkStudentData = false; //dữ liệu không tồn tại
                      this.exportData = false;
                      this.headerStudent = true;
                      this.studentData = [];
                      this.p = 1;
                      this.totalItems = 1;
                    } else {

                      this.checkStudentData = true; //dữ liệu tồn tại
                      this.exportData = true;
                      this.headerStudent = true;
                      this.studentData = data["students"];
                      this.totalItems = data["students"].length;
                      this._utilsService.setReverseFullname(this.studentData, 'fullname', 'reserveFullname');
                    }
                  })
              }

            });
        }
      );
    }
  }

  // //sort ten
  // alphabetsFather = ["A", "À", "Ả", "Ã", "Á", "Ạ",
  //   "Ă", "Ằ", "Ẳ", "Ẵ", "Ắ", "Ặ",
  //   "Â", "Ầ", "Ẩ", "Ẫ", "Ấ", "Ậ",
  //   "B", "C", "D", "Đ",
  //   "E", "È", "Ẻ", "Ẽ", "É", "Ẹ",
  //   "Ê", "Ề", "Ể", "Ễ", "Ế", "Ệ",
  //   "F", "G", "H",
  //   "I", "Ì", "Ỉ", "Ĩ", "Í", "Ị",
  //   "J", "K", "L", "M", "N",
  //   "O", "Ò", "Ỏ", "Õ", "Ó", "Ọ",
  //   "Ô", "Ồ", "Ổ", "Ỗ", "Ố", "Ộ",
  //   "Ơ", "Ờ", "Ở", "Ỡ", "Ớ", "Ợ",
  //   "P", "Q", "R", "S", "T",
  //   "U", "Ù", "Ủ", "Ũ", "Ú", "Ụ",
  //   "Ư", "Ừ", "Ử", "Ữ", "Ứ", "Ự",
  //   "V", "W", "X",
  //   "Y", "Ỳ", "Ỷ", "Ỹ", "Ý", "Ỵ",
  //   "Z", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  //// sort ten
  // firstTimeName = 1;
  // timesName: any;
  // sortFistName() {
  //   this.firstTimeName = 0;
  //   this.firstTimeCode = 1;
  //   this.timesCode = 0;

  //   //*1 hàm sort
  //   var alphabets = this.alphabetsFather;
  //   var aChar;
  //   var bChar;
  //   function CharCompare(a, b, index) {
  //     if (index == a.length || index == b.length) return 0;
  //     aChar = alphabets.indexOf(a.toUpperCase().charAt(index));
  //     bChar = alphabets.indexOf(b.toUpperCase().charAt(index));
  //     if (aChar != bChar) return aChar - bChar;
  //     else return CharCompare(a, b, index + 1);
  //   }

  //   const array = this.studentData;
  //   if (this.timesName === 1) {
  //     array.sort((a, b) => {
  //       var str1 = a.fullname;
  //       str1 = str1.split(" ");
  //       str1 = str1.reverse();
  //       str1 = str1.toString();
  //       str1 = str1.toUpperCase();

  //       var str2 = b.fullname;
  //       str2 = str2.split(" ");
  //       str2 = str2.reverse();
  //       str2 = str2.toString();
  //       str2 = str2.toUpperCase();

  //       return CharCompare(str1, str2, 0);
  //     });
  //     this.timesName = 2;
  //   } else if (this.timesName !== 1) {
  //     array.sort((a, b) => {
  //       var str1 = a.fullname;
  //       str1 = str1.split(" ");
  //       str1 = str1.reverse();
  //       str1 = str1.toString();
  //       str1 = str1.toUpperCase();

  //       var str2 = b.fullname;
  //       str2 = str2.split(" ");
  //       str2 = str2.reverse();
  //       str2 = str2.toString();
  //       str2 = str2.toUpperCase();

  //       return CharCompare(str2, str1, 0);
  //     });
  //     this.timesName = 1;
  //   }
  //   this.studentData = array;
  // }
  //// sort code
  // firstTimeCode = 1;
  // timesCode: any;
  // sortFistCode() {
  //   this.firstTimeCode = 0;
  //   this.firstTimeName = 1;
  //   this.timesName = 0;
  //   const array = this.studentData;
  //   if (this.timesCode === 1) {
  //     array.sort(function (a, b) {
  //       let str = a.code;
  //       str = str.substr(3);
  //       var nameA = Number(str);

  //       let str2 = b.code;
  //       str2 = str2.substr(3);
  //       var nameB = Number(str2);

  //       if (nameA < nameB) {
  //         return -1;
  //       }
  //       if (nameA > nameB) {
  //         return 1;
  //       }
  //       return 0;
  //     });
  //     this.timesCode = 2;
  //   } else {
  //     array.sort(function (a, b) {
  //       let str = a.code;
  //       str = str.substr(3);
  //       var nameA = Number(str);

  //       let str2 = b.code;
  //       str2 = str2.substr(3);
  //       var nameB = Number(str2);

  //       if (nameA > nameB) {
  //         return -1;
  //       }
  //       if (nameA < nameB) {
  //         return 1;
  //       }
  //       return 0;
  //     });
  //     this.timesCode = 1;
  //   }
  //   this.studentData = array;
  // }

  searchByKeyWord(search: any) {
    this.studentData = [];

    if (search.trim() === "") {
      this.notifyService.showError(
        "Vui lòng điền từ khóa tìm kiếm!",
        "Thông báo lỗi"
      );
      this.checkStudentData = false;
      this.exportData = false;
      this.headerStudent = true;
      this.studentData = [];
      this.p = 1;
      this.totalItems = 1;
    } else {
      this.studentUpdateBasic.searchByKeyWord(search)
        .subscribe(
          result => {
            this.headerStudent = true;
            if (result['count'] != 0) {
              this.studentData = [];
              this.checkStudentData = true;
              this.exportData = true;
              this.studentData = result['students'];
              this.totalItems = result['count'];
              // this.notifyService.showSuccess('Đã tìm thấy ' + result['count'] + ' bản gi dữ liệu', 'Thông báo');
              this.p = 1;
              this.flag = 2;
            } else {
              this.studentData = [];
              this.checkStudentData = false;
              this.exportData = false;
              this.totalItems = 1;
              this.p = 1;
            }
          })
    }
  }
  getByIdStudent(id: any) {
    // this.resetBasicInforData();
    this.updateBasicInformationLoaded = false;
    this.updateDetailInformationLoaded = false;
    this.updateParentInformationLoaded = false;
    this.updateAccountInformationLoaded = false;
    this.studentId = id;
    this.studentUpdateBasic.getByIdStudent(this.studentId)
      .subscribe(
        result => {
          this.oldTab = 1;
          const student = result['student'];
          const protector = result['protector'];
          const address = result['address'];
          const data = { 'student': student, 'protector': protector, 'address': address, 'tab': 1 };
          this.basicInfoData = data;
          this.activeTab = 'updateBasicInformation';
          this.updateBasicInformationLoaded = true;
        });
  }
  reloadStudentData() {
    this.resetBasicInforData();
    this.studentUpdateBasic
      .getByIdStudent(this.studentId)
      .subscribe((result) => {
        this.basicInfoData = result;
      });
  }
  resetBasicInforData() {
    this.updateBasicInformationLoaded = false;
    this.updateDetailInformationLoaded = false;
    this.updateParentInformationLoaded = false;
    this.updateAccountInformationLoaded = false;
    this.ngOnInit();
  }
  // Import dữ liệu cấu hình nhóm người sử dụng
  importFile() {
    this.loadingImport = true;
    var formData = new FormData();
    if (this.fileURL === undefined) {
      this.loadingImport = false;
      this.notifyService.showError('File excel chỉ nhận file có định dạng .xls, .xlsx, hoặc .csv', 'thông báo')
    } else {
      formData.append('data_import', this.fileInput.nativeElement.files[0])
      this.studentUpdateBasic.importFile(formData)
        .subscribe(
          result => {
            this.loadingImport = false;
            if (result['success'] === 0) {
              let mess = 'Tải lên thành công ' + result['success'] + ' bản ghi. Có ' + result['fail'] + ' bản ghi bị lỗi !';
              this.notifyService.showError(mess, 'Thông báo');
              this.fileInput.nativeElement.value = '';
              this.fileURL = '';
              if (result['fail'] !== 0) {
                let err = { 'basicError': result['basicError'], 'detailError': result['detailError'] };
                this.studentUpdateBasic.exportExcelErrors(err)
                  .subscribe((res) => {
                    var downloadURL = window.URL.createObjectURL(res);
                    var link = document.createElement('a');
                    link.href = downloadURL;
                    link.download = "File_Errors.xlsx";
                    link.click();
                  },
                    error => {
                      this.loadingImport = false;
                    }
                  );
              }
            } else {
              let mess = 'Tải lên thành công ' + result['success'] + ' bản ghi. Có ' + result['fail'] + ' bản ghi bị lỗi !';
              this.notifyService.showSuccess(mess, 'Thông báo');
              this.fileInput.nativeElement.value = '';
              this.fileURL = '';

              let err = { 'basicError': result['basicError'], 'detailError': result['detailError'] };
              if (result['fail'] !== 0) {
                this.studentUpdateBasic.exportExcelErrors(err)
                  .subscribe((res) => {
                    var downloadURL = window.URL.createObjectURL(res);
                    var link = document.createElement('a');
                    link.href = downloadURL;
                    link.download = "File_Errors.xlsx";
                    link.click();
                  },
                    error => {
                      this.loadingImport = false;
                    }
                  );
              }
              this.ngOnInit();
            }
          },
          error => {
            this.loadingImport = false;
            this.fileInput.nativeElement.value = '';
            this.fileURL = '';
          });
    }

  }
  //xuất têp
  exportFile() {
    this.loadingExport = true;

    if (
      this.studentData === undefined ||
      this.studentData === [] ||
      this.studentData.length === 0
    ) {
      this.notifyService.showError(
        "Không tìm thấy dữ liệu vui lòng tìm kiếm dữ liệu!",
        "Thông báo lỗi"
      );
      this.loadingExport = false;
      return;
    } else {
      var year_export = this.form.controls.searchYear.value;
      var search_export = this.form.controls.search.value;
      var formData = new FormData();
      if (this.flag === 1) {
        var i = 0;
        for (i = 0; i < 1; i++) {
          formData.append('year' + '[' + i + ']', year_export['name']);
        }
      } else if (this.flag === 2) {
        formData.append('search', search_export);
      } else {
        this.notifyService.showError(
          "Vui lòng tìm kiếm dữ liệu hoặc chọn năm học trước khi xuất ra tệp!",
          "Thông báo lỗi"
        );
        this.loadingExport = false;
        return;
      }
      formData.append('export_data', '1')
      this.studentUpdateBasic.exportFile(formData)
        .subscribe((res) => {
          this.loadingExport = false;
          var downloadURL = window.URL.createObjectURL(res);
          var link = document.createElement('a');
          link.href = downloadURL;
          link.download = "DanhSachHocSinh.xlsx";
          link.click();
        });
    }
  }

  //Tải file mẫu
  downloadSampleFile() {
    this.studentUpdateBasic.downloadSampleFile().subscribe((res) => {
      this.loadingDownload = false;
      var downloadURL = window.URL.createObjectURL(res);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "FileMau_DanhSachHocSinh.xlsx";
      link.click();
    });
  }
}
