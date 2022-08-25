import { ClassSummationsService } from "./../service/class-summations.service";
import { NotificationService } from "./../../../_services/notification.service";
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ɵConsole,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
declare var $: any;
@Component({
  selector: "class-summations",
  templateUrl: "./class-summations.component.html",
  styleUrls: ["./class-summations.component.scss"],
})
export class ClassSummationsComponent implements OnInit {
  @ViewChild("semesterProperties") semesterProperties: ElementRef[];
  @ViewChild("checkAllProperties") checkAllProperties: ElementRef[];
  classSummationsFilterForm: FormGroup;

  classSummationsDataSourceForm: FormGroup;

  submitted = false;
  loadingFilter = false;

  ddlYearData: any[];
  ddlClassData: any[];
  ddlSemesterData: any[];

  ddlResult: any[];
  ddlRank: any[];
  ddlRankRetest: any[];
  ddlConduct: any[];
  ddlDistinction: any[];

  filterSelectItems: any = {};
  modalItems: any = {};

  checkedList: any;

  headerData: any[];
  normalHeaderData: any[];
  billingualHeaderData: any[];
  billingualChildHeaderData: any[];
  dynamicCols: any[];
  dynamicCols2: any[];

  isSelected: boolean = false;

  maxNumberOfCharactersDescription = 300;
  numberOfCharactersDescription = 0;

  lastYear = false;

  constructor(
    private fb: FormBuilder,
    private notifyService: NotificationService,
    private classSummationsService: ClassSummationsService
  ) {}

  get f() {
    return this.classSummationsFilterForm.controls;
  }

  get subjects() {
    return this.classSummationsDataSourceForm.get("subjects") as FormArray;
  }
  get classSummations() {
    return this.classSummationsDataSourceForm.get(
      "classSummations"
    ) as FormArray;
  }
  subjectCount: number = 0;
  ngOnInit() {
    this.ddlResult = [
      { id: 1, name: "Lên lớp" },
      { id: 0, name: "Lưu ban" },
    ];
    this.ddlRank = [
      { id: "1", name: "Giỏi" },
      { id: "2", name: "Khá" },
      { id: "3", name: "Trung bình" },
      { id: "4", name: "Yếu" },
      { id: "5", name: "Kém" },
    ];
    this.ddlRankRetest = [
      { id: "2", name: "Khá" },
      { id: "3", name: "Trung bình" },
      { id: "4", name: "Yếu" },
      { id: "5", name: "Kém" },
    ];
    this.ddlConduct = [
      { id: "1", name: "Tốt" },
      { id: "2", name: "Khá" },
      { id: "3", name: "Trung bình" },
      { id: "4", name: "Yếu" },
    ];
    this.ddlDistinction = [
      { id: 1, name: "Học sinh giỏi" },
      { id: 2, name: "Học sinh tiên tiến" },
      { id: 3, name: "Khác" },
    ];
    this.classSummationsFilterForm = this.fb.group({
      year: new FormControl("", [Validators.required]),
      class: new FormControl("", [Validators.required]),
      semester: new FormControl("", [Validators.required]),
      comment: new FormControl("", [Validators.required]),
      result: new FormControl("", [Validators.required]),
      reason: new FormControl("", [Validators.required]),
    });

    this.classSummationsDataSourceForm = this.fb.group({
      classSummations: this.fb.array([]),
    });

    this.classSummationsService.yearList().subscribe((res) => {
      if (res.years) {
        const mapYearData = res.years.map((year) => ({
          id: year.id,
          name: year.start_year + "-" + year.end_year,
        }));
        this.ddlYearData = mapYearData;
        this.filterSelectItems.year = res.id_current_year;

        this.classSummationsService
          .classList(res.id_current_year)
          .subscribe((resData) => {
            if (resData.query) {
              const mapClassData = resData.query.map((item) => ({
                id: item.id,
                name: item.class_name,
                level: item.level,
                year_id: this.filterSelectItems.year,
              }));
              const classData = mapClassData.filter(
                (value) => value.level != 1
              );
              this.ddlClassData = classData;
            }
          });
      }
    });
  }

  cellCheckboxChecked(value: any) {
    if (value.selected) {
      value.selected = false;
    } else {
      value.selected = true;
    }
    const findRowSelected = this.dataSource.find(
      (item) => item.selected === false
    );
    if (findRowSelected) {
      this.checkAllProperties["nativeElement"].checked = false;
    } else {
      this.checkAllProperties["nativeElement"].checked = true;
    }
  }

  checkUncheckAll() {
    if (this.checkAllProperties["nativeElement"].checked === false) {
      this.isSelected = true;
      this.checkAllProperties["nativeElement"].checked = true;
    } else {
      this.isSelected = false;
      this.checkAllProperties["nativeElement"].checked = false;
    }
    for (var i = 0; i < this.dataSource.length; i++) {
      this.dataSource[i].selected = this.isSelected;
    }
    this.getCheckedItemList();
  }

  commentModal() {
    const findRowSelected = this.dataSource.find(
      (item) => item.selected == true
    );
    if (!findRowSelected) {
      this.notifyService.showWarning(
        "Vui lòng chọn học sinh cần nhập nhanh nhận xét!",
        "Thông báo"
      );
      return;
    }
    this.resetForm();
    $("#quichEntryModal").modal("show");
  }
  studentDisabilitiesModal() {
    const findRowSelected = this.dataSource.filter(
      (item) => item.selected === true
    );
    if (findRowSelected.length === 0) {
      this.notifyService.showWarning(
        "Vui lòng chọn học sinh để xét lên lớp cho học sinh khuyết tật!",
        "Thông báo"
      );
      return;
    } else {
      const arrStudent = [];
      const arrNotSummaryStudent = [];
      for (let i = 0; i < findRowSelected.length; i++) {
        if (findRowSelected[i].disability !== 1) {
          findRowSelected[i].selected = false;
          this.checkAllProperties["nativeElement"].checked = false;
          arrStudent.push(findRowSelected[i].name);
        } else {
          if (
            findRowSelected[i].summary === undefined ||
            findRowSelected[i].summary === null
          ) {
            arrNotSummaryStudent.push(findRowSelected[i].name);
          }
        }
      }

      if (arrStudent && arrStudent.length > 0) {
        const studentList = arrStudent.join(", ");
        this.notifyService.showWarning(
          "Học sinh " +
            studentList +
            " không phải là học sinh khuyết tật. Vui lòng kiểm tra lại!",
          "Thông báo"
        );
        return;
      }

      if (arrNotSummaryStudent && arrNotSummaryStudent.length > 0) {
        const studentList = arrNotSummaryStudent.join(", ");
        this.notifyService.showWarning(
          "Học sinh " +
            studentList +
            " chưa tổng kết điểm. Vui lòng kiểm tra lại!",
          "Thông báo"
        );
        return;
      }
    }
    this.resetForm();
    $("#studentDisabilitiesModal").modal("show");
  }

  save() {
    const data = this.dataSource;
    // console.log(data);

    let formData = new FormData();
    let i = 0;

    if (this.filterSelectItems.class) {
      formData.append("class_id", this.filterSelectItems.class);
    }
    if (this.filterSelectItems.semester) {
      formData.append("semester_id", this.filterSelectItems.semester);
    }
    if (this.semesterProperties) {
      formData.append(
        "last_summary",
        this.semesterProperties["selectedValues"][0].last_summary
      );
    }

    data.forEach((items) => {
      if (items) {
        formData.append(
          "data" + "[" + i + "]" + "[student_id]",
          items.student_id
        );
        // Học lực
        if (items.rank) {
          formData.append("data" + "[" + i + "]" + "[rank]", items.rank);
        }
        // Hạnh kiểm
        if (items.conduct) {
          formData.append("data" + "[" + i + "]" + "[conduct]", items.conduct);
        }
        // Số buổi nghỉ
        if (items.absent != null) {
          formData.append("data" + "[" + i + "]" + "[absent]", items.absent);
        }

        // Nhận xét GVCN
        // if (items.description) {
        formData.append(
          "data" + "[" + i + "]" + "[description]",
          items.description ? items.description : ""
        );
        // }

        // Danh hiệu
        if (items.distinction) {
          formData.append(
            "data" + "[" + i + "]" + "[distinction]",
            items.distinction
          );
        }

        // Khen thưởng khác
        if (items.reward) {
          formData.append("data" + "[" + i + "]" + "[reward]", items.reward);
        }

        // Điểm TB sau khi thi lại
        if (items.scores_retest) {
          formData.append(
            "data" + "[" + i + "]" + "[scores_retest]",
            items.scores_retest
          );
        }
        // Học lực sau khi thi lại
        if (items.rank_retest) {
          formData.append(
            "data" + "[" + i + "]" + "[rank_retest]",
            items.rank_retest
          );
        }
        // Hạnh kiểm sau khi rèn luyện
        if (items.conduct_retest) {
          formData.append(
            "data" + "[" + i + "]" + "[conduct_retest]",
            items.conduct_retest
          );
        }
        // Hoàn thành CTH sau khi thi lại, rèn luyện
        if (
          items.level_up_retest != undefined &&
          items.disability === 1 &&
          items.level_up_retest !== null
        ) {
          formData.append(
            "data" + "[" + i + "]" + "[level_up_retest]",
            items.level_up_retest
          );
        }
        // if (items.note != null) {
        formData.append(
          "data" + "[" + i + "]" + "[note]",
          items.note ? items.note : ""
        );
        // }

        i++;
      }
    });

    this.classSummationsService
      .summarySave(formData)
      .pipe()
      .subscribe(
        (res) => {
          this.notifyService.showSuccess("Lưu dữ liệu thành công", "Thông báo");
          this.filter();
          this.checkedList = [];
        },
        (error) => {
          this.checkedList = [];
          if (error.error) {
            switch (error.error) {
              case 11:
                this.notifyService.showError(
                  "Lớp không hợp lệ",
                  "Thông báo lỗi"
                );
                return;
              case 12:
                this.notifyService.showError(
                  "Cấp học của lớp không hợp lệ",
                  "Thông báo lỗi"
                );
                return;
              case 13:
                this.notifyService.showError(
                  "Học kỳ không hợp lệ",
                  "Thông báo lỗi"
                );
                return;
              case 14:
                this.notifyService.showError(
                  "Lớp không tồn tại học sinh",
                  "Thông báo lỗi"
                );
                return;
              case 20:
                this.notifyService.showError(
                  "Vui lòng truyền dữ liệu học sinh",
                  "Thông báo lỗi"
                );
                return;

              case 21:
                this.notifyService.showError(
                  "Dữ liệu học sinh truyền vào tồn tại học sinh chưa được tổng kết điểm học kỳ",
                  "Thông báo lỗi"
                );
                return;
              case 22:
                this.notifyService.showError(
                  "Dữ liệu học kỳ chưa tổng kết điểm",
                  "Thông báo lỗi"
                );
                return;
              case 23:
                this.notifyService.showError(
                  "Dữ liệu học kỳ trước chưa được tổng kết",
                  "Thông báo lỗi"
                );
                return;
              case 24:
                this.notifyService.showError(
                  "Thiếu dữ liệu danh hiệu",
                  "Thông báo lỗi"
                );
                return;
              case 25:
                this.notifyService.showError(
                  "Dữ liệu học kỳ tiếp theo đã được tạo không thể thay đổi chỉnh sửa học kỳ cũ",
                  "Thông báo lỗi"
                );
                return;
              default:
                this.notifyService.showError(
                  "Lưu dữ liệu không thành công",
                  "Thông báo lỗi"
                );
                return;
            }
          } else {
            this.notifyService.showError(
              "Lưu dữ liệu không thành công",
              "Thông báo lỗi"
            );
            return;
          }
        }
      );
  }

  onSelectYear(item: any) {
    this.ddlClassData = [];
    this.ddlSemesterData = [];
    this.filterSelectItems.class = [];
    this.filterSelectItems.semester = [];
    if (item) {
      this.classSummationsService
        .classList(item.id)
        .pipe()
        .subscribe((res) => {
          if (res.query) {
            const result = res.query.map((item) => ({
              id: item.id,
              name: item.class_name,
              level: item.level,
              year_id: item.id,
            }));
            const classData = result.filter((value) => value.level != 1);
            this.ddlClassData = classData;
          }
        });
    }
  }
  onSelectClass(item: any) {
    this.ddlSemesterData = [];
    this.filterSelectItems.semester = [];
    if (item) {
      this.classSummationsService
        .semesterList(this.filterSelectItems.year, item.level)
        .pipe()
        .subscribe((res) => {
          if (res.query) {
            const result = res.query.map((items) => ({
              id: items.id,
              name: items.name,
              level: items.level,
              exam_time: items.exam_time,
              last_semester_id: res.last_semester_id,
              total: res.query.length,
              last_summary: 0,
            }));
            let foundLastSemester = result.find(function (val) {
              return val.id === val.last_semester_id;
            });
            // console.log(foundLastSemester);
            // const classData = result.filter((value) => value.level != 1);
            result.push({
              id: foundLastSemester.id,
              name: "Cuối năm",
              level: foundLastSemester.level,
              exam_time: foundLastSemester.exam_time,
              last_semester_id: res.last_semester_id,
              total: res.query.length,
              last_summary: 1,
            });
            this.ddlSemesterData = result;
            this.filterSelectItems.semester = result[0].id;
          }
        });
    }
  }
  onSelectSemester(item: any) {}

  header: any[];
  dataSource: any[];
  lastSummary: boolean = false;
  filter() {
    this.submitted = true;
    this.loadingFilter = true;

    this.dataSource = [];

    if (
      this.classSummationsFilterForm.controls.class.invalid &&
      this.classSummationsFilterForm.controls.semester.invalid
    ) {
      this.loadingFilter = false;
      return;
    }
    const lastSummary = this.semesterProperties["selectedValues"][0]
      .last_summary;
    if (lastSummary === 1) {
      this.lastSummary = true;
    } else {
      this.lastSummary = false;
    }
    //headerData
    this.classSummationsService
      .subjectList(
        this.filterSelectItems.class,
        this.filterSelectItems.semester,
        lastSummary
      )
      .pipe()
      .subscribe(
        (res) => {
          this.loadingFilter = false;
          if (res.normal || res.billingual_child || res.billingual) {
            if (typeof res.normal === "object" && res.normal !== null) {
              this.normalHeaderData = Object.values(res.normal);
            } else {
              this.normalHeaderData = res.normal;
            }
            if (typeof res.billingual === "object" && res.billingual !== null) {
              this.billingualHeaderData = Object.values(res.billingual);
            } else {
              this.billingualHeaderData = res.billingual;
            }
            if (
              typeof res.billingual_child === "object" &&
              res.billingual_child !== null
            ) {
              this.billingualChildHeaderData = Object.values(
                res.billingual_child
              );
            } else {
              this.billingualChildHeaderData = res.billingual_child;
            }
            if (lastSummary === 1) {
              this.lastYear = true;
              this.classSummationsYearEndHeader(
                this.normalHeaderData,
                res.billingual_child,
                res.billingual
              );
            } else {
              this.lastYear = false;
              this.classSummationsEachSemesterHeader(
                this.normalHeaderData,
                res.billingual_child,
                res.billingual
              );
            }
            //dataBinding
            this.classSummationsService
              .classSummationList(this.filterSelectItems.class, lastSummary)
              .pipe()
              .subscribe((res) => {
                this.checkAllProperties["nativeElement"].checked = false;
                const data = [];
                if (res.query) {
                  console.log(res.query);
                  res.query.forEach((item) => {
                    var newData = {
                      id: item.id,
                      student_id: item.student_id,
                      code: item.code,
                      name: `${item.lastname} ${item.firstname}`,
                      dob: item.dob,
                      disability: item.disability,
                      selected: false,
                    };
                    this.normalHeaderData.forEach((el) => {
                      if (item.avg) {
                        const result = item.avg.split("*");
                        result.forEach((data) => {
                          if (data) {
                            const parseJsonData = JSON.parse(data);
                            let found;
                            if (lastSummary === 0) {
                              found = parseJsonData.find(function (elmt) {
                                return (
                                  el.detail_study_program_id ==
                                  elmt.detail_study_program_id
                                );
                              });
                              if (found) {
                                // if (lastSummary === 0) {
                                newData[
                                  "subject_" + el.detail_study_program_id
                                ] = found["scores"] ? found["scores"] : null;
                                // } else {
                                //   newData["subject_" + el.subject_id] = found[
                                //     "scores"
                                //   ]
                                //     ? found["scores"]
                                //     : null;
                                // }

                                if (item.summary) {
                                  let summary = JSON.parse(item.summary);

                                  if (summary) {
                                    let foundSummary = summary.find(function (
                                      item
                                    ) {
                                      return (
                                        found.semester_id == item.semester_id
                                      );
                                    });
                                    if (foundSummary) {
                                      newData["summary"] = foundSummary.avg
                                        ? foundSummary.avg
                                        : null;

                                      newData["rank"] = foundSummary.rank
                                        ? foundSummary.rank
                                        : null;
                                      newData["conduct"] = foundSummary.conduct
                                        ? foundSummary.conduct
                                        : null;
                                      newData[
                                        "description"
                                      ] = foundSummary.description
                                        ? foundSummary.description
                                        : null;
                                      newData["absent"] = foundSummary.absent
                                        ? foundSummary.absent
                                        : null;
                                      // Kiểm tra học lực và hạnh kiểm để xét danh hiệu
                                      if (
                                        foundSummary.rank &&
                                        foundSummary.conduct
                                      ) {
                                        if (
                                          foundSummary.rank === "1" &&
                                          foundSummary.conduct === "1"
                                        ) {
                                          newData["distinction"] = 1;
                                        } else if (
                                          foundSummary.rank === "1" &&
                                          foundSummary.conduct === "2"
                                        ) {
                                          newData["distinction"] = 2;
                                        } else if (
                                          foundSummary.rank === "2" &&
                                          foundSummary.conduct === "1"
                                        ) {
                                          newData["distinction"] = 2;
                                        } else {
                                          newData["distinction"] = 3;
                                        }
                                      }
                                      newData["reward"] = foundSummary.reward
                                        ? foundSummary.reward
                                        : null;
                                    }
                                  }
                                }
                              }
                            } else {
                              if (item.last_avg) {
                                let parseJsonData = JSON.parse(item.last_avg);
                                found = parseJsonData.detail.find(function (
                                  elmt
                                ) {
                                  return el.subject_id == elmt.subject_id;
                                });
                                if (found) {
                                  newData["subject_" + el.subject_id] = found[
                                    "scores"
                                  ]
                                    ? found["scores"]
                                    : null;
                                }
                                newData["summary"] = parseJsonData.scores
                                  ? parseJsonData.scores
                                  : null;
                                // }
                                newData["rank"] = parseJsonData.rank
                                  ? parseJsonData.rank
                                  : null;
                                newData["conduct"] = parseJsonData.conduct
                                  ? parseJsonData.conduct
                                  : null;
                                newData[
                                  "description"
                                ] = parseJsonData.description
                                  ? parseJsonData.description
                                  : null;
                                newData["absent"] =
                                  parseJsonData.absent !== null
                                    ? parseJsonData.absent
                                    : null;

                                // Kiểm tra học lực và hạnh kiểm để xét danh hiệu
                                if (
                                  parseJsonData.rank &&
                                  parseJsonData.conduct
                                ) {
                                  if (
                                    parseJsonData.rank === "1" &&
                                    parseJsonData.conduct === "1"
                                  ) {
                                    newData["distinction"] = 1;
                                  } else if (
                                    parseJsonData.rank === "1" &&
                                    parseJsonData.conduct === "2"
                                  ) {
                                    newData["distinction"] = 2;
                                  } else if (
                                    parseJsonData.rank === "2" &&
                                    parseJsonData.conduct === "1"
                                  ) {
                                    newData["distinction"] = 2;
                                  } else {
                                    newData["distinction"] = 3;
                                  }
                                }
                                newData["reward"] = parseJsonData.reward
                                  ? parseJsonData.reward
                                  : null;
                                newData["level_up"] =
                                  parseJsonData.level_up != undefined &&
                                  parseJsonData.level_up != null
                                    ? parseJsonData.level_up === 0
                                      ? 0
                                      : 1
                                    : null;
                                newData[
                                  "scores_retest"
                                ] = parseJsonData.scores_retest
                                  ? parseJsonData.scores_retest
                                  : null;
                                newData["rank_retest"] =
                                  parseJsonData.rank_retest != null
                                    ? parseJsonData.rank_retest
                                    : null;
                                newData["conduct_retest"] =
                                  parseJsonData.conduct_retest != null
                                    ? parseJsonData.conduct_retest
                                    : null;
                                newData["level_up_retest"] =
                                  parseJsonData.level_up_retest !== undefined &&
                                  parseJsonData.level_up_retest !== null
                                    ? parseJsonData.level_up_retest === 0
                                      ? 0
                                      : 1
                                    : null;
                                newData["note"] = parseJsonData.note
                                  ? parseJsonData.note
                                  : null;
                              } else {
                                let parseJsonAvgData = JSON.parse(data);
                                found = [parseJsonAvgData].find(function (
                                  elmt
                                ) {
                                  return el.subject_id == elmt.subject_id;
                                });
                                if (found) {
                                  newData["subject_" + el.subject_id] = found[
                                    "scores"
                                  ]
                                    ? found["scores"]
                                    : null;
                                }
                              }
                            }
                          }
                        });
                      }
                    });

                    this.billingualHeaderData.forEach((el) => {
                      if (item.avg != undefined) {
                        const result = item.avg.split("*");
                        result.forEach((data) => {
                          if (data) {
                            const parseJsonData = JSON.parse(data);
                            let found;
                            if (lastSummary === 0) {
                              found = parseJsonData.find(function (elmt) {
                                return (
                                  el.detail_study_program_id ==
                                  elmt.detail_study_program_id
                                );
                              });
                            } else {
                              found = [parseJsonData].find(function (elmt) {
                                return el.subject_id == elmt.subject_id;
                              });
                            }
                            if (found) {
                              if (lastSummary === 0) {
                                newData[
                                  "billingual_" + el.detail_study_program_id
                                ] = found["scores"] ? found["scores"] : null;
                              } else {
                                newData["billingual_" + el.subject_id] = found[
                                  "scores"
                                ]
                                  ? found["scores"]
                                  : null;
                              }
                            }
                          }
                        });
                      }
                    });

                    this.billingualChildHeaderData.forEach((el) => {
                      if (item.avg != undefined) {
                        const result = item.avg.split("*");
                        result.forEach((element) => {
                          if (element) {
                            const parseJsonData = JSON.parse(element);
                            let found;
                            if (lastSummary === 0) {
                              found = parseJsonData.find(function (elmt) {
                                return (
                                  el.detail_study_program_id ==
                                  elmt.detail_study_program_id
                                );
                              });
                            } else {
                              found = [parseJsonData].find(function (elmt) {
                                return el.subject_id == elmt.subject_id;
                              });
                            }
                            if (found) {
                              if (lastSummary === 0) {
                                newData[
                                  "billingual_child_" +
                                    el.detail_study_program_id
                                ] = found["scores"] ? found["scores"] : null;
                              } else {
                                newData[
                                  "billingual_child_" + el.subject_id
                                ] = found["scores"] ? found["scores"] : null;
                              }
                            }
                          }
                        });
                      }
                    });

                    data.push(newData);
                  });
                  this.dataSource = data;

                  console.log(data);
                }
              });
          }
        },
        (error) => {
          this.notifyService.showError(
            "Lọc dữ liệu không thành công",
            "Thông báo lỗi"
          );
        }
      );
  }

  isAllSelected() {
    this.isSelected = this.dataSource.every(function (item: any) {
      return item.selected == true;
    });
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedList = [];
    const chkList = [];
    for (var i = 0; i < this.dataSource.length; i++) {
      if (this.dataSource[i].selected) chkList.push(this.dataSource[i]);
    }
    if (chkList.length > 0) {
      this.checkedList = JSON.stringify(chkList);
    }
  }

  classSummationsEachSemesterHeader(normal, billingual_child, billingual) {
    this.dynamicCols = [];
    this.dynamicCols2 = [];
    if (normal.length > 0 && billingual_child.length > 0) {
      this.header = [
        { field: "code", value: "Mã học sinh", isDynamicCol: false },
        { field: "name", value: "Họ và tên", isDynamicCol: false },
        { field: "dob", value: "Ngày sinh", isDynamicCol: false },
        {
          field: "subjects",
          value: "Môn",
          isDynamicCol: true,
          colspan: normal.length,
        },
        {
          field: "billingual",
          value: "Môn song ngữ",
          isDynamicCol: true,
          colspan: billingual_child.length + 1,
        },
        { field: "avg", value: "Điểm TB học kỳ", isDynamicCol: false },
        { field: "rank", value: "Học lực", isDynamicCol: false },
        { field: "conduct", value: "Hạnh kiểm", isDynamicCol: false },
        { field: "description", value: "Nhận xét GVCN", isDynamicCol: false },
        {
          field: "absent",
          value: "Số buổi nghỉ",
          isDynamicCol: false,
        },
        { field: "distinction", value: "Danh hiệu", isDynamicCol: false },
        {
          field: "reward",
          value: "Khen thưởng khác",
          isDynamicCol: false,
        },
      ];
      for (let i = 0; i < normal.length; i++) {
        this.dynamicCols.push({
          id: normal[i].detail_study_program_id,
          field: "subject_" + normal[i].detail_study_program_id,
          value: normal[i].subject_name,
          subjectType: normal[i].subject_type,
          isDynamicCol: true,
        });
      }
      for (let j = 0; j < billingual_child.length; j++) {
        this.dynamicCols2.push({
          id: billingual_child[j].detail_study_program_id,
          field:
            "billingual_child_" + billingual_child[j].detail_study_program_id,
          value: billingual_child[j].subject_name,
          subjectType: 2,
          isDynamicCol: true,
        });
      }
      this.dynamicCols2.push({
        id: billingual[0].detail_study_program_id,
        field: "billingual_" + billingual[0].detail_study_program_id,
        value: billingual[0].subject_name,
        subjectType: 2,
        isDynamicCol: true,
      });
      // console.log(this.dynamicCols2);
    } else {
      if (normal) {
        this.header = [
          { field: "code", value: "Mã học sinh", isDynamicCol: false },
          { field: "name", value: "Họ và tên", isDynamicCol: false },
          { field: "dob", value: "Ngày sinh", isDynamicCol: false },
          // { field: 'subjects', value: 'Môn', isDynamicCol: true },
          {
            field: "subjects",
            value: "Môn",
            isDynamicCol: true,
            colspan: normal.length,
          },
          { field: "avg", value: "Điểm TB học kỳ", isDynamicCol: false },
          { field: "rank", value: "Học lực", isDynamicCol: false },
          { field: "conduct", value: "Hạnh kiểm", isDynamicCol: false },
          { field: "description", value: "Nhận xét GVCN", isDynamicCol: false },
          {
            field: "absent",
            value: "Số buổi nghỉ",
            isDynamicCol: false,
          },
          { field: "distinction", value: "Danh hiệu", isDynamicCol: false },
          {
            field: "reward",
            value: "Khen thưởng khác",
            isDynamicCol: false,
          },
        ];
        for (let i = 0; i < normal.length; i++) {
          this.dynamicCols.push({
            id: normal[i].detail_study_program_id,
            field: "subject_" + normal[i].detail_study_program_id,
            value: normal[i].subject_name,
            subjectType: normal[i].subject_type,
            isDynamicCol: true,
          });
        }
      } else if (billingual) {
        this.header = [
          { field: "code", value: "Mã học sinh1", isDynamicCol: false },
          { field: "name", value: "Họ và tên", isDynamicCol: false },
          { field: "dob", value: "Ngày sinh", isDynamicCol: false },
          { field: "subjects", value: "Môn", isDynamicCol: true },
          { field: "avg", value: "Điểm TB học kỳ", isDynamicCol: false },
          { field: "rank", value: "Học lực", isDynamicCol: false },
          { field: "conduct", value: "Hạnh kiểm", isDynamicCol: false },
          { field: "description", value: "Nhận xét GVCN", isDynamicCol: false },
          {
            field: "absent",
            value: "Số buổi nghỉ",
            isDynamicCol: false,
          },
          { field: "distinction", value: "Danh hiệu", isDynamicCol: false },
          {
            field: "reward",
            value: "Khen thưởng khác",
            isDynamicCol: false,
          },
        ];
        for (let i = 0; i < billingual.length; i++) {
          this.dynamicCols2.push({
            id: billingual[i].detail_study_program_id,
            field: "billingual_" + billingual[i].detail_study_program_id,
            value: billingual[i].subject_name,
            subjectType: normal[i].subject_type,
            isDynamicCol: true,
          });
        }
      }
    }
  }

  classSummationsYearEndHeader(normal, billingual_child, billingual) {
    this.dynamicCols = [];
    this.dynamicCols2 = [];
    if (normal.length > 0 && billingual.length > 0) {
      this.header = [
        { field: "code", value: "Mã học sinh", isDynamicCol: false },
        { field: "name", value: "Họ và tên", isDynamicCol: false },
        { field: "dob", value: "Ngày sinh", isDynamicCol: false },
        {
          field: "subjects",
          value: "Môn",
          isDynamicCol: true,
          colspan: normal.length,
        },
        {
          field: "billingual",
          value: "Môn song ngữ",
          isDynamicCol: true,
          colspan: 1,
        },
        { field: "avg", value: "Điểm TB năm", isDynamicCol: false },
        { field: "rank", value: "Học lực", isDynamicCol: false },
        { field: "conduct", value: "Hạnh kiểm", isDynamicCol: false },
        { field: "description", value: "Nhận xét GVCN", isDynamicCol: false },
        {
          field: "absent",
          value: "Số buổi nghỉ",
          isDynamicCol: false,
        },
        { field: "distinction", value: "Danh hiệu", isDynamicCol: false },
        {
          field: "reward",
          value: "Khen thưởng khác",
          isDynamicCol: false,
        },
        {
          field: "level_up",
          value: "Xét hoàn thành CTH",
          isDynamicCol: false,
        },
        {
          field: "scores_retest",
          value: "Điểm TB sau khi thi lại",
          isDynamicCol: false,
        },
        {
          field: "rank_retest",
          value: "Học lực sau khi thi lại",
          isDynamicCol: false,
        },
        {
          field: "conduct_retest",
          value: "Hạnh kiểm sau khi rèn luyện",
          isDynamicCol: false,
        },
        {
          field: "level_up_retest",
          value: "Hoàn thành CTH sau khi thi lại, rèn luyện",
          isDynamicCol: false,
        },
        {
          field: "note",
          value: "Ghi chú",
          isDynamicCol: false,
        },
      ];
      for (let i = 0; i < normal.length; i++) {
        this.dynamicCols.push({
          id: normal[i].subject_id,
          field: "subject_" + normal[i].subject_id,
          value: normal[i].subject_name,
          subjectType: normal[i].subject_type,
          isDynamicCol: true,
        });
      }
      for (let j = 0; j < billingual.length; j++) {
        this.dynamicCols2.push({
          id: billingual[j].subject_id,
          field: "billingual_" + billingual[j].subject_id,
          value: billingual[j].subject_name,
          subjectType: normal[j].subject_type,
          isDynamicCol: true,
        });
      }
    } else {
      if (normal) {
        this.header = [
          { field: "code", value: "Mã học sinh", isDynamicCol: false },
          { field: "name", value: "Họ và tên", isDynamicCol: false },
          { field: "dob", value: "Ngày sinh", isDynamicCol: false },
          {
            field: "subjects",
            value: "Môn",
            isDynamicCol: true,
            colspan: normal.length,
          },
          { field: "avg", value: "Điểm TB năm", isDynamicCol: false },
          { field: "rank", value: "Học lực", isDynamicCol: false },
          { field: "conduct", value: "Hạnh kiểm", isDynamicCol: false },
          { field: "description", value: "Nhận xét GVCN", isDynamicCol: false },
          {
            field: "absent",
            value: "Số buổi nghỉ",
            isDynamicCol: false,
          },
          { field: "distinction", value: "Danh hiệu", isDynamicCol: false },
          {
            field: "reward",
            value: "Khen thưởng khác",
            isDynamicCol: false,
          },
          {
            field: "level_up",
            value: "Xét hoàn thành CTH",
            isDynamicCol: false,
          },
          {
            field: "scores_retest",
            value: "Điểm TB sau khi thi lại",
            isDynamicCol: false,
          },
          {
            field: "rank_retest",
            value: "Học lực sau khi thi lại",
            isDynamicCol: false,
          },
          {
            field: "conduct_retest",
            value: "Hạnh kiểm sau khi rèn luyện",
            isDynamicCol: false,
          },
          {
            field: "level_up_retest",
            value: "Hoàn thành CTH sau khi thi lại, rèn luyện",
            isDynamicCol: false,
          },
          {
            field: "note",
            value: "Ghi chú",
            isDynamicCol: false,
          },
        ];
        for (let i = 0; i < normal.length; i++) {
          this.dynamicCols.push({
            id: normal[i].subject_id,
            field: "subject_" + normal[i].subject_id,
            value: normal[i].subject_name,
            subjectType: normal[i].subject_type,
            isDynamicCol: true,
          });
        }
      } else if (billingual) {
        this.header = [
          { field: "code", value: "Mã học sinh", isDynamicCol: false },
          { field: "name", value: "Họ và tên", isDynamicCol: false },
          { field: "dob", value: "Ngày sinh", isDynamicCol: false },
          {
            field: "subjects",
            value: "Môn",
            isDynamicCol: true,
            colspan: billingual.length,
          },
          { field: "avg", value: "Điểm TB năm", isDynamicCol: false },
          { field: "rank", value: "Học lực", isDynamicCol: false },
          { field: "conduct", value: "Hạnh kiểm", isDynamicCol: false },
          { field: "description", value: "Nhận xét GVCN", isDynamicCol: false },
          {
            field: "absent",
            value: "Số buổi nghỉ",
            isDynamicCol: false,
          },
          { field: "distinction", value: "Danh hiệu", isDynamicCol: false },
          {
            field: "reward",
            value: "Khen thưởng khác",
            isDynamicCol: false,
          },
          {
            field: "level_up",
            value: "Xét hoàn thành CTH",
            isDynamicCol: false,
          },
          {
            field: "scores_retest",
            value: "Điểm TB sau khi thi lại",
            isDynamicCol: false,
          },
          {
            field: "rank_retest",
            value: "Học lực sau khi thi lại",
            isDynamicCol: false,
          },
          {
            field: "conduct_retest",
            value: "Hạnh kiểm sau khi rèn luyện",
            isDynamicCol: false,
          },
          {
            field: "level_up_retest",
            value: "Hoàn thành CTH sau khi thi lại, rèn luyện",
            isDynamicCol: false,
          },
          {
            field: "note",
            value: "Ghi chú",
            isDynamicCol: false,
          },
        ];
        for (let i = 0; i < billingual.length; i++) {
          this.dynamicCols2.push({
            id: billingual[i].subject_id,
            field: "billingual_" + billingual[i].subject_id,
            value: billingual[i].subject_name,
            subjectType: normal[i].subject_type,
            isDynamicCol: true,
          });
        }
      }
    }
  }

  summary() {
    const selectedListData = this.checkedList;
    if (selectedListData === undefined || selectedListData.length === 0) {
      this.notifyService.showWarning(
        "Vui lòng chọn học sinh để tính điểm",
        "Thông báo lỗi"
      );
      return;
    }
    let formData = new FormData();
    let i = 0;
    if (this.filterSelectItems.class) {
      formData.append("class_id", this.filterSelectItems.class);
    }
    if (this.filterSelectItems.semester) {
      formData.append("semester_id", this.filterSelectItems.semester);
    }
    if (this.semesterProperties) {
      formData.append(
        "last_summary",
        this.semesterProperties["selectedValues"][0].last_summary
      );
    }
    JSON.parse(selectedListData).forEach((data) => {
      if (data) {
        formData.append(
          "data" + "[" + i + "]" + "[student_id]",
          data.student_id
        );
        i++;
      }
    });

    this.classSummationsService
      .summaryCreate(formData)
      .pipe()
      .subscribe(
        (res) => {
          this.notifyService.showSuccess(
            "Tổng kết điểm thành công",
            "Thông báo"
          );
          this.filter();
          this.checkAllProperties["nativeElement"].checked = false;
          this.checkedList = [];
        },
        (error) => {
          this.checkedList = [];
          if (error.error) {
            switch (error.error) {
              case 11:
                this.notifyService.showError(
                  "Lớp không hợp lệ",
                  "Thông báo lỗi"
                );
                return;
              case 12:
                this.notifyService.showError(
                  "Cấp học của lớp không hợp lệ",
                  "Thông báo lỗi"
                );
                return;
              case 13:
                this.notifyService.showError(
                  "Học kỳ không hợp lệ",
                  "Thông báo lỗi"
                );
                return;
              case 14:
                this.notifyService.showError(
                  "Lớp không tồn tại học sinh",
                  "Thông báo lỗi"
                );
                return;
              case 15:
                this.notifyService.showError(
                  "Không tồn tại chương trình học hoặc chương trình không có môn tính điểm",
                  "Thông báo lỗi"
                );
                return;
              case 17:
                this.notifyService.showError(
                  "Không đủ dữ liệu từng học kỳ",
                  "Thông báo lỗi"
                );
                return;
              case 20:
                this.notifyService.showError(
                  "Vui lòng truyền dữ liệu học sinh",
                  "Thông báo lỗi"
                );
                return;
              case 25:
                this.notifyService.showError(
                  "Dữ liệu học kỳ tiếp theo đã được tạo không thể thay đổi chỉnh sửa học kỳ cũ",
                  "Thông báo lỗi"
                );
                return;
              default:
                this.notifyService.showError(
                  "Tổng kết điểm không thành công",
                  "Thông báo lỗi"
                );
                return;
            }
          } else {
            this.notifyService.showError(
              "Tổng kết điểm không thành công",
              "Thông báo lỗi"
            );
            return;
          }
        }
      );
  }

  bindingComment() {
    this.classSummationsFilterForm
      .get("comment")
      .setValidators([Validators.required]);
    this.classSummationsFilterForm.get("comment").updateValueAndValidity();
    this.submitted = true;
    if (this.classSummationsFilterForm.controls.comment.invalid) {
      return;
    }
    this.dataSource.forEach((item) => {
      if (item.selected) {
        item.description = this.classSummationsFilterForm.controls.comment.value;
      }
    });
    $("#quichEntryModal").modal("hide");
    $(".modal-backdrop").remove();
  }

  evaluateSave() {
    this.classSummationsFilterForm
      .get("result")
      .setValidators([Validators.required]);
    this.classSummationsFilterForm.get("result").updateValueAndValidity();
    this.classSummationsFilterForm
      .get("reason")
      .setValidators([Validators.required]);
    this.classSummationsFilterForm.get("reason").updateValueAndValidity();
    this.submitted = true;
    if (
      this.classSummationsFilterForm.controls.result.invalid &&
      this.classSummationsFilterForm.controls.reason.invalid
    ) {
      return;
    }

    this.dataSource.forEach((item) => {
      if (item.selected) {
        item.level_up_retest = this.modalItems.result;
        item.note = this.modalItems.reason;
      }
    });
    $("#studentDisabilitiesModal").modal("hide");
    $(".modal-backdrop").remove();
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

  resetForm() {
    this.classSummationsFilterForm.controls.result.clearValidators();
    this.classSummationsFilterForm.controls.reason.clearValidators();
    this.classSummationsFilterForm.controls.comment.clearValidators();
    this.modalItems.result = 1;
    this.classSummationsFilterForm.get("reason").setValue(null);
    this.classSummationsFilterForm.get("comment").setValue(null);
  }

  removeSpecialCharacter(event) {
    var k;
    k = event.charCode;
    if (k == 43 || k == 45 || k == 101) {
      return false;
    }
  }
}
