import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { element } from 'protractor';
import { NotificationService } from '../../../_services/notification.service';
import { PrimarySchoolAcademicTranscriptService } from '../service/primary-school-academic-transcript.service';
declare var $: any;
@Component({
  selector: 'app-primary-school-academic-transcript',
  templateUrl: './primary-school-academic-transcript.component.html',
  styleUrls: ['./primary-school-academic-transcript.component.scss']
})
export class PrimarySchoolAcademicTranscriptComponent implements OnInit {
  submitted = false;
  dataNull = true;
  addColum: boolean;
  //header
  header = false;

  //
  arr_new_scores: any[];

  colSub: any;
  saveItem: any = {};
  //nxNl
  ddlContentCommentsNL = [];
  selectedContentCommentsNL = [];
  //nxPC
  ddlContentCommentsPC = [];
  selectedContentCommentsPC = [];
  //Lý do
  maxNumberOfCharactersDescription = 150;
  counter = true;
  numberOfCharactersDescription = 0;
  ddlNLPC = [
    { id: '1', name: "T" }, { id: '2', name: "Đ" }, { id: '3', name: "C" },
  ]
  ddlResult = [
    { id: 1, name: "Lưu ban" },
    { id: 2, name: "Lên lớp" }
  ]
  form: FormGroup;
  //dữ liệu chung filter
  filterSaveItems: any = {};

  p: number = 1;
  countPage: number = 10;
  totalItems = 0;
  perPageSelected(id: number) {
    this.countPage = id;
    this.p = 1;
  }


  //data
  dataSource: any[];
  //year data
  ddlYearData = [];
  currentYear = [];

  //class data
  ddlClassData = [];
  // selectedClass = [];

  //semester data
  ddlSemesterData = [];
  // selectedSemester = [];
  itemsSemester: any = {};

  //load fillter
  loadingFilter = false;

  //cột động
  // headerData: any[];
  dynamicCols: any[];
  headerData2: any[];
  headerDataUnder: any[];
  lastHeaderData: any[];

  minDate: string;
  maxDate: string;
  constructor(
    private fb: FormBuilder,
    private primarySchoolAcademicTranscriptService: PrimarySchoolAcademicTranscriptService,
    private notifyService: NotificationService,
  ) { }
  get f() {
    return this.form.controls;
  }
  //Drop năng lực
  dropCapacity() {
    this.primarySchoolAcademicTranscriptService
      .dropCapacity()
      .subscribe((result) => {
        const dtCommentCapacity = [];
        result["query"].forEach(function (cont) {
          dtCommentCapacity.push({ name: cont.content });
        });
        this.ddlContentCommentsNL = dtCommentCapacity;
      });
  }
  //Drop phẩm chất
  dropQuality() {
    this.primarySchoolAcademicTranscriptService
      .dropQuality()
      .subscribe((result) => {
        const dtCommentQuality = [];
        result["query"].forEach(function (cont) {
          dtCommentQuality.push({ name: cont.content });
        });
        this.ddlContentCommentsPC = dtCommentQuality;
      });
  }
  //drop năm
  fullYear() {
    this.primarySchoolAcademicTranscriptService.listYear().subscribe((res) => {
      if (res.years) {
        const result = res.years.map((year) => ({
          id: year.id,
          name: year.start_year + "-" + year.end_year,
        }));
        this.ddlYearData = result;
        this.filterSaveItems.year = res.id_current_year;

        this.primarySchoolAcademicTranscriptService
          .listClass(res.id_current_year)
          .subscribe((res) => {
            if (res.query) {
              const result = res.query.map((item) => ({
                id: item.id,
                name: item.class_name,
                level: item.level,
                year_id: this.filterSaveItems.year,
              }));
              const classData = result.filter((value) => value.level == 1);
              this.ddlClassData = classData;
            }
          });
      }
    });

  }
  ngOnInit() {
    this.form = this.fb.group({
      tpv: new FormControl(""),
      ht: new FormControl(""),
      th: new FormControl(""),
      commentsNL: new FormControl(""),
      ch: new FormControl(""),
      tt: new FormControl(""),
      tk: new FormControl(""),
      dk: new FormControl(""),
      commentsPC: new FormControl(""),
      descriptionAdd: new FormControl(""),
      result: new FormControl(""),
      semesterName: new FormControl(""),

    });
    this.fullYear();
    this.dropCapacity();
    this.dropQuality();
  }

  //sk change year
  onSelectYear(item: any) {
    this.filterSaveItems.class = {};
    this.filterSaveItems.semester = {};
    // this.selectedClass = [];
    // this.selectedSemester = [];
    if (item != undefined) {
      const arrClass = [];
      this.primarySchoolAcademicTranscriptService
        .listClass(item.id)
        .pipe()
        .subscribe((ress) => {
          ress["query"].forEach(function (items) {
            if (items.level == 1) {
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
  //sk change class
  onSelectClass(item: any) {

    this.filterSaveItems.semester = null;
    if (this.filterSaveItems.class) {
      this.filterSaveItems.showErrorClass = false;
      this.filterSaveItems.showErrorSemester = false;
    }
    if (item != undefined) {
      const arrSemester = [];
      this.primarySchoolAcademicTranscriptService
        .listSemester(item["year_id"], item.level)
        .pipe()
        .subscribe((res) => {
          res["query"].forEach(function (items) {
            if (items["level"] == 1) {
              if (items["exam_time"] == 1) {
                arrSemester.push({
                  semester_id: items["id"],
                  name: "Giữa" + " " + items["name"],
                  level: items["level"],
                  exam_time: items["exam_time"],
                  mid_or_last: 1,
                  last_semester_id: res.last_semester_id,
                });
                arrSemester.push({
                  semester_id: items["id"],
                  name: "Cuối" + " " + items["name"],
                  level: items["level"],
                  exam_time: items["exam_time"],
                  mid_or_last: 2,
                  last_semester_id: res.last_semester_id,
                });
              } else {
                arrSemester.push({
                  semester_id: items["id"],
                  name: "Cuối" + " " + items["name"],
                  level: items["level"],
                  exam_time: items["exam_time"],
                  mid_or_last: 2,
                  last_semester_id: res.last_semester_id,
                });
              }
            }
          });
          this.ddlSemesterData = arrSemester;
          this.filterSaveItems.semester = arrSemester[0].semester_id;
          this.itemsSemester = arrSemester;
        });
    }
  }
  //sk change semester
  onSelectSemester(item: any) {
    this.itemsSemester = item;
    if (this.filterSaveItems.semester) {
      this.filterSaveItems.showErrorSemester = false;
      this.filterSaveItems.showErrorSemester = false;
    }
  }
  headerData: any;
  rank: any;
  //filter
  filter() {

    this.dataSource = [];
    // this.loadingFilter = true;
    this.headerData = [];
    this.headerDataUnder = [];
    this.lastHeaderData = [];
    $("#removeCheck").prop("checked", false);
    $("#radio_row").prop("checked", false);
    $("#radio_column").prop("checked", true);

    this.isSelected = false;
    if (!this.filterSaveItems.class) {
      this.filterSaveItems.showErrorClass = true;
    }
    if (!this.filterSaveItems.semester) {
      this.filterSaveItems.showErrorSemester = true;
    }
    this.submitted = true;
    if (
      this.filterSaveItems.showErrorClass ||
      this.filterSaveItems.showErrorSemester
    ) {
      return;
    }

    this.headerData = [
      { field: "quickType", value: "" },
      { field: "stt", value: "STT" },
      { field: "code", value: "Mã học sinh", isDynamicCol: false },
      { field: "name", value: "Họ và tên", isDynamicCol: false },
      { field: "dob", value: "Ngày sinh", isDynamicCol: false },
      {
        field: "subjects",
        value: "Môn học và hoạt động giáo dục",
        isDynamicCol: true,
      },
      { field: "competence", value: "Năng lực", isDynamicCol: false },
      { field: "quality", value: "Phẩm chất", isDynamicCol: false },
    ];
    if (this.itemsSemester.last_semester_id == this.itemsSemester.semester_id && this.itemsSemester.mid_or_last == 2) {
      this.addColum = true;
      this.headerData.push(
        { field: "rewardingYear", value: "Khen thưởng cuối năm", isDynamicCol: false },
        { field: "rewarding_extraodinary", value: "Khen thưởng đột xuất", isDynamicCol: false },
        { field: "level_up", value: "Lên lớp", isDynamicCol: false },
        { field: "description", value: "Ghi chú", isDynamicCol: false }
      )
    }
    else {
      this.addColum = false;
    }
    this.primarySchoolAcademicTranscriptService.listAll(this.filterSaveItems.class, this.filterSaveItems.year, this.filterSaveItems.semester)
      .subscribe((res) => {
        //data_subject
        this.header = true;
        // this.dataNull = true;
        this.loadingFilter = false;
        if (res.data_subject.length > 0) {
          this.header = true;
          this.getHeadPrimarySchool(res["data_subject"]);

          // binding data
          const data = [];
          if (res.query.length > 0) {
            this.dataNull = true;
            res.query.forEach((item) => {
              var newData = {
                id: item.id,
                student_id: item.student_id,
                code: item.code,
                name: item.student_name,
                dob: item.dob,
                disability: item.disability,
                selected: false,
                description: item.description,
                rewarding_extraodinary: item.rewarding_extraodinary,
                reward_type: item.reward_type,
                reward_content: item.reward_content,
                level_up: item.level_up,
              };
              let check_mid_or_last;
              let check_semester_id;
              if (this.itemsSemester.mid_or_last == undefined) {
                check_mid_or_last = this.itemsSemester[0].mid_or_last;
                check_semester_id = this.itemsSemester[0].semester_id;
              } else if (this.itemsSemester.mid_or_last) {
                check_mid_or_last = this.itemsSemester.mid_or_last;
                check_semester_id = this.itemsSemester.semester_id;
              }
              res.data_subject.forEach((el) => {
                if (item.avg) {
                  const result = item.avg.split("-");
                  const arr_scores = [];
                  result.forEach((element) => {
                    if (element) {
                      var avgData = JSON.parse(element);
                      let found = avgData.find(function (elmt) {
                        return (el.detail_study_program_id == elmt.detail_study_program_id && elmt.mid_or_last == check_mid_or_last);
                      });
                      if (found) {
                        newData["sb_text_" + el.detail_study_program_id] = found["scores"] ? found["scores"] : null;
                        newData["sb_number_" + el.detail_study_program_id] = found["scores"] ? found["scores"] : null;
                      }
                    }

                  });

                }
                if (item.rating) {
                  var ratingData = JSON.parse(item.rating);
                  let found1 = ratingData.find(function (elmt) {
                    return (elmt.semester_id == check_semester_id && elmt.mid_or_last == check_mid_or_last);
                  });
                  //năng lực
                  if (found1) {

                    newData["competence1"] = found1.capacity.tpv;
                    newData["competence2"] = found1.capacity.ht;
                    newData["competence3"] = found1.capacity.th;
                    newData["competence4"] = found1.capacity.comment ? found1.capacity.comment : null;

                    //phảm chất
                    newData["quality1"] = found1.quality.ch;
                    newData["quality2"] = found1.quality.tt;
                    newData["quality3"] = found1.quality.dk;
                    newData["quality4"] = found1.quality.tk;
                    newData["quality5"] = found1.quality.comment ? found1.quality.comment : null;
                    // ratingData.forEach(items => {
                    //   newData["competence1"] = items.capacity.tpv;
                    //   newData["competence2"] = items.capacity.ht;
                    //   newData["competence3"] = items.capacity.th;
                    //   newData["competence4"] = items.capacity.comment ? items.capacity.comment : null;
                    //   return;
                    // });
                    // //phảm chất
                    // ratingData.forEach(items => {
                    //   newData["quality1"] = items.quality.ch;
                    //   newData["quality2"] = items.quality.tt;
                    //   newData["quality3"] = items.quality.dk;
                    //   newData["quality4"] = items.quality.tk;
                    //   newData["quality5"] = items.quality.comment ? items.quality.comment : null;
                    //   return;
                    // });
                    // }
                  }
                }

              });

              data.push(newData);


              const arr = [];
              for (var key in newData) {
                if (key.startsWith("sb_number")) {
                  arr.push(newData[key]); //arr_scoress
                }
              }

              let flag;
              //check danh hiệu tiêu biểu
              if ((newData["competence1"] == "2" || newData["competence1"] == "1")
                && (newData["competence2"] == "2" || newData["competence1"] == "1")
                && (newData["competence3"] == "2" || newData["competence1"] == "1")
                && (newData["quality1"] == "2" || newData["competence1"] == "1")
                && (newData["quality2"] == "2" || newData["competence1"] == "1")
                && (newData["quality3"] == "2" || newData["competence1"] == "1")
                && (newData["quality4"] == "2" || newData["competence1"] == "1")) {
                flag = 12;
              }

              if (arr.every((el) => el >= 5) === false
                || newData["competence1"] == ""
                || newData["competence2"] == ""
                || newData["competence3"] == ""
                || newData["quality1"] == ""
                || newData["quality2"] == ""
                || newData["quality3"] == ""
                || newData["quality4"] == ""
              ) {
                newData.reward_type = 0;
                if(newData.disability != 1){
                  newData.level_up = 0;
                }
              } else {
                if (arr.every((el) => el > 8) === true) {
                  if (newData["competence1"] == "1"
                    && newData["competence2"] == "1"
                    && newData["competence3"] == "1"
                    && newData["quality1"] == "1"
                    && newData["quality2"] == "1"
                    && newData["quality3"] == "1"
                    && newData["quality4"] == "1") {
                    newData.reward_type = 1;
                    // newData.level_up = 2;
                    if(newData.disability != 1){
                      newData.level_up = 2;
                    }
                  }
                } else if (arr.every((el) => el >= 5) === true && (flag == 12)) {
                  newData.reward_type = 2;
                  // newData.level_up = 2;
                  if(newData.disability != 1){
                    newData.level_up = 2;
                  }
                } else{
                  // newData.level_up = 1;
                  if(newData.disability != 1){
                    newData.level_up = 1;
                  }
                }
              }

              this.dataSource = data;


            });

          } else {
            this.dataSource = [];
            this.dataNull = false;
          }
        } else {
          this.dataSource = []
          this.headerData = [];
          this.headerDataUnder = [];
          this.lastHeaderData = [];
          this.dataNull = false;
        }
      })

  }
  //list môn
  getHeadPrimarySchool(subjects) {
    let cols = subjects.length;
    /*headerDataUnder*/
    this.headerDataUnder = [
      { field: "quickType", value: "" },
      { field: "code", value: "Mã học sinh", isDynamicCol: false },
      { field: "name", value: "Họ và tên", isDynamicCol: false },
      { field: "dob", value: "Ngày sinh", isDynamicCol: false },

    ];
    subjects.forEach((e) => {
      this.headerDataUnder.push({ field: "sb_" + e.detail_study_program_id, value: e.name, subjectType: e.subject_type, col: e.subject_type == 2 ? 1 : 2 });

    });
    this.headerDataUnder.push(
      { field: "competence1", value: "Tự phục vụ, tự quản", isDynamicCol: false },
      { field: "competence2", value: "Hợp tác", isDynamicCol: false },
      { field: "competence3", value: "Tự học và giải quyết vấn đề", isDynamicCol: false },
      { field: "competence4", value: "Nhận xét", isDynamicCol: false },
      { field: "quality1", value: "Chăm học, chăm làm", isDynamicCol: false },
      { field: "quality2", value: "Tự tin, trách nghiệm", isDynamicCol: false },
      { field: "quality3", value: "Trung thực, kỷ luật", isDynamicCol: false },
      { field: "quality4", value: "Đoàn kết yêu thương", isDynamicCol: false },
      { field: "quality5", value: "Nhận xét", isDynamicCol: false },
    );
    if (this.addColum == true) {
      this.headerDataUnder.push(
        { field: "rewardingYear1", value: "Loại khen thưởng", isDynamicCol: false },
        { field: "rewardingYear2", value: "Nội dung khen thưởng", isDynamicCol: false },
        { field: "rewarding_extraodinary", value: "Khen thưởng đột xuất", isDynamicCol: false },
        { field: "level_up", value: "Lên lớp", isDynamicCol: false },
        { field: "description", value: "Ghi chú", isDynamicCol: false }
      )
    }
    /*end*/
    /*lastHeaderData*/
    this.lastHeaderData = [
      { field: "code", value: "Mã học sinh", isDynamicCol: false },
      { field: "name", value: "Họ và tên", isDynamicCol: false },
      { field: "dob", value: "Ngày sinh", isDynamicCol: false },
    ]

    subjects.forEach((e) => {
      if (e.subject_type == 2) {
        this.lastHeaderData.push({ field: "sb_text_" + e.detail_study_program_id, value: "Mức độ hoàn thành" })
      } else {
        cols++;
        // this.lastHeaderData.push(
        //   { field: "sb_" + e.detail_study_program_id, value: "Mức độ hoàn thành", isDynamicCol: true },
        //   { field: "sb_" + e.detail_study_program_id, value: "Điểm KTĐK", isDynamicCol: true }
        // )
        this.lastHeaderData.push(
          {
            field: "sb_text_" + e.detail_study_program_id,
            value: "Mức độ hoàn thành",
            isDynamicCol: true,
          },
          {
            field: "sb_number_" + e.detail_study_program_id,
            value: "Điểm KTĐK",
            isDynamicCol: true,
          }
        );
      }
    });
    this.lastHeaderData.push(
      { field: "competence1", value: "Tự phục vụ, tự quản", isDynamicCol: false },
      { field: "competence2", value: "Hợp tác", isDynamicCol: false },
      { field: "competence3", value: "Tự học và giải quyết vấn đề", isDynamicCol: false },
      { field: "competence4", value: "Nhận xét", isDynamicCol: false },
      { field: "quality1", value: "Chăm học, chăm làm", isDynamicCol: false },
      { field: "quality2", value: "Tự tin, trách nghiệm", isDynamicCol: false },
      { field: "quality3", value: "Trung thực, kỷ luật", isDynamicCol: false },
      { field: "quality4", value: "Đoàn kết yêu thương", isDynamicCol: false },
      { field: "quality5", value: "Nhận xét", isDynamicCol: false },
    );
    if (this.addColum == true) {
      this.lastHeaderData.push(
        { field: "reward_type", value: "Loại khen thưởng", isDynamicCol: false },
        { field: "reward_content", value: "Nội dung khen thưởng", isDynamicCol: false },
        { field: "rewarding_extraodinary", value: "Khen thưởng đột xuất", isDynamicCol: false },
        { field: "level_up", value: "Lên lớp", isDynamicCol: false },
        { field: "description", value: "Ghi chú", isDynamicCol: false }
      )
    }
    /*end*/

    this.colSub = cols;
  }
  //sự kiện change của chọn all
  isSelected: boolean = false;
  checkedList: any = [];
  checkAllCheckBox(event: any) {
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
    // this.checkedList = [];
    const arrStudentId = [];
    for (var i = 0; i < this.dataSource.length; i++) {
      if (this.dataSource[i].selected)
        arrStudentId.push(this.dataSource[i]);
    }
    // this.checkedList = JSON.stringify(arrStudentId);
    this.checkedList = arrStudentId;
  }

  //Nhập nhạnh
  quickEntry() {
    this.saveItem = {};
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

  //lưu
  save() {
    let formData = new FormData();
    let i = 0;
    formData.append("year_id", this.filterSaveItems.year);
    formData.append("class_id", this.filterSaveItems.class);
    formData.append("semester_id", this.filterSaveItems.semester);
    if (this.itemsSemester.mid_or_last == undefined) {
      formData.append("mid_or_last", this.itemsSemester[0].mid_or_last);
    } else if (this.itemsSemester.mid_or_last) {
      formData.append("mid_or_last", this.itemsSemester.mid_or_last);
    }

    this.dataSource.forEach(function (item) {
      formData.append("data" + "[" + i + "]" + "[student_id]", item.student_id);
      if (item.competence1) {
        formData.append("data" + "[" + i + "]" + "[rating]" + "[capacity]" + "[tpv]", item.competence1);
      } else {
        item.competence1 = null;
      }

      if (item.competence2) {
        formData.append("data" + "[" + i + "]" + "[rating]" + "[capacity]" + "[ht]", item.competence2);
      } else {
        item.competence2 = null;
      }
      if (item.competence3) {
        formData.append("data" + "[" + i + "]" + "[rating]" + "[capacity]" + "[th]", item.competence3);
      } else {
        item.competence3 = null;
      }
      if (item.competence4) {
        formData.append("data" + "[" + i + "]" + "[rating]" + "[capacity]" + "[comment]", item.competence4);
        if (item.competence4.name) {
          formData.append("data" + "[" + i + "]" + "[rating]" + "[capacity]" + "[comment]", item.competence4.name);
        }
      }

      if (item.quality1) {
        formData.append("data" + "[" + i + "]" + "[rating]" + "[quality]" + "[ch]", item.quality1);
      } else {
        item.quality1 = null;
      }
      if (item.quality2) {
        formData.append("data" + "[" + i + "]" + "[rating]" + "[quality]" + "[tt]", item.quality2);
      } else {
        item.quality2 = null;
      }
      if (item.quality3) {
        formData.append("data" + "[" + i + "]" + "[rating]" + "[quality]" + "[dk]", item.quality3);
      } else {
        item.quality3 = null;
      }
      if (item.quality4) {
        formData.append("data" + "[" + i + "]" + "[rating][quality][tk]", item.quality4);
      } else {
        item.quality4 = null;
      }
      if (item.quality5) {
        formData.append("data" + "[" + i + "]" + "[rating][quality][comment]", item.quality5);
        if (item.quality5.name) {
          formData.append("data" + "[" + i + "]" + "[rating][quality][comment]", item.quality5.name);
        }
      }
      if (item.reward_type) {
        formData.append("data" + "[" + i + "]" + "[reward_type]", item.reward_type);
      }
      if (item.reward_content) {
        formData.append("data" + "[" + i + "]" + "[reward_content]", item.reward_content);
      }
      if (item.rewarding_extraodinary) {
        formData.append("data" + "[" + i + "]" + "[rewarding_extraodinary]", item.rewarding_extraodinary);
      }
      if (item.level_up) {
        formData.append("data" + "[" + i + "]" + "[level_up]", item.level_up);
      }
      if (item.description) {
        formData.append("data" + "[" + i + "]" + "[description]", item.description);
      }
      i++;
      // const capacity = []
    })
    // let data = {
    //   year_id: this.filterSaveItems.year,
    //   class_id: this.filterSaveItems.class,
    //   semester_id: this.filterSaveItems.semester,
    //   mid_or_last: this.itemsSemester,
    //   data: formData
    // };
    this.primarySchoolAcademicTranscriptService.save(formData).subscribe((res) => {
      if (res.message === "success") {
        this.notifyService.showSuccess(
          "Cập nhật dữ liệu thành công",
          "Thông báo"
        );
      }
      this.filter();
    },
      (error) => {
        if (error.error == 15) {
          this.notifyService.showError("Phải thêm lần lượt dữ liệu học kỳ", "Thông báo lỗi");
        } else if (error.error == 20) {
          this.notifyService.showError("Học kỳ không thuộc lớp", "Thông báo lỗi");
        } else if (error.error == 21) {
          this.notifyService.showError("Không tồn tại lớp học", "Thông báo lỗi");
        } else if (error.error == 22) {
          this.notifyService.showError("Không tồn tại học kỳ", "Thông báo lỗi");
        } else if (error.error == 23) {
          this.notifyService.showError("Không tồn tại học sinh thuộc lớp học", "Thông báo lỗi");
        } else if (error.error == 24) {
          this.notifyService.showError("Lớp học truyền vào phải thuộc cấp 1", "Thông báo lỗi");
        } else {
          this.notifyService.showError("Lưu thất bại.", "Thông báo lỗi");
        }
      }
    )


  }

  //xét lên lớp vs hs kt
  upLevel() {
    this.saveItem = {};
    this.numberOfCharactersDescription = 0;
    // const findRowSelected = this.dataSource.find(
    //   (item) => item.selected == true
    // );
    // if (!findRowSelected) {
    //   this.notifyService.showWarning(
    //     "Vui lòng chọn bản ghi dữ liệu cần cập nhật!",
    //     "Thông báo"
    //   );
    //   return;
    // }
    // this.dataSource.forEach((item) => {
    //   if (item.selected == true) {

    //     if (item.disability != 1) {
    //       item.selected = false;
    //       this.isSelected = false;
    //     } else if (item.disability == 1) {
    //       item.selected = true;
    //       $("#createModal").modal("show");
    //     } else {
    //       this.notifyService.showWarning(
    //         "Không phải học sinh khuyết tật",
    //         "Thông báo"
    //       );
    //       return;
    //     }
    //   }
    // })
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
          this.isSelected = false;
          findRowSelected[i].selected = false;
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
    }
    $("#createModal").modal("show");
  }

  //lưu khi nhập nhanh
  saveQuichEntry() {
    let allFilter = this.form.value;
    this.dataSource.forEach((item) => {
      if (item.selected) {
        item.competence1 = allFilter.tpv;
        item.competence2 = allFilter.ht;
        item.competence3 = allFilter.th;
        item.competence4 = allFilter.commentsNL;
        item.quality1 = allFilter.ch;
        item.quality2 = allFilter.tt;
        item.quality3 = allFilter.tk;
        item.quality4 = allFilter.dk;
        item.quality5 = allFilter.commentsPC;
      }
    });
    $("#quichEntryModal").modal("hide");
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

  //lưu khi xét lên lớp khuyế tật
  createKT() {
    let allFilter = this.form.value;
    this.dataSource.forEach((item) => {
      if (item.selected) {
        item.level_up = allFilter.result;
        item.description = allFilter.descriptionAdd;
      }
    });
    $("#createModal").modal("hide");
    $(".modal-backdrop").remove();

  }
  checkUncheckAll(event: any) {
    for (var i = 0; i < this.dataSource.length; i++) {
      this.dataSource[i].selected = this.isSelected;
    }
    this.getCheckedItemList();
  }
  enterR() {
    $(".competence1").attr("tabindex", "7");
    $(".competence2").attr("tabindex", "7");
    $(".competence3").attr("tabindex", "7");
    $(".competence4").attr("tabindex", "7");
    $(".quality1").attr("tabindex", "7");
    $(".quality2").attr("tabindex", "7");
    $(".quality3").attr("tabindex", "7");
    $(".quality4").attr("tabindex", "7");
    $(".quality5").attr("tabindex", "7");
    $(".reward_type").attr("tabindex", "7");
    $(".inputRow1").attr("tabindex", "7");
    $(".inputRow2").attr("tabindex", "7");
    $(".level_up").attr("tabindex", "7");
    $(".inputRow3").attr("tabindex", "7");

  }

  enterC() {
    $(".competence1").attr("tabindex", "8");
    $(".competence2").attr("tabindex", "9");
    $(".competence3").attr("tabindex", "10");
    $(".competence4").attr("tabindex", "11");
    $(".quality1").attr("tabindex", "12");
    $(".quality2").attr("tabindex", "13");
    $(".quality3").attr("tabindex", "14");
    $(".quality4").attr("tabindex", "15");
    $(".quality5").attr("tabindex", "16");
    $(".reward_type").attr("tabindex", "17");
    $(".inputRow1").attr("tabindex", "18");
    $(".inputRow2").attr("tabindex", "19");
    $(".level_up").attr("tabindex", "20");
    $(".inputRow3").attr("tabindex", "21");

  }

}
