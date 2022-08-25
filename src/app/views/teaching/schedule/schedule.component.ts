import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { element } from "protractor";
import { NotificationService } from "../../../_services/notification.service";
import { UtilityService } from "../../../_services/utils.service";
import { ScheduleService } from "../service/schedule.service";
declare var $: any;
@Component({
  selector: "app-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.scss"],
})
export class ScheduleComponent implements OnInit {

  //teacher
  ddlTeacherData = [];
  ddlTeacherSearchData = [];
  ddlTeacherColumns = [
    { field: 'code', header: 'Mã GV', dataType: 'string' },
    { field: 'name', header: 'Tên GV', dataType: 'string' },
    // { field: 'dob', header: 'Ngày sinh', dataType: 'date' },
  ];
  teachersNotAssigned: any[] = [];
  teachersNotAssignedTemp: any[] = [];
  selectedTeacher: any = {};

  ddlSubject = [];
  saveItem: any = {};

  mor_or_after: number;
  headerData: any;
  headerDataUnder: any[];

  headerSchedule = false;
  dataSource: any[];
  //thứ

  //tiết
  dataTiet = [
    { id: 0, name: "1" },
    { id: 1, name: "2" },
    { id: 2, name: "3" },
    { id: 3, name: "4" },
    { id: 4, name: "5" },
  ];

  morAfIndex: number = 0;

  colSub: any;
  disableStatus = true;
  scheduleTree: any = [];
  // grade
  ddlGradeData = [];
  selectedGrade = [];
  grades: any = [];

  //semester
  ddlSemesterData = [];
  selectedSemester = [];
  semesters: any = [];

  //
  selectedSchedule: any = [];
  //year data
  ddlYearData = [];
  selectedYear = [];
  currentYear = [];
  //dữ liệu chung filter
  filterSaveItems: any = {};
  saveItems: any = {};

  form: FormGroup;
  loadingListSchedule = true;
  loadingSchedule = true;
  activeTab = 0;
  submitted = false;
  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private notifyService: NotificationService,
    private _utilsService: UtilityService
  ) { }
  get f() {
    return this.form.controls;
  }
  // get checkStatus(): any {
  //   return this.form.get('checkStatus');
  // }
  valueCheck: any;
  valueBoolen: any;
  valueDate: any;
  checkDate: boolean;
  checkCurrentDate = true;
  changeDate($event) {
    this.checkCurrentDate = true;
    this.valueCheck = $event.target.validationMessage;
    this.valueBoolen = $event.target.validity.valid;
    this.valueDate = $event.target.value;
    if (
      (this.valueCheck === undefined &&
        this.valueBoolen === undefined &&
        this.valueDate === undefined) ||
      (this.valueCheck === "" &&
        this.valueBoolen === true &&
        this.valueDate === "") ||
      (this.valueCheck !== "" &&
        this.valueBoolen === false &&
        this.valueDate === "")
    ) {
      this.checkDate === false;
    }
    if (
      this.valueCheck === "" &&
      this.valueBoolen === true &&
      this.valueDate !== ""
    ) {
      this.checkDate === true;
    }
  }
  valueCheck2: any;
  valueBoolen2: any;
  valueDate2: any;
  checkDate2: boolean;
  checkCurrentDate2 = true;
  changeDate2($event) {
    this.checkCurrentDate2 = true;
    this.valueCheck2 = $event.target.validationMessage;
    this.valueBoolen2 = $event.target.validity.valid;
    this.valueDate2 = $event.target.value;
    if (
      (this.valueCheck2 === undefined &&
        this.valueBoolen2 === undefined &&
        this.valueDate2 === undefined) ||
      (this.valueCheck2 === "" &&
        this.valueBoolen2 === true &&
        this.valueDate2 === "") ||
      (this.valueCheck2 !== "" &&
        this.valueBoolen2 === false &&
        this.valueDate2 === "")
    ) {
      this.checkDate2 === false;
    }
    if (
      this.valueCheck2 === "" &&
      this.valueBoolen2 === true &&
      this.valueDate2 !== ""
    ) {
      this.checkDate2 === true;
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: new FormControl("", [
        Validators.required,
        Validators.maxLength(100),
      ]),
      start_date: new FormControl("", [Validators.required]),
      end_date: new FormControl("", [Validators.required]),
      grade_id: new FormControl("", [Validators.required]),
      semester_id: new FormControl("", [Validators.required]),
      checkStatus: new FormControl(true),
      subjectName: new FormControl(""),
    });
    this.fullYear();
    this.loadTreeSchedule();
    this.table();
    this.tabs_id = 1;
  }

  //drop năm
  fullYear() {
    this.scheduleService.listYear().subscribe((res) => {
      if (res.years) {
        const result = res.years.map((year) => ({
          id: year.id,
          name: year.start_year + "-" + year.end_year,
        }));
        this.ddlYearData = result;
        this.filterSaveItems.year = res.id_current_year;
      }
    });
  }
  //dữ liệu cây thư mục thời khóa biểu
  loadTreeSchedule() {
    this.loadingListSchedule = true;
    this.loadingSchedule = true;
    const year_id = JSON.parse(localStorage.getItem("year_data"));
    this.scheduleService.listTreeSchedule(year_id.id).subscribe((result) => {
      const mapSchedule = [];
      const scheduleData = result["query"];

      // Nhóm danh sách chương trình học theo học kỳ -> học kỳ -> khối
      const groupBy = (key) => (array) =>
        array.reduce((objectsByKeyValue, obj) => {
          const value = obj[key];
          objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(
            obj
          );
          return objectsByKeyValue;
        }, {});
      const groupByGrade = groupBy("grade_name");
      const groupBySemester = groupBy("semester_name");
      const gradeID = groupByGrade(scheduleData);

      Object.keys(gradeID).map(function (key, index) {
        const semesterDataSort = Object.entries(groupBySemester(gradeID[key]));
        mapSchedule.push(
          Object.entries({
            [gradeID[key][0]["grade_name"]]: semesterDataSort,
          })
        );
      });
      this.scheduleTree = mapSchedule;
      this.loadingListSchedule = false;
      this.loadingSchedule = false;
    });
  }
  table() {
    this.headerData = [
      { field: "dow", value: "Thứ", isDynamicCol: false },
      { field: "lesson", value: "Tiết", isDynamicCol: false },
    ];
  }
  //list giáo viên
  getAllTeacher(){
    this.scheduleService.listTeachingAssignment(this.filterSaveItems.year,this.selectedSchedule[0].grade_id)
    .subscribe((teacherData) => {
      if (teacherData.query) {
        const arr_Teacher = [];
        teacherData.query.forEach(function (e) {
          arr_Teacher.push({
            id: e.id,
            code: e.code_teacher,
            name: e.lastname + " " + e.firstname,
            teacher_id: e.teacher_id
            // dob: e.dob
          })
        })
        this.ddlTeacherSearchData = arr_Teacher;
      }
    })
  }
  headerBindding = [
    { field: "weekday", value: "Thứ"},
    { field: "lesson", value: "Tiết"},
    { field: "detail", value: "Chi tiết"},

  ];

  getHeadSchedule(data) {
    // let cols = class_name.length;
    this.headerData = [
      { field: "dow", value: "Thứ", isDynamicCol: false },
      { field: "lesson", value: "Tiết", isDynamicCol: false },
    ];
    data.forEach((e) => {
      this.headerData.push({ field: "class_" + e.id, value: e.name });

      this.headerDataUnder.push(
        {field: "class_" + e.id ,value: "Môn học",sub: 'subject',},
        {field: "class_" + e.id ,value: "Giáo viên",sub: 'teacher',}
      );


    });
  }
  tabs = [
    {id:1,name:'Buổi sáng'},
    {id:2,name:'Buổi chiều'},
  ];
  tabs_id:any;
  changeTab(event) {
    this.tabs_id = event == 1 ? 1 : 2;
    this.dataSource = [];
    this.loadScheduleDetail();
  }

  // nút thêm
  create_schedule() {
    // this.saveItems = {};
    // this.saveItems.grade = {};
    // this.saveItems.semester = {};
    this.selectedGrade = [];
    this.selectedSemester = [];
    this.form.controls["start_date"].enable();
    this.form.controls["end_date"].enable();
    this.form.controls["grade_id"].enable();
    this.form.controls["semester_id"].enable();
    this.form.get("name").clearValidators();
    this.form.get("name").setValue("");
    this.form.get("start_date").clearValidators();
    this.form.get("start_date").setValue("");
    this.form.get("end_date").clearValidators();
    this.form.get("end_date").setValue("");
    this.form.get("grade_id").clearValidators();
    // this.selectedGrade = [];
    this.form.get("semester_id").clearValidators();
    // this.selectedSemester = [];
    const yearId = JSON.parse(localStorage.getItem("year_data"));
    this.scheduleService.listGrade(yearId.id).subscribe((res) => {
      this.grades = res["query"];
      this.ddlGradeData = res["query"];
    });
    this.ddlSemesterData = [];
  }
  //Chọn grade
  onSelectGrade(item) {
    // this.saveItems.semester = {};
    this.selectedSemester = [];
    this.ddlSemesterData = [];
    const yearId = JSON.parse(localStorage.getItem("year_data"));
    this.scheduleService
      .listSemester(yearId.id, item["level"])
      .subscribe((res) => {
        this.ddlSemesterData = res["query"];
      });
  }
  // nút sửa
  edit_schedule() {
    this.form.controls["start_date"].disable();
    this.form.controls["end_date"].disable();
    this.form.controls["grade_id"].disable();
    this.form.controls["semester_id"].disable();
    if (this.selectedSchedule.length <= 0) {
      this.notifyService.showWarning(
        "Vui lòng chọn thời khóa biểu cần chỉnh sửa!",
        "Thông báo"
      );
    } else {
      $("#updateScheduleModal").modal("show");
    }
  }
  //nút xóa
  delete_schedule() {
    this._utilsService.showConfirm(
      "Bạn chắc chắn muốn xóa bản ghi này không?",
      (confirm) => {
        if (confirm) {
          this.scheduleService
            .deleteTree(this.selectedSchedule[0].id)
            .subscribe(
              (res) => {
                this.notifyService.showSuccess(
                  "Xóa thời khóa biểu thành công!",
                  "Thông báo"
                );
                this.loadTreeSchedule();
                this.loadingListSchedule = true;
              },
              (error) => {
                if (error.error == 10) {
                  this.notifyService.showError(
                    "Bản ghi không tồn tại, vui lòng kiểm tra lại!",
                    "Thông báo lỗi"
                  );
                } else {
                  this.notifyService.showError(
                    "Xóa thất bại.",
                    "Thông báo lỗi"
                  );
                }
              }
            );
        }
      }
    );
  }
  //nút sao chép
  copy_schedule() {
    if (this.selectedSchedule.length <= 0) {
      this.notifyService.showWarning(
        "Vui lòng chọn thời khóa biểu muốn sao chép!",
        "Thông báo"
      );
    } else {
      this.form.get("name").clearValidators();
      this.form.get("name").setValue("");
      $("#copyScheduleModal").modal("show");
    }
  }

  //Lưu khi thêm thời khóa biểu
  createSchedule() {
    this.form
      .get("name")
      .setValidators([Validators.required, Validators.maxLength(100)]);
    this.form.get("name").updateValueAndValidity();
    this.form.get("start_date").setValidators([Validators.required]);
    this.form.get("start_date").updateValueAndValidity();
    this.form.get("end_date").setValidators([Validators.required]);
    this.form.get("end_date").updateValueAndValidity();
    this.form.get("grade_id").setValidators([Validators.required]);
    this.form.get("grade_id").updateValueAndValidity();
    this.form.get("semester_id").setValidators([Validators.required]);
    this.form.get("semester_id").updateValueAndValidity();
    this.submitted = true;
    if (
      this.form.controls["name"].invalid ||
      this.form.controls["start_date"].invalid ||
      this.form.controls["end_date"].invalid ||
      this.form.controls["grade_id"].invalid ||
      this.form.controls["semester_id"].invalid
    ) {
      return;
    }
    let formData = new FormData();
    const name = this.form.controls["name"].value;
    const start_date = this.form.controls["start_date"].value;
    const end_date = this.form.controls["end_date"].value;
    const grade_id = this.form.controls["grade_id"].value;
    const semester_id = this.form.controls["semester_id"].value;
    const year_id = JSON.parse(localStorage.getItem("year_data"));
    if (name) {
      formData.append("name", name);
    }
    if (start_date) {
      formData.append("start_date", start_date);
    }
    if (end_date) {
      formData.append("end_date", end_date);
    }
    if (grade_id) {
      formData.append("grade_id", grade_id);
    }
    if (semester_id) {
      formData.append("semester_id", semester_id);
    }
    if (year_id) {
      formData.append("year_id", year_id.id);
    }
    this.scheduleService.createTreeSchedule(formData).subscribe(
      (res) => {
        if (res.message == "success") {
          this.notifyService.showSuccess(
            "Thêm mới thời khóa biểu thành công.",
            "Thông báo"
          );
          $("#createScheduleModal").modal("hide");
          $(".modal-backdrop").remove();
        } else {
          this.notifyService.showInfo(
            "Thêm thời khóa biểu không thành công.",
            "Thông báo"
          );
        }
        this.loadTreeSchedule();
        this.loadingListSchedule = true;
      },
      (error) => {
        if (error.errors == 11) {
          this.notifyService.showError("Không tồn tại học kỳ", "Thông báo lỗi");
        } else if (error.error == 12) {
          this.notifyService.showError(
            "không tồn tại khối khi truyền vào",
            "Thông báo lỗi"
          );
        } else if (error.error == 21) {
          this.notifyService.showError(
            "Thời gian truyền vào không hợp lệ",
            "Thông báo lỗi"
          );
        } else if (error.error == 22) {
          this.notifyService.showError(
            "Thời gian truyền vào không hợp lệ",
            "Thông báo lỗi"
          );
        } else if (error.error == 23) {
          this.notifyService.showError(
            "Thời gian truyền vào không hợp lệ",
            "Thông báo lỗi"
          );
        } else if (error.error == 24) {
          this.notifyService.showError(
            "Thời gian truyền vào không hợp lệ",
            "Thông báo lỗi"
          );
        } else {
          this.notifyService.showError("Lưu thất bại.", "Thông báo lỗi");
        }
      }
    );
  }
  //lưu khi sửa thời khóa biểu
  saveSchedule() {
    this.selectedSchedule[0].id;
    this.form
      .get("name")
      .setValidators([Validators.required, Validators.maxLength(100)]);
    this.form.get("name").updateValueAndValidity();
    this.form.get("start_date").setValidators([Validators.required]);
    this.form.get("start_date").updateValueAndValidity();
    this.form.get("end_date").setValidators([Validators.required]);
    this.form.get("end_date").updateValueAndValidity();
    this.form.get("grade_id").setValidators([Validators.required]);
    this.form.get("grade_id").updateValueAndValidity();
    this.form.get("semester_id").setValidators([Validators.required]);
    this.form.get("semester_id").updateValueAndValidity();
    this.submitted = true;
    if (
      this.form.controls["name"].invalid ||
      this.form.controls["start_date"].invalid ||
      this.form.controls["end_date"].invalid ||
      this.form.controls["grade_id"].invalid ||
      this.form.controls["semester_id"].invalid
    ) {
      return;
    }
    const name = this.form.controls["name"].value;
    let status;
    if (this.form.controls["checkStatus"].value == true) {
      status = 1;
    } else {
      status = 0;
    }
    let data = { name: name, status: status };
    this.scheduleService.editTree(this.selectedSchedule[0].id, data).subscribe(
      (res) => {
        if (res.message == "success") {
          this.notifyService.showSuccess(
            "Thay đổi thời khóa biểu thành công.",
            "Thông báo"
          );
          $("#updateScheduleModal").modal("hide");
          $(".modal-backdrop").remove();
        } else {
          this.notifyService.showInfo(
            "Thay đổi thời khóa biểu không thành công.",
            "Thông báo"
          );
        }
        this.loadTreeSchedule();
        this.loadingListSchedule = true;
      },
      (error) => {
        if (error.errors == 10) {
          this.notifyService.showError(
            "Bản ghi không tồn tại",
            "Thông báo lỗi"
          );
        } else if (error.errors == 11) {
          this.notifyService.showError("Không tồn tại học kỳ", "Thông báo lỗi");
        } else if (error.error == 12) {
          this.notifyService.showError(
            "không tồn tại khối khi truyền vào",
            "Thông báo lỗi"
          );
        } else if (error.error == 21) {
          this.notifyService.showError(
            "Thời gian truyền vào không hợp lệ",
            "Thông báo lỗi"
          );
        } else if (error.error == 22) {
          this.notifyService.showError(
            "Thời gian truyền vào không hợp lệ",
            "Thông báo lỗi"
          );
        } else if (error.error == 23) {
          this.notifyService.showError(
            "Thời gian truyền vào không hợp lệ",
            "Thông báo lỗi"
          );
        } else if (error.error == 24) {
          this.notifyService.showError(
            "Thời gian truyền vào không hợp lệ",
            "Thông báo lỗi"
          );
        } else {
          this.notifyService.showError("Lưu thất bại.", "Thông báo lỗi");
        }
      }
    );
  }
  //Lưu khi sao chép tkb
  copySchedule() {
    this.selectedSchedule[0].id;
    this.form
      .get("name")
      .setValidators([Validators.required, Validators.maxLength(100)]);
    this.form.get("name").updateValueAndValidity();

    this.submitted = true;
    if (this.form.controls["name"].invalid) {
      return;
    }
    const name = this.form.controls["name"].value;
    let data = { name: name };
    this.scheduleService.copyTree(this.selectedSchedule[0].id, data).subscribe(
      (res) => {
        if (res.message == "success") {
          this.notifyService.showSuccess(
            "Sao chép thời khóa biểu thành công.",
            "Thông báo"
          );
          $("#updateScheduleModal").modal("hide");
          $(".modal-backdrop").remove();
        } else {
          this.notifyService.showInfo(
            "Sao chép thời khóa biểu không thành công.",
            "Thông báo"
          );
        }
        this.loadTreeSchedule();
        this.loadingListSchedule = true;
      },
      (error) => {
        if (error.errors == 10) {
          this.notifyService.showError(
            "Bản ghi không tồn tại",
            "Thông báo lỗi"
          );
        } else if (error.errors == 4) {
          this.notifyService.showError(
            "Tên danh mục đã tồn tại",
            "Thông báo lỗi"
          );
        } else {
          this.notifyService.showError("Sao chép thất bại.", "Thông báo lỗi");
        }
      }
    );
  }

  setUpdateScheduleData(level, id, gradeId, semesterId, name, start_date, end_date, status) {
    this.headerData = [];
    this.headerDataUnder = [];

    this.selectedSchedule = [];
    const scheduleSelected = [];

    scheduleSelected.push({
      id: id,
      grade_id: gradeId,
      semester_id: semesterId,
      name: name,
      level: level,
      start_date: start_date,
      end_date: end_date,
      status: status,
    });

    this.selectedSchedule = scheduleSelected;
    this.loadScheduleDetail();
  }

  lessonDetail(data: any, key: any, value: any) {
    let lessonData = [];

    const lessonLength = [];
    for (let i = 0; i < 6; i++) {
      const lesson = [];

      if (data.data_class && data.detail_schedule) {
        if (value != "0") {
          let foundDetailSchedule = data.detail_schedule.find(
            (elmSchedule) =>
              elmSchedule.dow == key && elmSchedule.lesson == i + 1
          );
          if (
            foundDetailSchedule &&
            JSON.parse(foundDetailSchedule.information)
          ) {
            data.data_class.forEach((elmClass) => {
              let foundDetailScheduleInformation = JSON.parse(
                foundDetailSchedule.information
              ).find((elmInfo) => elmClass.id == elmInfo.class_id);
              if (foundDetailScheduleInformation) {
                lesson.push({
                  lessonNumber: i + 1,
                  ["class_" +
                    foundDetailScheduleInformation.class_id]: foundDetailScheduleInformation.class_id,
                  ["class_" +
                    foundDetailScheduleInformation.class_id +
                    "_subject"]: foundDetailScheduleInformation.subject_id,
                  ["class_" +
                    foundDetailScheduleInformation.teacher_id +
                    "_teacher"]: foundDetailScheduleInformation.teacher_id,
                });
              }
            });

            lessonData.push({
              [i]: lesson,
            });
          }
        }
        // });
      }
    }
    return lessonData;
  }

  //nút lưu
  save_schedule() { }
  //Nhập tệp
  upload_schedule() { }

  loadScheduleDetail() {
    this.getAllTeacher();
    if ((this.tabs_id == 1)) {
      this.mor_or_after = 0;
    } else {
      this.mor_or_after = 1;
    }

    if (this.selectedSchedule[0].grade_id) {
      if (this.selectedSchedule.length > 0) {
        this.loadingSchedule = true;
      /*lấy dữ liệu lớp bindding header*/
        this.scheduleService.detailSchedule(this.selectedSchedule[0].id, this.mor_or_after, this.selectedSchedule[0].grade_id, this.selectedSchedule[0].semester_id, this.selectedSchedule[0].level, this.filterSaveItems.year)
          .subscribe((data) => {
            /*Dữ liệu môn hoc*/
            this.ddlSubject = data.subjects;
            /*End*/
            /*Dữ liệu lớp*/
            var data_class = data.data_class;
            if (data_class.length > 0) {
              this.headerSchedule = true;
              this.getHeadSchedule(data_class);
              this.loadingSchedule = false;
            } else {
              this.loadingSchedule = false;
              this.headerSchedule = false;
            }
            /*End*/

            /* Dữ liệu thứ ngày tháng */
            let weekdays = JSON.parse(data.weekdays['weekdays']);
            let lesson = [1,2,3,4,5,6];
            var schedule = data.detail_schedule;
            if (weekdays) {
              const dataBinding = [];
              Object.keys(weekdays).forEach((el)=>{
                var dataChild = {};
                dataChild['weekday'] = {key: el, value: weekdays[el]};
                var detail = [];
                /*lesson*/
                lesson.forEach((el_lesson)=>{

                  let found = schedule.find((el_schedule)=>{
                    if(el_schedule.dow == el && el_schedule.lesson == el_lesson){
                      return true;
                    }
                  })
                  //Phải có thêm vòng lặp - theo lớp
                  // let detail_child = {};
                  let infor = {};
                  if(found){
                    var json_decode_infor = JSON.parse(found['information']);

                    data_class.forEach((el_class) => {
                      let found_class = json_decode_infor.find((e)=>{
                        return el_class.id == e.class_id;
                      })

                      let found_subject = this.ddlSubject.find((a)=>{
                        return a.id == found_class.subject_id;
                      })

                      let found_teacher = this.ddlTeacherSearchData.find((b)=>{
                        return b.teacher_id == found_class.teacher_id;
                      })
                      // let found_subject = this.ddlSubject.find((a)=>{
                      //   if(a.id == el_information.subject_id){
                      //     return true;
                      //   }
                      // })
                      // let found_teacher = this.ddlTeacherSearchData.find((b)=>{
                      //   if(b.teacher_id == el_information.teacher_id){
                      //     return true;
                      //   }
                      // })

                      if(found_class){
                        infor['class_'+el_class.id]={
                          subject_id:found_subject['id'],subject_name:found_subject['name'],
                          teacher_id:found_teacher['teacher_id'],teacher_name:found_teacher['name']}
                      }else{
                        infor['class_'+el_class.id]={
                          subject_id:'',subject_name:'',
                          teacher_id:'',teacher_name:''}
                      }

                    });
                    // let infor = {};
                    // JSON.parse(found['information']).forEach((el_information)=>{

                    //   let found_subject = this.ddlSubject.find((a)=>{
                    //     if(a.id == el_information.subject_id){
                    //       return true;
                    //     }
                    //   })
                    //   let found_teacher = this.ddlTeacherSearchData.find((b)=>{
                    //     if(b.teacher_id == el_information.teacher_id){
                    //       return true;
                    //     }
                    //   })
                    //   infor['class_'+el_information['class_id']]={
                    //     subject_id:found_subject['id'],subject_name:found_subject['name'],
                    //     teacher_id:found_teacher['teacher_id'],teacher_name:found_teacher['name']}
                    // });
                    detail.push({lesson:el_lesson,information_detail:infor});
                    // detail_child = {'id'}

                  }else{
                    detail.push({lesson:el_lesson,information:[1,2,3]});
                  }
                /*-end-*/
                })
                dataChild['information'] = detail;
                dataBinding.push(dataChild);
              })

              this.dataSource = dataBinding;
            }else{
              alert('Chưa cấu hình weekdays');
            }
            /*-End-*/
          });
      }
    }
  }

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
}
