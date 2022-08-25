import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { error } from 'protractor';
import { isBuffer } from 'util';
import { CommonService } from "../../../_services/common.service";
import { NotificationService } from "../../../_services/notification.service";
import { UtilityService } from '../../../_services/utils.service';
import { AssignHomeroomTeachingService } from "../service/assign-homeroom-teaching.service";

@Component({
  selector: "app-assign-homeroom-teaching",
  templateUrl: "./assign-homeroom-teaching.component.html",
  styleUrls: ["./assign-homeroom-teaching.component.scss"],
})
export class AssignHomeroomTeachingComponent implements OnInit {
  //year data
  ddlYearData = [];
  selectedYear = [];
  currentYear = [];

  minDate: string;
  maxDate: string;
  form: FormGroup;
  // assignHomeroomTeaching: FormGroup;
  p: number = 1;
  countPage: number = 10;
  perPageSelected(id: number) {
    this.countPage = id;
    this.p = 1;
  }
  //data
  dataGrid = [];
  //data class
  classData = [];
  //header
  headerAssignHomeroomTeaching = false;
  // headerAssignHomeroomTeaching = true;
  //check du lieu bang
  checkTable = false;
  // checkTable = true;
  //dữ liệu không tồn tại
  checkData = true;

  // drop grade
  ddlGradeData = [];
  ddlGradeSearchData = [];
  selectedGradeSearch = [];

  //dropdown giáo viên
  ddlTeacher = [];
  ddlTeacherColumns = [
    { field: 'code', header: 'Mã GV', dataType: 'string' },
    { field: 'fullName', header: 'Tên GV', dataType: 'string' },
    { field: 'dob', header: 'Ngày sinh', dataType: 'date' },
  ];
  teachersNotAssigned: any[] = [];
  teachersNotAssignedTemp: any[] = [];

  //load lại filter
  loadingFilter = false;

  dataSource: any[];
  dataPaged: any[];

  constructor(
    private fb: FormBuilder,
    private assignHomeroomTeachingService: AssignHomeroomTeachingService,
    private notifyService: NotificationService,
    private _utilsService: UtilityService
  ) { }
  get f() {
    return this.form.controls;
  }
  ngOnInit() {
    this.form = this.fb.group({
      grade: new FormControl(""),
      year: new FormControl(""),
      search: new FormControl(""),
    });
    //setting dropdown năm học
    this.assignHomeroomTeachingService
      .listYear()
      .subscribe((data) => {
        const selectedYearData = [];
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

        //Đổ dữ liệu grades
        this.assignHomeroomTeachingService
          .getGradeList(data["id_current_year"])
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
            // getGradesData.sort(this.compare);
            this.assignHomeroomTeachingService
              .getGradeList([data["id_current_year"]])
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
              });
          });
      });

    // lấy danh sách tất cả giáo viên
    this.assignHomeroomTeachingService.getAllTeacher().subscribe((rs) => {
      if (rs.query) {
        this.ddlTeacher = rs.query.map(p => {
          return {
            id: p.id,
            code: p.code,
            fullName: p.lastname + " " + p.firstname,
            dob: p.dob
          }
        });
      }
    });

    this.getTeachersNotAssigned();
  }

  // lấy danh sách giáo viên chưa được phân công giảng dạy.
  getTeachersNotAssigned(callback: Function = null) {
    this.teachersNotAssignedTemp = [];
    this.assignHomeroomTeachingService.getTeachersNotAssigned().subscribe((rs) => {
      if (rs.query && rs.query.length > 0) {
        this.teachersNotAssigned = rs.query.map(p => {
          return {
            id: p.id,
            code: p.code,
            fullName: p.lastname + " " + p.firstname,
            dob: p.dob
          }
        });
      } else {
        this.teachersNotAssigned = [];
      }
      if (callback) callback();
    });
  }

  // get dropdown teacher cho 1 dòng
  // row: dòng muốn get dropdown teacher data
  // teachers_not_assigned: danh sách GV chưa được phân công
  getDropdownTeacherDataForRow(row: any, teachers_not_assigned: any[]): any[] {
    let currentTeacher = null; // giáo viên của dòng hiện tại.
    if (row.teacher_id > 0) {
      currentTeacher = this.ddlTeacher.find(p => p.id == (row.teacher_id));
    }
    let rs = JSON.parse(JSON.stringify(teachers_not_assigned || []));
    if (currentTeacher && !rs.some(p => p.id == currentTeacher.id)) {
      rs.push(JSON.parse(JSON.stringify(currentTeacher)));
    }
    rs.sort((a, b) => { return (a.code || '').localeCompare(b.code || ''); });
    return rs;
  }

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
      this.dataSource.forEach(row => {
        row.ddlTeacher = this.getDropdownTeacherDataForRow(row, teachers_not_assigned);
      });
    }
  }

  // thay đổi khi chọn giáo viên
  onChangeTeacherIdOnRowData(teacher_id: number) {
    let teacherTemp = null;
    if (teacher_id > 0) {
      this.teachersNotAssignedTemp = this.teachersNotAssignedTemp.filter(p => p.id != teacher_id);
    }
    this.getDropdownTeacherDataForAllRow();
  }

  // thay đổi khi bỏ chọn giáo viên
  onBeforeClearTeacherId(clearingTeacherId: number) {
    let teacherTemp = null;
    if (clearingTeacherId > 0) {
      teacherTemp = this.ddlTeacher.find(p => p.id == clearingTeacherId);
      if (teacherTemp) {
        this.teachersNotAssignedTemp.push(teacherTemp);
      }
    }
  }

  onChangeDisplayTeacherName(item, teacher_name) {
    item.reverseTeacherName = this._utilsService.getReverseFullname(teacher_name);
  }

  //sk change year
  onSelectYear(item: any) {
    this.selectedGradeSearch = [];
    if (item !== undefined) {
      const arrSubject = [];
      this.assignHomeroomTeachingService
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
  //chọn  nhiều
  selectAllGradeSearch(ddlGradeSearchData) {
    this.selectedGradeSearch = ddlGradeSearchData;
  }
  //bỏ chọn nhiều
  deSelectAllGradeSearch() {
    this.selectedGradeSearch = [];
  }
  //Lọc
  filter() {
    let search = this.form.controls["search"].value;
    this.loadingFilter = true;
    this.teachersNotAssignedTemp = [];
    const arr_year = [];
    const ar_year = [];
    this.selectedYear["id"];
    ar_year.push(this.selectedYear["id"])
    arr_year.push('years' + '[' + 0 + ']' + '=' + this.selectedYear["id"]);
    const arr_grade = [];
    const ar_grade = [];
    let i = 0;
    if (this.selectedGradeSearch) {
      this.selectedGradeSearch.forEach(function (items) {
        ar_grade.push(items["id"])
      });
    }
    if (this.selectedGradeSearch) {
      this.selectedGradeSearch.forEach(function (items) {
        arr_grade.push('grades' + '[' + i + ']' + '=' + items["id"])
        i++;
      });
    }
    let concat_string = arr_year.join('&');
    let concat_string2 = arr_grade.join('&');
    let status = 1;
    // if(search == "" ){
    //   search = "";
    this.assignHomeroomTeachingService
      .listClass(ar_year, ar_grade, status)
      .subscribe((res) => {
        this.loadingFilter = false;
        if (res["classes"]["length"] === 0) {
          this.headerAssignHomeroomTeaching = true; //hiện header
          this.checkTable = true; //không có dữ liệu table
          this.checkData = false; //dữ liệu không tồn tại
          this.dataSource = [];
          this.classData = [];
          this.p = 1;
        } else {
          this.headerAssignHomeroomTeaching = true; //hiện header
          this.checkTable = true; //không có dữ liệu table
          this.checkData = true; //dữ liệu không tồn tại
          this.classData = res["classes"];
          this.p = 1;
        }
        //list danh sách ra grid
        let x = '&'
        this.assignHomeroomTeachingService
          .listAssignHomeroomTeaching(search, concat_string, concat_string2, x)
          .subscribe((result) => {
            if (search == "") {
              // this.classData.sort(this.compare);
              this.dataSource = [];
              this.classData.forEach(item => {
                let a = null;
                if (result.query) {
                  a = result.query.find(p => p.class_id == item.class_id && p.grade_id == item.grade_id);
                }
                this.dataSource.push({
                  id: a != null ? a.id : null,
                  class_id: item.class_id,
                  class_name: item.name,
                  grade_id: item.grade_id,
                  grade_name: item.grade_name,
                  teacher_id: a != null ? a.teacher_id : null,
                  teacher_name: a != null ? a.lastname + ' ' + a.firstname : null
                });
              });
            }
            else {
              if (result['query']['length'] === 0) {
                this.headerAssignHomeroomTeaching = true; //hiện header
                this.checkTable = true; // có dữ liệu table
                this.checkData = false; // không dữ liệu
                this.dataSource = [];
                this.classData = [];
                this.p = 1;
              } else {
                this.headerAssignHomeroomTeaching = true; //hiện header
                this.checkTable = true; // có dữ liệu table
                this.checkData = true; // có dữ liệu
                this.classData = result['query'];
                this.p = 1;
                this.dataSource = [];
                this.classData.forEach(item => {
                  this.dataSource.push({
                    id: item.id,
                    class_id: item.class_id,
                    class_name: item.class_name,
                    grade_id: item.grade_id,
                    grade_name: item.grade_name,
                    teacher_id: item.teacher_id,
                    teacher_name: item.lastname + ' ' + item.firstname
                  });
                });
              }
            }
            this._utilsService.setReverseFullname(this.dataSource, "teacher_name", "reverseTeacherName")
            this.getDropdownTeacherDataForAllRow();
          });

      });
  }

  //tìm kiếm
  searchTeacher(search: any) {
    this.filter();
  }

  setTeacherName(data) {
    if (data) {
      data.forEach(e => {
        let teacher = this.ddlTeacher.find(p => p.id == e.teacher_id);
        if (teacher) {
          e.teacher_name = teacher.fullName;
          e.reverseTeacherName = this._utilsService.getReverseFullname(e.teacher_name);
        }
      });
    }
  }

  //Lưu
  save() {
    const year = this.form.controls["year"].value;
    let data = { year_id: year.id, data: this.dataSource };
    this.assignHomeroomTeachingService.saveTeacher(data).subscribe((res) => {
      this.notifyService.showSuccess("Lưu thành công", "Thông báo");
      // this.filter();
      this.getTeachersNotAssigned(() => {
        // this.filter();
      });
    }, (error) => {
      switch (error) {
        case 11:
          this.notifyService.showError('Lớp học không đúng năm, hãy kiểm tra lại.', 'Thông báo');
          break;
        case 12:
          this.notifyService.showError('Giáo viên không tồn tại.', 'Thông báo');
          break;
        // case 1:
        //   this.notifyService.showError('Lớp học không đúng năm, hãy kiểm tra lại.', 'Thông báo');
        //   break;
        default:
          this.notifyService.showError(`Có lỗi xảy ra, error: ${error}`, 'Thông báo');
          break;
      }
    });
  }
}
