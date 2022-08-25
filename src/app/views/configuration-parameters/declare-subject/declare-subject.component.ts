import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { first } from "rxjs/operators";
import { Subjects } from "../../../_models/subject";
import { CommonService } from "../../../_services/common.service";
import { NotificationService } from "../../../_services/notification.service";
import { ConfigurationParametersDeclareSubjectService } from "../service/configuration-parameters-declare-subject.service";
declare var $: any;

@Component({
  selector: "app-declare-subject",
  templateUrl: "./declare-subject.component.html",
  styleUrls: ["./declare-subject.component.css"],
})
export class DeclareSubjectComponent implements OnInit {
  fileURL: any;
  @ViewChild("fileInput") fileInput: ElementRef;
  @Input()
  maxNumberOfCharactersDescription = 150;
  counter = true;
  numberOfCharactersDescription = 0;
  //year
  yearDataInsert = [];
  selectedFormAdd = [];
  //grade update
  gradeDataUpdate = [];
  //semester
  ddlSchoolTimeDataUpdate = [];
  ddlSemesterMap = [];
  schoolTimeAdd = [];

  loadingDownload = false;
  loadingImport = false;
  loadingExport = false;
  loadingFilter = false;
  selectedFile: File;
  id: number;
  subjects: Subjects[] = [];
  declareSubjectForm: FormGroup;
  submitted = false;
  checkSubjectData = false;
  searchInput: any;

  subjectData: any;
  headerSubject = false; // Show/ Hide header bảng dữ liệu môn học. Mặc định load form không show header
  p: number = 1;
  countPage: number = 10;
  totalItems = 0;

  //add
  selectedGradeInsert = [];

  ddlGradeSearchData = [];
  selectedGradeSearch = [];
  ddlGradeData = [];
  selectedGrade = [];
  ddlSubjectKindData: any = [];
  selectedSubjectKind = [];
  ddlSubjectTypeData = [];
  selectedSubjectType = [];
  ddlSchoolTimeData = [];
  selectedSchoolTime = [];
  ddlYearData = [];
  selectedYear = [];
  currentYearAdd: any;

  schoolTime = [];
  constructor(
    private fb: FormBuilder,
    private configurationParametersDeclareSubjectService: ConfigurationParametersDeclareSubjectService,
    private notifyService: NotificationService,
    private yearService: CommonService
  ) {}
  get f() {
    return this.declareSubjectForm.controls;
  }
  uploadFile(files) {
    if (files.length === 0) {
      return;
    }
    this.selectedFile = files[0];
    const mimeType = files[0].type;
    if (
      mimeType !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
      mimeType !== "application/vnd.ms-excel"
    ) {
      this.notifyService.showError(
        "Chỉ hỗ trợ định dạng .xls, .xlsx, .csv",
        "Thông báo lỗi"
      );
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.fileURL = this.selectedFile["name"];
    };
  }
  ngOnInit(): void {
    this.subjects = [];
    this.ddlSubjectKindData = [
      { id: 1, name: "Môn bắt buộc" },
      { id: 4, name: "Môn tự chọn" },
      { id: 2, name: "Môn chuyên" },
      { id: 3, name: "Môn khác" },
    ];
    this.ddlSubjectTypeData = [
      { id: 1, name: "Tính điểm" },
      { id: 2, name: "Không tính điểm" },
      { id: 3, name: "Tính điểm đọc viết chung" },
    ];
    this.declareSubjectForm = this.fb.group(
      {
        year_search: new FormControl(""),
        year: new FormControl(""),
        code: new FormControl(""),
        name: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ]),
        symbol: new FormControl("", Validators.maxLength(50)),
        grade_id: new FormControl("", Validators.required),
        grade_id_search: new FormControl(""),
        subject_kind: new FormControl("", Validators.required),
        year_id: new FormControl("", Validators.required),
        subject_type: new FormControl(
          this.ddlSubjectTypeData,
          Validators.required
        ),
        lesson: new FormControl("", [
          Validators.required,
          Validators.maxLength(3),
        ]),
        description: new FormControl(""),
        statusActive: new FormControl(true),
        search: new FormControl(""),
        school_time: new FormControl("", Validators.required),
      },
      {}
    );

    this.configurationParametersDeclareSubjectService
      .getYears()
      .pipe()
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
        this.configurationParametersDeclareSubjectService
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
            this.configurationParametersDeclareSubjectService
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
              });
          });

        // Drop tất cả học kỳ
        // Đổ dữ liệu grades
        this.configurationParametersDeclareSubjectService
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

    //Lấy năm hiện tại và tương lai ở form thêm
    this.yearService
      .getCurrentFutureYear()
      .pipe()
      .subscribe((data) => {
        const yearInsert = [];
        let currentYearData;
        data["query"].forEach(function (item) {
          yearInsert.push({
            id: item["id"],
            name: item["start_year"] + " - " + item["end_year"],
          });
          if (item["status"] === 1) {
            currentYearData = {
              id: item["id"],
              name: item["start_year"] + " - " + item["end_year"],
            };
          }
        });

        this.yearDataInsert = yearInsert;
        this.selectedFormAdd = currentYearData;
        this.currentYearAdd = currentYearData;
      });
    if (this.selectedGradeInsert.length != 0) {
      this.configurationParametersDeclareSubjectService
        .getSemesterCurrentYear()
        .subscribe((data) => {
          const schoolTimeObj = [];
          data["semester"].forEach(function (item) {
            schoolTimeObj.push({ id: item["id"], name: item["name"] });
          });
          this.ddlSchoolTimeData = schoolTimeObj;
        });
    }
  }
  //chọn khối
  onSelectGradeAdd(item: any) {
    this.ddlSchoolTimeData = [];
    this.selectedSchoolTime = null;
    if (item === undefined) {
      this.ddlSchoolTimeData = [];
      this.selectedSchoolTime = null;
    }
    if (item != undefined) {
      this.configurationParametersDeclareSubjectService
        .getSchoolTime([item["year_id"]], item["level"])
        .subscribe((gradeDataObj) => {
          const schoolTimeObj = [];
          gradeDataObj["query"].forEach(function (item) {
            schoolTimeObj.push({
              id: item["id"],
              name: item["name"],
              year_id: item["year_id"],
              level: item["level"],
            });
          });
          this.ddlSchoolTimeData = schoolTimeObj;
        });
    }
  }
  //chọn hiệu lực
  onSelectSchoolTimeAdd(item: any) {
    this.schoolTimeAdd = [];
    const schoolTimeAdd1 = [];
    if (item != undefined) {
      schoolTimeAdd1.push(item["id"]);
    }
    this.schoolTimeAdd = schoolTimeAdd1;
  }
  onSelectYear(item: any) {
    this.selectedGradeSearch = [];
    if (item !== undefined) {
      const arrSubject = [];
      this.configurationParametersDeclareSubjectService
        .getGradeList([item.id])
        .pipe()
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

  onselectYearInsert(item: any) {
    // this.selectedGradeSearch = [];
    const arrSemester = [];
    if (item !== undefined) {
      this.configurationParametersDeclareSubjectService
        .semesterList([item.id])
        .pipe()
        .subscribe((data) => {
          data["query"].forEach(function (items) {
            arrSemester.push({ id: items["id"], name: items["name"] });
          });
          this.ddlSchoolTimeData = arrSemester;
        });

      const arrSubject = [];
      this.configurationParametersDeclareSubjectService
        .getGradeList([item.id])
        .pipe()
        .subscribe((subjectData) => {
          subjectData["query"].forEach(function (items) {
            arrSubject.push({
              id: items["id"],
              name: items["name"],
              level: items["level"],
              year_id: item.id,
            });
          });
          this.ddlGradeData = arrSubject;
        });
    } else {
      this.ddlGradeData = [];
      this.selectedGradeInsert = [];
      this.ddlSchoolTimeData = [];
      this.selectedSchoolTime = [];
    }
  }

  selectAllGradeSearch(ddlGradeSearchData) {
    this.selectedGradeSearch = ddlGradeSearchData;
  }

  deSelectAllGradeSearch() {
    this.selectedGradeSearch = [];
  }

  onSelectAllSchoolTime(ddlSchoolTimeData) {
    this.selectedSchoolTime = ddlSchoolTimeData;
  }

  public deSelectAllSchoolTime() {
    this.selectedSchoolTime = [];
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

  resetDeclareSubjectForm() {
    this.declareSubjectForm.get("name").clearValidators();
    this.declareSubjectForm.get("name").setValue("");
    this.declareSubjectForm.get("symbol").clearValidators();
    this.declareSubjectForm.get("symbol").setValue("");
    this.declareSubjectForm.get("grade_id").clearValidators();
    this.declareSubjectForm.get("grade_id").setValue("");
    this.declareSubjectForm.get("school_time").clearValidators();
    this.declareSubjectForm.get("school_time").setValue("");
    this.declareSubjectForm.get("lesson").clearValidators();
    this.declareSubjectForm.get("lesson").setValue("");
    this.declareSubjectForm.get("subject_kind").clearValidators();
    this.declareSubjectForm.get("subject_kind").setValue("");
    this.declareSubjectForm.get("description").clearValidators();
    this.declareSubjectForm.get("description").setValue("");
    this.declareSubjectForm.get("subject_type").clearValidators();
    this.declareSubjectForm.get("subject_type").setValue("");
    this.declareSubjectForm.get("school_time").clearValidators();
    this.declareSubjectForm.get("school_time").setValue("");
    this.declareSubjectForm.get("search").clearValidators();
    this.declareSubjectForm.get("search").setValue("");
    this.declareSubjectForm.get("year_id").clearValidators();
    // this.declareSubjectForm.get('year_id').setValue('');
    // this.declareSubjectForm.get('year_id').setValue('');
    this.selectedGrade = [];
    this.selectedFormAdd = this.currentYearAdd;
    this.selectedSubjectKind = [];
    this.selectedSubjectType = [];
    this.selectedSchoolTime = [];
    this.ddlSchoolTimeData = [];
    this.numberOfCharactersDescription = 0;
  }

  filterSubject() {
    this.resetDeclareSubjectForm();
    this.loadingFilter = true;

    const years = [];
    // const years = this.declareSubjectForm.controls['year'].value.id;
    years.push(this.declareSubjectForm.controls["year"].value.id);

    const grades = [];
    this.selectedGradeSearch.forEach(function (items) {
      grades.push(items["id"]);
    });
    if (this.declareSubjectForm.value["statusActive"]) {
      status = "active";
    } else {
      status = "inactive";
    }
    this.configurationParametersDeclareSubjectService
      .filterSubject(grades, status, years)
      .subscribe(
        (result) => {
          this.loadingFilter = false;
          if (result["count"] === 0) {
            this.p = 1;
            this.totalItems = 1;
            this.headerSubject = true;
            this.checkSubjectData = true;
            this.subjects = [];
            this.subjectData = [];
          } else {
            this.headerSubject = true;
            this.checkSubjectData = false;

            const arrSchoolTime = [];
            const schoolTime = this.ddlSemesterMap;
            result["subjects"].forEach(function (items) {
              let school_time = items["school_time"];
              const mang = school_time.split(",");
              const arrName = [];
              mang.forEach(function (item) {
                const position = schoolTime
                  .map(function (x) {
                    return x.id;
                  })
                  .indexOf(parseInt(item));
                if (position > -1) {
                  arrName.push({ name: schoolTime[position]["name"] });
                }
              });

              const semeseterName = arrName
                .map(function (elem) {
                  return elem.name;
                })
                .join(", ");

              arrSchoolTime.push({
                id: items["id"],
                name: items["name"],
                code: items["code"],
                grade_id: items["grade_id"],
                grade_name: items["grade_name"],
                lesson: items["lesson"],
                subject_type: items["subject_type"],
                subject_kind: items["subject_kind"],
                symbol: items["symbol"],
                description: items["description"],
                year_id: items["year_id"],
                school_time: semeseterName,
                history: items["history"],
                status: items["status"],
              });
            });
            this.gradeDataUpdate = arrSchoolTime;

            // this.subjects = result['subjects'];
            this.subjects = arrSchoolTime;
            this.subjectData = arrSchoolTime;
            this.totalItems = result["count"];

            this.p = 1;
            // this.notifyService.showSuccess('Đã tìm thấy ' + this.totalItems + ' bản ghi dữ liệu.', 'Thông báo lỗi');
          }
        },
        (error) => {
          this.loadingFilter = false;
          Object.keys(error).forEach(function (key) {
            this.notifyService.showError(error[key], "Thông báo lỗi");
          });
          this.ngOnInit();
        }
      );
  }

  createDeclareSubject() {
    this.declareSubjectForm
      .get("name")
      .setValidators([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]);
    this.declareSubjectForm.get("name").updateValueAndValidity();
    this.declareSubjectForm
      .get("symbol")
      .setValidators([Validators.maxLength(50)]);
    this.declareSubjectForm.get("symbol").updateValueAndValidity();
    this.declareSubjectForm
      .get("grade_id")
      .setValidators([Validators.required]);
    this.declareSubjectForm.get("grade_id").updateValueAndValidity();
    this.declareSubjectForm.get("lesson").setValidators([Validators.required]);
    this.declareSubjectForm.get("lesson").updateValueAndValidity();
    // this.declareSubjectForm.get('subject_kind').setValidators([Validators.required]);
    // this.declareSubjectForm.get('subject_kind').updateValueAndValidity();
    this.declareSubjectForm
      .get("subject_type")
      .setValidators([Validators.required]);
    this.declareSubjectForm.get("subject_type").updateValueAndValidity();
    this.declareSubjectForm
      .get("school_time")
      .setValidators([Validators.required]);
    this.declareSubjectForm.get("school_time").updateValueAndValidity();
    this.declareSubjectForm.get("year_id").setValidators([Validators.required]);
    this.declareSubjectForm.get("year_id").updateValueAndValidity();
    this.submitted = true;

    if (this.declareSubjectForm.invalid) {
      return;
    }
    var i = 0;
    // const year = this.selectedYear;
    const name = this.declareSubjectForm.controls["name"].value;
    const symbol = this.declareSubjectForm.controls["symbol"].value;
    const grade_id = this.declareSubjectForm.controls["grade_id"].value.id;
    const year_id = this.declareSubjectForm.controls["year_id"].value.id;
    // const subject_kind = this.declareSubjectForm.controls['subject_kind'].value.id;
    const subject_type = this.declareSubjectForm.controls["subject_type"].value
      .id;
    const lesson = this.declareSubjectForm.controls["lesson"].value;
    const description = this.declareSubjectForm.controls["description"].value;
    const school_time = this.declareSubjectForm.controls["school_time"].value;
    var uploadData = new FormData();
    // if (year) {
    //   uploadData.append('year', year['id']);
    // }
    if (name) {
      uploadData.append("name", name);
    }
    if (symbol) {
      uploadData.append("symbol", symbol);
    }
    if (year_id) {
      uploadData.append("year_id", year_id);
    }
    if (grade_id) {
      uploadData.append("grade_id", grade_id);
    }
    // if (subject_kind) {
    //   uploadData.append('subject_kind', subject_kind);
    // }
    if (subject_type) {
      uploadData.append("subject_type", subject_type);
    }
    if (lesson) {
      uploadData.append("lesson", lesson);
    }
    if (description) {
      uploadData.append("description", description.substring(0, 150));
    }
    if (school_time) {
      school_time.forEach(function (item) {
        uploadData.append("school_time" + "[" + i + "]", item["id"]);
        i++;
      });
    }

    this.configurationParametersDeclareSubjectService
      .create(uploadData)
      .subscribe(
        (result) => {
          this.onReloadSubjectData();
          this.notifyService.showSuccess(
            "Khai báo môn học thành công",
            "Thông báo"
          );
          this.headerSubject = true;
          this.checkSubjectData = false;
          this.resetDeclareSubjectForm();
          // this.ngOnInit();
          $("#createDeclareSubjectModal").modal("hide");
          $(".modal-backdrop").remove();
        },
        (error) => {
          if (error) {
            if (error["error"] === 7) {
              this.notifyService.showError(
                "Sai kiểu dữ liệu hiệu lực",
                "Thông báo lỗi"
              );
            } else if (error["message"]) {
              if (error["message"].error) {
                this.notifyService.showError(
                  error["message"].error,
                  "Thông báo lỗi"
                );
              } else if (error["message"].name) {
                this.notifyService.showError(
                  error["message"].name,
                  "Thông báo lỗi"
                );
              } else if (error["message"].lesson) {
                this.notifyService.showError(
                  error["message"].lesson,
                  "Thông báo lỗi"
                );
              }
              // else if (error['message'].subject_kind) {
              //   this.notifyService.showError(error['message'].subject_kind, 'Thông báo lỗi');
              // }
              else if (error["message"].school_time) {
                this.notifyService.showError(
                  error["message"].school_time,
                  "Thông báo lỗi"
                );
              } else {
                this.notifyService.showError(
                  "Cập nhật môn học theo trường không thành công",
                  "Thông báo lỗi"
                );
              }
            } else if (error["messages"]) {
              this.notifyService.showError(error["messages"], "Thông báo lỗi");
            } else {
              this.notifyService.showError(
                "Cập nhật môn học theo trường không thành công",
                "Thông báo lỗi"
              );
            }
          }
        }
      );
  }

  updateDeclareSubject(id: number) {
    this.declareSubjectForm
      .get("name")
      .setValidators([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]);
    this.declareSubjectForm.get("name").updateValueAndValidity();
    this.declareSubjectForm
      .get("symbol")
      .setValidators([Validators.maxLength(50)]);
    this.declareSubjectForm.get("symbol").updateValueAndValidity();
    this.declareSubjectForm
      .get("grade_id")
      .setValidators([Validators.required]);
    this.declareSubjectForm.get("grade_id").updateValueAndValidity();
    this.declareSubjectForm.get("lesson").setValidators([Validators.required]);
    this.declareSubjectForm.get("lesson").updateValueAndValidity();
    // this.declareSubjectForm.get('subject_kind').setValidators([Validators.required]);
    // this.declareSubjectForm.get('subject_kind').updateValueAndValidity();
    this.declareSubjectForm
      .get("subject_type")
      .setValidators([Validators.required]);
    this.declareSubjectForm.get("subject_type").updateValueAndValidity();
    this.declareSubjectForm
      .get("school_time")
      .setValidators([Validators.required]);
    this.declareSubjectForm.get("school_time").updateValueAndValidity();
    this.submitted = true;

    if (this.declareSubjectForm.invalid) {
      return;
    }
    var i = 0;
    // const year = this.selectedYear;
    const name = this.declareSubjectForm.controls["name"].value;
    const symbol = this.declareSubjectForm.controls["symbol"].value;
    const grade_id = this.declareSubjectForm.controls["grade_id"].value.id;
    // const subject_kind = this.declareSubjectForm.controls['subject_kind'].value.id;
    const subject_type = this.declareSubjectForm.controls["subject_type"].value
      .id;
    const lesson = this.declareSubjectForm.controls["lesson"].value;
    const description = this.declareSubjectForm.controls["description"].value;
    const school_time = this.declareSubjectForm.controls["school_time"].value;

    var uploadData = new FormData();
    // if (year) {
    //   uploadData.append('year', year['id']);
    // }
    if (name) {
      uploadData.append("name", name);
    }
    if (symbol) {
      uploadData.append("symbol", symbol);
    }
    if (grade_id) {
      uploadData.append("grade_id", grade_id);
    }
    // if (subject_kind) {
    //   uploadData.append('subject_kind', subject_kind);
    // }
    if (subject_type) {
      uploadData.append("subject_type", subject_type);
    }
    if (lesson) {
      uploadData.append("lesson", lesson);
    }
    if (description) {
      uploadData.append("description", description.substring(0, 150));
    }
    if (school_time) {
      school_time.forEach(function (item) {
        uploadData.append("school_time" + "[" + i + "]", item["id"]);
        i++;
      });
    }

    this.configurationParametersDeclareSubjectService
      .update(id, uploadData)
      .subscribe(
        (result) => {
          this.onReloadSubjectData();
          this.notifyService.showSuccess(
            "Sửa khai báo môn học thành công",
            "Thông báo"
          );
          this.headerSubject = true;
          this.checkSubjectData = false;
          // this.ngOnInit();
          $("#updateDeclareSubjectModal").modal("hide");
          $(".modal-backdrop").remove();
        },
        (error) => {
          if (error) {
            if (error["error"] === 7) {
              this.notifyService.showError(
                "Sai kiểu dữ liệu hiệu lực",
                "Thông báo lỗi"
              );
            } else if (error["message"]) {
              if (error["message"].error) {
                this.notifyService.showError(
                  error["message"].error,
                  "Thông báo lỗi"
                );
              } else if (error["message"].name) {
                this.notifyService.showError(
                  error["message"].name,
                  "Thông báo lỗi"
                );
              } else if (error["message"].lesson) {
                this.notifyService.showError(
                  error["message"].lesson,
                  "Thông báo lỗi"
                );
              } else if (error["message"].subject_kind) {
                this.notifyService.showError(
                  error["message"].subject_kind,
                  "Thông báo lỗi"
                );
              } else if (error["message"].school_time) {
                this.notifyService.showError(
                  error["message"].school_time,
                  "Thông báo lỗi"
                );
              } else {
                this.notifyService.showError(
                  "Cập nhật môn học theo trường không thành công",
                  "Thông báo lỗi"
                );
              }
            } else if (error["messages"]) {
              this.notifyService.showError(error["messages"], "Thông báo lỗi");
            } else {
              this.notifyService.showError(
                "Cập nhật môn học theo trường không thành công",
                "Thông báo lỗi"
              );
            }
          }
        }
      );
  }

  deleteDeclareSubject(id: number) {
    let isDelete = confirm("Bạn chắc chắn xóa dữ liệu khai báo môn học?");
    if (isDelete) {
      this.configurationParametersDeclareSubjectService
        .delete(id)
        .subscribe((res) => {
          this.notifyService.showSuccess(
            "Xóa dữ liệu khai báo môn học thành công",
            "Thông báo"
          );
          this.onReloadSubjectData();
        });
    }
  }

  getByIdSubject(id: number) {
    this.resetDeclareSubjectForm();
    this.configurationParametersDeclareSubjectService
      .findByIdSubject(id)
      .subscribe((result) => {
        const arrayData = result["subject"];
        this.id = result["subject"]["id"];
        this.declareSubjectForm.patchValue(arrayData);
        if (
          arrayData.description === null ||
          arrayData.description === "" ||
          arrayData.description === " "
        ) {
          this.declareSubjectForm.controls["description"].setValue("");
        }
        //Đổ dữ liệu grades Search
        let idCurrentYear = result["subject"]["year_id"];
        this.configurationParametersDeclareSubjectService
          .getGradeList(idCurrentYear)
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
            this.gradeDataUpdate = getGradesData;
            // var gradeValue = arrayData['grade_id'];

            if (arrayData["grade_id"]) {
              const mapGrade = this.gradeDataUpdate
                .map(function (x) {
                  return x.id;
                })
                .indexOf(arrayData["grade_id"]);
              if (mapGrade > -1) {
                selectGrade.push({
                  id: this.gradeDataUpdate[mapGrade]["id"],
                  name: this.gradeDataUpdate[mapGrade]["name"],
                  level: this.gradeDataUpdate[mapGrade]["level"],
                });
              }
              this.selectedGrade = selectGrade[0];
            }
            //binding dữ liệu của học kỳ theo năm
            const arrSemester = [];
            this.configurationParametersDeclareSubjectService
              .getSchoolTime([idCurrentYear], this.selectedGrade["level"])
              .pipe()
              .subscribe((data) => {
                data["query"].forEach(function (items) {
                  arrSemester.push({ id: items["id"], name: items["name"] });
                });
                this.ddlSchoolTimeDataUpdate = arrSemester;
                this.ddlSchoolTimeData = arrSemester;

                if (arrayData["school_time"]) {
                  const schoolTimeData = arrayData["school_time"].split(",");
                  const ddlSchoolTimeDataUpdate = this.ddlSchoolTimeDataUpdate;
                  schoolTimeData.forEach(function (item) {
                    const mapSchoolTimeData = ddlSchoolTimeDataUpdate
                      .map(function (x) {
                        return x.id;
                      })
                      .indexOf(parseInt(item));
                    if (mapSchoolTimeData > -1) {
                      selectSchoolTime.push({
                        id: ddlSchoolTimeDataUpdate[mapSchoolTimeData]["id"],
                        name:
                          ddlSchoolTimeDataUpdate[mapSchoolTimeData]["name"],
                      });
                    }
                  });
                  this.selectedSchoolTime = selectSchoolTime;
                }
              });
          });

        const selectGrade = [];
        const selectSubjectKind = [];
        const selectSubjectType = [];
        const selectSchoolTime = [];
        // if (arrayData['grade_id']) {
        //   const mapGrade = this.ddlGradeData.map(function (x) { return x.id; }).indexOf(arrayData['grade_id']);
        //   if (mapGrade > -1) {
        //     selectGrade.push({ id: this.ddlGradeData[mapGrade]['id'], name: this.ddlGradeData[mapGrade]['name'] });
        //   }
        //   this.selectedGrade = selectGrade[0];
        // }
        // if (arrayData['subject_kind']) {
        //   const mapSubjectKind = this.ddlSubjectKindData.map(function (x) { return x.id; }).indexOf(arrayData['subject_kind']);
        //   if (mapSubjectKind > -1) {
        //     selectSubjectKind.push({ id: this.ddlSubjectKindData[mapSubjectKind]['id'], name: this.ddlSubjectKindData[mapSubjectKind]['name'] });
        //   }
        //   this.selectedSubjectKind = selectSubjectKind[0];
        // }
        if (arrayData["subject_type"]) {
          const mapSubjectType = this.ddlSubjectTypeData
            .map(function (x) {
              return x.id;
            })
            .indexOf(arrayData["subject_type"]);
          if (mapSubjectType > -1) {
            selectSubjectType.push({
              id: this.ddlSubjectTypeData[mapSubjectType]["id"],
              name: this.ddlSubjectTypeData[mapSubjectType]["name"],
            });
          }
          this.selectedSubjectType = selectSubjectType[0];
        }
        // if (arrayData['school_time']) {
        //   const schoolTimeData = arrayData['school_time'].split(',');
        //   const ddlSchoolTimeData = this.ddlSchoolTimeData;
        //   schoolTimeData.forEach(function (item) {
        //     const mapSchoolTimeData = ddlSchoolTimeData.map(function (x) { return x.id; }).indexOf(parseInt(item));
        //     if (mapSchoolTimeData > -1) {
        //       selectSchoolTime.push({ id: ddlSchoolTimeData[mapSchoolTimeData]['id'], name: ddlSchoolTimeData[mapSchoolTimeData]['name'] });
        //     }
        //   });
        //   this.selectedSchoolTime = selectSchoolTime;
        // }
        if (this.declareSubjectForm.controls["description"].value) {
          this.numberOfCharactersDescription =
            result["subject"].description.length;
        } else {
          this.numberOfCharactersDescription = 0;
        }
      });
  }

  perPageSelected(id: number) {
    this.countPage = id;
    this.p = 1;
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    } else {
      var inputQuantity = [];
      $(function () {
        $(".lesson").each(function (i) {
          inputQuantity[i] = this.defaultValue;
          $(this).data("idx", i);
        });
        $(".lesson").on("keyup", function (e) {
          var $field = $(this),
            val = this.value,
            $thisIndex = parseInt($field.data("idx"), 10);
          if (
            (this.validity && this.validity.badInput) ||
            isNaN(val) ||
            $field.is(":invalid")
          ) {
            this.value = inputQuantity[$thisIndex];
            return;
          }
          if (val.length > Number($field.attr("maxlength"))) {
            val = val.slice(0, 5);
            $field.val(val);
          }
          inputQuantity[$thisIndex] = val;
        });
      });
      return true;
    }
  }

  searchByKeyWord(search) {
    this.subjects = [];
    let status;
    if (this.declareSubjectForm.value["statusActive"]) {
      status = "active";
    } else {
      status = "inactive";
    }
    if (search.trim() === "") {
      this.notifyService.showError(
        "Vui lòng điền từ khóa tìm kiếm!",
        "Thông báo lỗi"
      );
      this.headerSubject = false;
      this.checkSubjectData = false;
      this.subjects = [];
      this.p = 1;
      this.totalItems = 1;
    } else {
      if (this.selectedGradeSearch && this.selectedGradeSearch.length > 0) {
        const gradeId = [];
        this.selectedGradeSearch.forEach((items) => {
          gradeId.push(items["id"]);
        });
        this.configurationParametersDeclareSubjectService
          .searchByKeyWord(search, gradeId, status)
          .subscribe(
            (result) => {
              if (result["count"] === 0) {
                this.p = 1;
                this.totalItems = 1;
                this.headerSubject = true;
                this.checkSubjectData = true;
                this.subjects = [];
                this.subjectData = [];
              } else {
                this.headerSubject = true;
                this.checkSubjectData = false;

                const arrSchoolTime = [];
                const schoolTime = this.ddlSemesterMap;
                result["subjects"].forEach(function (items) {
                  let school_time = items["school_time"];
                  const mang = school_time.split(",");
                  const arrName = [];
                  mang.forEach(function (item) {
                    const position = schoolTime
                      .map(function (x) {
                        return x.id;
                      })
                      .indexOf(parseInt(item));
                    if (position > -1) {
                      arrName.push({ name: schoolTime[position]["name"] });
                    }
                  });

                  const semeseterName = arrName
                    .map(function (elem) {
                      return elem.name;
                    })
                    .join(", ");

                  arrSchoolTime.push({
                    id: items["id"],
                    name: items["name"],
                    code: items["code"],
                    grade_id: items["grade_id"],
                    grade_name: items["grade_name"],
                    lesson: items["lesson"],
                    subject_type: items["subject_type"],
                    subject_kind: items["subject_kind"],
                    symbol: items["symbol"],
                    description: items["description"],
                    year_id: items["year_id"],
                    school_time: semeseterName,
                    history: items["history"],
                    status: items["status"],
                  });
                });
                this.gradeDataUpdate = arrSchoolTime;

                // this.subjects = result['subjects'];
                this.subjects = arrSchoolTime;
                this.subjectData = arrSchoolTime;
                this.totalItems = result["count"];

                this.p = 1;
              }
            },
            (error) => {
              this.notifyService.showError(error, "Thông báo lỗi");
            }
          );
      } else {
        this.configurationParametersDeclareSubjectService
          .searchByKeyWord(search, null, status)
          .subscribe(
            (result) => {
              if (result["count"] === 0) {
                this.p = 1;
                this.totalItems = 1;
                this.headerSubject = true;
                this.checkSubjectData = true;
                this.subjects = [];
                this.subjectData = [];
              } else {
                this.headerSubject = true;
                this.checkSubjectData = false;
                this.subjects = result["subjects"];
                this.subjectData = result["subjects"];
                this.totalItems = result["count"];
                this.p = 1;
              }
            },
            (error) => {
              this.notifyService.showError(error, "Thông báo lỗi");
            }
          );
      }
    }
  }

  onReloadSubjectData() {
    if (this.declareSubjectForm.value["search"]) {
      this.searchByKeyWord(this.declareSubjectForm.value["search"]);
    } else {
      this.resetDeclareSubjectForm();
      this.loadingFilter = true;

      const years = [];
      // const years = this.declareSubjectForm.controls['year'].value.id;
      years.push(this.declareSubjectForm.controls["year"].value.id);

      const grades = [];
      this.selectedGradeSearch.forEach(function (items) {
        grades.push(items["id"]);
      });
      if (this.declareSubjectForm.value["statusActive"]) {
        status = "active";
      } else {
        status = "inactive";
      }
      this.configurationParametersDeclareSubjectService
        .filterSubject(grades, status, years)
        .subscribe(
          (result) => {
            this.loadingFilter = false;
            if (result["count"] === 0) {
              this.p = 1;
              this.totalItems = 1;
              this.headerSubject = true;
              this.checkSubjectData = true;
              this.subjects = [];
              this.subjectData = [];
            } else {
              // this.headerSubject = true;
              // this.checkSubjectData = false;
              // this.subjects = result['subjects'];
              // this.subjectData = result['subjects'];
              // this.totalItems = result['count'];
              this.headerSubject = true;
              this.checkSubjectData = false;

              const arrSchoolTime = [];
              const schoolTime = this.ddlSemesterMap;
              result["subjects"].forEach(function (items) {
                let school_time = items["school_time"];
                const mang = school_time.split(",");
                const arrName = [];
                mang.forEach(function (item) {
                  const position = schoolTime
                    .map(function (x) {
                      return x.id;
                    })
                    .indexOf(parseInt(item));
                  if (position > -1) {
                    arrName.push({ name: schoolTime[position]["name"] });
                  }
                });

                const semeseterName = arrName
                  .map(function (elem) {
                    return elem.name;
                  })
                  .join(", ");

                arrSchoolTime.push({
                  id: items["id"],
                  name: items["name"],
                  code: items["code"],
                  grade_id: items["grade_id"],
                  grade_name: items["grade_name"],
                  lesson: items["lesson"],
                  subject_type: items["subject_type"],
                  subject_kind: items["subject_kind"],
                  symbol: items["symbol"],
                  description: items["description"],
                  year_id: items["year_id"],
                  school_time: semeseterName,
                  history: items["history"],
                  status: items["status"],
                });
              });
              this.gradeDataUpdate = arrSchoolTime;

              // this.subjects = result['subjects'];
              this.subjects = arrSchoolTime;
              this.subjectData = arrSchoolTime;
              this.totalItems = result["count"];

              this.p = 1;
            }
          },
          (error) => {
            this.loadingFilter = false;
            Object.keys(error).forEach(function (key) {
              this.notifyService.showError(error[key], "Thông báo lỗi");
            });
            this.ngOnInit();
          }
        );
    }
  }

  downloadTemplateFile() {
    this.loadingDownload = true;
    this.configurationParametersDeclareSubjectService
      .downloadTemplate()
      .subscribe((res) => {
        this.loadingDownload = false;
        // window.open(window.URL.createObjectURL(res));
        var downloadURL = window.URL.createObjectURL(res);
        var link = document.createElement("a");
        link.href = downloadURL;
        link.download = "FileMau_DanhSach_MonHoc_TheoTruong.xlsx";
        link.click();
      });
  }

  importFile() {
    this.loadingImport = true;
    const formData = new FormData();
    if (this.selectedFile === undefined) {
      this.loadingImport = false;
      this.notifyService.showError("Vui lòng chọn tệp!", "Thông báo lỗi");
      return;
    }
    formData.append("data_import", this.selectedFile);
    this.configurationParametersDeclareSubjectService
      .importExcel(formData)
      .subscribe(
        (result) => {
          let success = result["success"];
          let fail = result["fails"];
          if (success !== 0 && fail !== 0) {
            this.notifyService.showSuccess(
              "Tải lên thành công: " +
                success +
                " bản ghi" +
                ". Tải lên thất bại: " +
                fail +
                " bản ghi",
              "Thông báo"
            );
            this.loadingImport = false;

            let basicError = result["basicError"];
            let detailError = result["detailError"];
            const arrError = {
              basicError: basicError,
              detailError: detailError,
            };
            this.configurationParametersDeclareSubjectService
              .exportErrorExcel(arrError)
              .subscribe(
                (res) => {
                  if (res["type"] !== "application/json") {
                    var downloadURL = window.URL.createObjectURL(res);
                    var link = document.createElement("a");
                    link.href = downloadURL;
                    link.download = "DuLieuLoi.xlsx";
                    link.click();
                  } else {
                    this.notifyService.showError(
                      "Không thể tải dữ liệu lỗi",
                      "Thông báo lỗi"
                    );
                  }
                },
                (errors) => {}
              );
          } else if (success !== 0 && fail === 0) {
            this.notifyService.showSuccess(
              "Tải lên thành công: " + success + " bản ghi",
              "Thông báo"
            );
            this.loadingImport = false;
          } else if (success === 0 && fail !== 0) {
            this.notifyService.showError(
              "Tải lên thành công: " +
                success +
                " bản ghi" +
                ". Tải lên thất bại: " +
                fail +
                " bản ghi",
              "Thông báo"
            );
            this.loadingImport = false;

            let basicError = result["basicError"];
            let detailError = result["detailError"];
            const arrError = {
              basicError: basicError,
              detailError: detailError,
            };
            this.configurationParametersDeclareSubjectService
              .exportErrorExcel(arrError)
              .subscribe(
                (res) => {
                  if (res["type"] !== "application/json") {
                    var downloadURL = window.URL.createObjectURL(res);
                    var link = document.createElement("a");
                    link.href = downloadURL;
                    link.download = "DuLieuLoi.xlsx";
                    link.click();
                  } else {
                    this.notifyService.showError(
                      "Không thể tải dữ liệu lỗi",
                      "Thông báo lỗi"
                    );
                  }
                },
                (errors) => {}
              );
          } else {
            this.notifyService.showError(
              "Tải dữ liệu lên thất bại",
              "Thông báo"
            );
            this.loadingImport = false;
          }
          this.fileInput.nativeElement.value = "";
          this.fileURL = "";
        },
        (error) => {
          if (error.messages) {
            if (error.messages.data_import !== undefined) {
              if (error.messages.data_import[0] === "8") {
                this.notifyService.showError(
                  "File truyền vào không hợp lệ. Định dạng file excel .xls, .xlsx, .csv",
                  "Thông báo lỗi"
                );
              }
              if (error.messages.data_import[0] === "1") {
                this.notifyService.showError(
                  "File dữ liệu không được bỏ trống",
                  "Thông báo lỗi"
                );
              }
            }
          } else {
            this.notifyService.showError(
              "File dữ liệu truyền vào không hợp lệ",
              "Thông báo lỗi"
            );
          }
          this.fileInput.nativeElement.value = "";
          this.fileURL = "";
          this.loadingImport = false;
        }
      );
  }

  exportFile() {
    this.loadingExport = true;
    if (!this.subjectData) {
      this.notifyService.showError(
        "Dữ liệu không tồn tại. Vui lòng kiểm tra lại!",
        "Thông báo lỗi"
      );
      this.loadingExport = false;
      return;
    }
    let statusVal;
    let searchVal;
    let export_subject = true;
    const grades = [];
    if (this.selectedGradeSearch && this.selectedGradeSearch.length > 0) {
      this.selectedGradeSearch.forEach(function (items) {
        grades.push(items["id"]);
      });
    }
    if (this.declareSubjectForm.value["statusActive"]) {
      statusVal = "active";
    } else {
      statusVal = "inactive";
    }
    if (this.declareSubjectForm.value["search"]) {
      searchVal = this.declareSubjectForm.value["search"];
    }
    if (this.checkSubjectData == true) {
      this.notifyService.showError(
        "Dữ liệu không tồn tại. Vui lòng kiểm tra lại!",
        "Thông báo lỗi"
      );
      this.loadingExport = false;
      return;
    } else {
      this.configurationParametersDeclareSubjectService
        .exportExcel(searchVal, grades, statusVal, export_subject)
        .subscribe((res) => {
          this.loadingExport = false;
          // window.open(window.URL.createObjectURL(res));
          var downloadURL = window.URL.createObjectURL(res);
          var link = document.createElement("a");
          link.href = downloadURL;
          link.download = "DanhSach_MonHoc_TheoTruong.xlsx";
          link.click();
        });
    }
  }

  //sort ten
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

  firstTimeCode = 1;
  subjectCode: any;
  sortSubjectCode() {
    this.firstTimeCode = 0;
    this.firstSubjectName = 1;
    this.firstsortGrade = 1;
    this.firstSubjectType = 1;
    this.firstSubjectKind = 1;
    this.subjectName = 0;
    this.gradeTime = 0;
    this.subjectKind = 0;
    this.subject_type = 0;
    const array = this.subjectData;
    if (this.subjectCode === 1) {
      array.sort((a, b) => {
        let str = a.code;
        var nameA = Number(str);
        let str2 = b.code;
        var nameB = Number(str2);
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      this.subjectCode++;
    } else {
      array.sort((a, b) => {
        let str = a.code;
        var nameA = Number(str);
        let str2 = b.code;
        var nameB = Number(str2);
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }
        return 0;
      });
      this.subjectCode = 1;
    }
    this.subjectData = array;
  }

  firstSubjectName = 1;
  subjectName: any;
  sortSubjectName() {
    this.firstTimeCode = 1;
    this.firstSubjectName = 0;
    this.firstsortGrade = 1;
    this.firstSubjectType = 1;
    this.firstSubjectKind = 1;
    this.subjectCode = 0;
    this.gradeTime = 0;
    this.subjectKind = 0;
    this.subject_type = 0;
    const array = this.subjectData;
    if (this.subjectName === 1) {
      array.sort((a, b) => {
        let str = a.name;
        var nameA = str.toUpperCase();
        let str2 = b.name;
        var nameB = str2.toUpperCase();
        return this.CharCompare(nameA, nameB, 0);
      });
      this.subjectName++;
    } else {
      array.sort((a, b) => {
        let str = a.name;
        var nameA = str.toUpperCase();
        let str2 = b.name;
        var nameB = str2.toUpperCase();
        return this.CharCompare(nameB, nameA, 0);
      });
      this.subjectName = 1;
    }
    this.subjectData = array;
  }

  firstsortGrade = 1;
  gradeTime: any;
  sortGrade() {
    this.firstTimeCode = 1;
    this.firstSubjectName = 1;
    this.firstsortGrade = 0;
    this.firstSubjectType = 1;
    this.firstSubjectKind = 1;
    this.subjectCode = 0;
    this.subjectName = 0;
    this.subjectKind = 0;
    this.subject_type = 0;
    const array = this.subjectData;
    if (this.gradeTime === 1) {
      array.sort(function (a, b) {
        let str = a.grade_name;

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

        var nameA = str.toUpperCase(); // bỏ qua hoa thường

        let str2 = b.grade_name;

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
      this.gradeTime++;
    } else {
      array.sort(function (a, b) {
        let str = a.grade_name;

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

        var nameA = str.toUpperCase(); // bỏ qua hoa thường

        let str2 = b.grade_name;

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

        var nameB = str2.toUpperCase(); // bỏ qua hoa thường
        if (nameA > nameB) {
          return -1;
        }
        if (nameA < nameB) {
          return 1;
        }
        // name trùng nhau
        return 0;
      });
      this.gradeTime = 1;
    }
    this.subjectData = array;
  }

  firstSubjectKind = 1;
  subjectKind: any;
  sortSubjectKind() {
    this.firstTimeCode = 1;
    this.firstSubjectName = 1;
    this.firstsortGrade = 1;
    this.firstSubjectType = 1;
    this.firstSubjectKind = 0;
    this.subjectCode = 0;
    this.gradeTime = 0;
    this.subjectName = 0;
    this.subject_type = 0;
    const array = this.subjectData;
    if (this.subjectKind === 1) {
      array.sort((a, b) => {
        let str = a.subject_kind;
        var nameA = Number(str);
        let str2 = b.subject_kind;
        var nameB = Number(str2);
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      this.subjectKind++;
    } else {
      array.sort((a, b) => {
        let str = a.subject_kind;
        var nameA = Number(str);
        let str2 = b.subject_kind;
        var nameB = Number(str2);
        if (nameA > nameB) {
          return -1;
        }
        if (nameA < nameB) {
          return 1;
        }
        return 0;
      });
      this.subjectKind = 1;
    }
    this.subjectData = array;
  }

  firstSubjectType = 1;
  subject_type: any;
  sortSubjectType() {
    this.firstTimeCode = 1;
    this.firstSubjectName = 1;
    this.firstsortGrade = 1;
    this.firstSubjectType = 0;
    this.firstSubjectKind = 1;
    this.subjectCode = 0;
    this.gradeTime = 0;
    this.subjectKind = 0;
    this.subjectName = 0;
    const array = this.subjectData;
    if (this.subject_type === 1) {
      array.sort(function (a, b) {
        let str = a.subject_type;
        var nameA = Number(str);
        let str2 = b.subject_type;
        var nameB = Number(str2);
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }
        return 0;
      });
      this.subject_type++;
    } else {
      array.sort(function (a, b) {
        let str = a.subject_type;
        var nameA = Number(str);
        let str2 = b.subject_type;
        var nameB = Number(str2);
        if (nameA > nameB) {
          return 1;
        }
        if (nameA < nameB) {
          return -1;
        }
        return 0;
      });
      this.subject_type = 1;
    }
    this.subjectData = array;
  }
}
