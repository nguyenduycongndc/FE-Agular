import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { element, error } from "protractor";
import { last } from "rxjs/operators";
import { NotificationService } from "../../../_services/notification.service";
import { UtilityService } from "../../../_services/utils.service";
import { AcademicTranscriptService } from "../service/academic-transcript.service";
declare var $: any;
@Component({
  selector: "academic-transcript",
  templateUrl: "./academic-transcript.component.html",
  styleUrls: ["./academic-transcript.component.scss"],
})
export class AcademicTranscriptComponent implements OnInit {
  academicTranscriptForm: FormGroup;

  ddlYearData: any[];
  selectedYear = [];
  ddlClassData: any[];
  selectedClass = [];
  ddlSemesterData: any[];
  selectedSemester = [];

  listTabs: any[];
  studentList = [];
  coefficientSubjectType: any[];
  markBoardList: any[];
  markBoard = false;

  dataSource = [];
  get_detail_study_program: any;
  flagOps3: boolean;
  subjectData = [];

  activeTab = "";
  loadingNotBilingualTab = false;
  loadingBilingualTab = false;

  checkData = false;
  submitted = false;

  subject_type_display = 1;

  maxNumberOfCharactersDescription = 300;
  numberOfCharactersDescription = 0;

  loadingFilter = false;
  courseScoring = false;

  constructor(
    private fb: FormBuilder,
    private notifyService: NotificationService,
    private academicTranscriptService: AcademicTranscriptService
  ) {
    this.academicTranscriptForm = this.fb.group({
      year: new FormControl("", [Validators.required]),
      class: new FormControl("", [Validators.required]),
      semester: new FormControl("", [Validators.required]),
      comment: new FormControl(""),
    });
  }

  get f() {
    return this.academicTranscriptForm.controls;
  }

  headerData: any[];
  headerData2: any[];
  dynamicCols: any[];

  ngOnInit() {
    this.markBoard = false;
    this.academicTranscriptService.yearList().subscribe((data) => {
      const fullYear = [];
      const limitYear = [];
      const idCurrentYear = data["id_current_year"];
      let currentYearData;
      let currentArrYearData;
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
        }
      });
      this.ddlYearData = fullYear;
      this.selectedYear = currentYearData;

      this.academicTranscriptService
        .classList(idCurrentYear)
        .subscribe((res) => {
          const getDataClass = [];
          if (Object.keys(res["query"]).length > 0) {
            res["query"].forEach(function (item) {
              if (item.level !== 1) {
                getDataClass.push({
                  id: item["id"],
                  name: item["class_name"],
                  level: item["level"],
                  year_id: data["id_current_year"],
                });
              }
            });
            this.ddlClassData = getDataClass;
          }
        });
    });
  }

  // Header hệ điểm song ngữ
  headerSubjectBilingual(studentMarkBoard) {
    let regularExam = JSON.parse(studentMarkBoard.regular_exam);
    let midSemesterExam = JSON.parse(studentMarkBoard.mid_semester_exam);
    let lastSemesterExam = JSON.parse(studentMarkBoard.last_semester_exam);

    this.headerData = [];
    this.headerData = [
      // { field: 'id', value: 'STT', isDynamicCol: false },
      { field: "code", value: "Mã học sinh", isDynamicCol: false },
      { field: "name", value: "Họ và tên", isDynamicCol: false },
      { field: "dob", value: "Ngày sinh", isDynamicCol: false },
      {
        field: "regular_mark",
        value: "ĐĐGtx",
        isDynamicCol: true,
        colspan:
          regularExam != null &&
          !isNaN(regularExam.max_co1) &&
          !isNaN(regularExam.max_eo1) &&
          !isNaN(regularExam.max_ce1) &&
          !isNaN(regularExam.max_ee1) &&
          !isNaN(regularExam.max_cl1)
            ? Number(regularExam.max_co1) +
              Number(regularExam.max_eo1) +
              Number(regularExam.max_ce1) +
              Number(regularExam.max_ee1) +
              Number(regularExam.max_cl1)
            : 5,
      },
      {
        field: "mid_regular",
        value: "ĐĐGgk",
        isDynamicCol: true,
        colspan:
          midSemesterExam != null &&
          !isNaN(midSemesterExam.max_co2) &&
          !isNaN(midSemesterExam.max_eo2) &&
          !isNaN(midSemesterExam.max_ce2) &&
          !isNaN(midSemesterExam.max_ee2) &&
          !isNaN(midSemesterExam.max_cl2)
            ? Number(midSemesterExam.max_co2) +
              Number(midSemesterExam.max_eo2) +
              Number(midSemesterExam.max_ce2) +
              Number(midSemesterExam.max_ee2) +
              Number(midSemesterExam.max_cl2)
            : 5,
      },
      {
        field: "last_regular",
        value: "ĐĐGck",
        isDynamicCol: true,
        colspan:
          lastSemesterExam != null &&
          !isNaN(lastSemesterExam.max_co3) &&
          !isNaN(lastSemesterExam.max_eo3) &&
          !isNaN(lastSemesterExam.max_ce3) &&
          !isNaN(lastSemesterExam.max_ee3) &&
          !isNaN(lastSemesterExam.max_cl3)
            ? Number(lastSemesterExam.max_co3) +
              Number(lastSemesterExam.max_eo3) +
              Number(lastSemesterExam.max_ce3) +
              Number(lastSemesterExam.max_ee3) +
              Number(lastSemesterExam.max_cl3)
            : 5,
      },
      { field: "scores", value: "TBHK", isDynamicCol: false },
      { field: "remarks", value: "Nhận xét", isDynamicCol: false },
    ];
    // this.headerData.push(
    //   { field: 'remarks', value: 'Nhận xét', isDynamicCol: false }
    // );

    this.headerData2 = [
      {
        field: "regular_mark_co1",
        value: "CO",
        isDynamicCol: true,
        colspan:
          regularExam != null && !isNaN(regularExam.max_co1)
            ? Number(regularExam.max_co1)
            : 1,
      },
      {
        field: "regular_mark_eo1",
        value: "EO",
        isDynamicCol: true,
        colspan:
          regularExam != null && !isNaN(regularExam.max_eo1)
            ? Number(regularExam.max_eo1)
            : 1,
      },
      {
        field: "regular_mark_ce1",
        value: "CE",
        isDynamicCol: true,
        colspan:
          regularExam != null && !isNaN(regularExam.max_ce1)
            ? Number(regularExam.max_ce1)
            : 1,
      },
      {
        field: "regular_mark_ee1",
        value: "EE",
        isDynamicCol: true,
        colspan:
          regularExam != null && !isNaN(regularExam.max_ee1)
            ? Number(regularExam.max_ee1)
            : 1,
      },
      {
        field: "regular_mark_cl1",
        value: "CL",
        isDynamicCol: true,
        colspan:
          regularExam != null && !isNaN(regularExam.max_cl1)
            ? Number(regularExam.max_cl1)
            : 1,
      },

      {
        field: "mid_regular_co2",
        value: "CO",
        isDynamicCol: true,
        colspan:
          midSemesterExam != null && !isNaN(midSemesterExam.max_co2)
            ? Number(midSemesterExam.max_co2)
            : 1,
      },
      {
        field: "mid_regular_eo2",
        value: "EO",
        isDynamicCol: true,
        colspan:
          midSemesterExam != null && !isNaN(midSemesterExam.max_co2)
            ? Number(midSemesterExam.max_eo2)
            : 1,
      },
      {
        field: "mid_regular_ce2",
        value: "CE",
        isDynamicCol: true,
        colspan:
          midSemesterExam != null && !isNaN(midSemesterExam.max_ce2)
            ? Number(midSemesterExam.max_ce2)
            : 1,
      },
      {
        field: "mid_regular_ee2",
        value: "EE",
        isDynamicCol: true,
        colspan:
          midSemesterExam != null && !isNaN(midSemesterExam.max_ee2)
            ? Number(midSemesterExam.max_ee2)
            : 1,
      },
      {
        field: "mid_regular_cl2",
        value: "CL",
        isDynamicCol: true,
        colspan:
          midSemesterExam != null && !isNaN(midSemesterExam.max_cl2)
            ? Number(midSemesterExam.max_cl2)
            : 1,
      },

      {
        field: "last_regular_co3",
        value: "CO",
        isDynamicCol: true,
        colspan:
          midSemesterExam != null && !isNaN(lastSemesterExam.max_max_co3cl2)
            ? Number(lastSemesterExam.max_co3)
            : 1,
      },
      {
        field: "last_regular_eo3",
        value: "EO",
        isDynamicCol: true,
        colspan:
          lastSemesterExam != null && !isNaN(lastSemesterExam.max_eo3)
            ? Number(lastSemesterExam.max_eo3)
            : 1,
      },
      {
        field: "last_regular_ce3",
        value: "CE",
        isDynamicCol: true,
        colspan:
          lastSemesterExam != null && !isNaN(lastSemesterExam.max_ce3)
            ? Number(lastSemesterExam.max_ce3)
            : 1,
      },
      {
        field: "last_regular_ee3",
        value: "EE",
        isDynamicCol: true,
        colspan:
          lastSemesterExam != null && !isNaN(lastSemesterExam.max_ee3)
            ? Number(lastSemesterExam.max_ee3)
            : 1,
      },
      {
        field: "last_regular_cl3",
        value: "CL",
        isDynamicCol: true,
        colspan:
          lastSemesterExam != null && !isNaN(lastSemesterExam.max_cl3)
            ? Number(lastSemesterExam.max_cl3)
            : 1,
      },
    ];

    if (regularExam) {
      this.dynamicCols = [];
      if (regularExam != null && !isNaN(regularExam.max_co1)) {
        for (let i = 0; i < regularExam.max_co1; i++) {
          this.dynamicCols.push({
            field: "regular_mark_co" + (i + 1),
            value: (i + 1).toString(),
          });
        }
      } else {
        this.dynamicCols.push({
          field: "regular_mark_co1",
          value: 1,
        });
      }
      if (regularExam != null && !isNaN(regularExam.max_eo1)) {
        for (let i = 0; i < regularExam.max_eo1; i++) {
          this.dynamicCols.push({
            field: "regular_mark_eo" + (i + 1),
            value: (i + 1).toString(),
          });
        }
      } else {
        this.dynamicCols.push({
          field: "regular_mark_eo1",
          value: 1,
        });
      }
      if (regularExam != null && !isNaN(regularExam.max_ce1)) {
        for (let i = 0; i < regularExam.max_ce1; i++) {
          this.dynamicCols.push({
            field: "regular_mark_ce" + (i + 1),
            value: (i + 1).toString(),
          });
        }
      } else {
        this.dynamicCols.push({
          field: "regular_mark_ce1",
          value: 1,
        });
      }
      if (regularExam != null && !isNaN(regularExam.max_ee1)) {
        for (let i = 0; i < regularExam.max_ee1; i++) {
          this.dynamicCols.push({
            field: "regular_mark_ee" + (i + 1),
            value: (i + 1).toString(),
          });
        }
      } else {
        this.dynamicCols.push({
          field: "regular_mark_ee1",
          value: 1,
        });
      }
      if (regularExam != null && !isNaN(regularExam.max_cl1)) {
        for (let i = 0; i < regularExam.max_cl1; i++) {
          this.dynamicCols.push({
            field: "regular_mark_cl" + (i + 1),
            value: (i + 1).toString(),
          });
        }
      } else {
        this.dynamicCols.push({
          field: "regular_mark_cl1",
          value: 1,
        });
      }
    }
    if (midSemesterExam) {
      if (midSemesterExam != null && !isNaN(midSemesterExam.max_co2)) {
        for (let i = 0; i < midSemesterExam.max_co2; i++) {
          this.dynamicCols.push({
            field: "mid_regular_co" + (i + 1),
            value: (i + 1).toString(),
          });
        }
      } else {
        this.dynamicCols.push({
          field: "mid_regular_co1",
          value: 1,
        });
      }

      if (midSemesterExam != null && !isNaN(midSemesterExam.max_eo2)) {
        for (let i = 0; i < midSemesterExam.max_eo2; i++) {
          this.dynamicCols.push({
            field: "mid_regular_eo" + (i + 1),
            value: (i + 1).toString(),
          });
        }
      } else {
        this.dynamicCols.push({
          field: "mid_regular_eo1",
          value: 1,
        });
      }

      if (midSemesterExam != null && !isNaN(midSemesterExam.max_ce2)) {
        for (let i = 0; i < midSemesterExam.max_ce2; i++) {
          this.dynamicCols.push({
            field: "mid_regular_ce" + (i + 1),
            value: (i + 1).toString(),
          });
        }
      } else {
        this.dynamicCols.push({
          field: "mid_regular_ce1",
          value: 1,
        });
      }

      if (midSemesterExam != null && !isNaN(midSemesterExam.max_ee2)) {
        for (let i = 0; i < midSemesterExam.max_ee2; i++) {
          this.dynamicCols.push({
            field: "mid_regular_ee" + (i + 1),
            value: (i + 1).toString(),
          });
        }
      } else {
        this.dynamicCols.push({
          field: "mid_regular_ee1",
          value: 1,
        });
      }

      if (midSemesterExam != null && !isNaN(midSemesterExam.max_cl2)) {
        for (let i = 0; i < midSemesterExam.max_cl2; i++) {
          this.dynamicCols.push({
            field: "mid_regular_cl" + (i + 1),
            value: (i + 1).toString(),
          });
        }
      } else {
        this.dynamicCols.push({
          field: "mid_regular_cl1",
          value: 1,
        });
      }
    }
    if (lastSemesterExam) {
      if (lastSemesterExam != null && !isNaN(lastSemesterExam.max_co3)) {
        for (let i = 0; i < lastSemesterExam.max_co3; i++) {
          this.dynamicCols.push({
            field: "last_regular_co" + (i + 1),
            value: (i + 1).toString(),
          });
        }
      } else {
        this.dynamicCols.push({
          field: "last_regular_co1",
          value: 1,
        });
      }
      if (lastSemesterExam != null && !isNaN(lastSemesterExam.max_eo3)) {
        for (let i = 0; i < lastSemesterExam.max_eo3; i++) {
          this.dynamicCols.push({
            field: "last_regular_eo" + (i + 1),
            value: (i + 1).toString(),
          });
        }
      } else {
        this.dynamicCols.push({
          field: "last_regular_eo1",
          value: 1,
        });
      }
      if (lastSemesterExam != null && !isNaN(lastSemesterExam.max_ce3)) {
        for (let i = 0; i < lastSemesterExam.max_ce3; i++) {
          this.dynamicCols.push({
            field: "last_regular_ce" + (i + 1),
            value: (i + 1).toString(),
          });
        }
      } else {
        this.dynamicCols.push({
          field: "last_regular_ce1",
          value: 1,
        });
      }
      if (lastSemesterExam != null && !isNaN(lastSemesterExam.max_ee3)) {
        for (let i = 0; i < lastSemesterExam.max_ee3; i++) {
          this.dynamicCols.push({
            field: "last_regular_ee" + (i + 1),
            value: (i + 1).toString(),
          });
        }
      } else {
        this.dynamicCols.push({
          field: "last_regular_ee1",
          value: 1,
        });
      }
      if (lastSemesterExam != null && !isNaN(lastSemesterExam.max_cl3)) {
        for (let i = 0; i < lastSemesterExam.max_cl3; i++) {
          this.dynamicCols.push({
            field: "last_regular_cl" + (i + 1),
            value: (i + 1).toString(),
          });
        }
      } else {
        this.dynamicCols.push({
          field: "last_regular_cl1",
          value: 1,
        });
      }
    }
  }

  // Header không phải hệ điểm song ngữ
  headerSubjectNotBilingual(subjectType, studentMarkBoard, regularExamValue) {
    this.headerData = [];
    const filterControl = this.academicTranscriptForm;
    if (
      filterControl.value.semester.id ==
      filterControl.value.semester.last_semester_id
    ) {
      this.headerData = [
        // { field: 'id', value: 'STT', isDynamicCol: false },
        { field: "code", value: "Mã học sinh", isDynamicCol: false },
        { field: "name", value: "Họ và tên", isDynamicCol: false },
        { field: "dob", value: "Ngày sinh", isDynamicCol: false },
        { field: "regular_mark", value: "ĐĐGtx", isDynamicCol: true },
        { field: "mid_regular", value: "ĐĐGgk", isDynamicCol: false },
        { field: "last_regular", value: "ĐĐGck", isDynamicCol: false },
      ];
      let total = filterControl.value.semester.total;
      for (let index = 1; index <= total; index++) {
        this.headerData.push({
          field: "scores" + index,
          value: "TBHK" + index,
          isDynamicCol: false,
        });
      }
      this.headerData.push(
        { field: "last_scores", value: "TBCN", isDynamicCol: false },
        { field: "remarks", value: "Nhận xét", isDynamicCol: false }
      );
    } else {
      this.headerData = [
        // { field: 'id', value: 'STT', isDynamicCol: false },
        { field: "code", value: "Mã học sinh", isDynamicCol: false },
        { field: "name", value: "Họ và tên", isDynamicCol: false },
        { field: "dob", value: "Ngày sinh", isDynamicCol: false },
        { field: "regular_mark", value: "ĐĐGtx", isDynamicCol: true },
        { field: "mid_regular", value: "ĐĐGgk", isDynamicCol: false },
        { field: "last_regular", value: "ĐĐGck", isDynamicCol: false },
        { field: "scores", value: "TBHK", isDynamicCol: false },
        { field: "remarks", value: "Nhận xét", isDynamicCol: false },
      ];
    }

    switch (subjectType) {
      case 1:
        this.courseScoring = true;
        break;
      case 2:
        this.courseScoring = false;
        break;
      default:
        this.courseScoring = true;
    }
    this.dynamicCols = [];
    for (let i = 0; i < regularExamValue; i++) {
      this.dynamicCols.push({
        field: "regular_exam_" + (i + 1),
        value: (i + 1).toString(),
      });
    }
  }

  isSelected: boolean = false;
  checkedCategoryList: any;
  checkUncheckAll(event: any) {
    for (var i = 0; i < this.dataSource.length; i++) {
      this.dataSource[i].selected = this.isSelected;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.isSelected = this.dataSource.every(function (item: any) {
      return item.selected == true;
    });
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedCategoryList = [];
    for (var i = 0; i < this.dataSource.length; i++) {
      if (this.dataSource[i].selected)
        this.checkedCategoryList.push(this.dataSource[i]);
    }
    this.checkedCategoryList = JSON.stringify(this.checkedCategoryList);
  }

  bindingComment() {
    const filterControl = this.academicTranscriptForm;
    let comment = filterControl.value.comment;
    this.dataSource.forEach((item) => {
      if (item.selected) {
        item.remarks = comment;
      }
    });
    $("#quichEntryModal").modal("hide");
    $(".modal-backdrop").remove();
  }

  checkSelectedDataRow() {
    const findRowSelected = this.dataSource.find(
      (item) => item.selected == true
    );
    if (!findRowSelected) {
      this.notifyService.showWarning(
        "Vui lòng chọn bản ghi dữ liệu cần cập nhật!",
        "Thông báo"
      );
      return;
    }
    $("#quichEntryModal").modal("show");
  }

  // Xử lý sự kiện khi chọn năm học lấy dữ liệu lớp theo năm học
  onSelectYear(item: any) {
    this.selectedClass = [];
    this.selectedSemester = [];
    this.ddlClassData = [];
    this.ddlSemesterData = [];
    if (item) {
      const arrClass = [];
      this.academicTranscriptService
        .classList(item.id)
        .pipe()
        .subscribe((res) => {
          res["query"].forEach(function (items) {
            if (items["level"] !== 1) {
              arrClass.push({
                id: items["id"],
                name: items["class_name"],
                level: items["level"],
                year_id: item["id"],
              });
            }
          });

          this.ddlClassData = arrClass;
        });
    }
  }

  // Xử lý sự kiện chọn lớp lấy dữ liệu học kỳ theo lớp
  onSelectClass(item: any) {
    this.selectedSemester = [];
    if (item) {
      const arrSemester = [];
      this.academicTranscriptService
        .semesterList(item["year_id"], item.level)
        .subscribe((res) => {
          if (Object.keys(res["query"]).length > 0) {
            let total = res["query"].length;
            res["query"].forEach(function (items) {
              if (items["level"] !== 1) {
                arrSemester.push({
                  id: items["id"],
                  name: items["name"],
                  level: items["level"],
                  exam_time: items["exam_time"],
                  last_semester_id: res.last_semester_id,
                  total: total,
                });
              }
            });
            this.ddlSemesterData = arrSemester;
            this.selectedSemester = arrSemester[0];
          }
        });
    }
  }

  // Lọc dữ liệu lấy ra danh sách môn học
  filter() {
    this.activeTab = "";
    this.listTabs = [];
    this.dataSource = [];
    this.headerData = [];
    this.headerData2 = [];
    this.dynamicCols = [];
    this.loadingBilingualTab = true;
    this.loadingNotBilingualTab = true;
    this.loadingFilter = true;
    this.submitted = true;
    const filterFormData = new FormData();
    const filterControl = this.academicTranscriptForm;
    if (filterControl.invalid) {
      this.loadingFilter = false;
      return;
    }
    if (filterControl.value.year) {
      filterFormData.append("year_id", filterControl.value.year.id);
    }
    if (filterControl.value.semester) {
      filterFormData.append("semester_id", filterControl.value.semester.id);
    }
    if (filterControl.value.class) {
      filterFormData.append("class_id", filterControl.value.class.id);
    }
    this.academicTranscriptService.subjectList(filterFormData).subscribe(
      (res) => {
        this.loadingBilingualTab = false;
        this.loadingNotBilingualTab = false;
        this.loadingFilter = false;
        if (Object.keys(res["query"]).length > 0) {
          this.listTabs = res["query"];
          this.checkData = true;
        }
      },
      (error) => {
        this.loadingFilter = false;
        this.notifyService.showError(
          "Không tìm thấy dữ liệu môn học",
          "Thông báo lỗi"
        );
      }
    );
  }
  sortFistName(data) {
    const array = data;
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
  }

  alphabetsFather = [
    "A",
    "À",
    "Ả",
    "Ã",
    "Á",
    "Ạ",
    "Ă",
    "Ằ",
    "Ẳ",
    "Ẵ",
    "Ắ",
    "Ặ",
    "Â",
    "Ầ",
    "Ẩ",
    "Ẫ",
    "Ấ",
    "Ậ",
    "B",
    "C",
    "D",
    "Đ",
    "E",
    "È",
    "Ẻ",
    "Ẽ",
    "É",
    "Ẹ",
    "Ê",
    "Ề",
    "Ể",
    "Ễ",
    "Ế",
    "Ệ",
    "F",
    "G",
    "H",
    "I",
    "Ì",
    "Ỉ",
    "Ĩ",
    "Í",
    "Ị",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "Ò",
    "Ỏ",
    "Õ",
    "Ó",
    "Ọ",
    "Ô",
    "Ồ",
    "Ổ",
    "Ỗ",
    "Ố",
    "Ộ",
    "Ơ",
    "Ờ",
    "Ở",
    "Ỡ",
    "Ớ",
    "Ợ",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "Ù",
    "Ủ",
    "Ũ",
    "Ú",
    "Ụ",
    "Ư",
    "Ừ",
    "Ử",
    "Ữ",
    "Ứ",
    "Ự",
    "V",
    "W",
    "X",
    "Y",
    "Ỳ",
    "Ỷ",
    "Ỹ",
    "Ý",
    "Ỵ",
    "Z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    " ",
  ];

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

  typeRowData() {
    $(".tabIndexTypeData").attr("tabIndex", "8");
  }

  typeColumnData() {
    $(".tabIndexTypeData1").attr("tabIndex", "9");
  }

  save() {
    let formData = new FormData();
    let i = 0;
    const filterControl = this.academicTranscriptForm;
    let semester_id = filterControl.value.semester.id;
    let class_id = filterControl.value.class.id;
    formData.append("semester_id", semester_id);
    formData.append("class_id", class_id);
    formData.append("detail_study_program_id", this.get_detail_study_program);
    //Chương trình học song ngữ
    if (this.flagOps3 === true) {
      this.dataSource.forEach(function (item) {
        if (
          item.regular_mark_co1 ||
          item.regular_mark_eo1 ||
          item.regular_mark_ce1 ||
          item.regular_mark_ee1 ||
          item.regular_mark_cl1 ||
          item.mid_regular_co1 ||
          item.mid_regular_eo1 ||
          item.mid_regular_ce1 ||
          item.mid_regular_ee1 ||
          item.mid_regular_cl1 ||
          item.last_regular_co1 ||
          item.last_regular_eo1 ||
          item.last_regular_ce1 ||
          item.last_regular_ee1 ||
          item.last_regular_cl1
        ) {
          // Id học sinh
          formData.append("data" + "[" + i + "]" + "[student_id]", item.id);
          const markArr = [
            { name: "regular_mark_co", tt: "re", ht: "co1" },
            { name: "regular_mark_eo", tt: "re", ht: "eo1" },
            { name: "regular_mark_ce", tt: "re", ht: "ce1" },
            { name: "regular_mark_ee", tt: "re", ht: "ee1" },
            { name: "regular_mark_cl", tt: "re", ht: "cl1" },

            { name: "mid_regular_co", tt: "mid", ht: "co2" },
            { name: "mid_regular_eo", tt: "mid", ht: "eo2" },
            { name: "mid_regular_ce", tt: "mid", ht: "ce2" },
            { name: "mid_regular_ee", tt: "mid", ht: "ee2" },
            { name: "mid_regular_cl", tt: "mid", ht: "cl2" },

            { name: "last_regular_co", tt: "last", ht: "co3" },
            { name: "last_regular_eo", tt: "last", ht: "eo3" },
            { name: "last_regular_ce", tt: "last", ht: "ce3" },
            { name: "last_regular_ee", tt: "last", ht: "ee3" },
            { name: "last_regular_cl", tt: "last", ht: "cl3" },

            { name: "remarks" },
          ];
          markArr.forEach((elm) => {
            const reco = [];
            for (const [key, value] of Object.entries(item)) {
              if (key.startsWith(elm.name)) {
                if (value != "") {
                  let lastCharacter = key.substr(key.length - 1);
                  reco[lastCharacter] = value;
                }
              }
            }
            if (reco.length > 0) {
              let j = 0;
              reco.forEach((e) => {
                if (e) {
                  formData.append(
                    "data" +
                      "[" +
                      i +
                      "]" +
                      "[avg][" +
                      elm.tt +
                      "][" +
                      elm.ht +
                      "]" +
                      "[" +
                      j +
                      "]",
                    e
                  );
                  j++;
                }
              });
            }
          });
          formData.append(
            "data" + "[" + i + "]" + "[avg][comment]",
            item.remarks
          );
          i++;
        }
      });
    } else {
      //Chương trình học không phải song ngữ
      this.dataSource.forEach(function (item) {
        // Id học sinh
        formData.append("data" + "[" + i + "]" + "[student_id]", item.id);
        // Điểm kiểm tra giữa kỳ
        const mid_regular = item.mid_regular;
        if (mid_regular) {
          if (isNaN(mid_regular)) {
            formData.append(
              "data" + "[" + i + "]" + "[avg][mid][0]",
              mid_regular == "Đ" ? "7" : "4"
            );
          } else {
            formData.append(
              "data" + "[" + i + "]" + "[avg][mid][0]",
              mid_regular
            );
          }
        }

        const last_regular = item.last_regular;
        if (last_regular) {
          if (isNaN(last_regular)) {
            formData.append(
              "data" + "[" + i + "]" + "[avg][last][0]",
              last_regular == "Đ" ? "7" : "4"
            );
          } else {
            formData.append(
              "data" + "[" + i + "]" + "[avg][last][0]",
              last_regular
            );
          }
        }
        // Nhận xét
        if (item.remarks) {
          formData.append(
            "data" + "[" + i + "]" + "[avg][comment]",
            item.remarks
          );
        }

        const reArr = [];
        for (const [key, value] of Object.entries(item)) {
          if (key.startsWith("regular_exam")) {
            if (value) {
              let lastCharacter = key.substr(key.length - 1);
              reArr[lastCharacter] = value;
            }
          }
        }
        if (reArr.length > 0) {
          let j = 0;
          reArr.forEach((e) => {
            if (e && isNaN(e)) {
              formData.append(
                "data" + "[" + i + "]" + "[avg][re]" + "[" + j + "]",
                e == "Đ" ? "7" : "4"
              );
            } else {
              formData.append(
                "data" + "[" + i + "]" + "[avg][re]" + "[" + j + "]",
                e
              );
            }
            j++;
          });
        }

        i++;
      });
    }
    this.academicTranscriptService
      .createMarkBoard(formData)
      .pipe()
      .subscribe(
        (res) => {
          if (res.message === "success") {
            this.notifyService.showSuccess(
              "Cập nhật dữ liệu thành công",
              "Thông báo"
            );
            this.getStudentData(this.subjectData);
          }
        },
        (error) => {
          if (error.error) {
            switch (error.error) {
              case 11:
                this.notifyService.showError(
                  "Chương trình học không tồn tại",
                  "Thông báo lỗi"
                );
                return;
              case 121:
                this.notifyService.showError(
                  "Năm học phải là năm trong hiện tại và tương lai",
                  "Thông báo lỗi"
                );
                return;
              case 13:
                this.notifyService.showError(
                  "Môn học không được áp dụng cho lớp hoặc không thuộc học kỳ",
                  "Thông báo lỗi"
                );
                return;
              case 15:
                this.notifyService.showError(
                  "Vui lòng thêm lần lượt dữ liệu học kỳ",
                  "Thông báo lỗi"
                );
                return;
              case 19:
                this.notifyService.showError(
                  "Vui lòng truyền dữ liệu học sinh",
                  "Thông báo lỗi"
                );
                return;
              default:
                this.notifyService.showError(
                  "Cập nhật không thành công",
                  "Thông báo lỗi"
                );
                return;
            }
          } else {
            this.notifyService.showError(
              "Cập nhật không thành công",
              "Thông báo lỗi"
            );
            return;
          }
        }
      );
  }

  //Binding dữ liệu
  getStudentData(item: any) {
    if (item.subject_type == 2) {
      this.subject_type_display = 2;
    } else {
      this.subject_type_display = 1;
    }
    // this.activeTab = '';
    this.studentList = [];
    this.subjectData = [];

    this.markBoardList = [];
    this.dataSource = [];
    this.subjectData = item;
    this.loadingBilingualTab = true;
    this.loadingNotBilingualTab = true;
    const filterFormData = new FormData();
    const filterControl = this.academicTranscriptForm;

    if (filterControl.value.class) {
      filterFormData.append("class_id", filterControl.value.class.id);
    }
    if (item.detail_study_program_id) {
      filterFormData.append(
        "detail_study_program_id",
        item.detail_study_program_id
      );
      this.get_detail_study_program = item.detail_study_program_id;
    }
    if (item.study_program_id) {
      filterFormData.append("study_program_id", item.study_program_id);
    }
    if (item.subject_id) {
      filterFormData.append("subject_id", item.subject_id);
    }
    if (item.subject_type) {
      filterFormData.append("subject_type", item.subject_type);
    }
    if (filterControl.value.semester) {
      filterFormData.append("semester_id", filterControl.value.semester.id);
      filterFormData.append(
        "last_semester_id",
        filterControl.value.semester.last_semester_id
      );
    }

    this.academicTranscriptService
      .studentList(filterFormData)
      .subscribe((res) => {
        if (Object.keys(res["query"]).length > 0) {
          this.studentList = res["query"];

          this.academicTranscriptService
            .coefficientSubjectTypeList(filterFormData)
            .subscribe((res) => {
              if (Object.keys(res["query"]).length > 0) {
                this.coefficientSubjectType = res["query"];
                const studentMarkBoard = res["query"];
                if (
                  JSON.parse(studentMarkBoard.subject_kind).ops3 === "1" &&
                  JSON.parse(studentMarkBoard.subject_kind).ops5 === "1"
                ) {
                  this.flagOps3 = true;
                  this.loadingBilingualTab = false;
                  this.activeTab = "bilingulalTab";
                  const checkBilingualSetting = JSON.parse(
                    studentMarkBoard.regular_exam
                  );
                  if (
                    JSON.parse(studentMarkBoard.subject_kind).ops5 === "1" &&
                    isNaN(checkBilingualSetting.min_co1)
                  ) {
                    this.notifyService.showError(
                      "Vui lòng cấu hình điểm môn song ngữ!",
                      "Thông báo lỗi"
                    );
                    return false;
                  } else {
                    this.headerSubjectBilingual(studentMarkBoard);
                    if (this.studentList) {
                      this.studentList.forEach((el) => {
                        this.dataSource.push({
                          id: el.id,
                          code: el.code,
                          name: `${el.lastname} ${el.firstname}`,
                          dob: el.dob,
                          selected: false,
                        });
                      });
                      this.sortFistName(this.dataSource);
                    }
                  }
                } else {
                  this.flagOps3 = false;
                  this.loadingNotBilingualTab = false;
                  this.activeTab = "notBilingulalTab";
                  if (this.studentList) {
                    this.headerSubjectNotBilingual(
                      item.subject_type,
                      this.studentList,
                      JSON.parse(studentMarkBoard.regular_exam).max1
                    );
                    const data = [];
                    this.studentList.forEach((el) => {
                      data.push({
                        id: el.id,
                        code: el.code,
                        name: `${el.lastname} ${el.firstname}`,
                        dob: el.dob,
                        selected: false,
                      });
                    });
                    this.dataSource = data;
                    this.sortFistName(this.dataSource);
                  }
                }
              } else {
                this.notifyService.showError(
                  "Không tìm thấy dữ liệu môn học",
                  "Thông báo"
                );
              }
            });

          this.academicTranscriptService
            .markBoardList(filterFormData)
            .subscribe((res) => {
              if (res) {
                if (Object.keys(res["query"]).length > 0) {
                  this.markBoard = false;
                  this.markBoardList = res["query"];
                  const coefficientSubjectType = this.coefficientSubjectType;
                  this.markBoardList.forEach((el) => {
                    //AVG
                    if (
                      filterControl.value.semester.id ==
                      filterControl.value.semester.last_semester_id
                    ) {
                      if (
                        JSON.parse(coefficientSubjectType["subject_kind"])
                          .ops3 === "1" &&
                        JSON.parse(coefficientSubjectType["subject_kind"])
                          .ops5 === "1"
                      ) {
                        this.flagOps3 = true;

                        let found = this.dataSource.find(
                          (element) => el.students_id == element.id
                        );
                        let regular_mark = JSON.parse(el.avg);
                        if (regular_mark.length > 0) {
                          let findLastSemester = regular_mark.find(
                            (elm) =>
                              filterControl.value.semester.last_semester_id ==
                              elm.semester_id
                          );

                          if (findLastSemester) {
                            if (
                              findLastSemester.re.co1 &&
                              findLastSemester.re.co1.length > 0
                            ) {
                              for (
                                let index = 0;
                                index < findLastSemester.re.co1.length;
                                index++
                              ) {
                                found["regular_mark_co" + (index + 1)] =
                                  findLastSemester.re.co1[index];
                              }
                            }
                            if (
                              findLastSemester.re.eo1 &&
                              findLastSemester.re.eo1.length > 0
                            ) {
                              for (
                                let index = 0;
                                index < findLastSemester.re.eo1.length;
                                index++
                              ) {
                                found["regular_mark_eo" + (index + 1)] =
                                  findLastSemester.re.eo1[index];
                              }
                            }
                            if (
                              findLastSemester.re.ce1 &&
                              findLastSemester.re.ce1.length > 0
                            ) {
                              for (
                                let index = 0;
                                index < findLastSemester.re.ce1.length;
                                index++
                              ) {
                                found["regular_mark_ce" + (index + 1)] =
                                  findLastSemester.re.ce1[index];
                              }
                            }
                            if (
                              findLastSemester.re.ee1 &&
                              findLastSemester.re.ee1.length > 0
                            ) {
                              for (
                                let index = 0;
                                index < findLastSemester.re.ee1.length;
                                index++
                              ) {
                                found["regular_mark_ee" + (index + 1)] =
                                  findLastSemester.re.ee1[index];
                              }
                            }
                            if (
                              findLastSemester.re.cl1 &&
                              findLastSemester.re.cl1.length > 0
                            ) {
                              for (
                                let index = 0;
                                index < findLastSemester.re.cl1.length;
                                index++
                              ) {
                                found["regular_mark_cl" + (index + 1)] =
                                  findLastSemester.re.cl1[index];
                              }
                            }

                            if (
                              findLastSemester.mid.co2 &&
                              findLastSemester.mid.co2.length > 0
                            ) {
                              for (
                                let index = 0;
                                index < findLastSemester.mid.co2.length;
                                index++
                              ) {
                                found["mid_regular_co" + (index + 1)] =
                                  findLastSemester.mid.co2[index];
                              }
                            }
                            if (
                              findLastSemester.mid.eo2 &&
                              findLastSemester.mid.eo2.length > 0
                            ) {
                              for (
                                let index = 0;
                                index < findLastSemester.mid.eo2.length;
                                index++
                              ) {
                                found["mid_regular_eo" + (index + 1)] =
                                  findLastSemester.mid.eo2[index];
                              }
                            }
                            if (
                              findLastSemester.mid.ce2 &&
                              findLastSemester.mid.ce2.length > 0
                            ) {
                              for (
                                let index = 0;
                                index < findLastSemester.mid.ce2.length;
                                index++
                              ) {
                                found["mid_regular_ce" + (index + 1)] =
                                  findLastSemester.mid.ce2[index];
                              }
                            }
                            if (
                              findLastSemester.mid.ee2 &&
                              findLastSemester.mid.ee2.length > 0
                            ) {
                              for (
                                let index = 0;
                                index < findLastSemester.mid.ee2.length;
                                index++
                              ) {
                                found["mid_regular_ee" + (index + 1)] =
                                  findLastSemester.mid.ee2[index];
                              }
                            }
                            if (
                              findLastSemester.mid.cl2 &&
                              findLastSemester.mid.cl2.length > 0
                            ) {
                              for (
                                let index = 0;
                                index < findLastSemester.mid.cl2.length;
                                index++
                              ) {
                                found["mid_regular_cl" + (index + 1)] =
                                  findLastSemester.mid.cl2[index];
                              }
                            }

                            if (
                              findLastSemester.last.co3 &&
                              findLastSemester.last.co3.length > 0
                            ) {
                              for (
                                let index = 0;
                                index < findLastSemester.last.co3.length;
                                index++
                              ) {
                                found["last_regular_co" + (index + 1)] =
                                  findLastSemester.last.co3[index];
                              }
                            }
                            if (
                              findLastSemester.last.eo3 &&
                              findLastSemester.last.eo3.length > 0
                            ) {
                              for (
                                let index = 0;
                                index < findLastSemester.last.eo3.length;
                                index++
                              ) {
                                found["last_regular_eo" + (index + 1)] =
                                  findLastSemester.last.eo3[index];
                              }
                            }
                            if (
                              findLastSemester.last.ce3 &&
                              findLastSemester.last.ce3.length > 0
                            ) {
                              for (
                                let index = 0;
                                index < findLastSemester.last.ce3.length;
                                index++
                              ) {
                                found["last_regular_ce" + (index + 1)] =
                                  findLastSemester.last.ce3[index];
                              }
                            }
                            if (
                              findLastSemester.last.ee3 &&
                              findLastSemester.last.ee3.length > 0
                            ) {
                              for (
                                let index = 0;
                                index < findLastSemester.last.ee3.length;
                                index++
                              ) {
                                found["last_regular_ee" + (index + 1)] =
                                  findLastSemester.last.ee3[index];
                              }
                            }
                            if (
                              findLastSemester.last.cl3 &&
                              findLastSemester.last.cl3.length > 0
                            ) {
                              for (
                                let index = 0;
                                index < findLastSemester.last.cl3.length;
                                index++
                              ) {
                                found["last_regular_cl" + (index + 1)] =
                                  findLastSemester.last.cl3[index];
                              }
                            }
                            found.scores = findLastSemester.scores;
                            if (findLastSemester.comment != "undefined") {
                              found.remarks = findLastSemester.comment;
                            }
                          }
                        }
                      } else {
                        this.flagOps3 = false;
                        let found = this.dataSource.find(
                          (item) => el.students_id == item.id
                        );

                        if (found) {
                          let findLastScore = JSON.parse(el.avg).find(
                            (value) => value.last_scores != undefined
                          );
                          //Tìm điểm cuối kỳ nếu có
                          if (findLastScore) {
                            let lastScore = findLastScore.re;
                            for (
                              let index = 0;
                              index < lastScore.length;
                              index++
                            ) {
                              if (
                                lastScore[index] >= 6.5 &&
                                this.subject_type_display == 2
                              ) {
                                found["regular_exam_" + (index + 1)] = "Đ";
                              } else if (
                                lastScore[index] <= 6.5 &&
                                this.subject_type_display == 2
                              ) {
                                found["regular_exam_" + (index + 1)] = "C";
                              } else {
                                found["regular_exam_" + (index + 1)] =
                                  lastScore[index];
                              }
                            }

                            if (
                              findLastScore.mid[0] >= 6.5 &&
                              this.subject_type_display == 2
                            ) {
                              found.mid_regular = "Đ";
                            } else if (
                              findLastScore.mid[0] <= 6.5 &&
                              this.subject_type_display == 2
                            ) {
                              found.mid_regular = "C";
                            } else {
                              found.mid_regular = findLastScore.mid[0];
                            }

                            if (
                              findLastScore.last[0] >= 6.5 &&
                              this.subject_type_display == 2
                            ) {
                              found.last_regular = "Đ";
                            } else if (
                              findLastScore.last[0] <= 6.5 &&
                              this.subject_type_display == 2
                            ) {
                              found.last_regular = "C";
                            } else {
                              found.last_regular = findLastScore.last[0];
                            }

                            if (findLastScore.last_scores) {
                              if (
                                findLastScore.last_scores >= 6.5 &&
                                this.subject_type_display == 2
                              ) {
                                found.last_scores = "Đ";
                              } else if (
                                findLastScore.last_scores <= 6.5 &&
                                this.subject_type_display == 2
                              ) {
                                found.last_scores = "C";
                              } else {
                                found.last_scores = findLastScore.last_scores;
                              }
                            }

                            if (findLastScore.comment != "undefined") {
                              found.remarks = findLastScore.comment;
                            }

                            let index = 1;
                            this.ddlSemesterData.forEach((itemSemester) => {
                              let foundSemesterId = JSON.parse(el.avg).find(
                                (value) => value.semester_id == itemSemester.id
                              );
                              if (foundSemesterId) {
                                if (
                                  foundSemesterId.scores >= 6.5 &&
                                  this.subject_type_display == 2
                                ) {
                                  found["scores" + index] = "Đ";
                                } else if (
                                  foundSemesterId.scores <= 6.5 &&
                                  this.subject_type_display == 2
                                ) {
                                  found["scores" + index] = "C";
                                } else {
                                  found["scores" + index] =
                                    foundSemesterId.scores;
                                }
                              }
                              index++;
                            });
                          } else {
                            let index = 1;
                            this.ddlSemesterData.forEach((itemSemester) => {
                              let foundSemesterId = JSON.parse(el.avg).find(
                                (value) => value.semester_id == itemSemester.id
                              );
                              if (foundSemesterId) {
                                if (
                                  foundSemesterId.scores >= 6.5 &&
                                  this.subject_type_display == 2
                                ) {
                                  found["scores" + index] = "Đ";
                                } else if (
                                  foundSemesterId.scores <= 6.5 &&
                                  this.subject_type_display == 2
                                ) {
                                  found["scores" + index] = "C";
                                } else {
                                  found["scores" + index] =
                                    foundSemesterId.scores;
                                }
                              }
                              index++;
                            });
                          }
                        }
                      }
                    } else {
                      let found = this.dataSource.find(
                        (element) => el.students_id == element.id
                      );
                      if (found) {
                        if (
                          JSON.parse(coefficientSubjectType["subject_kind"])
                            .ops3 === "1" &&
                          JSON.parse(coefficientSubjectType["subject_kind"])
                            .ops5 === "1" &&
                          el.regular_mark
                        ) {
                          this.flagOps3 = true;

                          let regular_mar = el.regular_mark;
                          if (
                            regular_mar.co1 ||
                            regular_mar.eo1 ||
                            regular_mar.ce1 ||
                            regular_mar.ee1 ||
                            regular_mar.cl1
                          ) {
                            for (
                              let index = 0;
                              index < regular_mar.co1.length;
                              index++
                            ) {
                              found["regular_mark_co" + (index + 1)] =
                                regular_mar.co1[index];
                              found["regular_mark_eo" + (index + 1)] =
                                regular_mar.eo1[index];
                              found["regular_mark_ce" + (index + 1)] =
                                regular_mar.ce1[index];
                              found["regular_mark_ee" + (index + 1)] =
                                regular_mar.ee1[index];
                              found["regular_mark_cl" + (index + 1)] =
                                regular_mar.cl1[index];
                            }
                          }

                          let mid_regular = el.mid_regular;
                          if (mid_regular.co2) {
                            for (
                              let index = 0;
                              index < mid_regular.co2.length;
                              index++
                            ) {
                              found["mid_regular_co" + (index + 1)] =
                                mid_regular.co2[index];
                            }
                          }
                          if (mid_regular.eo2) {
                            for (
                              let index = 0;
                              index < mid_regular.eo2.length;
                              index++
                            ) {
                              found["mid_regular_eo" + (index + 1)] =
                                mid_regular.eo2[index];
                            }
                          }
                          if (mid_regular.ce2) {
                            for (
                              let index = 0;
                              index < mid_regular.ce2.length;
                              index++
                            ) {
                              found["mid_regular_ce" + (index + 1)] =
                                mid_regular.ce2[index];
                            }
                          }
                          if (mid_regular.ee2) {
                            for (
                              let index = 0;
                              index < mid_regular.ee2.length;
                              index++
                            ) {
                              found["mid_regular_ee" + (index + 1)] =
                                mid_regular.ee2[index];
                            }
                          }
                          if (mid_regular.cl2) {
                            for (
                              let index = 0;
                              index < mid_regular.cl2.length;
                              index++
                            ) {
                              found["mid_regular_cl" + (index + 1)] =
                                mid_regular.cl2[index];
                            }
                          }

                          let last_regular = el.last_regular;
                          if (last_regular.co3) {
                            for (
                              let index = 0;
                              index < last_regular.co3.length;
                              index++
                            ) {
                              found["last_regular_co" + (index + 1)] =
                                last_regular.co3[index];
                            }
                          }
                          if (last_regular.eo3) {
                            for (
                              let index = 0;
                              index < last_regular.eo3.length;
                              index++
                            ) {
                              found["last_regular_eo" + (index + 1)] =
                                last_regular.eo3[index];
                            }
                          }
                          if (last_regular.ce3) {
                            for (
                              let index = 0;
                              index < last_regular.ce3.length;
                              index++
                            ) {
                              found["last_regular_ce" + (index + 1)] =
                                last_regular.ce3[index];
                            }
                          }
                          if (last_regular.ee3) {
                            for (
                              let index = 0;
                              index < last_regular.ee3.length;
                              index++
                            ) {
                              found["last_regular_ee" + (index + 1)] =
                                last_regular.ee3[index];
                            }
                          }
                          if (last_regular.cl3) {
                            for (
                              let index = 0;
                              index < last_regular.cl3.length;
                              index++
                            ) {
                              found["last_regular_cl" + (index + 1)] =
                                last_regular.cl3[index];
                            }
                          }
                          if (el.scores !== undefined) {
                            found.scores = el.scores;
                          }

                          if (el.comment != "undefined") {
                            found.remarks = el.comment;
                          }
                        } else {
                          this.flagOps3 = false;

                          if (el.scores && el.scores !== undefined) {
                            if (
                              el.scores >= 6.5 &&
                              this.subject_type_display == 2
                            ) {
                              found.scores = "Đ";
                            } else if (
                              el.scores <= 6.5 &&
                              this.subject_type_display == 2
                            ) {
                              found.scores = "C";
                            } else {
                              found.scores = el.scores;
                            }
                          }
                          let regularMark = el.regular_mark;
                          if (regularMark) {
                            for (
                              let index = 0;
                              index < regularMark.length;
                              index++
                            ) {
                              if (
                                regularMark[index] >= 6.5 &&
                                this.subject_type_display == 2
                              ) {
                                found["regular_exam_" + (index + 1)] = "Đ";
                              } else if (
                                regularMark[index] <= 6.5 &&
                                this.subject_type_display == 2
                              ) {
                                found["regular_exam_" + (index + 1)] = "C";
                              } else {
                                found["regular_exam_" + (index + 1)] =
                                  regularMark[index];
                              }
                            }
                          }

                          if (el.mid_regular) {
                            if (
                              el.mid_regular[0] >= 6.5 &&
                              this.subject_type_display == 2
                            ) {
                              found.mid_regular = "Đ";
                            } else if (
                              el.mid_regular[0] <= 6.5 &&
                              this.subject_type_display == 2
                            ) {
                              found.mid_regular = "C";
                            } else {
                              found.mid_regular = el.mid_regular[0];
                            }
                          }
                          if (el.last_regular) {
                            if (
                              el.last_regular[0] >= 6.5 &&
                              this.subject_type_display == 2
                            ) {
                              found.last_regular = "Đ";
                            } else if (
                              el.last_regular[0] <= 6.5 &&
                              this.subject_type_display == 2
                            ) {
                              found.last_regular = "C";
                            } else {
                              found.last_regular = el.last_regular[0];
                            }
                            // found.last_regular = el.last_regular[0];
                          }

                          if (el.comment != "undefined") {
                            found.remarks = el.comment;
                          }
                        }
                      }
                    }
                  });
                }
              } else {
                this.markBoard = true;
              }
            });
        } else {
          this.notifyService.showError(
            "Không tìm thấy dữ liệu học sinh",
            "Thông báo"
          );
        }
      });
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

  enterR() {
    $(".inputRow").attr("tabIndex", "9");
    $(".inputRow1").attr("tabIndex", "9");
    $(".inputRow2").attr("tabIndex", "9");
  }

  enterC() {
    $(".inputRow").attr("tabIndex", "8");
    $(".inputRow1").attr("tabIndex", "7");
    $(".inputRow2").attr("tabIndex", "10");
  }

  removeSpecialCharacter(event) {
    var k;
    k = event.charCode;
    if (k == 43 || k == 45 || k == 101) {
      return false;
    }
  }
}
