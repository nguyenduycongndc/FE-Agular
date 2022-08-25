import { Component, Input, OnInit } from "@angular/core";
import { NotificationService } from "../../../_services/notification.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ConfigurationParametersLessonService } from "../service/configuration-parameters-lesson";
import { Lessons } from "../../../_models/lesson";
import { CommonService } from "../../../_services/common.service";

declare var $: any;

@Component({
  selector: "app-configuration-lesson",
  templateUrl: "./configuration-lesson.component.html",
  styleUrls: ["./configuration-lesson.component.scss"],
})
export class ConfigurationLessonComponent implements OnInit {
  @Input()
  maxNumberOfCharactersDescription = 150;
  counter = true;
  numberOfCharactersDescription = 0;

  ddlYearData = [];
  selectedYear: any;
  ddlAddYearData = [];
  selectedAddYear: any;
  loadingFilter = false;
  lesson_config: any;
  lessonConfig: any;
  lessonGetId: any;

  checkLessonData = true;

  id: any;
  form: FormGroup;
  lessonConfigurationData: any;
  submitted = false;

  p: number = 1;
  countPage: number = 10;
  totalItems = 0;

  check_lesson = true;
  headerLessonConfiguration = false;
  constructor(
    private lessonService: ConfigurationParametersLessonService,
    private notifyService: NotificationService,
    private getYear: CommonService
  ) {}

  get f() {
    return this.form.controls;
  }

  // get statusActive(): any {
  //   return this.form.get('statusActive');
  // }

  ngOnInit() {
    this.headerLessonConfiguration = false;
    //Khởi tạo để validate + biến nhận value
    this.form = new FormGroup({
      add_year: new FormControl("", [Validators.required]),
      name: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      start_date: new FormControl("", [Validators.required]),
      end_date: new FormControl("", [Validators.required]),
      start_time: new FormControl("", [Validators.required]),
      end_time: new FormControl("", [Validators.required]),
      description: new FormControl(""),
      statusActive: new FormControl(true),
      code: new FormControl(""),
      year: new FormControl(""),
    });

    // this.lessonService.getAll().subscribe(
    //   (data) => {
    //   this.lesson_config = data['lesson_config'];
    // });
    this.lessonService
      .getYears()
      .pipe()
      .subscribe((data) => {
        const fullYear = [];
        const limitYear = [];
        const idCurrentYear = data["id_current_year"];
        let currentYearData;
        const currentArrYearData = [];
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
            currentArrYearData.push({
              id: item["id"],
              name: item["start_year"] + " - " + item["end_year"],
            });
          }
        });
        this.ddlYearData = fullYear;
        this.selectedYear = currentYearData;
      });
    //dropdown addYear
    this.getYear
      .getCurrentFutureYear()
      .pipe()
      .subscribe((res) => {
        const fullFutureYear = [];
        const limitFutureYear = [];
        const idFutureYear = res["query"];
        let futureYearData;
        const currentArrYearData = [];
        res["query"].forEach(function (item) {
          fullFutureYear.push({
            id: item["id"],
            name: item["start_year"] + " - " + item["end_year"],
          });
        });
        res["query"].forEach(function (item) {
          limitFutureYear.push({
            id: item["id"],
            name: item["start_year"] + " - " + item["end_year"],
          });
          if (item["status"] === 1) {
            futureYearData = {
              id: item["id"],
              name: item["start_year"] + " - " + item["end_year"],
            };
            currentArrYearData.push({
              id: item["id"],
              name: item["start_year"] + " - " + item["end_year"],
            });
          }
        });
        this.ddlAddYearData = fullFutureYear;
        this.selectedAddYear = futureYearData;
      });
  }
  onSelectYear(items: any) {
    if (this.selectedYear === null) {
      this.lessonService
        .getYears()
        .pipe()
        .subscribe((data) => {
          const fullYear = [];
          const limitYear = [];
          const idCurrentYear = data["id_current_year"];
          let currentYearData;
          const currentArrYearData = [];
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
              currentArrYearData.push({
                id: item["id"],
                name: item["start_year"] + " - " + item["end_year"],
              });
            }
          });
          this.ddlYearData = fullYear;
          this.selectedYear = currentYearData;
        });
    }
  }
  filter() {
    this.loadingFilter = true;
    var i = 0;
    const year = [];
    const status = this.form.value.statusActive;
    var uploadData = new FormData();
    year.push(this.selectedYear);
    if (year && year.length > 0) {
      year.forEach(function (item) {
        uploadData.append("year" + "[" + i + "]", item["id"]);
        i++;
      });
    }
    if (status) {
      uploadData.append("status", "active");
    } else {
      uploadData.append("status", "inactive");
    }
    this.lessonService.searchByFilter(uploadData).subscribe(
      (result) => {
        this.loadingFilter = false;
        if (result["lesson_config"].length === 0) {
          this.p = 1;
          this.totalItems = 1;
          this.lesson_config = [];
          this.checkLessonData = false;
          this.headerLessonConfiguration = true;
        } else {
          this.lesson_config = [];
          this.checkLessonData = true;
          this.headerLessonConfiguration = true;
          this.lesson_config = result["lesson_config"];
          this.totalItems = result["lesson_config"].length;
          this.p = 1;
        }
      },
      (error) => {
        this.loadingFilter = false;
        if (error) {
          this.notifyService.showError(
            "Lọc dữ liệu khối không thành công.",
            "Thông báo lỗi"
          );
        }
      }
    );
  }

  onKeyUp(event: any): void {
    this.numberOfCharactersDescription = event.target.value.length;
    if (
      this.numberOfCharactersDescription > this.maxNumberOfCharactersDescription
    ) {
      event.target.value = event.target.value.slice(0,this.maxNumberOfCharactersDescription);
      this.numberOfCharactersDescription = this.maxNumberOfCharactersDescription;
    }
  }
  // onKeyDown(event: any): void {
  //   const des = this.form.value.description;
  //   this.numberOfCharactersDescription = event.target.value.length;
  //   if (
  //     this.numberOfCharactersDescription > this.maxNumberOfCharactersDescription
  //   ) {
  //     event.target.value = event.target.value.slice(0,this.maxNumberOfCharactersDescription);
  //     this.numberOfCharactersDescription = this.maxNumberOfCharactersDescription;
  //   }
  // }

  //Hiển thị 10/20/50/100
  perPageSelected(id: number) {
    this.countPage = id;
    this.p = 1;
  }

  resetLessonForm() {
    this.form.get("name").clearValidators();
    this.form.get("start_date").clearValidators();
    this.form.get("end_date").clearValidators();
    this.form.get("start_time").clearValidators();
    this.form.get("end_time").clearValidators();
    this.form.get("description").clearValidators();
    // this.form.get('add_year').clearValidators();
    // this.form.get('add_year').setValue(null);
    this.form.get("name").setValue("");
    this.form.get("start_date").setValue("");
    this.form.get("end_date").setValue("");
    this.form.get("start_time").setValue("");
    this.form.get("end_time").setValue("");
    this.form.get("description").setValue("");
    this.numberOfCharactersDescription = 0;
  }

  reloadLessonData() {
    this.filter();
  }
  searchByCheckbox() {
    this.lesson_config = [];
    let status;
    let statusActive = this.form.controls["statusActive"]["nativeElement"]
      .checked;
    if (statusActive) {
      status = "active";
    } else {
      status = "inactive";
    }
    this.lessonService.searchByCheckbox(status).subscribe(
      (result) => {
        if (result["count"] === 0) {
          this.p = 1;
          this.totalItems = 1;
          this.lesson_config = [];
          this.checkLessonData = false;
          // this.notifyService.showError('Không tìm thấy dữ liệu', 'Thông báo lỗi');
        } else {
          this.lesson_config = [];
          this.checkLessonData = true;
          this.lesson_config = result["lesson_config"];
          this.totalItems = result["count"];
          this.p = 1;
        }
      },
      (error) => {
        Object.keys(error).forEach(function (key) {
          this.notifyService.showError(error[key], "Thông báo lỗi");
        });
      }
    );
  }

  //
  find(id: number) {
    this.form.get("name").clearValidators();
    this.form.get("start_date").clearValidators();
    this.form.get("end_date").clearValidators();
    this.form.get("start_time").clearValidators();
    this.form.get("end_time").clearValidators();
    this.form.get("description").clearValidators();

    this.form.get("name").setValue("");
    this.form.get("start_date").setValue("");
    this.form.get("end_date").setValue("");
    this.form.get("start_time").setValue("");
    this.form.get("end_time").setValue("");
    this.form.get("description").setValue("");

    this.lessonService.getIdLesson(id).subscribe((data) => {
      // this.lessonGetId = data;
      //Fill dữ liệu lên dropdown
      this.id = data["lesson_config"]["id"];
      const countDescriptionCharacter = data["lesson_config"].description
        .replace(/\s+/g, "")
        .trim();
      if (countDescriptionCharacter) {
        this.numberOfCharactersDescription =
          data["lesson_config"].description.length;
      }else{
        this.numberOfCharactersDescription = 0;
      }
      this.form.patchValue(data["lesson_config"]);
    });
  }
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

  onSelectAddYear(item: any) {
    if (this.selectedAddYear === null) {
      this.getYear
        .getCurrentFutureYear()
        .pipe()
        .subscribe((res) => {
          const fullFutureYear = [];
          const limitFutureYear = [];
          const idFutureYear = res["query"];
          let futureYearData;
          const currentArrYearData = [];
          res["query"].forEach(function (item) {
            fullFutureYear.push({
              id: item["id"],
              name: item["start_year"] + " - " + item["end_year"],
            });
          });
          res["query"].forEach(function (item) {
            limitFutureYear.push({
              id: item["id"],
              name: item["start_year"] + " - " + item["end_year"],
            });
            if (item["status"] === 1) {
              futureYearData = {
                id: item["id"],
                name: item["start_year"] + " - " + item["end_year"],
              };
              currentArrYearData.push({
                id: item["id"],
                name: item["start_year"] + " - " + item["end_year"],
              });
            }
          });
          this.ddlAddYearData = fullFutureYear;
          this.selectedAddYear = futureYearData;
        });
    }
  }
  //Tạo mới tiết học
  createLesson() {
    //reset lại thông báo của validate khi click thêm mới lại
    this.form
      .get("name")
      .setValidators([Validators.required, Validators.maxLength(50)]);
    this.form.get("name").updateValueAndValidity();

    this.form.get("start_date").setValidators([Validators.required]);
    this.form.get("start_date").updateValueAndValidity();

    this.form.get("add_year").setValidators([Validators.required]);
    this.form.get("add_year").updateValueAndValidity();

    this.form.get("end_date").setValidators([Validators.required]);
    this.form.get("end_date").updateValueAndValidity();

    this.form.get("start_time").setValidators([Validators.required]);
    this.form.get("start_time").updateValueAndValidity();

    this.form.get("end_time").setValidators([Validators.required]);
    this.form.get("end_time").updateValueAndValidity();

    this.submitted = true;
    //reset lại giá trị của drop
    if (this.form.invalid) {
      return;
    }
    var uploadData = new FormData();

    var add_year = this.form.controls["add_year"].value;
    var name = this.form.controls["name"].value;
    var start_date = this.form.controls["start_date"].value;
    var end_date = this.form.controls["end_date"].value;
    var start_time = this.form.controls["start_time"].value;
    var end_time = this.form.controls["end_time"].value;
    var description = this.form.controls["description"].value;
    if(description){
      description = description.substring(0, 150);
    }

    if (add_year) {
      uploadData.append("year_id", add_year.id);
    }
    if (name) {
      uploadData.append("name", name);
    }
    if (start_date) {
      uploadData.append("start_date", start_date);
    }
    if (end_date) {
      uploadData.append("end_date", end_date);
    }
    if (start_time) {
      uploadData.append("start_time", start_time);
    }
    if (end_time) {
      uploadData.append("end_time", end_time);
    }
    if (description) {
      uploadData.append("description", description);
    }

    //Thực thi thêm mới
    this.lessonService.create(uploadData).subscribe(
      (res) => {
        //Khi thêm mới thành công thì ẩn modal

        this.notifyService.showSuccess("Thêm mới thành công", "Thông báo");

        //Khi thêm mới thành công thì hiển thị lên gridview
        $("#addLessonModal").modal("hide");
        $(".modal-backdrop").remove();
        this.reloadLessonData();
      },
      (error) => {
        if (error.messages) {
          if (error.messages["end_time"]) {
            this.notifyService.showError(
              error.messages["end_time"],
              "Thông báo"
            );
          } else {
            this.notifyService.showError(
              "Thêm mới không thành công",
              "Thông báo"
            );
          }
          // if (error.messages['end_time']) {
          //   this.notifyService.showError(error.messages['end_time'], 'Thông báo');
          // } else if (error.messages['name']) {
          //   this.notifyService.showError(error.messages['name'], 'Thông báo');
          // }else if (error.messages['start_time']) {
          //   this.notifyService.showError(error.messages['start_time'], 'Thông báo');
          // }else{
          //   this.notifyService.showError('Thêm mới không thành công', 'Thông báo');
          // }
        } else if (error.message) {
          if (error.message["error"]) {
            this.notifyService.showError(error.message["error"], "Thông báo");
          } else if (error.message["lesson_config"]) {
            this.notifyService.showError(
              error.message["lesson_config"],
              "Thông báo"
            );
          } else {
            this.notifyService.showError(
              "Thêm mới không thành công",
              "Thông báo"
            );
          }
        } else {
          this.notifyService.showError(
            "Thêm mới không thành công",
            "Thông báo"
          );
        }
      }
    );
  }

  //Cập nhật môn học
  updateLesson(id) {
    this.form
      .get("name")
      .setValidators([Validators.required, Validators.maxLength(50)]);
    this.form.get("name").updateValueAndValidity();

    this.form.get("start_date").setValidators([Validators.required]);
    this.form.get("start_date").updateValueAndValidity();

    this.form.get("end_date").setValidators([Validators.required]);
    this.form.get("end_date").updateValueAndValidity();

    this.form.get("start_time").setValidators([Validators.required]);
    this.form.get("start_time").updateValueAndValidity();

    this.form.get("end_time").setValidators([Validators.required]);
    this.form.get("end_time").updateValueAndValidity();

    this.submitted = true;

    // const lessonData = new FormData();

    //reset lại giá trị của drop
    if (this.form.invalid) {
      return;
    }

    if (this.form.value["name"]) {
      var name = this.form.controls["name"].value;
    }
    if (this.form.value["start_date"]) {
      var start_date = this.form.controls["start_date"].value;
    }
    if (this.form.value["end_date"]) {
      var end_date = this.form.controls["end_date"].value;
    }
    if (this.form.value["start_time"]) {
      let startTime = this.form.controls["start_time"].value;
      let editStartTime = startTime.substr(0, 5);
      var start_time = editStartTime;
      // var start_time = this.form.controls['start_time'].value;
    }
    if (this.form.value["end_time"]) {
      let endTime = this.form.controls["end_time"].value;
      let editEndTime = endTime.substr(0, 5);
      var end_time = editEndTime;
      // var end_time = this.form.controls['end_time'].value;
    }
    if (this.form.value["description"]) {
      var description = this.form.controls["description"].value;
      if(description){
        description = description.substring(0, 150);
      }
    }
    //
    this.lessonService
      .update(id, start_date, end_date, start_time, end_time, description, name)
      .subscribe(
        (res) => {
          $("#editYearModal").modal("hide");
          $(".modal-backdrop").remove();
          this.notifyService.showSuccess("Cập nhật thành công", "Thông báo");

          //Khi cập nhật thành công thì hiển thị lên gridview
          this.reloadLessonData();
        },
        (error) => {
          if (error.messages) {
            if (error.messages["end_time"]) {
              this.notifyService.showError(
                error.messages["end_time"],
                "Thông báo"
              );
            } else {
              this.notifyService.showError(
                "cập nhật không thành công",
                "Thông báo"
              );
            }
          } else if (error.message) {
            if (error.message["error"]) {
              this.notifyService.showError(error.message["error"], "Thông báo");
            } else if (error.message["lesson_config"]) {
              this.notifyService.showError(
                error.message["lesson_config"],
                "Thông báo"
              );
            } else {
              this.notifyService.showError(
                "cập nhật không thành công",
                "Thông báo"
              );
            }
          } else {
            this.notifyService.showError(
              "cập nhật không thành công",
              "Thông báo"
            );
          }
        }
      );
  }

  //delete
  deleteLesson(id) {
    let isDelete = confirm("Bạn chắc chắn muốn xóa dữ liệu này?");
    if (isDelete) {
      this.lessonService.delete(id).subscribe((res) => {
        this.notifyService.showSuccess(
          "Xóa dữ liệu tiết học thành công",
          "Thông báo"
        );
        this.reloadLessonData();
      });
    }
  }

  //Sort theo mã
  firstCode = 1;
  timesId: any;
  sortCode() {
    this.firstName = 1;
    this.firstCode = 0;
    this.timesName = 0;
    const array = this.lesson_config;
    if (this.timesId === 1) {
      array.sort(function (a, b) {
        let str = a.id;
        var nameA = Number(str); // bỏ qua hoa thường
        let str2 = b.id;
        var nameB = Number(str2); // bỏ qua hoa thường
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // name trùng nhau
        return 0;
      });
      this.timesId++;
    } else {
      array.sort(function (a, b) {
        let str = a.id;
        var nameA = Number(str); // bỏ qua hoa thường
        let str2 = b.id;
        var nameB = Number(str2); // bỏ qua hoa thường
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }
        // name trùng nhau
        return 0;
      });
      this.timesId = 1;
    }
    this.lesson_config = array;
  }

  //sort tên học kỳ
  firstName = 1;
  timesName: any;
  sortLessonName() {
    this.firstName = 0;
    this.firstCode = 1;
    this.timesId = 0;
    const array = this.lesson_config;
    if (this.timesName === 1) {
      array.sort(function (a, b) {
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

        // var A = this.loc_xoa_dau(a.fullname);
        // var B = this.loc_xoa_dau(b.fullname);
        var nameA = str.toUpperCase(); // bỏ qua hoa thường

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
      this.timesName++;
    } else {
      array.sort(function (a, b) {
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

        // var A = this.loc_xoa_dau(a.fullname);
        // var B = this.loc_xoa_dau(b.fullname);
        var nameA = str.toUpperCase(); // bỏ qua hoa thường

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

        var nameB = str2.toUpperCase(); // bỏ qua hoa thường
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }
        // name trùng nhau
        return 0;
      });
      this.timesName = 1;
    }
    this.lesson_config = array;
  }
  // sort
}
