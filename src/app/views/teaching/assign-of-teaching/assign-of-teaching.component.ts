import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { isBuffer } from 'util';
import { CommonService } from "../../../_services/common.service";
import { NotificationService } from "../../../_services/notification.service";
import { UtilityService } from '../../../_services/utils.service';
import { AssignOfTeachingService } from "../service/assign-of-teaching.component.service";
declare var $: any;
@Component({
  selector: "app-assign-of-teaching",
  templateUrl: "./assign-of-teaching.component.html",
  styleUrls: ["./assign-of-teaching.component.scss"],
})
export class AssignOfTeachingComponent implements OnInit {
  form: FormGroup;
  ddlSemesterMap = [];
  checkData = true
  id_row: any;
  saveItem: any = {};
  dataPaged: any[];
  //data
  dataSource: any[];
  //year data
  ddlYearData = [];
  selectedYear = [];
  currentYear = [];
  //grade list
  ddlGradeData = [];
  ddlGradeSearchData = [];
  selectedGradeSearch = [];
  //dữ liệu grade khi thêm
  ddlGradeInsertData = [];
  //class list
  ddlClassData = [];
  ddlClassSearchData = [];
  selectedClassSearch = [];
  //teacher
  ddlTeacherData = [];
  ddlTeacherSearchData = [];
  ddlTeacherColumns = [
    { field: 'code', header: 'Mã GV', dataType: 'string' },
    { field: 'name', header: 'Tên GV', dataType: 'string' },
    { field: 'dob', header: 'Ngày sinh', dataType: 'date' },
  ];
  teachersNotAssigned: any[] = [];
  teachersNotAssignedTemp: any[] = [];
  selectedTeacher: any = {};
  //Môn khi thêm
  ddlSubjectAddData = [];
  ddlClassAddData = [];
  //Học kỳ khi thêm
  ddlSemesterAddData = [];
  //Môn khi cập nhật
  ddlSubjectUpdateData = [];
  ddlClassUpdateData = [];
  //Học kỳ khi cập nhật
  ddlSemesterUpdateData = [];
  //header
  // headerAssign = false;
  headerAssign = true;

  p: number = 1;
  countPage: number = 10;
  totalItems = 0;
  perPageSelected(id: number) {
    this.countPage = id;
    this.p = 1;
  }
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private assignOfTeachingService: AssignOfTeachingService,
    private notifyService: NotificationService,
    private _utilsService: UtilityService
  ) { }
  get f() {
    return this.form.controls;
  }
  ngOnInit() {
    this.form = this.fb.group({
      gradeAdd: new FormControl("", [Validators.required,]),
      subjectAdd: new FormControl("", [Validators.required,]),
      classAdd: new FormControl("", [Validators.required,]),
      semesterAdd: new FormControl("", [Validators.required,]),
      teacherUpdate: new FormControl("", [Validators.required,]),
      gradeUpdate: new FormControl("", [Validators.required,]),
      subjectUpdate: new FormControl("", [Validators.required,]),
      classUpdate: new FormControl("", [Validators.required,]),
      semesterUpdate: new FormControl("", [Validators.required,]),
    });
    //setting dropdown năm học
    this.assignOfTeachingService
      .listYear()
      .pipe()
      .subscribe((data) => {
        const fullYear = [];
        const limitYear = [];
        const idCurrentYear = data["id_current_year"];
        let currentYearData;
        const currentArrYearData = [];
        const getAllYearId = [];
        data["years"].forEach(function (item) {
          fullYear.push({
            id: item["id"],
            name: item["start_year"] + " - " + item["end_year"],
          });
          getAllYearId.push(item["id"]);
        });
        data["limit_year"].forEach(function (item) {
          limitYear.push({
            id: item["id"],
            name: item["start_year"] + " - " + item["end_year"],
          });
          if (item["id"] === idCurrentYear) {
            currentYearData = {
              id: item["id"],
              name: item["start_year"] + " - " + item["end_year"],
            };
            currentArrYearData.push({
              id: item["id"],
              name: item["start_year"] + " - " + item["end_year"],
            });
          }
        });
        this.ddlYearData = fullYear;
        this.selectedYear = currentYearData;
        this.currentYear = currentYearData;

        //Đổ dữ liệu grades
        this.assignOfTeachingService
          .getGradeList(data["id_current_year"])
          .pipe()
          .subscribe((datum) => {
            const getGradesData = [];
            datum["query"].forEach(function (items) {
              getGradesData.push({
                id: items["id"],
                name: items["name"],
                level: items["level"],
              });
            });
            this.ddlGradeSearchData = getGradesData;
            this.ddlGradeData = getGradesData;

            this.assignOfTeachingService
              .getGradeList([data["id_current_year"]])
              .pipe()
              .subscribe((subjectData) => {
                const arrGradesData = [];
                subjectData["query"].forEach(function (items) {
                  arrGradesData.push({
                    id: items["id"],
                    name: items["name"],
                    level: items["level"],
                    year_id: data["id_current_year"],
                  });
                });
                this.ddlGradeData = arrGradesData;
                this.ddlGradeInsertData = arrGradesData;
              });
          });
        this.assignOfTeachingService
          .classListInsert()
          .pipe()
          .subscribe((dt) => {
            const classObj = [];
            if (dt["query"] !== undefined && dt["query"].length > 0) {
              dt["query"].forEach(function (item) {
                classObj.push({ id: item["id"], name: item["name"] });
              });
            }
            this.ddlClassData = classObj;
          });
        this.assignOfTeachingService
          .getAllSemester(getAllYearId)
          .pipe()
          .subscribe((res) => {
            const semesterData = [];
            res["query"].forEach(function (items) {
              semesterData.push({
                id: items["id"],
                name: items["name"],
                year_id: items["year_id"],
                level: items["level"],
              });
            });
            this.ddlSemesterMap = semesterData;
          });
      });
    this.assignOfTeachingService.getAllTeacher().subscribe((teacherData) => {
      if (teacherData.query) {
        const arr_Teacher = [];
        teacherData.query.forEach(function (e) {
          arr_Teacher.push({
            id: e.id,
            code: e.code,
            name: e.lastname + " " + e.firstname,
            dob: e.dob
          })
        })
        this.ddlTeacherSearchData = arr_Teacher;
      }
    })

  }
  //chọn year
  onSelectYear(item: any) {
    this.selectedGradeSearch = [];
    if (item !== undefined) {
      const arrSubject = [];
      this.assignOfTeachingService
        .getGradeList([item.id])
        .subscribe((subjectData) => {
          subjectData["query"].forEach(function (items) {
            arrSubject.push({ id: items["id"], name: items["name"] });
          });
          this.ddlGradeSearchData = arrSubject;
        });
    } else {
      this.ddlGradeSearchData = [];
      this.selectedGradeSearch = [];
      this.selectedYear = [];
    }
  }

  //chọn grade
  onSelectGrade(item: any) {
    this.ddlClassSearchData = [];
    this.selectedClassSearch = null;
    if (item !== undefined && item != null && item != []) {
      const arrId = item.map(e => {
        return {
          id: e.id
        }
      })
      this.assignOfTeachingService
        .classListSearch(arrId)
        .pipe()
        .subscribe((data) => {
          this.ddlClassSearchData = data.map(p => {
            return {
              id: p.id,
              name: p.name,
            }
          })
          //bắt đầu
          // const arrAfterFilter = [];
          // const arrSelected = this.selectedClassSearch;
          // arrSelected.forEach(function (items) {
          //   let id = items.id;
          //   let x = this.ddlClassSearchData.map(function (ite) { return ite.id }).indexOf(id);
          //   if (x > -1) {
          //     arrAfterFilter.push({ id: items.id, name: items.name });
          //   }
          // });
          // if (arrAfterFilter.length > 0) {
          //   this.selectedClassSearch = arrAfterFilter;
          // } else {
          //   this.selectedClassSearch = null;
          // }
          //kết thúc

        });
    } else {
      this.ddlClassSearchData = [];
      this.selectedClassSearch = null;
    }
  }
  //chọn  nhiều grade
  selectAllGradeSearch(ddlGradeSearchData) {
    this.selectedGradeSearch = ddlGradeSearchData;
    this.ddlClassSearchData = [];
    this.selectedClassSearch = null;
    if (ddlGradeSearchData !== undefined && ddlGradeSearchData.length > 0) {
      const arrId = ddlGradeSearchData.map(c => {
        return {
          id: c.id
        }
      })
      this.assignOfTeachingService
        .classListSearch(arrId)
        .pipe()
        .subscribe((data) => {
          this.ddlClassSearchData = data.map(p => {
            return {
              id: p.id,
              name: p.name,
            }
          })
        });
    } else {
      this.ddlClassSearchData = [];
      this.selectedClassSearch = [];
    }
  }
  //bỏ chọn nhiều grade
  deSelectAllGradeSearch() {
    this.selectedGradeSearch = null;
    this.selectedClassSearch = null;
  }
  //chọn Class
  onSelectClass(item: any) { }
  //chọn  nhiều class
  selectAllClassSearch(classSearchData) {
    this.selectedClassSearch = classSearchData;
  }
  //bỏ chọn nhiều class
  deSelectAllClassSearch() {
    this.selectedClassSearch = [];
  }
  //load lại dữ liệu trang
  loadDataGrid() {
    let i = 0;
    let z = 0;
    let x = 0;
    //năm
    const arr_year = [];
    const ar_year = [];
    this.selectedYear["id"];
    ar_year.push(this.selectedYear["id"])
    arr_year.push('years' + '[' + 0 + ']' + '=' + this.selectedYear["id"]);
    //khối
    const arr_grade = [];
    const ar_grade = [];
    if (this.selectedGradeSearch) {
      this.selectedGradeSearch.forEach(function (items) {
        ar_grade.push(items.id)
      });
    }
    if (this.selectedGradeSearch) {
      this.selectedGradeSearch.forEach(function (items) {
        arr_grade.push('grades' + '[' + i + ']' + '=' + items.id)
        i++;
      });
    }
    //lớp
    const arr_class = [];
    const ar_class = [];
    if (this.selectedClassSearch) {
      this.selectedClassSearch.forEach(function (items) {
        ar_class.push(items.id)
      });
    }
    if (this.selectedClassSearch) {
      this.selectedClassSearch.forEach(function (items) {
        arr_class.push('classes' + '[' + z + ']' + '=' + items.id)
        i++;
      });
    }
    //giáo viên
    const arr_teacher = [];
    if (this.selectedTeacher["teacher_id"]) {
      arr_teacher.push('teachers' + '[' + 0 + ']' + '=' + this.selectedTeacher["teacher_id"])
    } else arr_teacher.push(null)
    let concat_string_year = arr_year.join('&');
    let concat_string_grade = arr_grade.join('&');
    let concat_string_class = arr_class.join('&');
    let concat_string_teacher = arr_teacher.join('&');
    let e = '&'
    this.assignOfTeachingService.listTeachingAssignment(concat_string_year, concat_string_grade, concat_string_class, concat_string_teacher, e).subscribe((teachingAssignData) => {
      if (teachingAssignData["query"]["length"] === 0) {
        this.headerAssign = true;
        this.checkData = false;
        this.dataSource = [];
      } else {
        this.headerAssign = true;
        this.checkData = true;
        teachingAssignData["query"];
        this.dataSource = [];
        teachingAssignData.query.forEach((e) => {
          let row = this.dataSource.find(p => p.teacher_id == e.teacher_id && p.grade_id == e.grade_id
            && p.subject_id == e.subject_id && p.class_id == e.class_id);
          // let row = this.dataSource.find(p => p.teacher_id == e.teacher_id && p.grade_id == e.grade_id
          //   && p.subject_id == e.subject_id);
          if (row) {
            row.ids.push(e.id);
            // if (!row.class_ids.includes(e.class_id)) {
            //   row.class_ids.push(e.class_id);
            //   row.class_name += ', ' + e.class_name;
            // }
            if (!row.semester_ids.includes(e.semester_id)) {
              row.semester_ids.push(e.semester_id);
              row.semester_name += ', ' + e.semester_name;
            }
          } else {
            e.ids = [e.id];
            e.class_ids = [e.class_id];
            e.semester_ids = [e.semester_id];
            this.dataSource.push(e);
          }
        });
        this._utilsService.setReverseFullname(this.dataSource, 'teacher_name', 'reverse_teacher_name');
      }
    })
  }
  //Lọc
  filter() {
    let i = 0;
    let z = 0;
    let x = 0;
    //năm
    const arr_year = [];
    const ar_year = [];
    this.selectedYear["id"];
    ar_year.push(this.selectedYear["id"])
    arr_year.push('years' + '[' + 0 + ']' + '=' + this.selectedYear["id"]);
    //khối
    const arr_grade = [];
    const ar_grade = [];
    if (this.selectedGradeSearch) {
      this.selectedGradeSearch.forEach(function (items) {
        ar_grade.push(items.id)
      });
    }
    if (this.selectedGradeSearch) {
      this.selectedGradeSearch.forEach(function (items) {
        arr_grade.push('grades' + '[' + i + ']' + '=' + items.id)
        i++;
      });
    }
    //lớp
    const arr_class = [];
    const ar_class = [];
    if (this.selectedClassSearch) {
      this.selectedClassSearch.forEach(function (items) {
        ar_class.push(items.id)
      });
    }
    if (this.selectedClassSearch) {
      this.selectedClassSearch.forEach(function (items) {
        arr_class.push('classes' + '[' + z + ']' + '=' + items.id)
        i++;
      });
    }
    //giáo viên
    const arr_teacher = [];
    if (this.selectedTeacher["teacher_id"]) {
      arr_teacher.push('teachers' + '[' + 0 + ']' + '=' + this.selectedTeacher["teacher_id"])
    } else arr_teacher.push(null)
    let concat_string_year = arr_year.join('&');
    let concat_string_grade = arr_grade.join('&');
    let concat_string_class = arr_class.join('&');
    let concat_string_teacher = arr_teacher.join('&');
    let e = '&'
    this.assignOfTeachingService.listTeachingAssignment(concat_string_year, concat_string_grade, concat_string_class, concat_string_teacher, e).subscribe((teachingAssignData) => {
      if (teachingAssignData["query"]["length"] === 0) {
        this.headerAssign = true;
        this.checkData = false;
        this.dataSource = [];
        this.p = 1
      } else {
        this.headerAssign = true;
        this.checkData = true;
        teachingAssignData["query"];
        this.p = 1
        this.dataSource = [];
        teachingAssignData.query.forEach((e) => {
          // let row = this.dataSource.find(p => p.teacher_id == e.teacher_id && p.grade_id == e.grade_id
          //   && p.subject_id == e.subject_id);
          let row = this.dataSource.find(p => p.teacher_id == e.teacher_id && p.grade_id == e.grade_id
            && p.subject_id == e.subject_id && p.class_id == e.class_id);
          if (row) {
            row.ids.push(e.id);
            // if (!row.class_ids.includes(e.class_id)) {
            //   row.class_ids.push(e.class_id);
            //   row.class_name += ', ' + e.class_name;
            // }
            if (!row.semester_ids.includes(e.semester_id)) {
              row.semester_ids.push(e.semester_id);
              row.semester_name += ', ' + e.semester_name;
            }
          } else {
            e.ids = [e.id];
            e.class_ids = [e.class_id];
            e.semester_ids = [e.semester_id];
            this.dataSource.push(e);
          }
        });
        this._utilsService.setReverseFullname(this.dataSource, 'teacher_name', 'reverse_teacher_name');
      }
    })
  }

  //sửa
  editAssign(item: any) {
    this.resetFormUpdate();
    this.form.controls['teacherUpdate'].disable();
    this.form.controls['gradeUpdate'].disable();
    this.form.controls['subjectUpdate'].disable();

    this.saveItem = JSON.parse(JSON.stringify(item));
    if (item.grade_id !== undefined) {
      this.assignOfTeachingService.listSubjectGrade(this.saveItem.grade_id).subscribe((subjectGradeData) => {
        const ar_subject = [];
        subjectGradeData.query.forEach(function (e) {
          ar_subject.push({
            id: e.id,
            grade_id: e.grade_id,
            name: e.name,
          })
        });
        this.ddlSubjectUpdateData = ar_subject
      })
    } else {
      this.ddlSubjectUpdateData = [];
      this.saveItem.subject_id = null;
    }
    if (this.saveItem.subject_id > 0) {
      //lấy class
      this.assignOfTeachingService.listClassSubject(this.saveItem.subject_id).subscribe((classSubjectData) => {
        this.ddlClassUpdateData = classSubjectData.query;
      });
      //lấy semester
      this.assignOfTeachingService.listSemesterSubject(this.saveItem.subject_id).subscribe((semesterSubjectData) => {
        this.ddlSemesterUpdateData = semesterSubjectData.query
      });
    } else {
      this.ddlClassSearchData = [];
      this.saveItem.class_ids = [];
      this.ddlSemesterUpdateData = [];
      this.saveItem.semester_ids = [];
    }
  }
  //xóa
  deleteAssign(ids: number[]) {
    this._utilsService.showConfirm('Bạn chắc chắn muốn xóa bản ghi này không?', confirm => {
      if (confirm) {
        this.assignOfTeachingService.deleteMany(ids).subscribe(
          (rs) => {
            this.notifyService.showSuccess(
              'Xóa môn học theo lớp thành công!',
              'Thông báo'
            );
            this.filter();
          },
          (error) => {
            if (error.error == 20) {
              this.notifyService.showError("Bản ghi này không còn tồn tại, vui lòng kiểm tra lại!", "Thông báo lỗi");
            } else if (error.error == 37) {
              this.notifyService.showError("id bản ghi truyền vào phải là mảng.", "Thông báo lỗi");
            } else {
              this.notifyService.showError("Xóa thất bại.", "Thông báo lỗi");
            }
          }
        );
      }
    });
  }

  //nút thêm
  resetForm() {
    this.saveItem = {};
    this.ddlSemesterAddData = [];
    this.ddlClassAddData = [];
    this.ddlSubjectAddData = null;
  }
  //rs form sửa
  resetFormUpdate() {
    this.saveItem = {};
  }
  //Lưu khi thêm
  createAssign() {
    if (!(this.saveItem.teacher_id > 0)) {
      this.saveItem.showErrorTeacherId = true;
    }
    if (!(this.saveItem.grade_id > 0)) {
      this.saveItem.showErrorGradeId = true;
    }
    if (!(this.saveItem.subject_id > 0)) {
      this.saveItem.showErrorSubjectId = true;
    }
    if (!this.saveItem.class_ids || this.saveItem.class_ids.length == 0) {
      this.saveItem.showErrorClassId = true;
    }
    if (!this.saveItem.semester_ids || this.saveItem.semester_ids.length == 0) {
      this.saveItem.showErrorSemesterId = true;
    }
    this.submitted = true;
    if (

      this.saveItem.showErrorTeacherId ||
      this.saveItem.showErrorGradeId ||
      this.saveItem.showErrorSubjectId ||
      this.saveItem.showErrorClassId ||
      this.saveItem.showErrorSemesterId
    ) {
      return;
    }
    const year_id = this.currentYear["id"];
    const data = [];
    const data_semester_id = [];
    // if (this.saveItem.class_ids) {
    //   this.saveItem.class_ids.forEach(function (e) {
    //     data.push({ class_id: e });
    //   });
    // }
    this.assignOfTeachingService
      .create(year_id, this.saveItem.teacher_id, this.saveItem.grade_id, this.saveItem.class_ids, this.saveItem.subject_id, this.saveItem.semester_ids)
      .subscribe((res) => {
        this.notifyService.showSuccess(
          "Thêm thành công",
          "Thông báo"
        );
        $("#createModal").modal("hide");
        $(".modal-backdrop").remove();
        this.headerAssign = true;
        this.checkData = true;
        this.filter();
      },
        (error) => {
          if (error.error == 40) {
            this.notifyService.showError("Lỗi đầu vào lớp học", "Thông báo lỗi");
          } else if (error.error == 35) {
            this.notifyService.showError("Lớp học truyền vào không thuộc môn học theo chương trình học", "Thông báo lỗi");
          } else if (error.error == 34) {
            this.notifyService.showError("Bản ghi đã tồn tại", "Thông báo lỗi");
          } else if (error.error == 33) {
            this.notifyService.showError("Không tồn tại môn học thuộc khối", "Thông báo lỗi");
          } else if (error.error == 32) {
            this.notifyService.showError("Học kỳ truyền vào không thuộc môn", "Thông báo lỗi");
          } else if (error.error == 31) {
            this.notifyService.showError("Không tồn tại môn học", "Thông báo lỗi");
          } else if (error.error == 30) {
            this.notifyService.showError("Lỗi đầu vào học kỳ", "Thông báo lỗi");
          } else if (error.error == 29) {
            this.notifyService.showError("Không tồn tại giáo viên", "Thông báo lỗi");
          } else {
            this.notifyService.showError("Lưu thất bại.", "Thông báo lỗi");
          }
        })

  }
  //lưu khi sửa
  updateAssign() {
    if (!this.saveItem.class_ids || this.saveItem.class_ids.length == 0) {
      this.saveItem.showErrorClassId = true;
    }
    if (!this.saveItem.semester_ids || this.saveItem.semester_ids.length == 0) {
      this.saveItem.showErrorSemesterId = true;
    }
    this.submitted = true;
    if (
      this.saveItem.showErrorClassId ||
      this.saveItem.showErrorSemesterId
    ) {
      return;
    }
    const year_id = this.currentYear["id"];
    // const data = [];
    // const semester_id = [];
    // if (this.saveItem.class_ids) {
    //   this.saveItem.class_ids.forEach(class_id => {
    //     data.push({ class_id: class_id });
    //   });
    // }
    this.assignOfTeachingService.update(this.saveItem.ids, year_id, this.saveItem.teacher_id, this.saveItem.grade_id, this.saveItem.class_ids, this.saveItem.subject_id, this.saveItem.semester_ids)
      .subscribe((res) => {
        this.notifyService.showSuccess(
          "Thay đổi thành công",
          "Thông báo"
        );
        $("#updateModal").modal("hide");
        $(".modal-backdrop").remove();
        this.headerAssign = true;
        this.checkData = true;
        this.loadDataGrid();
      },
        (error) => {
          if (error.error == 50) {
            this.notifyService.showError("Lỗi đầu vào", "Thông báo lỗi");
          } else if (error.error == 40) {
            this.notifyService.showError("Lỗi đầu vào lớp học", "Thông báo lỗi");
          } else if (error.error == 36) {
            this.notifyService.showError("Trùng giáo viên dạy môn học", "Thông báo lỗi");
          } else if (error.error == 35) {
            this.notifyService.showError("Lớp học truyền vào không thuộc môn học theo chương trình học", "Thông báo lỗi");
          } else if (error.error == 34) {
            this.notifyService.showError("Tại học kỳ này, môn này của lớp bạn chọn đã được phân công giảng dạy", "Thông báo lỗi");
          } else if (error.error == 33) {
            this.notifyService.showError("Không tồn tại môn học thuộc khối", "Thông báo lỗi");
          } else if (error.error == 32) {
            this.notifyService.showError("Học kỳ truyền vào không thuộc môn", "Thông báo lỗi");
          } else if (error.error == 31) {
            this.notifyService.showError("Không tồn tại môn học", "Thông báo lỗi");
          } else if (error.error == 30) {
            this.notifyService.showError("Lỗi đầu vào học kỳ", "Thông báo lỗi");
          } else if (error.error == 29) {
            this.notifyService.showError("Không tồn tại giáo viên", "Thông báo lỗi");
          } else if (error.error == 11) {
            this.notifyService.showError("Không tồn tại bản ghi", "Thông báo lỗi");
          } else {
            this.notifyService.showError("Lưu thất bại.", "Thông báo lỗi");
          }
        })
  }
  //chọn Khối khi thêm mới
  onSelectGradeAdd(event: any) {

    if (this.saveItem.grade_id > 0) {
      this.saveItem.showErrorGradeId = false;
    }
    this.ddlSubjectAddData = [];
    this.saveItem.subject_id = null;

    this.saveItem.class_ids = [];
    this.ddlClassAddData = [];
    this.saveItem.class_ids = [];

    this.saveItem.semester_ids = [];
    this.ddlSemesterAddData = [];
    this.saveItem.semester_ids = [];
    if (event !== undefined) {
      this.assignOfTeachingService.listSubjectGrade(event.id).subscribe((subjectGradeData) => {
        const ar_subject = [];
        subjectGradeData.query.forEach(function (e) {
          ar_subject.push({
            id: e.id,
            grade_id: e.grade_id,
            name: e.name,
          })
        });
        this.ddlSubjectAddData = ar_subject
      })
    } else {
      this.ddlSubjectAddData = [];
      this.saveItem.subject_id = null;
    }
  }
  //chọn Môn khi thêm mới
  onSelectSubjectAdd(event: any) {
    if (this.saveItem.subject_id > 0) {
      this.saveItem.showErrorSubjectId = false;
    }
    this.saveItem.class_ids = [];
    this.ddlClassAddData = [];
    this.saveItem.class_ids = [];

    this.saveItem.semester_ids = [];
    this.ddlSemesterAddData = [];
    this.saveItem.semester_ids = [];
    if (event !== undefined) {
      this.assignOfTeachingService.listClassSubject(event.id).subscribe((classSubjectData) => {
        const ar_class = [];
        classSubjectData.query.forEach(function (e) {
          ar_class.push({
            class_id: e.class_id,
            name: e.name,
          })
        });
        this.ddlClassAddData = ar_class
      })
      this.assignOfTeachingService.listSemesterSubject(event.id).subscribe((semesterSubjectData) => {
        const ar_semester = [];
        semesterSubjectData.query.forEach(function (e) {
          ar_semester.push({
            semester_id: e.id,
            name: e.name,
          })
        });
        this.ddlSemesterAddData = ar_semester
      })
    } else {
      this.ddlClassAddData = [];
      this.saveItem.class_ids = [];
      this.ddlSemesterAddData = [];
      this.saveItem.semester_ids = [];
    }
  }
  //chọn Lớp khi thêm mới
  onSelectClassAdd(event: any) {
    if (this.saveItem.class_ids) {
      this.saveItem.showErrorClassId = false;
    }
  }

  //chọn Học kỳ khi thêm mới
  onSelectSemesterAdd(event: any) {
    if (this.saveItem.semester_ids) {
      this.saveItem.showErrorSemesterId = false;
    }
  }
  //chọn Lớp khi Cập nhật
  onSelectClassUpdate(event: any) {
    if (this.saveItem.class_ids) {
      this.saveItem.showErrorClassId = false;
    }
  }

  //chọn Học kỳ khi Cập nhật
  onSelectSemesterUpdate(event: any) {
    if (this.saveItem.semester_ids) {
      this.saveItem.showErrorSemesterId = false;
    }
  }


  // get dropdown teacher cho 1 dòng
  // row: dòng muốn get dropdown teacher data
  // teachers_not_assigned: danh sách GV chưa được phân công

  // get dropdown teacher cho tất cả các dòng
  getDropdownTeacherDataForAllRow() {
    if (this.dataSource) {
      // danh sách Id GV đã được phân công trên màn hình hiện tại:
      let teacher_ids_assigneds = this.dataSource.filter(p => p.teacher_id > 0).map(p => p.teacher_id);

      // danh sách GV chưa được phân công:
      let teachers_not_assigned = this.teachersNotAssigned.filter(p => !teacher_ids_assigneds.includes(p.id));
      if (this.teachersNotAssignedTemp && this.teachersNotAssignedTemp.length > 0) {
        // Loại bỏ các giáo viên trùng:
        let teachersNotAssignedTemp = this.teachersNotAssignedTemp.filter(p => !teachers_not_assigned.map(q => q.id).includes(p.id));
        if (teachersNotAssignedTemp && teachersNotAssignedTemp.length > 0) {
          teachers_not_assigned = teachers_not_assigned.concat(JSON.parse(JSON.stringify(teachersNotAssignedTemp)));
        }
      }

    }
  }

  // thay đổi khi chọn giáo viên
  onChangeTeacherIdOnRowData(teacher_id: number) {
    let teacherTemp = null;
    if (teacher_id > 0) {
      this.teachersNotAssignedTemp = this.teachersNotAssignedTemp.filter(p => p.id != teacher_id);
    }
    this.getDropdownTeacherDataForAllRow();
    if (this.saveItem.teacher_id > 0) {
      this.saveItem.showErrorTeacherId = false;
    }
  }

  // thay đổi khi bỏ chọn giáo viên
  onBeforeClearTeacherId(clearingTeacherId: number) {
    let teacherTemp = null;
    if (clearingTeacherId > 0) {
      teacherTemp = this.ddlTeacherSearchData.find(p => p.id == clearingTeacherId);
      if (teacherTemp) {
        this.teachersNotAssignedTemp.push(teacherTemp);
      }
    }
  }

  // onChangeDisplayTeacherName(item, teacher_name) {
  //   item.reverseTeacherName = this._utilsService.getReverseFullname(teacher_name);
  // }
}
