import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { unwatchFile } from "fs";
import { pipe } from "rxjs";
import { isBuffer } from "util";
import { CommonService } from "../../../_services/common.service";
import { NotificationService } from "../../../_services/notification.service";
import { PeriodicAssessmentService } from "../service/periodic-assessment.service";

declare var $: any;
@Component({
  selector: "app-periodic-assessment",
  templateUrl: "./periodic-assessment.component.html",
  styleUrls: ["./periodic-assessment.component.scss"],
})
export class PeriodicAssessmentComponent implements OnInit {
  @ViewChild("selecselectConment") selectConment: ElementRef;
  //index của môn học
  subjectIndex: number = 0;
  //dữ liệu môn
  subjectData: any[];
  //length dshs
  countStudent: any;
  countChecked = [];

  //aray data student
  ddlStudentData = [];

  //aray data level
  ddlLevelData = [];

  //check du lieu tab
  checkTabTable = true;
  checkTabTable1 = true

  //check du lieu bang
  checkTable = false;
  //model Điểm kiểm tra định kỳ
  showPeriodicScore: any;
  //model Điểm đọc
  showReadScore: any;
  //model Điểm viết
  showWriteScore: any;

  showCompleteLevel: any;
  showCompleteLevelAvg: any;

  // ex_periodic: String;
  avgL: number;
  avgM: number;
  submitted = false;
  value_id: any;
  checked: boolean;

  //lưu dữ liệu đánh giá
  selectedPeriodicAssessment: any = [];
  form: FormGroup;
  periodicAssessment: FormGroup;
  isChecked: any;
  headerPeriodicAssessment = false;
  detail_study_program_id: any;
  detail_study_program_id_add: any;
  subject_id: any;
  subject_type: any;
  study_id: any;
  detail_id: any;
  detail_id_add: any;

  //year data
  ddlYearData = [];
  selectedYear = [];
  currentYear = [];

  //class data
  ddlClassData = [];
  selectedClass = [];

  //semester data
  ddlSemesterData = [];
  selectedSemester = [];
  loadingFilter = false;
  p: number = 1;
  countPage: number = 10;
  totalItems = 0;
  minDate: string;
  maxDate: string;
  perPageSelected(id: number) {
    this.countPage = id;
    this.p = 1;
  }
  //lấy id checkbox
  getArrayChecboxId = [];
  //dữ liệu drop mức độ hoàn thành
  ddlCompleteLevel = [];
  selectedCompleteLevel = [];
  //dữ liệu mẫu nhận xét
  ddlContentComments = [];
  selectedContentComments = [];
  listTab: any;

  checkTab: number;
  check_subject_id: number;
  check_detail_study_program_id: number;
  check_detail_study_program_id_add: any;
  check_subject_type_add: any;

  constructor(
    private fb: FormBuilder,
    private perodicAssessmentService: PeriodicAssessmentService,
    private yearService: CommonService,
    private notifyService: NotificationService
  ) {
    this.periodicAssessment = this.fb.group({
      // items: [null, Validators.required],
      // items_value: ['no', Validators.required],
      periodicAssessmentDetails: this.fb.array([]),
    });
  }
  get f() {
    return this.form.controls;
  }
  ngOnInit() {
    this.ddlCompleteLevel = [
      { id: 0, name: "Hoàn thành tốt", value: 9 },
      { id: 1, name: "Hoàn thành", value: 8 },
      { id: 2, name: "Chưa hoàn thành", value: 4 },
    ];
    this.form = this.fb.group({
      year: new FormControl(""),
      class: new FormControl(""),
      semester: new FormControl(""),
      completeLevel: new FormControl("", [Validators.required]),
      contentComments: new FormControl("", [Validators.required]),
      read_score: new FormControl("", [Validators.required]),
      write_score: new FormControl("", [Validators.required]),
      periodic_score: new FormControl("", [Validators.required]),
      // idCheckAll: new FormControl(false),
    });
    this.perodicAssessmentService
      .listCommentSubject()
      .pipe()
      .subscribe((result) => {
        const dtCommentSubject = [];
        result["query"].forEach(function (cont) {
          dtCommentSubject.push({ name: cont.content });
        });
        this.ddlContentComments = dtCommentSubject;
      });
    //setting dropdown năm học
    this.perodicAssessmentService
      .listYear()
      .pipe()
      .subscribe((data) => {
        const selectedYearData = [];
        const fullYear = [];
        const limitYear = [];
        const idCurrentYear = data["id_current_year"];
        let currentYearData;
        let currentArrYearData;
        // const currentArrYearData = [];
        data["years"].forEach(function (item) {
          fullYear.push({
            id: item["id"],
            name: item["start_year"] + " - " + item["end_year"],
          });
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
            currentArrYearData = {
              id: item["id"],
              name: item["start_year"] + " - " + item["end_year"],
            };
            // currentArrYearData.push({id: item['id'],name: item['start_year'] + ' - ' + item['end_year']});
          }
        });
        this.ddlYearData = fullYear;
        // this.yearDataUpdate = limitYear;
        // this.selectedYearSearch = currentArrYearData;
        this.selectedYear = currentYearData;
        // this.mapYear([idCurrentYear]);
        const minYear = currentArrYearData.name.substring(0, 4);
        const maxYear = currentArrYearData.name.substring(
          currentArrYearData.name.length - 4,
          currentArrYearData.name.length
        );
        this.minDate = minYear + "-01-01";
        this.maxDate = maxYear + "-12-31";
        //đổ dữ liệu class theo năm hiện tại
        this.perodicAssessmentService
          .listClass(data["id_current_year"])
          .pipe()
          .subscribe((res) => {
            const getDataClass = [];
            res["query"].forEach(function (item) {
              if (item.level == 1) {
                getDataClass.push({
                  id: item["id"],
                  name: item["class_name"],
                  level: item["level"],
                  year_id: data["id_current_year"],
                });
              }
            });
            this.ddlClassData = getDataClass;
            const arr_data = getDataClass.sort(this.compareClass);
          });
      });
  }
  compareClass(a, b) {
    let str = a.name;
    str = str.replace(/\s+/g, " ");
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
    const bandA = str.toUpperCase();
    let str2 = b.name;
    str2 = str2.replace(/\s+/g, " ");
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

    const bandB = str2.toUpperCase();
    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }
  //sort
  compare(a, b) {
    let str = a.firstname;
    str = str.replace(/\s+/g, " ");
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
    const bandA = str.toUpperCase();
    let str2 = b.firstname;
    str2 = str2.replace(/\s+/g, " ");
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

    const bandB = str2.toUpperCase();
    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }

  //filter
  filter() {
    this.subjectIndex = 0; //gán index bằng 0
    this.checkTabTable = true;
    this.checkTabTable1 = true;
    $("#removeCheck").prop("checked", false);
    $("#radio_row").prop("checked", false);
    $("#radio_column").prop("checked", false);
    // this.periodicAssessment.removeControl("periodicAssessmentDetails");
    const arr_year = this.form.controls["year"].value;
    const arr_class = this.form.controls["class"].value;
    const arr_semester = this.form.controls["semester"].value;
    if (arr_class == undefined || arr_class == null || arr_class == "") {
      this.notifyService.showError("Vui lòng chọn lớp", "thông báo");
      return;
    } else if (
      (arr_class && arr_semester == undefined) ||
      (arr_class && arr_semester == null) ||
      (arr_class && arr_semester == "")
    ) {
      this.notifyService.showError("Vui lòng chọn kỳ đánh giá", "Thông báo");
      return;
    }
    const formData = new FormData();
    if (arr_year) {
      formData.append("year_id", arr_year["id"]);
    }
    if (arr_class) {
      formData.append("class_id", arr_class["id"]);
    }
    if (arr_semester) {
      formData.append("semester_id", arr_semester["id"]);
    }
    //list môn
    this.perodicAssessmentService.tabClass(formData).subscribe((res) => {
      //list xóa data cũ
      this.periodicAssessment.removeControl("periodicAssessmentDetails");
      const rows = this.fb.array([]);
      this.periodicAssessment.addControl("periodicAssessmentDetails", rows);
      const a_study_id = [];
      if (res["query"].length == 0) {
        this.checkTabTable = false;
        this.checkTabTable1 = false;
        this.checkTable = false;
      } else {
        this.subjectData = res["query"][0]; //dữ liệu data môn học bằng chỉ mục 0 của backend trả ra
        res["query"].forEach(function (items) {
          a_study_id.push({
            get_study_id: items["study_program_id"],
            get_detail: items["detail_study_program_id"],
          });
        });
        this.study_id = a_study_id[0].get_study_id;
        this.detail_id = a_study_id[0].get_detail;

        // }
        //list phổ điểm
        this.perodicAssessmentService
          .spectralPoint(this.study_id, this.detail_id)
          .pipe()
          .subscribe((ress) => {
            let max;
            if (arr_semester["mid_or_last"] == 1) {
              max = JSON.parse(ress["query"].mid_semester_exam).max2; //Giữa kỳ bằng 1
            } else {
              max = JSON.parse(ress["query"].last_semester_exam).max3; //giữa kỳ bằng 0
            }
            if (res["query"].length == 0) {
              this.listTab = [];
              this.checkTable = false;
              this.headerPeriodicAssessment = false;
            } else {
              this.listTab = res["query"];
              this.checkTable = true;
              this.headerPeriodicAssessment = true;
              if (max == 0) {
                this.checkTab = 2;
              } else {
                switch (res["query"][0].subject_type) {
                  case 1:
                    this.checkTab = 1;
                    break;
                  case 2:
                    this.checkTab = 2;
                    break;
                  case 3:
                    this.checkTab = 3;
                    break;
                }
              }
            }
          });
        const a_detail_study_program_id = [];
        res["query"].forEach(function (items) {
          a_detail_study_program_id.push({
            get_detail_study_program_id: items["detail_study_program_id"],
            get_subject_id: items["subject_id"],
            get_subject_type: items["subject_type"],
          });
        });

        this.detail_study_program_id_add =
          a_detail_study_program_id[0].get_detail_study_program_id;
        this.detail_study_program_id =
          a_detail_study_program_id[0].get_detail_study_program_id;
        this.subject_id = a_detail_study_program_id[0].get_subject_id;
        this.subject_type = a_detail_study_program_id[0].get_subject_type;

        let class_id = String(arr_class.id);
        let subject_id = String(this.subject_id);
        let semester_id = String(arr_semester.id);
        let mid_or_last = String(arr_semester.mid_or_last);
        let detail_study_program_id = String(this.detail_study_program_id);
        let subject_type = String(this.subject_type);
        //list điểm
        this.perodicAssessmentService
          .listMarkBoard(
            class_id,
            subject_id,
            semester_id,
            mid_or_last,
            detail_study_program_id,
            subject_type
          )
          .pipe()
          .subscribe((dt) => {
            this.periodicAssessment.removeControl("periodicAssessmentDetails");

            //list hs
            this.perodicAssessmentService
              .listStudent(arr_class.id, this.detail_study_program_id)
              .pipe()
              .subscribe((data) => {
                this.ddlStudentData = data["query"];
                const arr_data_student = this.ddlStudentData.sort(this.compare);
                this.countStudent = data["query"].length;
                if (res["query"].length != 0 && this.countStudent == 0) {
                  this.checkTabTable = false;
                } else if (res["query"].length != 0 && this.countStudent != 0) {
                  this.checkTabTable = true;
                  const rows = this.fb.array([]);
                  this.periodicAssessment.addControl(
                    "periodicAssessmentDetails",
                    rows
                  );
                  let datum = arr_data_student;
                  let arr = [];
                  datum.forEach(function (ite) {
                    let x = dt["query"]
                      .map(function (itm) {
                        return itm.student_id;
                      })
                      .indexOf(ite.id);
                    if (x > -1) {
                      arr.push({
                        student_id: ite.id,
                        code: ite.code,
                        dob: ite.dob,
                        lastname: ite.lastname,
                        firstname: ite.firstname,
                        read: dt["query"][x]["read"],
                        write: dt["query"][x]["write"],
                        scores: dt["query"][x]["scores"],
                        comment: dt["query"][x]["comment"],
                      });
                    } else {
                      arr.push({
                        student_id: ite.id,
                        code: ite.code,
                        dob: ite.dob,
                        lastname: ite.lastname,
                        firstname: ite.firstname,
                        read: "",
                        write: "",
                        scores: "",
                        comment: "",
                      });
                    }
                  });
                  const control = this.periodicAssessment.get(
                    "periodicAssessmentDetails"
                  ) as FormArray;

                  this.onAddRowPeriodicAssessment(arr);
                }
              });
            // }
          });
      }
      // }
    });
  }

  onAddRowPeriodicAssessment(students) {
    const control = this.periodicAssessment.get(
      "periodicAssessmentDetails"
    ) as FormArray;
    for (let i = 0; i < students.length; i++) {
      control.push(this.createPeriodicAssessmentFormGroup(students[i]));
    }
  }

  createPeriodicAssessmentFormGroup(periodicAssessments): FormGroup {
    // let scoresCheck;
    // if (periodicAssessments.scores < 5) {
    //   scoresCheck = "Chưa hoàn thành";
    // } else if (periodicAssessments.scores < 9) {
    //   scoresCheck = "Hoàn thành";
    // } else {
    //   scoresCheck = "Hoàn thành tốt";
    // }
    // let scoresCheck;
    if (
      periodicAssessments.scores == "" ||
      periodicAssessments.scores == null ||
      periodicAssessments.scores == undefined
    ) {
      periodicAssessments.complete_level = "";
    } else if (periodicAssessments.scores < 5) {
      periodicAssessments.complete_level = "Chưa hoàn thành";
    } else if (periodicAssessments.scores < 9) {
      periodicAssessments.complete_level = "Hoàn thành";
    } else {
      periodicAssessments.complete_level = "Hoàn thành tốt";
    }

    const doc = Number(periodicAssessments.read);
    const viet = Number(periodicAssessments.write);
    if (doc && viet) {
      this.avgL = (doc + viet) / 2;
      periodicAssessments.scores = Math.round(this.avgL);
    }

    return this.fb.group({
      idCheck: new FormControl(false),
      student_id: new FormControl(periodicAssessments.student_id),
      code: new FormControl(periodicAssessments.code),
      dob: new FormControl(periodicAssessments.dob),
      student_name: new FormControl(
        periodicAssessments.lastname + " " + periodicAssessments.firstname
      ),
      read: new FormControl(periodicAssessments.read),
      write: new FormControl(periodicAssessments.write),
      scores: new FormControl(periodicAssessments.scores),
      complete_level: new FormControl(periodicAssessments.complete_level),
      // complete_level: new FormControl(scoresCheck),
      // comment: new FormControl(periodicAssessments.comment),
      comment: new FormControl({
        value: periodicAssessments.comment,
        disabled: true,
      }),
      idCheckAll: new FormControl(false),
    });
  }

  //Lưu
  save() {
    const formData = new FormData();
    let i = 0;
    if (this.detail_study_program_id_add) {
      formData.append(
        "detail_study_program_id",
        this.detail_study_program_id_add
      );
    }
    if (this.check_detail_study_program_id_add) {
      formData.append(
        "detail_study_program_id",
        this.check_detail_study_program_id_add
      );
    }
    const control = this.periodicAssessment.get(
      "periodicAssessmentDetails"
    ) as FormArray;
    if (control.value.length > 0) {
      const arr_class = this.form.controls["class"].value;
      const arr_semester = this.form.controls["semester"].value;
      if (arr_class) {
        formData.append("class_id", arr_class["id"]);
      }
      if (arr_semester) {
        formData.append("semester_id", arr_semester["id"]);
        formData.append("mid_or_last", arr_semester["mid_or_last"]);
      }
      if (this.checkTab == 3) {
        control.value.forEach(function (items) {
          if (items.idCheck === true) {
            if (items.read === null) {
              items.read = "";
            }
            if (items.write === null) {
              items.write = "";
            }
            if (items.comment === null) {
              items.comment = "";
            }
            if (
              items.read !== "" &&
              items.write !== "" &&
              items.comment !== ""
            ) {
              formData.append(
                "data" + "[" + i + "]" + "[student_id]",
                items.student_id
              );
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[read]",
                items.read
              );
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[write]",
                items.write
              );
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[scores]",
                items.scores
              );
              if (items.comment.name == undefined) {
                formData.append(
                  "data" + "[" + i + "]" + "[avg]" + "[comment]",
                  items.comment
                );
              } else {
                formData.append(
                  "data" + "[" + i + "]" + "[avg]" + "[comment]",
                  items.comment.name
                );
              }
              i++;
            } else if (
              items.read === "" &&
              items.write !== "" &&
              items.comment !== ""
            ) {
              formData.append(
                "data" + "[" + i + "]" + "[student_id]",
                items.student_id
              );
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[write]",
                items.write
              );
              if (items.comment.name == undefined) {
                formData.append(
                  "data" + "[" + i + "]" + "[avg]" + "[comment]",
                  items.comment
                );
              } else {
                formData.append(
                  "data" + "[" + i + "]" + "[avg]" + "[comment]",
                  items.comment.name
                );
              }
              i++;
            } else if (
              items.read === "" &&
              items.write === "" &&
              items.comment !== ""
            ) {
              formData.append(
                "data" + "[" + i + "]" + "[student_id]",
                items.student_id
              );
              if (items.comment.name == undefined) {
                formData.append(
                  "data" + "[" + i + "]" + "[avg]" + "[comment]",
                  items.comment
                );
              } else {
                formData.append(
                  "data" + "[" + i + "]" + "[avg]" + "[comment]",
                  items.comment.name
                );
              }
              i++;
            } else if (
              items.read !== "" &&
              items.write === "" &&
              items.comment !== ""
            ) {
              formData.append(
                "data" + "[" + i + "]" + "[student_id]",
                items.student_id
              );
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[read]",
                items.read
              );
              if (items.comment.name == undefined) {
                formData.append(
                  "data" + "[" + i + "]" + "[avg]" + "[comment]",
                  items.comment
                );
              } else {
                formData.append(
                  "data" + "[" + i + "]" + "[avg]" + "[comment]",
                  items.comment.name
                );
              }
              i++;
            } else if (
              items.read !== "" &&
              items.write === "" &&
              items.comment === ""
            ) {
              formData.append(
                "data" + "[" + i + "]" + "[student_id]",
                items.student_id
              );
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[read]",
                items.read
              );
              i++;
            } else if (
              items.read !== "" &&
              items.write !== "" &&
              items.comment === ""
            ) {
              formData.append(
                "data" + "[" + i + "]" + "[student_id]",
                items.student_id
              );
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[read]",
                items.read
              );
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[write]",
                items.write
              );
              i++;
            } else if (
              items.read === "" &&
              items.write === "" &&
              items.comment === ""
            ) {
              formData.append(
                "data" + "[" + i + "]" + "[student_id]",
                items.student_id
              );
              i++;
            }
          }
        });
        this.perodicAssessmentService
          .savePoint(formData)
          .pipe()
          .subscribe(
            (res) => {
              this.notifyService.showSuccess("Lưu thành công", "Thông báo");
              this.isChecked = "";
              this.isChecked = null;
              this.isChecked = [];
              this.isChecked = false;
              // this.filter();
              this.loadMarkBoardData(this.subjectData); //load lại dữ liệu
            },
            (error) => {
              if (error.errors) {
                // if (error.errors["avg.read"]) {
                //   this.notifyService.showError(
                //     "Điểm đọc không được để trống",
                //     "Thông báo lỗi"
                //   );
                // } else if (error.errors["avg.write"]) {
                //   this.notifyService.showError(
                //     "Điểm viết không được để trống",
                //     "Thông báo lỗi"
                //   );
                // } else if (error.errors["avg.scores"]) {
                //   this.notifyService.showError(
                //     "Điểm chung không được để trống",
                //     "Thông báo lỗi"
                //   );
                // } else if (error.errors["avg.comment"]) {
                //   this.notifyService.showError(
                //     "Nhận xét không được để trống",
                //     "Thông báo lỗi"
                //   );
                // } else
                if (error.errors.student_id) {
                  this.notifyService.showError(
                    "Thông tin không hợp lý",
                    "Thông báo lỗi"
                  );
                }
              } else if (error.error) {
                if (error.error === 1) {
                  this.notifyService.showError(
                    "Không được bỏ trống",
                    "Thông báo lỗi"
                  );
                } else if (error.error === 2) {
                  this.notifyService.showError(
                    "Dữ liệu truyền vào chỉ nhận giá trị là 1 hoặc 2",
                    "Thông báo lỗi"
                  );
                } else if (error.error === 7) {
                  this.notifyService.showError(
                    "Dữ liệu kiểu số",
                    "Thông báo lỗi"
                  );
                } else if (error.error === 121) {
                  this.notifyService.showError(
                    "Năm học phải là năm trong hiện tại và tương lai",
                    "Thông báo lỗi"
                  );
                } else if (error.error === 11) {
                  this.notifyService.showError(
                    "Chương trình học không tồn tại",
                    "Thông báo lỗi"
                  );
                } else if (error.error === 13) {
                  this.notifyService.showError(
                    "Môn học không được áo dụng cho lớp hoặc không thuộc học kỳ",
                    "Thông báo lỗi"
                  );
                } else if (error.error === 14) {
                  this.notifyService.showError(
                    "Dữ liệu học sinh truyền vào không thuộc lớp",
                    "Thông báo lỗi"
                  );
                } else if (error.error === 15) {
                  this.notifyService.showError(
                    "Vui lòng thêm lần lượt học kỳ",
                    "Thông báo lỗi"
                  );
                } else if (error.error === 18) {
                  this.notifyService.showError(
                    "Kiểm tra lại phổ điểm truyền vào không được tồn tại điểm đọc viết",
                    "Thông báo lỗi"
                  );
                } else if (error.error === 19) {
                  this.notifyService.showError(
                    "Vui lòng truyền dữ liệu đầu vào",
                    "Thông báo lỗi"
                  );
                } else if (error.error === 20) {
                  this.notifyService.showError(
                    "Vui lòng truyền dữ liệu học sinh",
                    "Thông báo lỗi"
                  );
                }
              } else {
                this.notifyService.showError("Lưu thất bại.", "Thông báo lỗi");
              }
            }
          );
      } else {
        control.value.forEach(function (items) {
          if (items.idCheck === true) {
            if (items.read === null) {
              items.read = "";
            }
            if (items.write === null) {
              items.write = "";
            }
            if (items.scores === null) {
              items.scores = "";
            }
            if (items.comment === null) {
              items.comment = "";
            }
            if (items.scores !== "" && items.comment !== "") {
              formData.append(
                "data" + "[" + i + "]" + "[student_id]",
                items.student_id
              );
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[scores]",
                items.scores
              );
              if (items.comment.name == undefined) {
                formData.append(
                  "data" + "[" + i + "]" + "[avg]" + "[comment]",
                  items.comment
                );
              } else {
                formData.append(
                  "data" + "[" + i + "]" + "[avg]" + "[comment]",
                  items.comment.name
                );
              }
              i++;
            } else if (items.scores === "" && items.comment !== "") {
              formData.append(
                "data" + "[" + i + "]" + "[student_id]",
                items.student_id
              );
              if (items.comment.name == undefined) {
                formData.append(
                  "data" + "[" + i + "]" + "[avg]" + "[comment]",
                  items.comment
                );
              } else {
                formData.append(
                  "data" + "[" + i + "]" + "[avg]" + "[comment]",
                  items.comment.name
                );
              }
              i++;
            } else if (items.scores !== "" && items.comment === "") {
              formData.append(
                "data" + "[" + i + "]" + "[student_id]",
                items.student_id
              );
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[scores]",
                items.scores
              );
              i++;
            } else if (items.scores === "" && items.comment === "") {
              formData.append(
                "data" + "[" + i + "]" + "[student_id]",
                items.student_id
              );
              i++;
            }
          }
        });
        this.perodicAssessmentService
          .savePoint(formData)
          .pipe()
          .subscribe(
            (res) => {
              this.notifyService.showSuccess("Lưu thành công", "Thông báo");
              this.isChecked = "";
              this.isChecked = null;
              this.isChecked = [];
              this.isChecked = false;
              // this.filter();
              this.loadMarkBoardData(this.subjectData);
            },
            (error) => {
              if (error.errors) {
                // if (error.errors["avg.scores"]) {
                //   this.notifyService.showError(
                //     "Kiểm tra định kỳ/Mức độ hoàn thành không được để trống",
                //     "Thông báo lỗi"
                //   );
                // } else if (error.errors["avg.comment"]) {
                //   this.notifyService.showError(
                //     "Nhận xét không được để trống",
                //     "Thông báo lỗi"
                //   );
                // } else
                if (error.errors.student_id) {
                  this.notifyService.showError(
                    "Thông tin không hợp lý",
                    "Thông báo lỗi"
                  );
                }
              } else if (error.error) {
                if (error.error === 1) {
                  this.notifyService.showError(
                    "Không được bỏ trống",
                    "Thông báo lỗi"
                  );
                } else if (error.error === 2) {
                  this.notifyService.showError(
                    "Dữ liệu truyền vào chỉ nhận giá trị là 1 hoặc 2",
                    "Thông báo lỗi"
                  );
                } else if (error.error === 7) {
                  this.notifyService.showError(
                    "Dữ liệu kiểu số",
                    "Thông báo lỗi"
                  );
                } else if (error.error === 121) {
                  this.notifyService.showError(
                    "Năm học phải là năm trong hiện tại và tương lai",
                    "Thông báo lỗi"
                  );
                } else if (error.error === 11) {
                  this.notifyService.showError(
                    "Chương trình học không tồn tại",
                    "Thông báo lỗi"
                  );
                } else if (error.error === 13) {
                  this.notifyService.showError(
                    "Môn học không được áo dụng cho lớp hoặc không thuộc học kỳ",
                    "Thông báo lỗi"
                  );
                } else if (error.error === 14) {
                  this.notifyService.showError(
                    "Dữ liệu học sinh truyền vào không thuộc lớp",
                    "Thông báo lỗi"
                  );
                } else if (error.error === 15) {
                  this.notifyService.showError(
                    "Vui lòng thêm lần lượt học kỳ",
                    "Thông báo lỗi"
                  );
                } else if (error.error === 18) {
                  this.notifyService.showError(
                    "Kiểm tra lại phổ điểm truyền vào không được tồn tại điểm đọc viết",
                    "Thông báo lỗi"
                  );
                } else if (error.error === 19) {
                  this.notifyService.showError(
                    "Vui lòng truyền dữ liệu đầu vào",
                    "Thông báo lỗi"
                  );
                } else if (error.error === 20) {
                  this.notifyService.showError(
                    "Vui lòng truyền dữ liệu học sinh",
                    "Thông báo lỗi"
                  );
                }
              } else {
                this.notifyService.showError("Lưu thất bại.", "Thông báo lỗi");
              }
            }
          );
      }
    }
  }
  //sự kiện change của chọn all
  checkAllCheckBox(item: any) {
    const control = this.periodicAssessment.get(
      "periodicAssessmentDetails"
    ) as FormArray;
    let value_id_all = item.target.value;
    let checked_all = item.target.checked;
    if (checked_all === true) {
      control.controls.forEach((item) => {
        item["controls"]["idCheck"].setValue(true);
        item["controls"]["idCheckAll"].setValue(true);
        if (this.checkTab == 3) {
          item["controls"].read.enable();
          item["controls"].write.enable();
          item["controls"].comment.enable();
        } else if (this.checkTab == 1) {
          item["controls"].scores.enable();
          item["controls"].comment.enable();
        } else {
          item["controls"].scores.enable();
          item["controls"].comment.enable();
        }
      });
    } else {
      control.controls.forEach((item) => {
        item["controls"]["idCheck"].setValue(false);
        item["controls"]["idCheckAll"].setValue(false);
        if (this.checkTab == 3) {
          item["controls"].read.disable();
          item["controls"].write.disable();
          item["controls"].scores.disable();
          item["controls"].comment.disable();
        } else if (this.checkTab == 1) {
          item["controls"].scores.disable();
          item["controls"].comment.disable();
        } else {
          item["controls"].scores.disable();
          item["controls"].comment.disable();
        }
      });
    }

    // console.log(item);
    if (checked_all) {
      if (this.getArrayChecboxId.length === 0) {
        this.getArrayChecboxId.push(value_id_all);
      } else {
        let checkbox_ex = this.getArrayChecboxId.indexOf(value_id_all);
        if (checkbox_ex != -1) {
        } else {
          this.getArrayChecboxId.push(value_id_all);
        }
      }
      this.isChecked = this.getArrayChecboxId;
    } else {
      if (this.getArrayChecboxId.length === 0) {
        this.isChecked = "";
      } else {
        let checkbox_ex = this.getArrayChecboxId.indexOf(value_id_all);
        if (checkbox_ex != -1) {
          this.getArrayChecboxId.splice(checkbox_ex, 1);
          if (this.getArrayChecboxId.length === 0) {
            this.isChecked = "";
          }
        } else {
        }
      }
    }
  }
  //chọn 1 dòng
  getSelectedClassStudentValue(item, event) {
    this.value_id = event.target.value;
    this.checked = event.target.checked;
    const control = this.periodicAssessment.get(
      "periodicAssessmentDetails"
    ) as FormArray;
    if (this.checked === true) {
      if (this.checkTab == 3) {
        item.controls.read.enable();
        item.controls.write.enable();
        item.controls.comment.enable();
      } else if (this.checkTab == 1) {
        item.controls.scores.enable();
        item.controls.comment.enable();
      } else {
        item.controls.scores.enable();
        item.controls.comment.enable();
      }

      const arrCheck = [];
      let chkApply = control.value.find((items) => items.idCheck == true);

      //get length checked
      control.value.forEach(function (it) {
        if (it["idCheck"] == true) {
          arrCheck.push({ iCheck: it["idCheck"] });
        }
      });
      this.countChecked = arrCheck;
      //end check lenght
      //fill checked all
      if (this.countStudent == this.countChecked.length + 1) {
        item.controls["idCheckAll"].setValue(true);
        $("#removeCheck").prop("checked", true);
      }
      //end fill checked all
      if (this.getArrayChecboxId.length === 0) {
        this.getArrayChecboxId.push(this.value_id);
      } else {
        let checkbox_ex = this.getArrayChecboxId.indexOf(this.value_id);
        if (checkbox_ex != -1) {
        } else {
          this.getArrayChecboxId.push(this.value_id);
        }
      }
      this.isChecked = this.getArrayChecboxId;
    } else {
      if (this.checkTab == 3) {
        item.controls.read.disable();
        item.controls.write.disable();
        item.controls.scores.disable();
        item.controls.comment.disable();
      } else if (this.checkTab == 1) {
        item.controls.scores.disable();
        item.controls.comment.disable();
      } else {
        item.controls.scores.disable();
        item.controls.comment.disable();
      }
      // item.controls.read.disable();
      // item.controls.write.disable();
      // item.controls.scores.disable();
      // item.controls.comment.disable();
      item.controls["idCheckAll"].setValue(false);
      $("#removeCheck").prop("checked", false);
      if (this.getArrayChecboxId.length === 0) {
        this.isChecked = "";
        this.isChecked = null;
        this.isChecked = [];
        this.isChecked = false;
      } else {
        let checkbox_ex = this.getArrayChecboxId.indexOf(this.value_id);
        if (checkbox_ex != -1) {
          this.getArrayChecboxId.splice(checkbox_ex, 1);
          if (this.getArrayChecboxId.length === 0) {
            this.isChecked = "";
            this.isChecked = null;
            this.isChecked = [];
            this.isChecked = false;
          }
        } else {
        }
      }
    }
  }
  //nhập nhanh
  quickEntry() {
    this.resetForm();
  }

  //sort
  //sk change year
  onSelectYear(item: any) {
    this.selectedClass = [];
    this.selectedSemester = [];
    if (item != undefined) {
      const arrClass = [];
      this.perodicAssessmentService
        .listClass(item.id)
        .pipe()
        .subscribe((ress) => {
          ress["query"].forEach(function (items) {
            arrClass.push({
              id: items["id"],
              name: items["class_name"],
              level: items["level"],
              year_id: item["id"],
            });
          });
          this.ddlClassData = arrClass;
        });
    }
  }
  //sk change class
  onSelectClass(item: any) {
    this.selectedSemester = [];
    if (item != undefined) {
      const arrSemester = [];
      this.perodicAssessmentService
        .listSemester(item["year_id"], item.level)
        .pipe()
        .subscribe((res) => {
          res["query"].forEach(function (items) {
            if (items["level"] == 1) {
              if (items["exam_time"] == 1) {
                arrSemester.push({
                  id: items["id"],
                  name: "Giữa" + " " + items["name"],
                  level: items["level"],
                  exam_time: items["exam_time"],
                  mid_or_last: 1,
                });
                arrSemester.push({
                  id: items["id"],
                  name: "Cuối" + " " + items["name"],
                  level: items["level"],
                  exam_time: items["exam_time"],
                  mid_or_last: 2,
                });
              } else {
                arrSemester.push({
                  id: items["id"],
                  name: items["name"],
                  level: items["level"],
                  exam_time: items["exam_time"],
                  mid_or_last: 2,
                });
              }
            }
          });
          this.ddlSemesterData = arrSemester;
        });
    }
  }
  //sk change semester
  onSelectSemester() { }
  //Lưu khi nhập nhanh
  saveQuichEntry() {
    const formData = new FormData();
    let i = 0;
    if (this.detail_study_program_id_add) {
      formData.append(
        "detail_study_program_id",
        this.detail_study_program_id_add
      );
    }
    if (this.check_detail_study_program_id_add) {
      formData.append(
        "detail_study_program_id",
        this.check_detail_study_program_id_add
      );
    }
    const control = this.periodicAssessment.get(
      "periodicAssessmentDetails"
    ) as FormArray;
    // if (control.value.length > 0) {
    const arr_class = this.form.controls["class"].value;
    const arr_semester = this.form.controls["semester"].value;
    if (arr_class) {
      formData.append("class_id", arr_class["id"]);
    }
    if (arr_semester) {
      formData.append("semester_id", arr_semester["id"]);
      formData.append("mid_or_last", arr_semester["mid_or_last"]);
    }
    if (this.checkTab == 3) {
      const arr_read_score = this.form.controls["read_score"].value;
      if (arr_read_score) {
        formData.append("read_score", arr_read_score);
      }
      const arr_write_score = this.form.controls["write_score"].value;
      if (arr_write_score) {
        formData.append("write_score", arr_write_score);
      }
      const arr_completeLevel = this.form.controls["completeLevel"].value;
      if (arr_completeLevel) {
        formData.append("completeLevel", arr_completeLevel.value);
      }
      const arr_contentComments = this.form.controls["contentComments"].value;
      if (arr_contentComments) {
        formData.append("contentComments", arr_contentComments);
      }
      control.value.forEach(function (items) {
        if (items.idCheck === true) {
          items.scores = (arr_read_score + arr_write_score) / 2;
          items.read = arr_read_score;
          items.write = arr_write_score;
          items.comment = arr_contentComments;
          if (items.read === null) {
            items.read = "";
            if (items.read === "") {
              items.scores = "";
            }
          }
          if (items.write === null) {
            items.write = "";
            if (items.write === "") {
              items.scores = "";
            }
          }
          if (items.comment === null) {
            items.comment = "";
          }
          if (items.read !== "" && items.write !== "" && items.comment !== "") {
            formData.append(
              "data" + "[" + i + "]" + "[student_id]",
              items.student_id
            );
            formData.append(
              "data" + "[" + i + "]" + "[avg]" + "[read]",
              items.read
            );
            formData.append(
              "data" + "[" + i + "]" + "[avg]" + "[write]",
              items.write
            );
            formData.append(
              "data" + "[" + i + "]" + "[avg]" + "[scores]",
              items.scores
            );
            if (items.comment.name == undefined) {
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[comment]",
                items.comment
              );
            } else {
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[comment]",
                items.comment.name
              );
            }
            i++;
          } else if (
            items.read === "" &&
            items.write !== "" &&
            items.comment !== ""
          ) {
            formData.append(
              "data" + "[" + i + "]" + "[student_id]",
              items.student_id
            );
            formData.append(
              "data" + "[" + i + "]" + "[avg]" + "[write]",
              items.write
            );
            if (items.comment.name == undefined) {
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[comment]",
                items.comment
              );
            } else {
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[comment]",
                items.comment.name
              );
            }
            i++;
          } else if (
            items.read === "" &&
            items.write === "" &&
            items.comment !== ""
          ) {
            formData.append(
              "data" + "[" + i + "]" + "[student_id]",
              items.student_id
            );
            if (items.comment.name == undefined) {
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[comment]",
                items.comment
              );
            } else {
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[comment]",
                items.comment.name
              );
            }
            i++;
          } else if (
            items.read !== "" &&
            items.write === "" &&
            items.comment !== ""
          ) {
            formData.append(
              "data" + "[" + i + "]" + "[student_id]",
              items.student_id
            );
            formData.append(
              "data" + "[" + i + "]" + "[avg]" + "[read]",
              items.read
            );
            if (items.comment.name == undefined) {
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[comment]",
                items.comment
              );
            } else {
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[comment]",
                items.comment.name
              );
            }
            i++;
          } else if (
            items.read !== "" &&
            items.write === "" &&
            items.comment === ""
          ) {
            formData.append(
              "data" + "[" + i + "]" + "[student_id]",
              items.student_id
            );
            formData.append(
              "data" + "[" + i + "]" + "[avg]" + "[read]",
              items.read
            );
            i++;
          } else if (
            items.read !== "" &&
            items.write !== "" &&
            items.comment === ""
          ) {
            formData.append(
              "data" + "[" + i + "]" + "[student_id]",
              items.student_id
            );
            formData.append(
              "data" + "[" + i + "]" + "[avg]" + "[read]",
              items.read
            );
            formData.append(
              "data" + "[" + i + "]" + "[avg]" + "[write]",
              items.write
            );
            i++;
          } else if (
            items.read === "" &&
            items.write === "" &&
            items.comment === ""
          ) {
            formData.append(
              "data" + "[" + i + "]" + "[student_id]",
              items.student_id
            );
            i++;
          }
          // formData.append(
          //   "data" + "[" + i + "]" + "[student_id]",
          //   items.student_id
          // );
          // formData.append(
          //   "data" + "[" + i + "]" + "[avg]" + "[scores]",
          //   items.scores
          // );
          // formData.append(
          //   "data" + "[" + i + "]" + "[avg]" + "[read]",
          //   items.read
          // );
          // formData.append(
          //   "data" + "[" + i + "]" + "[avg]" + "[write]",
          //   items.write
          // );
          // formData.append(
          //   "data" + "[" + i + "]" + "[avg]" + "[comment]",
          //   items.comment.name
          // );
          // i++;
        }
      });
    } else if (this.checkTab === 1) {
      let arr_periodic_score = this.form.controls["periodic_score"].value;
      if (arr_periodic_score) {
        formData.append("periodic_score", arr_periodic_score);
      }
      let arr_completeLevel = this.form.controls["completeLevel"].value;
      if (arr_completeLevel) {
        formData.append("completeLevel", arr_completeLevel.value);
      }
      let arr_contentComments = this.form.controls["contentComments"].value;
      if (arr_contentComments) {
        formData.append("contentComments", arr_contentComments.name);
      }
      control.value.forEach(function (items) {
        if (items.idCheck === true) {
          items.scores = arr_periodic_score;
          items.comment = arr_contentComments;
          if (arr_periodic_score === null) {
            arr_periodic_score = "";
          }
          if (arr_contentComments === null) {
            arr_contentComments = "";
          }
          if (items.scores !== "" && items.comment["length"] !== 0) {
            formData.append(
              "data" + "[" + i + "]" + "[student_id]",
              items.student_id
            );
            formData.append(
              "data" + "[" + i + "]" + "[avg]" + "[scores]",
              items.scores
            );
            // formData.append(
            //   "data" + "[" + i + "]" + "[avg]" + "[scores]",
            //   arr_periodic_score
            // );
            if (arr_contentComments.name == undefined) {
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[comment]",
                arr_contentComments
              );
            } else {
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[comment]",
                arr_contentComments.name
              );
            }
            i++;
          } else if (items.scores === "" && items.comment["length"] !== 0) {
            formData.append(
              "data" + "[" + i + "]" + "[student_id]",
              items.student_id
            );
            if (arr_contentComments.name == undefined) {
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[comment]",
                arr_contentComments
              );
            } else {
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[comment]",
                arr_contentComments.name
              );
            }
            i++;
          } else if (items.scores !== "" && items.comment["length"] === 0) {
            formData.append(
              "data" + "[" + i + "]" + "[student_id]",
              items.student_id
            );
            formData.append(
              "data" + "[" + i + "]" + "[avg]" + "[scores]",
              items.scores
            );
            i++;
          } else if (items.scores === "" && items.comment["length"] === 0) {
            formData.append(
              "data" + "[" + i + "]" + "[student_id]",
              items.student_id
            );
            i++;
          }
        }
      });
    } else {
      let arr_completeLevel = this.form.controls["completeLevel"].value;
      if (arr_completeLevel) {
        formData.append("completeLevel", arr_completeLevel.value);
      }
      let arr_contentComments = this.form.controls["contentComments"].value;
      if (arr_contentComments) {
        formData.append("contentComments", arr_contentComments.name);
      }

      if (arr_completeLevel == null) {
        arr_completeLevel = "";
      }
      if (arr_contentComments == null) {
        arr_contentComments = "";
      }
      control.value.forEach(function (items) {
        if (items.idCheck === true) {
          items.comment = arr_contentComments;
          items.complete_level = arr_completeLevel;
          if (
            items.complete_level["length"] !== 0 &&
            items.comment["length"] !== 0
          ) {
            formData.append(
              "data" + "[" + i + "]" + "[student_id]",
              items.student_id
            );
            if (items.complete_level.value == undefined) {
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[scores]",
                items.complete_level
              );
            } else {
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[scores]",
                items.complete_level.value
              );
            }

            if (items.comment.name == undefined) {
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[comment]",
                items.comment
              );
            } else {
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[comment]",
                items.comment.name
              );
            }
            i++;
          } else if (
            items.complete_level["length"] === 0 &&
            items.comment["length"] !== 0
          ) {
            formData.append(
              "data" + "[" + i + "]" + "[student_id]",
              items.student_id
            );
            if (items.comment.name == undefined) {
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[comment]",
                items.comment
              );
            } else {
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[comment]",
                items.comment.name
              );
            }
            i++;
          } else if (
            items.complete_level["length"] !== 0 &&
            items.comment["length"] === 0
          ) {
            formData.append(
              "data" + "[" + i + "]" + "[student_id]",
              items.student_id
            );
            if (items.complete_level.value == undefined) {
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[scores]",
                items.complete_level
              );
            } else {
              formData.append(
                "data" + "[" + i + "]" + "[avg]" + "[scores]",
                items.complete_level.value
              );
            }

            // formData.append(
            //   "data" + "[" + i + "]" + "[avg]" + "[scores]",
            //   arr_completeLevel.value
            // );
            i++;
          } else if (
            items.complete_level["length"] === 0 &&
            items.comment["length"] === 0
          ) {
            formData.append(
              "data" + "[" + i + "]" + "[student_id]",
              items.student_id
            );
            i++;
          }
        }
      });
    }
    this.perodicAssessmentService
      .savePoint(formData)
      .pipe()
      .subscribe(
        (res) => {
          this.notifyService.showSuccess("Lưu thành công", "Thông báo");
          $("#quichEntryModal").modal("hide");
          $(".modal-backdrop").remove();
          this.isChecked = "";
          this.isChecked = null;
          this.isChecked = [];
          this.isChecked = false;
          // this.filter();
          this.loadMarkBoardData(this.subjectData);
        },
        (error) => {
          if (error.errors) {
            if (error.errors.student_id) {
              this.notifyService.showError(
                "Thông tin không hợp lý",
                "Thông báo lỗi"
              );
            }
          } else if (error.error) {
            if (error.error === 1) {
              this.notifyService.showError(
                "Không được bỏ trống",
                "Thông báo lỗi"
              );
            } else if (error.error === 2) {
              this.notifyService.showError(
                "Dữ liệu truyền vào chỉ nhận giá trị là 1 hoặc 2",
                "Thông báo lỗi"
              );
            } else if (error.error === 7) {
              this.notifyService.showError("Dữ liệu kiểu số", "Thông báo lỗi");
            } else if (error.error === 121) {
              this.notifyService.showError(
                "Năm học phải là năm trong hiện tại và tương lai",
                "Thông báo lỗi"
              );
            } else if (error.error === 11) {
              this.notifyService.showError(
                "Chương trình học không tồn tại",
                "Thông báo lỗi"
              );
            } else if (error.error === 13) {
              this.notifyService.showError(
                "Môn học không được áo dụng cho lớp hoặc không thuộc học kỳ",
                "Thông báo lỗi"
              );
            } else if (error.error === 14) {
              this.notifyService.showError(
                "Dữ liệu học sinh truyền vào không thuộc lớp",
                "Thông báo lỗi"
              );
            } else if (error.error === 15) {
              this.notifyService.showError(
                "Vui lòng thêm lần lượt học kỳ",
                "Thông báo lỗi"
              );
            } else if (error.error === 18) {
              this.notifyService.showError(
                "Kiểm tra lại phổ điểm truyền vào không được tồn tại điểm đọc viết",
                "Thông báo lỗi"
              );
            } else if (error.error === 19) {
              this.notifyService.showError(
                "Vui lòng truyền dữ liệu đầu vào",
                "Thông báo lỗi"
              );
            } else if (error.error === 20) {
              this.notifyService.showError(
                "Vui lòng truyền dữ liệu học sinh",
                "Thông báo lỗi"
              );
            }
          } else {
            this.notifyService.showError("Lưu thất bại.", "Thông báo lỗi");
          }
        }
      );
    // }
  }
  //confim khi thay đổi môn nhưng chưa lưu
  dirtyTab() {
    const dirty_tab = this.periodicAssessment.get(
      "periodicAssessmentDetails"
    ) as FormArray;
    if (dirty_tab.dirty == true) {
      let confirmSave = confirm(
        "Bạn có muốn lưu dữ liệu trước khi chuyển tab hay không?"
      );
      if (confirmSave) {
        this.save();
      } else {
      }
    }
  }

  // hàm load lại dữ liệu bảng
  loadMarkBoardData(item: any) {
    $("#removeCheck").prop("checked", false);
    $("#radio_row").prop("checked", false);
    $("#radio_column").prop("checked", false);
    this.isChecked = false;
    this.periodicAssessment.removeControl("periodicAssessmentDetails");
    const rows = this.fb.array([]);
    this.periodicAssessment.addControl("periodicAssessmentDetails", rows);
    // this.checkTab = item.subject_type;
    const arr_class = this.form.controls["class"].value;
    const arr_semester = this.form.controls["semester"].value;
    //list phổ điểm
    this.perodicAssessmentService
      .spectralPoint(item.study_program_id, item.detail_study_program_id)
      .pipe()
      .subscribe((ress) => {
        let max;
        if (arr_semester["mid_or_last"] == 1) {
          max = JSON.parse(ress["query"].mid_semester_exam).max2; //Giữa kỳ bằng 1
        } else {
          max = JSON.parse(ress["query"].last_semester_exam).max3; //giữa kỳ bằng 0
        }
        if (max == 0) {
          this.checkTab = 2;
        } else {
          switch (item.subject_type) {
            case 1:
              this.checkTab = 1;
              break;
            case 2:
              this.checkTab = 2;
              break;
            case 3:
              this.checkTab = 3;
              break;
          }
        }
      });
    this.check_subject_id = item.subject_id;
    this.check_detail_study_program_id = item.detail_study_program_id;
    this.check_detail_study_program_id_add = item.detail_study_program_id;
    this.check_subject_type_add = item.subject_type;
    let class_id = String(arr_class.id);
    let subject_id = String(this.check_subject_id);
    let semester_id = String(arr_semester.id);
    let mid_or_last = String(arr_semester.mid_or_last);
    let detail_study_program_id = String(this.check_detail_study_program_id);
    let subject_type = String(this.check_subject_type_add);
    this.perodicAssessmentService
      .listMarkBoard(
        class_id,
        subject_id,
        semester_id,
        mid_or_last,
        detail_study_program_id,
        subject_type
      )
      .pipe()
      .subscribe((dt) => {
        this.periodicAssessment.removeControl("periodicAssessmentDetails");
        const rows = this.fb.array([]);
        this.periodicAssessment.addControl("periodicAssessmentDetails", rows);
        //list điểm
        this.perodicAssessmentService
          .listStudent(arr_class.id, this.detail_study_program_id)
          .pipe()
          .subscribe((data) => {
            this.ddlStudentData = data["query"].sort(this.compare);
            const rows = this.fb.array([]);
            this.periodicAssessment.addControl(
              "periodicAssessmentDetails",
              rows
            );
            let datum = data["query"];
            let arr = [];
            datum.forEach(function (ite) {
              let x = dt["query"]
                .map(function (itm) {
                  return itm.student_id;
                })
                .indexOf(ite.id);
              if (x > -1) {
                arr.push({
                  student_id: ite.id,
                  code: ite.code,
                  dob: ite.dob,
                  lastname: ite.lastname,
                  firstname: ite.firstname,
                  read: dt["query"][x]["read"],
                  write: dt["query"][x]["write"],
                  scores: dt["query"][x]["scores"],
                  comment: dt["query"][x]["comment"],
                });
              } else {
                arr.push({
                  student_id: ite.id,
                  code: ite.code,
                  dob: ite.dob,
                  lastname: ite.lastname,
                  firstname: ite.firstname,
                  read: "",
                  write: "",
                  scores: "",
                  comment: "",
                });
              }
            });
            const control = this.periodicAssessment.get(
              "periodicAssessmentDetails"
            ) as FormArray;
            this.onAddRowPeriodicAssessment(arr);
          });
      });
  }

  //chọn môn
  changeTab(item: any) {
    this.subjectData = item; //gán dữ liệu môn bằng item trả về
    // item["controls"]["idCheckAll"].setValue(false);
    this.dirtyTab();
    $("#removeCheck").prop("checked", false);
    $("#radio_row").prop("checked", false);
    $("#radio_column").prop("checked", false);
    this.isChecked = false;
    this.periodicAssessment.removeControl("periodicAssessmentDetails");
    const rows = this.fb.array([]);
    this.periodicAssessment.addControl("periodicAssessmentDetails", rows);
    // this.checkTab = item.subject_type;
    const arr_class = this.form.controls["class"].value;
    const arr_semester = this.form.controls["semester"].value;
    //list phổ điểm
    this.perodicAssessmentService
      .spectralPoint(item.study_program_id, item.detail_study_program_id)
      .pipe()
      .subscribe((ress) => {
        let max;
        if (arr_semester["mid_or_last"] == 1) {
          max = JSON.parse(ress["query"].mid_semester_exam).max2; //Giữa kỳ bằng 1
        } else {
          max = JSON.parse(ress["query"].last_semester_exam).max3; //giữa kỳ bằng 0
        }
        if (max == 0) {
          this.checkTab = 2;
        } else {
          switch (item.subject_type) {
            case 1:
              this.checkTab = 1;
              break;
            case 2:
              this.checkTab = 2;
              break;
            case 3:
              this.checkTab = 3;
              break;
          }
        }
      });
    this.check_subject_id = item.subject_id;
    this.check_detail_study_program_id = item.detail_study_program_id;
    this.check_detail_study_program_id_add = item.detail_study_program_id;
    this.check_subject_type_add = item.subject_type;
    let class_id = String(arr_class.id);
    let subject_id = String(this.check_subject_id);
    let semester_id = String(arr_semester.id);
    let mid_or_last = String(arr_semester.mid_or_last);
    let detail_study_program_id = String(this.check_detail_study_program_id);
    let subject_type = String(this.check_subject_type_add);
    this.perodicAssessmentService
      .listMarkBoard(
        class_id,
        subject_id,
        semester_id,
        mid_or_last,
        detail_study_program_id,
        subject_type
      )
      .pipe()
      .subscribe((dt) => {
        this.periodicAssessment.removeControl("periodicAssessmentDetails");
        const rows = this.fb.array([]);
        this.periodicAssessment.addControl("periodicAssessmentDetails", rows);
        //list điểm
        this.perodicAssessmentService
          .listStudent(arr_class.id, this.detail_study_program_id)
          .pipe()
          .subscribe((data) => {
            this.ddlStudentData = data["query"].sort(this.compare);
            const rows = this.fb.array([]);
            this.periodicAssessment.addControl(
              "periodicAssessmentDetails",
              rows
            );
            let datum = data["query"];
            let arr = [];
            datum.forEach(function (ite) {
              let x = dt["query"]
                .map(function (itm) {
                  return itm.student_id;
                })
                .indexOf(ite.id);
              if (x > -1) {
                arr.push({
                  student_id: ite.id,
                  code: ite.code,
                  dob: ite.dob,
                  lastname: ite.lastname,
                  firstname: ite.firstname,
                  read: dt["query"][x]["read"],
                  write: dt["query"][x]["write"],
                  scores: dt["query"][x]["scores"],
                  comment: dt["query"][x]["comment"],
                });
              } else {
                arr.push({
                  student_id: ite.id,
                  code: ite.code,
                  dob: ite.dob,
                  lastname: ite.lastname,
                  firstname: ite.firstname,
                  read: "",
                  write: "",
                  scores: "",
                  comment: "",
                });
              }
            });
            const control = this.periodicAssessment.get(
              "periodicAssessmentDetails"
            ) as FormArray;
            this.onAddRowPeriodicAssessment(arr);
          });
      });
  }
  resetForm() {
    this.form.get("read_score").clearValidators();
    this.form.get("read_score").setValue("");
    this.form.get("write_score").clearValidators();
    this.form.get("write_score").setValue("");
    this.form.get("periodic_score").clearValidators();
    this.form.get("periodic_score").setValue("");
    this.form.get("completeLevel").clearValidators();
    this.selectedCompleteLevel = [];
    this.form.get("contentComments").clearValidators();
    this.selectedContentComments = [];
  }
  //thay đổi điểm đọc trên line
  changeReadScore(change_read_score) {
    let doc = Number(change_read_score.value.read);
    let viet = Number(change_read_score.value.write);
    if (doc > 10) {
      doc = 10;
      change_read_score.controls.read.setValue(Math.round(10));
    }
    if (doc < 0) {
       doc = 0;
       change_read_score.controls.read.setValue(Math.round(0));
    }
    if(change_read_score.value.read == null){
      change_read_score.controls.read.setValue("");
    }
    if (doc && viet) {
      this.avgL = (doc + viet) / 2;

      change_read_score.controls.scores.setValue(Math.round(this.avgL));

      change_read_score.value.scores = Math.round(this.avgL);
      if (doc === 0 || viet === 0) {
        this.form.value.complete_level = "";
      } else if (this.avgL < 5) {
        this.form.value.complete_level = "Chưa hoàn thành";
      } else if (this.avgL < 9) {
        this.form.value.complete_level = "Hoàn thành";
      }
      if (this.avgL >= 9) {
        this.form.value.complete_level = "Hoàn thành tốt";
      }
      change_read_score.controls.complete_level.setValue(
        this.form.value.complete_level
      );
    } else if (doc === 0 || viet === 0) {
      change_read_score.controls.scores.setValue("");
      change_read_score.value.scores = "";
      this.form.value.complete_level = "";
      change_read_score.controls.complete_level.setValue(
        this.form.value.complete_level
      );
    }
  }
  //thay đổi điểm viết trên line
  changeWriteScore(change_write_score) {
    let doc = Number(change_write_score.value.read);
    let viet = Number(change_write_score.value.write);
    if (viet > 10) {
      viet = 10;
      change_write_score.controls.write.setValue(10);
    }
    if (viet < 0) {
      viet = 0;
      change_write_score.controls.write.setValue(0);
    }
    if(change_write_score.value.write == null){
      change_write_score.controls.write.setValue("");
    }
    if (doc && viet) {
      this.avgL = (doc + viet) / 2;

      change_write_score.controls.scores.setValue(Math.round(this.avgL));

      change_write_score.value.scores = Math.round(this.avgL);
      if (this.avgL == null || this.avgL == undefined) {
        this.form.value.complete_level = "";
      } else if (this.avgL < 5) {
        this.form.value.complete_level = "Chưa hoàn thành";
      } else if (this.avgL < 9) {
        this.form.value.complete_level = "Hoàn thành";
      }
      if (this.avgL >= 9) {
        this.form.value.complete_level = "Hoàn thành tốt";
      }
      change_write_score.controls.complete_level.setValue(
        this.form.value.complete_level
      );
    } else if (doc === 0 || viet === 0) {
      change_write_score.controls.scores.setValue("");
      change_write_score.value.scores = "";
      this.form.value.complete_level = "";
      change_write_score.controls.complete_level.setValue(
        this.form.value.complete_level
      );
    }
  }
  //thay đổi điểm ktdk khi chỉ có 1 cột
  changeScoreLine(change_score_line) {
    if (change_score_line.value.scores > 10) {
      change_score_line.controls.scores.setValue(10);
    }
    if (change_score_line.value.scores < 0) {
      change_score_line.controls.scores.setValue(0);
    }
    if (
      change_score_line.value.scores == "" ||
      change_score_line.value.scores == null ||
      change_score_line.value.scores == undefined
    ) {
      change_score_line.controls.scores.setValue("");
      this.form.value.complete_level = "";
    } else if (change_score_line.value.scores < Math.round(5)) {
      this.form.value.complete_level = "Chưa hoàn thành";
    } else if (change_score_line.value.scores < Math.round(9)) {
      this.form.value.complete_level = "Hoàn thành";
    }
    if (change_score_line.value.scores >= Math.round(9)) {
      this.form.value.complete_level = "Hoàn thành tốt";
    }
    change_score_line.controls.complete_level.setValue(
      this.form.value.complete_level
    );
  }
  //thay đổi theo điểm định kỳ type=1 trên modal
  changeScore() {
    if (this.form.value.periodic_score > 10) {
      this.form.value.periodic_score = 10;
    }
    if (this.form.value.periodic_score < 0) {
      this.form.value.periodic_score = 0;
    }
    if (
      this.form.value.periodic_score == "" ||
      this.form.value.periodic_score == null ||
      this.form.value.periodic_score == undefined
    ) {
      this.form.value.completeLevel = "";
      this.form.value.periodic_score = ""
    } else if (this.form.value.periodic_score < 5) {
      this.form.value.completeLevel = "Chưa hoàn thành";
    } else if (this.form.value.periodic_score < 9) {
      this.form.value.completeLevel = "Hoàn thành";
    }
    if (this.form.value.periodic_score >= 9) {
      this.form.value.completeLevel = "Hoàn thành tốt";
    }
    this.showCompleteLevel = this.form.value.completeLevel;
    this.showPeriodicScore = this.form.value.periodic_score
  }
  //thay đổi theo điểm định kỳ type=3
  //hàm avg modal
  avgFunModal() {
    const doc = Number(this.form.value.read_score);
    const viet = Number(this.form.value.write_score);
    if (doc && viet) {
      this.avgM = (doc + viet) / 2;
      if (this.avgM < 5) {
        this.form.value.completeLevel = "Chưa hoàn thành";
      } else if (this.avgM < 9) {
        this.form.value.completeLevel = "Hoàn thành";
      }
      if (this.avgM >= 9) {
        this.form.value.completeLevel = "Hoàn thành tốt";
      }
      this.showCompleteLevelAvg = this.form.value.completeLevel;
    } else if (doc === 0 || viet === 0) {
      this.form.value.completeLevel = "";
      this.form.controls.completeLevel.setValue(this.form.value.completeLevel);
    }
  }
  //thay đổi theo điểm đọc trên modal
  change_readScore() {
    const doc = Number(this.form.value.read_score);
    if (doc > 10) {
      this.form.value.read_score = 10;
    }
    if (doc < 0) {
      this.form.value.read_score = 0;
    }
    if (
      this.form.value.read_score == "" ||
      this.form.value.read_score == null ||
      this.form.value.read_score == undefined
    ){
      this.form.value.read_score = ""
    }
    this.showReadScore = this.form.value.read_score;

    this.avgFunModal();
  }
  //thay đổi theo điểm viết trên modal
  change_writeScore() {
    const viet = Number(this.form.value.write_score);
    if (viet > 10) {
      this.form.value.write_score = 10;
    }
    if (viet < 0) {
      this.form.value.write_score = 0;
    }
    if (
      this.form.value.write_score == "" ||
      this.form.value.write_score == null ||
      this.form.value.write_score == undefined
    ){
      this.form.value.write_score = ""
    }
    this.showWriteScore = this.form.value.write_score;
    this.avgFunModal();
  }
  //nhập dữ liệu theo hàng
  enterR() {
    $(".commentTypeAdd").attr("tabindex", "8");
  }
  enterC() {
    $(".commentTypeAdd").attr("tabindex", "9");
  }
}
