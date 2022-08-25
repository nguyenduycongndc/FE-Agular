import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ClassManagementStudentService } from '../service/class-management-student.service';
import { NotificationService } from '../../../_services/notification.service';
import { ConfigurationParametersSemesterService } from '../../configuration-parameters/service/configuration-parameters-semester.service';
import { first } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'app-class-management-student',
  templateUrl: './class-management-student.component.html',
  styleUrls: ['./class-management-student.component.css'],
})
export class ClassManagementStudentComponent implements OnInit {
  fileURL: any;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('selectedItem') selectedItem: ElementRef;
  @ViewChild('selectYearSearch') selectYearSearch: ElementRef;


  //Lọc
  year_search = [];
  grades = [];
  years = [];
  classes = [];
  semester = [];

  loadingDownload = false;
  loadingImport = false;
  loadingExport = false;
  loadingFilter = false;
  deleteClassStudent = false;
  selectedFile: File;
  id: number;
  item: any;
  students: any;
  model: any = {};
  studentForm: FormGroup;
  submitted = false;
  checkStudentData = true;
  searchInput: any;
  rememberButton: any;

  studentData: any;
  headerStudent = false; // Show/ Hide header bảng dữ liệu môn học. Mặc định load form không show header
  p: number = 1;
  countPage: number = 10;
  totalItems = 0;

  SelectedIDs: any[];
  selectedClassStudentValue = [];
  getArrayChecboxId = [];
  classStudentError: Boolean = true;

  ddlYearSearchData: any = [];
  selectedYearSearch = [];
  ddlYearSearchSettings = {};
  ddlSemesterSearchData: any = [];
  selectedSemesterSearch = [];
  ddlSemesterSearchSettings = {};
  ddlGradeSearchData = [];
  selectedGradeSearch = [];
  ddlGradeSearchSettings = {};
  ddlClassSearchData = [];
  selectedClassSearch = [];
  ddlClassSearchSettings = {};

  ddlClassInsertData = [];
  selectedClassInsert = [];
  ddlClassInsertSettings = {};
  ddlStudentInsertData = [];
  selectedStudentInsert = [];
  ddlStudentInsertSettings = {};

  constructor(
    private fb: FormBuilder,
    private classManagementStudentService: ClassManagementStudentService,
    private notifyService: NotificationService
  ) { }

  //chọn 1 năm học
  onSelectYear(item: any) {
    const arrSemester = [];
    this.selectedSemesterSearch = [];
    this.selectedGradeSearch = [];
    this.ddlClassSearchData = [];
    this.selectedClassSearch = [];

    if (item !== undefined) {
      this.classManagementStudentService
        .semesterList([item.id])
        .pipe()
        .subscribe((data) => {
          data['query'].forEach(function (items) {
            arrSemester.push({ id: items['id'], name: items['name'] });
          });
          this.ddlSemesterSearchData = arrSemester;
        });
      const arrSubject = [];
      this.classManagementStudentService
        .getGradeList([item.id])
        .pipe()
        .subscribe((subjectData) => {
          subjectData['query'].forEach(function (items) {
            arrSubject.push({ id: items['id'], name: items['name'] });
          });
          this.ddlGradeSearchData = arrSubject;
        });
    } else {
      this.ddlSemesterSearchData = [];
      this.ddlGradeSearchData = [];
      this.ddlClassSearchData = [];
      this.selectedSemesterSearch = [];
      this.selectedGradeSearch = [];
      this.ddlClassSearchData = [];
      this.selectedClassSearch = [];
    }

  }

  selectAllGradeSearch(gradeSearchData) {
    this.selectedGradeSearch = gradeSearchData;
    this.selectedClassSearch = [];
    this.ddlClassSearchData = [];
    const arrClass = [];
    const arrId = [];
    if (gradeSearchData !== undefined && gradeSearchData.length > 0) {
      gradeSearchData.forEach(function (items) {
        arrId.push(items['id']);
      });
      this.classManagementStudentService
        .classListSearch(arrId)
        .pipe()
        .subscribe((data) => {
          data.forEach(function (items) {
            arrClass.push({ id: items['id'], name: items['name'] });
          });
          arrClass.sort((a, b) => {
            var str1 = a['name'];
            var str2 = b['name'];
            return this.CharCompare(str1, str2, 0);
          });

          this.ddlClassSearchData = arrClass;
        });
    } else {
      this.ddlClassSearchData = [];
      this.selectedClassSearch = [];
    }
  }

  deSelectAllGradeSearch() {
    this.selectedGradeSearch = [];
    this.selectedClassSearch = [];
    this.ddlClassSearchData = [];
  }

  selectAllClassSearch(classSearchData) {
    this.selectedClassSearch = classSearchData;
  }

  deSelectAllClassSearch() {
    this.selectedClassSearch = [];
  }

  onSelectGrade(item: any) {
    // this.selectedClassSearch = [];
    const arrClass = [];
    const arrId = [];
    if (item !== undefined) {
      item.forEach(function (items) {
        arrId.push(items['id']);
      });
      this.classManagementStudentService
        .classListSearch(arrId)
        .pipe()
        .subscribe((data) => {

          data.forEach(function (items) {
            arrClass.push({ id: items['id'], name: items['name'] });
          });
          arrClass.sort((a, b) => {
            var str1 = a['name'];
            var str2 = b['name'];
            return this.CharCompare(str1, str2, 0);
          });
          this.ddlClassSearchData = arrClass;

          //bắt đầu
          const arrAfterFilter = [];
          const arrSelected = this.selectedClassSearch;
          arrSelected.forEach(function(items){
            let id = items.id;
            let x = arrClass.map(function(ite) {return ite.id}).indexOf(id);
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

        });
    } else {
      this.ddlClassSearchData = [];
      this.selectedClassSearch = [];
    }
  }

  get f() {
    return this.studentForm.controls;
  }
  ngOnInit() {
    this.studentForm = this.fb.group(
      {
        search: new FormControl(''),
        year: new FormControl(''),
        semester: new FormControl(''),
        grade: new FormControl(''),
        class_id_search: new FormControl(''),
        class_id: new FormControl('', Validators.required),
        student_id: new FormControl('', Validators.required),
      },
      {}
    );

    $(document).ready(function () {
      $('#checkAll').click(
        function () {
          $('input:checkbox').attr('checked', 'checked');
        },
        function () {
          $('input:checkbox').removeAttr('checked');
        }
      );
    });

    this.classManagementStudentService
      .yearList()
      .pipe()
      .subscribe((data) => {
        const getData = [];
        const idCurrentYear = data['id_current_year'];
        // let getData ;
        // let idSelected = [];
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
        //Đổ dữ liệu học kỳ
        this.classManagementStudentService
          .semesterList([data['id_current_year']])
          .pipe()
          .subscribe((res) => {
            const getSemesterData = [];
            // let idSemesterSelected = [];
            let idSemesterSelected;
            res['query'].forEach(function (items) {
              getSemesterData.push({
                id: items['id'],
                name: items['name'],
              });
              // if (items['id'] == data['id_semester'][0]['id']) {
              //   idSemesterSelected = {
              //     id: items['id'],
              //     name: items['name'],
              //   };
              // }
            });
            this.ddlSemesterSearchData = getSemesterData;
            // this.selectedSemesterSearch = idSemesterSelected;
          });
        //Đổ dữ liệu grades
        let def = idSelected['id'];
        this.classManagementStudentService
          .getGradeList(def)
          .pipe()
          .subscribe((datum) => {
            const getGradesData = [];
            datum['query'].forEach(function (items) {
              getGradesData.push({
                id: items['id'],
                name: items['name'],
              });
            });
            this.ddlGradeSearchData = getGradesData;
          });
      });

    this.classManagementStudentService
      .classListInsert()
      .pipe()
      .subscribe((data) => {
        // this.dmKhoiData = data;
        const classObj = [];
        // let classObj;
        if (data['query'] !== undefined && data['query'].length > 0) {
          data['query'].forEach(function (item) {
            classObj.push({ id: item['id'], name: item['name'] });
          });
        }
        this.ddlClassInsertData = classObj;
        // this.ddlClassSearchData = classObj;
      });

    this.classManagementStudentService
      .studentList()
      .pipe(first())
      .subscribe((data) => {
        const studentObj = [];
        if (data['query'] !== undefined && data['query'].length > 0) {
          data['query'].forEach(function (item) {
            studentObj.push({
              id: item['id'],
              name:
                item['code'] +
                ' - ' +
                item['lastname'] +
                ' ' +
                item['firstname'],
            });
          });
        }
        this.ddlStudentInsertData = studentObj;
      });
  }

  uploadFile(files) {
    if (files.length === 0) {
      return;
    }
    this.selectedFile = files[0];
    const mimeType = files[0].type;
    if (
      mimeType !==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
      mimeType !== 'application/vnd.ms-excel'
    ) {
      this.notifyService.showError(
        'Chỉ hỗ trợ định dạng .xls, .xlsx, .csv',
        'Thông báo lỗi'
      );
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.fileURL = this.selectedFile['name'];
      // this.imgURL = reader.result;
    };
  }
  perPageSelected(id: number) {
    this.countPage = id;
    this.p = 1;
  }

  //Searchby Input
  searchByInput() {
    this.loadingFilter = true;
    this.getArrayChecboxId = [];
    this.students = [];
    // var uploadData = new FormData();
    var i = 0;

    const years = [];
    years.push(this.studentForm.controls['year'].value.id);

    const semester = [];
    semester.push(this.studentForm.controls['semester'].value.id);


    const grades = [];
    this.studentForm.controls['grade'].value.forEach(function (items) {
      grades.push(items['id']);
    });

    const classes = [];
    this.studentForm.controls['class_id_search'].value.forEach(function (items) {
      classes.push(items['id']);
    });

    this.classManagementStudentService.searchByInput(years,semester,grades,classes).subscribe(
      (result) => {
        this.loadingFilter = false;
        if (result['query'].length != 0) {
          this.students = [];
          this.headerStudent = true;
          this.checkStudentData = true;
          this.students = result['query'];
          this.totalItems = result['query'].length;
          // this.notifyService.showSuccess(
          //   'Đã tìm thấy ' + this.students.length + ' bản ghi dữ liệu',
          //   'Thông báo'
          // );
          this.rememberButton = 1;
          this.p = 1;
        } else {
          this.headerStudent = true;
          this.students = [];
          this.checkStudentData = false;
          this.totalItems = 1;
          this.p = 1;
        }
      },
      (error) => {
        this.loadingFilter = false;
        Object.keys(error).forEach(function (key) {
          this.notifyService.showError(error[key], 'Thông báo lỗi');
        });
      }
    );
  }
  //Search
  searchByKeyWord(search) {
    this.students = [];
    this.getArrayChecboxId = [];
    if (search.trim() === '') {
      this.notifyService.showError(
        'Vui lòng điền từ khóa tìm kiếm!',
        'Thông báo lỗi'
      );
      this.headerStudent = true;
      this.checkStudentData = false;
      this.totalItems = 1;
      this.p = 1;
    } else {
      this.classManagementStudentService.searchByKeyWord(search).subscribe(
        (result) => {
          this.headerStudent = true;
          if (result['query'].length != 0) {
            this.students = [];
            this.checkStudentData = true;
            this.students = result['query'];
            this.totalItems = result['query'].length;
            // this.notifyService.showSuccess(
            //   'Đã tìm thấy ' + this.students.length + ' bản ghi dữ liệu',
            //   'Thông báo'
            // );
            this.rememberButton = 2;
            this.p = 1;
          } else {
            this.students = [];
            this.checkStudentData = false;
            this.totalItems = 1;
            this.p = 1;
          }
        },
        (error) => {
          this.notifyService.showError(error, 'Thông báo lỗi');
        }
      );
    }
  }

  deleteStudent() {
    const array_id_checkbox = this.getArrayChecboxId;
    const id_students = [];
    if (array_id_checkbox.length > 0) {
      let isDelete = confirm('Bạn có chắc chắn muốn loại học sinh ra khỏi lớp?');
      if (isDelete) {
        var uploadData = new FormData();
        var i = 0;
        array_id_checkbox.forEach(function (item) {
          uploadData.append('id' + '[' + i + ']', item);
          i++;
          id_students.push(item);
        });

        this.classManagementStudentService
          .delete(uploadData)
          .subscribe((res) => {
            this.notifyService.showSuccess('Loại bỏ học sinh thành công', 'Thông báo');
            this.deleteClassStudent = false;

            this.getArrayChecboxId = [];
            this.firstTimeCode = 1;
            this.firstTimeName = 1;
            this.timesCode = 3;
            this.timesName = 3;

            // window.location.reload();

            this.classManagementStudentService
              .studentList()
              .pipe()
              .subscribe((data) => {
                const studentObj = [];
                if (data['query'] !== undefined && data['query'].length > 0) {
                  data['query'].forEach(function (item) {
                    studentObj.push({
                      id: item['id'],
                      name:
                        item['code'] +
                        ' - ' +
                        item['lastname'] +
                        ' ' +
                        item['firstname'],
                    });
                  });
                }
                this.ddlStudentInsertData = studentObj;
              });

            this.searchByInput();

            let searchKeyWord = this.studentForm.controls['search'].value;
            this.students = [];

            if (searchKeyWord) {
              this.headerStudent = true;
              this.checkStudentData = false;
              this.totalItems = 1;
              this.p = 1;
            } else {
              this.classManagementStudentService.searchByKeyWord(searchKeyWord).subscribe(
                (result) => {
                  this.headerStudent = true;
                  if (result['query'].length != 0) {
                    this.students = [];
                    this.checkStudentData = true;
                    this.students = result['query'];
                    this.totalItems = result['query'].length;
                    this.rememberButton = 2;
                    this.p = 1;
                  } else {
                    this.students = [];
                    this.checkStudentData = false;
                    this.totalItems = 1;
                    this.p = 1;
                  }
                },
                (error) => {
                  this.notifyService.showError(error, 'Thông báo lỗi');
                }
              );
            }



            // this.searchByKeyWord();



            // const arrStudent = this.ddlStudentInsertData;
            // var x = arrStudent.filter(function (item) {
            //   if (id_students.indexOf(item) === -1) {
            //     return true;
            //   }
            // });
            // this.ddlStudentInsertData = x;


            // this.classManagementStudentService
            //   .classStudentList()
            //   .pipe()
            //   .subscribe((data) => {
            //     this.students = data['query'];
            //   });
          }
          // ,
          //   error => {
          //     if (error.error) {
          //       this.notifyService.showError("Không được xóa dữ liệu cũ", "Thông báo");

          //     }
          //   }

          );
      }
    } else {
      return this.notifyService.showError('Vui lòng chọn bản ghi trước khi loại bỏ!', 'Lỗi');
    }
  }

  createStudent() {
    this.studentForm.get('class_id').setValidators([Validators.required]);
    this.studentForm.get('class_id').updateValueAndValidity();
    this.studentForm.get('student_id').setValidators([Validators.required]);
    this.studentForm.get('student_id').updateValueAndValidity();
    this.submitted = true;

    var uploadData = new FormData();
    var i = 0;
    const id_students = [];

    if (this.studentForm.invalid) {
      return;
    }

    if (this.studentForm.value['class_id']) {
      uploadData.append(
        'class_id',
        this.studentForm.value['class_id']['id']
      );
    }

    const students = this.studentForm.value['student_id'];
    if (students.length > 0) {
      students.forEach(function (item) {
        uploadData.append('student_id' + '[' + i + ']', item['id']);
        i++;
        id_students.push(item['id']);
      });
    }
    //Thực thi thêm mới
    this.classManagementStudentService
      .insertUserAccount(uploadData)
      .subscribe((res) => {
        this.notifyService.showSuccess('Thêm mới thành công', 'Thông báo');
        $('#createClassStudentModal').modal('hide');
        $('.modal-backdrop').remove();
        this.resetStudentForm();
        // console.log(id_students);
        const arrStudent = this.ddlStudentInsertData;
        var x = arrStudent.filter(function (item) {
          if (id_students.indexOf(item['id']) === -1) {
            return true;
          }
        });
        this.ddlStudentInsertData = x;

        if (this.rememberButton == 1) {
          this.searchByInput();
        }

        if (this.rememberButton == 2) {
          const search = this.studentForm.value['search'];
          this.searchByKeyWord(search);
        }
        // this.classManagementStudentService
        //   .classStudentList()
        //   .pipe()
        //   .subscribe((data) => {
        //     this.headerStudent = true;
        //     this.students = data['query'];
        //   });
      });
  }
  updateStudent() { }

  // Tải file mẫu
  downloadTemplateFile() {
    this.classManagementStudentService.downloadSampleFile().subscribe((res) => {
      this.loadingDownload = false;
      // window.open(window.URL.createObjectURL(res));
      var downloadURL = window.URL.createObjectURL(res);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "FileMau_HocSinhTheoLop.xlsx";
      link.click();
    });
  }

  // Nhập tự file excel
  importFile() {

    this.loadingImport = true;
    var formData = new FormData();
    if(this.fileURL === undefined
      ||this.fileURL === ''
      ||this.fileURL === null){
      this.loadingImport = false;
      this.notifyService.showError('File excel chỉ nhận file có định dạng .xls, .xlsx, hoặc .csv','thông báo')
    }else{
      formData.append('data_import', this.fileInput.nativeElement.files[0])
      this.classManagementStudentService.importExcel(formData)
      .subscribe(
        result => {
          this.loadingImport = false;
          if(result['success'] === 0){
            let mess = 'Tải lên thành công ' + result['success'] + ' bản ghi. Có ' +result['fail']+ ' bản ghi bị lỗi !';
            this.notifyService.showError(mess,'Thông báo');
            this.fileInput.nativeElement.value = '';
            this.fileURL = '';
            if(result['fail'] !== 0){
              let err = {'basicError':result['basicError'], 'detailError':result['detailError']};
              this.classManagementStudentService.exportExcelErrors(err)
              .subscribe((res)=>{
                var downloadURL = window.URL.createObjectURL(res);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = "File_Errors.xlsx";
                link.click();
              },
                error =>{
                  this.loadingImport = false;
                }
              );
          }
          }else{
            let mess = 'Tải lên thành công ' + result['success'] + ' bản ghi. Có ' +result['fail']+ ' bản ghi bị lỗi !';
            this.notifyService.showSuccess(mess,'Thông báo');
            this.fileInput.nativeElement.value = '';
            this.fileURL = '';

            let err = {'basicError':result['basicError'], 'detailError':result['detailError']};
            if(result['fail'] !== 0){
              this.classManagementStudentService.exportExcelErrors(err)
              .subscribe((res)=>{
                var downloadURL = window.URL.createObjectURL(res);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = "File_Errors.xlsx";
                link.click();
              },
                error =>{
                  this.loadingImport = false;
                }
              );
          }
          }
        },
        error => {
          this.loadingImport = false;
          this.fileInput.nativeElement.value = '';
          this.fileURL = '';
        });
    }
    ///

  }

  // arrYearId:any;
  exportFile() {
    this.loadingExport = true;
    if (!this.students) {
      this.notifyService.showError(
        'Dữ liệu không tồn tại. Vui lòng kiểm tra lại!',
        'Thông báo lỗi'
      );
      this.loadingExport = false;
      return;
    }
    let searchVal;
    var exportData = new FormData();
    var i = 0;
    if (this.rememberButton === 1) {

      let x = this.studentForm.value['year']['id'];

      if (this.studentForm.value['year']) {
        exportData.append('years' + '[' + 0 + ']', this.studentForm.value['year']['id']);
      }
      let y = this.studentForm.value['semester'].length;
      if (this.studentForm.value['semester'].length > 0) {
        exportData.append('semester' + '[' + 0 + ']', this.studentForm.value['semester']['id']);
      }

      const grades = this.studentForm.value['grade'];
      if (grades.length > 0) {
        grades.forEach(function (item) {
          exportData.append('grades' + '[' + i + ']', item['id']);
          i++;
        });
        i = 0;
      }

      const classes = this.studentForm.value['class_id_search'];
      if (classes.length > 0) {
        classes.forEach(function (item) {
          exportData.append('classes' + '[' + i + ']', item['id']);
          i++;
        });
        i = 0;
      }


      exportData.append('export_data', '1');
    }
    if (this.rememberButton === 2) {
      if (this.studentForm.value['search']) {
        searchVal = this.studentForm.value['search'];
        exportData.append('search', searchVal);
      }
      exportData.append('export_data', 'export_data');
    }

    this.classManagementStudentService
      .exportExcel(exportData)
      .subscribe((res) => {
        this.loadingExport = false;
        // window.open(window.URL.createObjectURL(res));
        var downloadURL = window.URL.createObjectURL(res);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = "DanhSachHocSinhTheoLop.xlsx";
        link.click();

      });
  }

  resetStudentForm() {
    this.studentForm.get('class_id').clearValidators();
    this.studentForm.get('class_id').setValue('');
    this.studentForm.get('student_id').clearValidators();
    this.studentForm.get('student_id').setValue('');
    this.model.ddlStudentInsertData = '';
    this.selectedClassInsert = [];
  }

  //sort ten
  alphabetsFather = ['A', 'À', 'Ả', 'Ã', 'Á', 'Ạ',
    'Ă', 'Ằ', 'Ẳ', 'Ẵ', 'Ắ', 'Ặ',
    'Â', 'Ầ', 'Ẩ', 'Ẫ', 'Ấ', 'Ậ',
    'B', 'C', 'D', 'Đ',
    'E', 'È', 'Ẻ', 'Ẽ', 'É', 'Ẹ',
    'Ê', 'Ề', 'Ể', 'Ễ', 'Ế', 'Ệ',
    'F', 'G', 'H',
    'I', 'Ì', 'Ỉ', 'Ĩ', 'Í', 'Ị',
    'J', 'K', 'L', 'M', 'N',
    'O', 'Ò', 'Ỏ', 'Õ', 'Ó', 'Ọ',
    'Ô', 'Ồ', 'Ổ', 'Ỗ', 'Ố', 'Ộ',
    'Ơ', 'Ờ', 'Ở', 'Ỡ', 'Ớ', 'Ợ',
    'P', 'Q', 'R', 'S', 'T',
    'U', 'Ù', 'Ủ', 'Ũ', 'Ú', 'Ụ',
    'Ư', 'Ừ', 'Ử', 'Ữ', 'Ứ', 'Ự',
    'V', 'W', 'X',
    'Y', 'Ỳ', 'Ỷ', 'Ỹ', 'Ý', 'Ỵ',
    'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' '];

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

  //sort ten
  firstTimeName = 1;
  timesName: any;
  sortFistName() {
    this.firstTimeName = 0;
    this.firstTimeCode = 1;
    this.timesCode = 0;

    //*1 hàm sort
    const array = this.students;
    if (this.timesName === 1) {
      array.sort((a, b) => {
        var str1 = a.student_name;
        str1 = str1.split(' ');
        str1 = str1.reverse();
        str1 = str1.toString();
        str1 = str1.toUpperCase();

        var str2 = b.student_name;
        str2 = str2.split(' ');
        str2 = str2.reverse();
        str2 = str2.toString();
        str2 = str2.toUpperCase();

        return this.CharCompare(str1, str2, 0);
      });
      this.timesName = 2;
    } else if (this.timesName !== 1) {
      array.sort((a, b) => {
        var str1 = a.student_name;
        str1 = str1.split(' ');
        str1 = str1.reverse();
        str1 = str1.toString();
        str1 = str1.toUpperCase();

        var str2 = b.student_name;
        str2 = str2.split(' ');
        str2 = str2.reverse();
        str2 = str2.toString();
        str2 = str2.toUpperCase();

        return this.CharCompare(str2, str1, 0);
      });
      this.timesName = 1;
    }
    this.students = array;
  }
  //sort code
  firstTimeCode = 1;
  timesCode: any;
  sortFistCode() {
    this.firstTimeCode = 0;
    this.firstTimeName = 1;
    this.timesName = 0;
    const array = this.students;
    if (this.timesCode === 1) {
      array.sort(function (a, b) {
        let str = a.student_code;
        str = str.substr(3);
        var nameA = Number(str);

        let str2 = b.student_code;
        str2 = str2.substr(3);
        var nameB = Number(str2);

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      this.timesCode = 2;
    } else {
      array.sort(function (a, b) {
        let str = a.student_code;
        str = str.substr(3);
        var nameA = Number(str);

        let str2 = b.student_code;
        str2 = str2.substr(3);
        var nameB = Number(str2);

        if (nameA > nameB) {
          return -1;
        }
        if (nameA < nameB) {
          return 1;
        }
        return 0;
      });
      this.timesCode = 1;
    }
    this.students = array;
  }




  selectID(id, event: any) {
    this.selectedItem['selectedItems'] = [];
    // this.SelectedIDs.push(id);
  }

  getSelectedClassStudentValue(e) {
    let value_id = e.target.value;
    // alert (value_id);
    if (this.getArrayChecboxId.length === 0) {
      this.getArrayChecboxId.push(value_id);
    } else {
      let checkbox_ex = this.getArrayChecboxId.indexOf(value_id);
      if (checkbox_ex != -1) {
        this.getArrayChecboxId.splice(checkbox_ex, 1);
      } else {
        this.getArrayChecboxId.push(value_id);
      }
    }
    this.getArrayChecboxId;
  }
}
