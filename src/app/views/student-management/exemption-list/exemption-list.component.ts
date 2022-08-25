import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY } from '@angular/cdk/overlay/overlay-directives';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../_services/notification.service';
import { UtilityService } from '../../../_services/utils.service';
import { ExemptionListService } from '../service/exemption-list.service';
declare var $: any;

@Component({
  selector: 'app-exemption-list',
  templateUrl: './exemption-list.component.html',
  styleUrls: ['./exemption-list.component.scss']
})
export class ExemptionListComponent implements OnInit {
  studentsNotAssigned: any[] = [];
  studentsNotAssignedTemp: any[] = [];
  dataShow: any = {
    id: '',
    student_id: '',
    student_name: '',
    class_name: '',
    class_id: '',
    firstname: '',
    lastname: '',
    semester_id: '',
    semester_name: '',
    level: '',
    detail_study_program_id: '',
    subject_name: '',
    description: '',
    year_id: '',
  };
  //header
  header = true;
  subjectAdd = [];
  //class data
  ddlClassData = [];

  //Môn khi thêm
  ddlSubjectAddData = [];
  //class
  ddlClassAddData = [];
  //Học kỳ khi thêm
  ddlSemesterAddData = [];

  //data student
  ddlStudentData = [];
  ddlStudentColumns = [
    { field: 'code', header: 'Mã HS', dataType: 'string' },
    { field: 'student_name', header: 'Tên HS', dataType: 'string' },
    { field: 'dob', header: 'Ngày sinh', dataType: 'date' },
  ];
  //ghi chú
  maxNumberOfCharactersDescription = 150;
  counter = true;
  numberOfCharactersDescription = 0;
  submitted = false;
  //dữ liệu
  saveItem: any = {};
  //dữ liệu chung filter
  filterSaveItems: any = {};
  //tồn tại dữ liệu
  checkData = true
  //year data
  ddlYearData = [];
  currentYear = [];

  minDate: string;
  maxDate: string;
  form: FormGroup;

  // //semester data
  ddlSemesterData = [];
  // selectedSemester = [];

  //load lại filter
  loadingFilter = false;

  p: number = 1;
  countPage: number = 10;
  totalItems = 0;
  perPageSelected(id: number) {
    this.countPage = id;
    this.p = 1;
  }

  dataSource: any[];

  dataPaged: any[];
  constructor(
    private fb: FormBuilder,
    private exemptionListService: ExemptionListService,
    private notifyService: NotificationService,
    private _utilsService: UtilityService) { }
  get f() {
    return this.form.controls;
  }
  //drop năm
  fullYear() {
    this.exemptionListService
      .listYear().subscribe((res) => {
        if (res.years) {
          const result = res.years.map((year) => ({
            id: year.id,
            name: year.start_year + "-" + year.end_year,
          }));
          this.ddlYearData = result;
          this.filterSaveItems.year = res.id_current_year;
          //lấy class theo năm hiện tại
          this.exemptionListService
            .listClass(res.id_current_year)
            .subscribe((res) => {
              if (res.query) {
                const result = res.query.map((item) => ({
                  class_id: item.id,
                  class_name: item.class_name,
                  level: item.level,
                  year_id: this.filterSaveItems.year,
                }));
                const classData = result.filter((value) => value.level);
                this.ddlClassAddData = classData;
                this.ddlClassData = classData;
              }
            });
        }
      });

  }
  //sk change year
  onSelectYear(item: any) {
    this.filterSaveItems.class_id = {};
    this.filterSaveItems.semester_ids = {};
    // this.ddlClassData = [];
    // this.filterSaveItems.class_id = null;
    if (item != undefined) {
      const arrClass = [];
      this.exemptionListService
        .listClass(item.id)
        .pipe()
        .subscribe((ress) => {
          ress["query"].forEach(function (items) {
            arrClass.push({
              class_id: items["id"],
              class_name: items["class_name"],
              level: items["level"],
              year_id: item["id"],
            });
          });
          this.ddlClassData = arrClass;
        });
    } else {
      this.ddlClassData = [];
      this.filterSaveItems.class_id = null;
      this.ddlSemesterData = [];
      this.filterSaveItems.semester_ids = null;
    }
  }
  //chọn Học kỳ khi thêm mới
  onSelectSemester(event: any) {

  }
  //sk change class
  onSelectClass(item: any) {
    this.filterSaveItems.semester_ids = {};
    if (item != undefined) {
      const arrSemester = [];
      this.exemptionListService
        .listSemester(item["year_id"], item.level)
        .pipe()
        .subscribe((res) => {
          res["query"].forEach(function (items) {
              if (items["exam_time"] == 1) {
                arrSemester.push({
                  semester_ids: items["id"],
                  semester_name: items["name"],
                  level: items["level"],
                  exam_time: items["exam_time"],
                  mid_or_last: 1,
                });
              } else {
                arrSemester.push({
                  semester_ids: items["id"],
                  semester_name: items["name"],
                  level: items["level"],
                  exam_time: items["exam_time"],
                  mid_or_last: 2,
                });
              }

          });
          this.ddlSemesterData = arrSemester;
        });
    } else {
      this.ddlSemesterData = [];
      this.filterSaveItems.semester_ids = null;
    }
  }
  ngOnInit() {
    this.form = this.fb.group({
      search: new FormControl("", [Validators.required,]),
      class: new FormControl("", [Validators.required,]),
      student: new FormControl("", [Validators.required,]),
      subject: new FormControl("", [Validators.required,]),
      semester: new FormControl("", [Validators.required,]),
      description: new FormControl("", [Validators.required,]),
      classAdd: new FormControl("", [Validators.required,]),
      subjectAdd: new FormControl("", [Validators.required,]),
      semesterAdd: new FormControl("", [Validators.required,]),
      descriptionAdd: new FormControl("", [Validators.required,]),
    });
    //lấy year
    this.fullYear();
  }
  //load dữ liệu grid
  loadData() {
    this.loadingFilter = true;
    this.filterSaveItems;
    let concat_string;
    let concat_string_1;
    let search = this.form.controls["search"].value;
    const arr_semester = [];
    let i = 0;
    if (this.filterSaveItems.semester_ids && this.filterSaveItems.semester_ids.length > 0) {
      this.filterSaveItems.semester_ids.forEach(function (items) {
        arr_semester.push('semester_id' + '[' + i + ']' + '=' + items)
        i++;
        concat_string = arr_semester.join('&');
      });
    }
    if (this.filterSaveItems.class_id) {
      arr_semester.push('class_id' + '=' + this.filterSaveItems.class_id)
      concat_string_1 = arr_semester.join('&');
    }
    let e = '&'
    if (concat_string == undefined && this.filterSaveItems.class_id == undefined) {
      this.exemptionListService.listGrid(search, this.filterSaveItems.year, null, null, e)
        .subscribe((gridData) => {
          this.loadingFilter = false;
          if (gridData["query"]["length"] === 0) {
            this.header = true;
            this.checkData = false;
            this.dataSource = [];
          } else {
            this.header = true;
            this.checkData = true;
            gridData["query"];
            this.dataSource = gridData.query;
          }
        });
    } else
      if (concat_string == undefined) {
        this.exemptionListService.listGrid(search, this.filterSaveItems.year, concat_string_1, null, e)
          .subscribe((gridData) => {
            this.loadingFilter = false;
            if (gridData["query"]["length"] === 0) {
              this.header = true;
              this.checkData = false;
              this.dataSource = [];
            } else {
              this.header = true;
              this.checkData = true;
              gridData["query"];
              this.dataSource = gridData.query;
            }
          });
      } else {
        this.exemptionListService.listGrid(search, this.filterSaveItems.year, concat_string_1, concat_string, e)
          .subscribe((gridData) => {
            this.loadingFilter = false;
            if (gridData["query"]["length"] === 0) {
              this.header = true;
              this.checkData = false;
              this.dataSource = [];
            } else {
              this.header = true;
              this.checkData = true;
              gridData["query"];
              this.dataSource = gridData.query;
            }
          });
      }//endif

  }
  //lọc
  filter() {
    this.loadingFilter = true;
    this.filterSaveItems;
    let concat_string;
    let concat_string_1;
    let search = this.form.controls["search"].value;
    const arr_semester = [];
    let i = 0;
    if (this.filterSaveItems.semester_ids && this.filterSaveItems.semester_ids.length > 0) {
      this.filterSaveItems.semester_ids.forEach(function (items) {
        arr_semester.push('semester_id' + '[' + i + ']' + '=' + items)
        i++;
        concat_string = arr_semester.join('&');
      });
    }
    if (this.filterSaveItems.class_id) {
      arr_semester.push('class_id' + '=' + this.filterSaveItems.class_id)
      concat_string_1 = arr_semester.join('&');
    }
    let e = '&'
    if (concat_string == undefined && this.filterSaveItems.class_id == undefined) {
      this.exemptionListService.listGrid(search, this.filterSaveItems.year, null, null, e)
        .subscribe((gridData) => {
          this.loadingFilter = false;
          if (gridData["query"]["length"] === 0) {
            this.header = true;
            this.checkData = false;
            this.dataSource = [];
            this.p = 1
          } else {
            this.header = true;
            this.checkData = true;
            gridData["query"];
            this.p = 1
            this.dataSource = gridData.query;
          }
        });
    } else
      if (concat_string == undefined) {
        this.loadingFilter = false;
        this.exemptionListService.listGrid(search, this.filterSaveItems.year, concat_string_1, null, e)
          .subscribe((gridData) => {
            if (gridData["query"]["length"] === 0) {
              this.header = true;
              this.checkData = false;
              this.dataSource = [];
              this.p = 1
            } else {
              this.header = true;
              this.checkData = true;
              gridData["query"];
              this.p = 1
              this.dataSource = gridData.query;
            }
          });
      } else {
        this.exemptionListService.listGrid(search, this.filterSaveItems.year, concat_string_1, concat_string, e)
          .subscribe((gridData) => {
            this.loadingFilter = false;
            if (gridData["query"]["length"] === 0) {
              this.header = true;
              this.checkData = false;
              this.dataSource = [];
              this.p = 1
            } else {
              this.header = true;
              this.checkData = true;
              gridData["query"];
              this.p = 1
              this.dataSource = gridData.query;
            }
          });
      }//endif

  }

  //sửa
  edit(item: any) {
    this.saveItem = {};
    this.dataShow = {};

    let found = this.dataSource.find(el => {
      return el.id == item.id
    });
    if (found) {
      this.dataShow = found;
    }
    if(this.dataShow.description == " "){
      this.dataShow.description = "";
    }
    if(!this.dataShow.description){
      this.numberOfCharactersDescription = 0;
    }else{
      this.numberOfCharactersDescription = this.dataShow.description.length;
    }
    this.ddlSubjectAddData.push([{ 'detail_study_program_id': this.dataShow.detail_study_program_id, 'subject_name': this.dataShow.subject_name }]);
    const arrSemesterAdd = [];
    this.exemptionListService
      .listSemester(this.dataShow.year_id, this.dataShow.level)
      .pipe()
      .subscribe((res) => {
        res["query"].forEach(function (items) {
          arrSemesterAdd.push({
            semester_id: items["id"],
            semester_name: items["name"],
            level: items["level"],
            exam_time: items["exam_time"],
          });
        });
        this.ddlSemesterAddData = arrSemesterAdd;
      });
    const arrSubjectAdd = [];
    this.exemptionListService.listSubject(this.dataShow.class_id, this.dataShow.semester_id, this.dataShow.student_id)
      .subscribe((semesterData) => {
        semesterData.query.forEach(function (items) {
          arrSubjectAdd.push({
            detail_study_program_id: items["detail_study_program_id"],
            subject_name: items["name"],
            subject_type: items["subject_type"],
          });
        })
        this.ddlSubjectAddData = arrSubjectAdd
      })
  }

  //xóa
  delete(id: number) {
    this._utilsService.showConfirm('Bạn chắc chắn muốn xóa bản ghi này không?', confirm => {
      if (confirm) {
        this.exemptionListService.delete(id).subscribe(
          (rs) => {
            this.notifyService.showSuccess(
              'Xóa thành công!',
              'Thông báo'
            );
            this.loadData();
          },
          (error) => {
            // else {
            //   this.notifyService.showError("Xóa thất bại.", "Thông báo lỗi");
            // }
          }
        );
      }
    });
  }

  //nút thêm
  resetForm() {
    this.saveItem = {};
    this.dataShow = {};
    this.ddlStudentData = [];
    this.ddlSemesterAddData = [];
    this.ddlSubjectAddData = [];
    this.numberOfCharactersDescription = 0;
  }
  onKeyUp(event: any): void {
    this.numberOfCharactersDescription = event.target.value.length;
    if (
      this.numberOfCharactersDescription > this.maxNumberOfCharactersDescription
    ) {
      event.target.value = event.target.value.slice(
        0,
        this.maxNumberOfCharactersDescription
      );
      this.numberOfCharactersDescription = this.maxNumberOfCharactersDescription;
    }
  }

  // get dropdown student cho tất cả các dòng
  getDropdownStudentDataForAllRow() {
    if (this.dataSource) {
      // danh sách Id GV đã được phân công trên màn hình hiện tại:
      let student_ids_assigneds = this.dataSource.filter(p => p.student_id > 0).map(p => p.student_id);

      // danh sách GV chưa được phân công:
      let teachers_not_assigned = this.studentsNotAssigned.filter(p => !student_ids_assigneds.includes(p.id));
      if (this.studentsNotAssignedTemp && this.studentsNotAssignedTemp.length > 0) {
        // Loại bỏ các giáo viên trùng:
        let studentsNotAssignedTemp = this.studentsNotAssignedTemp.filter(p => !teachers_not_assigned.map(q => q.id).includes(p.id));
        if (studentsNotAssignedTemp && studentsNotAssignedTemp.length > 0) {
          teachers_not_assigned = teachers_not_assigned.concat(JSON.parse(JSON.stringify(studentsNotAssignedTemp)));
        }
      }

    }
  }

  // thay đổi khi bỏ chọn học sinh
  onBeforeClearStudentId(clearingStudentId: number) {
    let studentTemp = null;
    if (clearingStudentId > 0) {
      studentTemp = this.ddlStudentData.find(p => p.id == clearingStudentId);
      if (studentTemp) {
        this.studentsNotAssignedTemp.push(studentTemp);
      }
    }
  }
  // thay đổi khi chọn giáo viên
  onChangeStudentIdOnRowData(student_id: number) {
    if (student_id > 0) {
      this.studentsNotAssignedTemp = this.studentsNotAssignedTemp.filter(p => p.id != student_id);
    }
    this.getDropdownStudentDataForAllRow();
    if (this.saveItem.student_id > 0) {
      this.saveItem.showErrorStudentId = false;
    }
  }

  //chọn Lớp khi thêm mới
  onSelectClassAdd(item: any) {
    this.saveItem.semester_ids = {};
    this.saveItem.detail_study_program_id = {};
    this.saveItem.student_id = {};
    if (this.saveItem.class_id) {
      this.saveItem.showErrorClassId = false;
    }
    if (item != undefined) {
      const arrStudent = [];
      this.exemptionListService.listStudent(item.class_id).subscribe((studentData) => {
        studentData.query.forEach(function (items) {
          arrStudent.push({
            student_id: items["id"],
            student_name: items["lastname"] + " " + items["firstname"],
            code: items["code"],
            dob: items["dob"],
          });
        })
        this.ddlStudentData = arrStudent;
      })
    } else {
      this.ddlStudentData = [];
      this.saveItem.student_id = null;
    }
    this.saveItem.semester_id = {};
    if (item != undefined) {
      const arrSemesterAdd = [];
      this.exemptionListService
        .listSemester(item["year_id"], item.level)
        .pipe()
        .subscribe((res) => {
          res["query"].forEach(function (items) {
              if (items["exam_time"] == 1) {
                arrSemesterAdd.push({
                  semester_id: items["id"],
                  semester_name: items["name"],
                  level: items["level"],
                  exam_time: items["exam_time"],
                  mid_or_last: 1,
                });
              } else {
                arrSemesterAdd.push({
                  semester_id: items["id"],
                  semester_name: items["name"],
                  level: items["level"],
                  exam_time: items["exam_time"],
                  mid_or_last: 2,
                });
              }
          });
          this.ddlSemesterAddData = arrSemesterAdd;
        });
    } else {
      this.ddlSemesterAddData = [];
      this.saveItem.semester_id = null;
    }
  }

  //chọn Học kỳ khi thêm mới
  onSelectSemesterAdd(item: any) {
    this.saveItem.detail_study_program_id = {};
    if (this.saveItem.semester_id) {
      this.saveItem.showErrorSemesterId = false;
    }
    if (item != undefined) {
      const arrSubjectAdd = [];
      this.exemptionListService.listSubject(this.saveItem.class_id, this.saveItem.semester_id, this.saveItem.student_id)
        .subscribe((semesterData) => {
          semesterData.query.forEach(function (items) {
            arrSubjectAdd.push({
              detail_study_program_id: items["detail_study_program_id"],
              subject_name: items["name"],
              subject_type: items["subject_type"],
            });
          })
          this.ddlSubjectAddData = arrSubjectAdd
        })
    } else {
      this.ddlSubjectAddData = [];
      this.saveItem.detail_study_program_id = {};
    }
  }
  //chọn Môn khi thêm mới
  onSelectSubjectAdd(item: any) {
    this.subjectAdd = item
  }
  //chọn Học kỳ khi cập nhật
  onSelectSemesterUpdate(item: any) {
    this.dataShow.detail_study_program_id = {}
    if (this.dataShow.semester_id) {
      this.saveItem.showErrorSemesterId = false;
    }
    if (item != undefined) {
      const arrSubjectAdd = [];
      this.exemptionListService.listSubject(this.dataShow.class_id, this.dataShow.semester_id, this.dataShow.student_id)
        .subscribe((semesterData) => {
          semesterData.query.forEach(function (items) {
            arrSubjectAdd.push({
              detail_study_program_id: items["detail_study_program_id"],
              subject_name: items["name"],
              subject_type: items["subject_type"],
            });
          })
          this.ddlSubjectAddData = arrSubjectAdd
        })
    } else {
      this.ddlSubjectAddData = [];
      this.dataShow.detail_study_program_id = {};
    }
  }
  //chọn Môn khi thêm mới
  onSelectSubjectUpdate(item: any) {

  }

  //lưu khi thêm
  create() {
    if (!(this.saveItem.class_id > 0)) {
      this.saveItem.showErrorClassId = true;
    }
    if (!(this.saveItem.student_id > 0)) {
      this.saveItem.showErrorStudentId = true;
    }
    if (!(this.saveItem.semester_id > 0)) {
      this.saveItem.showErrorSemesterId = true;
    }
    if (!(this.saveItem.detail_study_program_id > 0)) {
      this.saveItem.showErrorSubjectId = true;
    }
    // if (!this.saveItem.class_ids || this.saveItem.class_ids.length == 0) {
    //   this.saveItem.showErrorClassId = true;
    // }
    // if (!this.saveItem.semester_ids || this.saveItem.semester_ids.length == 0) {
    //   this.saveItem.showErrorSemesterId = true;
    // }
    this.submitted = true;
    if (
      this.saveItem.showErrorClassId ||
      this.saveItem.showErrorStudentId ||
      this.saveItem.showErrorSemesterId ||
      this.saveItem.showErrorSubjectId
    ) {
      return;
    }
    this.exemptionListService.create(this.saveItem.class_id, this.saveItem.student_id, this.saveItem.semester_id, this.subjectAdd["detail_study_program_id"], this.dataShow.description)
      .subscribe(
        result => {
          this.notifyService.showSuccess(
            "Thêm thành công",
            "Thông báo"
          );
          $("#createModal").modal("hide");
          $(".modal-backdrop").remove();
          this.header = true;
          this.checkData = true;
          this.filter();
        }, (error) => {
          if (error.error == 11) {
            this.notifyService.showError("Lớp không tồn tại", "Thông báo lỗi");
          } else if (error.error == 12) {
            this.notifyService.showError("Học kỳ không tồn tại", "Thông báo lỗi");
          } else if (error.error == 13) {
            this.notifyService.showError("Chương trình học không tồn tại", "Thông báo lỗi");
          } else if (error.error == 14) {
            this.notifyService.showError("Chương trình học không thuộc lớp hoặc học kỳ", "Thông báo lỗi");
          } else if (error.error == 15) {
            this.notifyService.showError("Môn học phải là môn không tính điểm", "Thông báo lỗi");
          } else if (error.error == 16) {
            this.notifyService.showError("Học sinh không tồn tại", "Thông báo lỗi");
          } else if (error.error == 17) {
            this.notifyService.showError("Lỗi bản ghi", "Thông báo lỗi");
          } else if (error.error == 18) {
            this.notifyService.showError("Bản ghi này đã được tạo", "Thông báo lỗi");
          } else if (error.error == 121) {
            this.notifyService.showError("Năm học là năm quá khứ hoặc đã ngừng hoạt động", "Thông báo lỗi");
          } else {
            this.notifyService.showError("Lưu thất bại.", "Thông báo lỗi");
          }
        }
      )
  }

  //Lưu khi cập nhật
  update() {
    // if (!(this.dataShow.class_id != null)) {
    //   this.saveItem.showErrorClassId = true;
    // }
    // if (!(this.saveItem.student_id != null)) {
    //   this.saveItem.showErrorStudentId = true;
    // }
    if (!(this.dataShow.semester_id > 0)) {
      this.saveItem.showErrorSemesterId = true;
    }
    if (!(this.dataShow.detail_study_program_id > 0)) {
      this.saveItem.showErrorSubjectId = true;
    }
    // if (!this.saveItem.class_ids || this.saveItem.class_ids.length == 0) {
    //   this.saveItem.showErrorClassId = true;
    // }
    // if (!this.saveItem.semester_ids || this.saveItem.semester_ids.length == 0) {
    //   this.saveItem.showErrorSemesterId = true;
    // }
    this.submitted = true;
    if (
      // this.saveItem.showErrorClassId ||
      // this.saveItem.showErrorStudentId ||
      this.saveItem.showErrorSemesterId ||
      this.saveItem.showErrorSubjectId
    ) {
      return;
    }
    this.exemptionListService.update(this.dataShow.id, this.dataShow.semester_id, this.dataShow.detail_study_program_id, this.dataShow.description).subscribe((dataUpdate) => {
      this.notifyService.showSuccess(
        "Thay đổi thành công",
        "Thông báo"
      );
      $("#updateModal").modal("hide");
      $(".modal-backdrop").remove();
      this.header = true;
      this.checkData = true;
      this.loadData();
    }, (error) => {
      if (error.error == 10) {
        this.notifyService.showError("Bản ghi không tồn tại", "Thông báo lỗi");
      } else if (error.error == 12) {
        this.notifyService.showError("Lỗi đầu vào", "Thông báo lỗi");
      } else if (error.error == 13) {
        this.notifyService.showError("Học kỳ không thuộc cấp học", "Thông báo lỗi");
      } else if (error.error == 14) {
        this.notifyService.showError("Chương trình học không thuộc lớp hoặc học kỳ", "Thông báo lỗi");
      } else if (error.error == 15) {
        this.notifyService.showError("Môn học phải là môn không tính điểm", "Thông báo lỗi");
      } else if (error.error == 17) {
        this.notifyService.showError("Lỗi bản ghi", "Thông báo lỗi");
      } else if (error.error == 18) {
        this.notifyService.showError("Bản ghi này đã được tạo", "Thông báo lỗi");
      } else if (error.error == 121) {
        this.notifyService.showError("Năm học là năm quá khứ hoặc đã ngừng hoạt động", "Thông báo lỗi");
      } else {
        this.notifyService.showError("Lưu thất bại.", "Thông báo lỗi");
      }
    }
    )
  }


}
