import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CommonService } from "../../../_services/common.service";
import { NotificationService } from "../../../_services/notification.service";
import { UtilityService } from "../../../_services/utils.service";
import { AttendanceService } from "../service/attendance.service";
declare var $: any;
@Component({
  selector: "attendance",
  templateUrl: "./attendance.component.html",
  styleUrls: ["./attendance.component.scss"],
})
export class AttendanceComponent implements OnInit {
  attendanceFilterForm: FormGroup;
  attendanceForm: FormGroup;
  dataSource: any = [];
  filterSelectItems: any = {};
  submitted = false;
  loadingFilter = false;

  ddlYearData: any[];
  ddlClassData: any[];
  ddlTypeOfTimeData: any[];
  ddlMonthData: any[];

  minDate: string;
  maxDate: string;

  // get f() {
  //   return this.attendanceForm.controls.filter["controls"];
  // }
  // get filters() {
  //   return this.attendanceForm.get("filter") as FormGroup;
  // }

  // get dataSource() {
  //   return this.attendanceForm.get("dataSource") as FormArray;
  // }
  // addAlias(index) {
  //   this.dataSource.push(this.fb.control(""));
  // }
  get f() {
    return this.attendanceForm.controls;
  }
  // get t() {
  //   return this.f.dataSource as FormArray;
  // }

  constructor(
    private fb: FormBuilder,
    private attendanceService: AttendanceService,
    private _utilsService: UtilityService,
    private _commonService: CommonService,
    private notifyService: NotificationService
  ) {}

  ngOnInit() {
    // this.attendanceForm = this.fb.group({
    //   // firstName: ['', Validators.required],
    //   // lastName: [''],
    //   filter: this.fb.group({
    //     year: new FormControl("", [Validators.required]),
    //     class: new FormControl("", [Validators.required]),
    //     typeOfTime: new FormControl("", [Validators.required]),
    //     month: new FormControl("", [Validators.required]),
    //     startDate: new FormControl("", [Validators.required]),
    //   }),
    //   dataSource: this.fb.array([this.fb.control("")]),
    // });

    this.attendanceForm = this.fb.group({
      year: new FormControl("", [Validators.required]),
      class: new FormControl("", [Validators.required]),
      typeOfTime: new FormControl("", [Validators.required]),
      month: new FormControl("", [Validators.required]),
      startDate: new FormControl("", [Validators.required]),
      numberOfTickets: ["", Validators.required],
    });

    this.bindingFilterData();
    this.dropdownListDefaultValue();

    // for (let i = 0; i < 5; i++) {
    //   this.addAlias(i);
    // }
  }

  dropdownListDefaultValue() {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    this.filterSelectItems.typeOfTime = 1;
    this.filterSelectItems.month = date.getMonth() + "" + date.getFullYear();
    const valueDate = this._utilsService.getDateNow();

    // this.filters.controls.startDate.setValue("2021/01/14");
    this.filterSelectItems.startDate = valueDate;

    this.attendanceService.yearList().subscribe((res) => {
      if (res.years) {
        const mapYearData = res.years.map((year) => ({
          id: year.id,
          name: year.start_year + "-" + year.end_year,
        }));
        this.ddlYearData = mapYearData;
        this.filterSelectItems.year = res.id_current_year;

        this.attendanceService
          .classList(res.id_current_year)
          .subscribe((resData) => {
            if (resData.query) {
              const mapClassData = resData.query.map((item) => ({
                id: item.id,
                name: item.class_name,
                level: item.level,
                year_id: this.filterSelectItems.year,
              }));
              this.ddlClassData = mapClassData;
            }
          });
      }
    });
  }

  findDaysOfWeek(object, value) {
    return Object.keys(object).filter((key) => object[key] === value);
  }

  getDataSource() {
    // console.log(this.ddlClassSelected);
    this.loadingFilter = true;
    const month =
      this.attendanceForm.value.month.substr(-4) +
      "-0" +
      this.attendanceForm.value.month.substr(0, 1) +
      "-01";
    const date = new Date(month);

    const studentData = [];
    this.attendanceService
      .attendanceList(
        this.filterSelectItems.class,
        this.filterSelectItems.year,
        this.ddlClassSelected["level"],
        this.filterSelectItems.typeOfTime === 1
          ? month
          : this.attendanceForm.controls.startDate.value
      )
      .pipe()
      .subscribe((res) => {
        console.log(res);
        this.loadingFilter = false;
        if (res.class_student.length > 0) {
          let i = 0;
          res.class_student.forEach((studentElement) => {
            // studentData.push({
            //   id: studentElement.id,
            //   code: studentElement.code,
            //   name: `${studentElement.lastname} ${studentElement.firstname}`,
            //   dob: studentElement.dob,
            //   selected: false,
            // });
            var newData = {
              orderNumber: i + 1,
              id: studentElement.id,
              code: studentElement.code,
              name: `${studentElement.lastname} ${studentElement.firstname}`,
              dob: studentElement.dob,
              selected: false,
            };

            if (res.weekdays) {
              const daysOfWeek = JSON.parse(res.weekdays.weekdays);
              const days = this.findDaysOfWeek(daysOfWeek, "0");

              let found;

              found = res.attendance.find(function (el) {
                return el.student_id == studentElement.student_id;
              });
              // JSON.parse(found.schedule)[0].date.substr(-2)
              if (found) {
                this.dynamicCols.forEach((item) => {
                  const schedule = JSON.parse(found.schedule);

                  const attendanceData = schedule.find(function (elm) {
                    return elm.date.substr(-2) == item.dayValue;
                  });

                  if (attendanceData) {
                    switch (attendanceData.value) {
                      case "0": {
                        newData["dateOfMonth_" + item.dayValue] = " ";
                        break;
                      }
                      case "1": {
                        newData["dateOfMonth_" + item.dayValue] = "P";
                        break;
                      }
                      case "2": {
                        newData["dateOfMonth_" + item.dayValue] = "K";
                        break;
                      }
                      default: {
                        newData["dateOfMonth_" + item.dayValue] = "V";
                      }
                    }

                    // if(attendanceData.value){

                    // }
                    // newData[
                    //   "dateOfMonth_" + item.dayValue
                    // ] = attendanceData.value ===  ? attendanceData.value : null;
                  } else {
                    // newData["dateOfMonth_" + item.dayValue] = null;
                    if (this.filterSelectItems.typeOfTime !== 1) {
                      const lastWeek = days.find(function (el) {
                        return el === item.field.substr(-1);
                      });
                      if (lastWeek) {
                        newData["dateOfMonth_" + item.dayValue] = "  ";
                      }
                    } else {
                      const lastWeek = days.find(function (el) {
                        return el === item.field.substr(-1);
                      });
                      if (lastWeek) {
                        newData["dateOfMonth_" + item.dayValue] = "  ";
                      }
                    }
                    //  else {
                    //   newData["dateOfMonth_" + item.field.split("_")[1]] = "  ";
                    // }
                  }
                });
              } else {
                if (days) {
                  this.dynamicCols.forEach((item) => {
                    const lastWeek = days.find(function (el) {
                      return el === item.field.substr(-1);
                    });
                    if (lastWeek) {
                      newData["dateOfMonth_" + item.dayValue] = "  ";
                    }
                  });
                }
                if (res.holidays.length > 0) {
                  this.dynamicCols.forEach((item) => {
                    const holidays = res.holidays.find(function (el) {
                      if (el.start_date === el.end_date) {
                        return el.start_date === item.date;
                      } else {
                        if (item.date === el.start_date) {
                          return el.start_date === item.date;
                        } else {
                          return el.end_date === item.date;
                        }
                      }
                    });
                    if (holidays) {
                      newData["dateOfMonth_" + item.dayValue] = "   ";
                    }
                  });
                }
              }
            }
            studentData.push(newData);
            i++;
          });
          this.dataSource = studentData;
          if (res.weekdays) {
            const weekDayData = JSON.parse(res.weekdays.weekdays);
            console.log(this.header);
            console.log(this.dynamicCols);
            console.log(weekDayData);
          }
        }
      });

    console.log(this.dataSource);
  }

  monthHeader() {
    const month =
      this.attendanceForm.value.month.substr(-4) +
      "-0" +
      this.attendanceForm.value.month.substr(0, 1) +
      "-01";
    const date = new Date(month);
    // date.setMonth(date.getMonth());

    const months = this.attendanceForm.value.month.substr(0, 1);
    const year = this.attendanceForm.value.month.substr(-4);

    const daysInMonth = this._utilsService.getDaysInMonth(months, year);
    this.attendanceHeader(daysInMonth, date);
  }
  weekHeader() {
    // console.log(this.attendanceForm.value.startDate);
    // const date = new Date();
    const daysOfWeek = [];
    const days = 7;
    // date.setDate(date.getDate() + 1);
    // const valueDate = this._utilsService.getDateNow();
    // const day = this._utilsService.addDays(date, i + 1);

    // for (let i = 0; i < 7; i++) {
    const day = this._utilsService.getDays(this.attendanceForm.value.startDate);

    if (day[0] === "CN") {
      for (let i = 1; i < 7; i++) {
        const cal = "+";
        const days = this._utilsService.addDays(
          this.attendanceForm.value.startDate,
          cal,
          i
        );
        daysOfWeek.push(days);
      }
      daysOfWeek.unshift(day);
    } else {
      const cal = "-";
      let dayOfWeek = null;
      switch (day[0]) {
        case "T2":
          dayOfWeek = 1;
          break;
        case "T3":
          dayOfWeek = 2;
          break;
        case "T4":
          dayOfWeek = 3;
          break;
        case "T5":
          dayOfWeek = 4;
          break;
        case "T6":
          dayOfWeek = 5;
          break;
        case "T7":
          dayOfWeek = 6;
          break;
      }
      for (let i = 0; i <= dayOfWeek; i++) {
        const days = this._utilsService.addDays(
          this.attendanceForm.value.startDate,
          cal,
          i
        );
        daysOfWeek.push(days);
        daysOfWeek.pop();
        daysOfWeek.unshift(days);
      }
      for (let i = 1; i < days - dayOfWeek; i++) {
        const cal = "+";
        const days = this._utilsService.addDays(
          this.attendanceForm.value.startDate,
          cal,
          i
        );
        daysOfWeek.push(days);
      }
    }

    // }

    // const found = daysOfWeek.find(function (el) {
    //   return el[0] === "CN";
    // });

    // if (!found) {
    //   daysOfWeek.pop();
    //   daysOfWeek.unshift(found);
    //   daysOfWeek[0][1].setDate(daysOfWeek[1][1].getDate() - 1);

    //   // daysOfWeek.forEach(el => {
    //   // });
    // }
    this.attendanceHeader(daysOfWeek.length, daysOfWeek);

    // console.log("datenow ", daysOfWeek);
  }

  header: any[];
  dynamicCols: any[];
  dayNow: any;
  attendanceHeader(daysInMonth, date) {
    this.dynamicCols = [];
    this.header = [
      { field: "orderNumber", value: "STT", isSingleRow: true },
      { field: "code", value: "Mã học sinh", isSingleRow: true },
      { field: "name", value: "Họ và tên", isSingleRow: true },
      { field: "dob", value: "Ngày sinh", isSingleRow: true },
    ];

    if (date.length === undefined) {
      for (let i = 0; i < daysInMonth; i++) {
        this.header.push({
          field: "dateOfMonth_" + (i + 1),
          value: i + 1,
          isSingleRow: false,
        });

        const day = this._utilsService.addDays(date, "+", i);
        const dayNow = new Date(day[1]);
        dayNow.getDate();
        const daysOfWeek = date.getDate() + i;
        const fullDate =
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1 > 9
            ? date.getMonth() + 1
            : "0" + (date.getMonth() + 1)) +
          "-" +
          (dayNow.getDate() > 9 ? dayNow.getDate() : "0" + dayNow.getDate());

        this.dynamicCols.push({
          field:
            "dayOfWeek_" + (day[0] === "CN" ? 8 : day[0].toString().substr(-1)),
          value: day[0],
          dayValue: daysOfWeek,
          date: fullDate,
          isSingleRow: false,
        });
      }
    } else {
      for (let i = 0; i < date.length; i++) {
        const daysOfWeek = date[i][1].getDate();
        const fullDate =
          date[i][1].getFullYear() +
          "-" +
          (date[i][1].getMonth() + 1 > 9
            ? date[i][1].getMonth() + 1
            : "0" + (date[i][1].getMonth() + 1)) +
          "-" +
          (date[i][1].getDate() > 9
            ? date[i][1].getDate()
            : "0" + date[i][1].getDate());

        this.header.push({
          field: "dateOfMonth_" + daysOfWeek,
          value: daysOfWeek,
          isSingleRow: false,
        });
        const day = this._utilsService.getWeekDay(date[i][1]);
        this.dynamicCols.push({
          field: "dayOfWeek_" + (day === "CN" ? 8 : i + 1),
          value: day,
          dayValue: daysOfWeek,
          date: fullDate,
          isSingleRow: false,
        });
      }
    }
  }

  // onSubmit() {
  //   this.submitted = true;

  //   // stop here if form is invalid
  //   if (this.attendanceForm.invalid) {
  //     return;
  //   }

  //   // display form values on success
  //   alert(
  //     "SUCCESS!! :-)\n\n" + JSON.stringify(this.attendanceForm.value, null, 4)
  //   );
  // }
  // onReset() {
  //   // reset whole form back to initial state
  //   this.submitted = false;
  //   this.attendanceForm.reset();
  //   this.t.clear();
  // }

  // onClear() {
  //   // clear errors and reset ticket fields
  //   this.submitted = false;
  //   this.t.reset();
  // }

  bindingFilterData() {
    this.ddlTypeOfTimeData = [
      { id: 1, name: "Tháng" },
      { id: 2, name: "Tuần" },
    ];
    const month = [];

    for (let i = 0; i <= 5; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      month.push({
        id: date.getMonth() + 1 + "" + date.getFullYear(),
        name: "Tháng " + (date.getMonth() + 1) + "/" + date.getFullYear(),
      });
    }
    for (let i = 1; i <= 5; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      month.push({
        id: date.getMonth() + 1 + "" + date.getFullYear(),
        name: "Tháng " + (date.getMonth() + 1) + "/" + date.getFullYear(),
      });
    }
    this.ddlMonthData = month;
  }

  valueCheck: any;
  valueBoolen: any;
  valueDate: any;
  checkDate: boolean;
  changeDate($event) {
    this.valueCheck = $event.target.validationMessage;
    this.valueBoolen = $event.target.validity.valid;
    this.valueDate = $event.target.value;
    var myDate = /^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/;
    if (
      this.valueCheck === "" &&
      this.valueBoolen === true &&
      this.valueDate !== ""
    ) {
      this.checkDate = myDate.test(this.valueDate);
    }
  }

  onSelectYear(item: any) {}

  ddlClassSelected: {};
  onSelectClass(item: any) {
    let classSelectedValue = {};
    classSelectedValue = {
      id: item.id,
      name: item.name,
      level: item.level,
      year_id: this.filterSelectItems.year,
    };
    this.ddlClassSelected = classSelectedValue;
    // console.log(classSelectedValue);
  }
  week = false;
  test = false;
  filter() {
    this.submitted = true;

    // const a = this.f;
    // if (this.f.invalid) {
    //   return;
    // }
    if (this.filterSelectItems.typeOfTime === 1) {
      this.monthHeader();
      // this.datasourceALl();
      this.week = false;
    } else {
      this.weekHeader();
      this.week = true;
      // this.datasourceALl();
    }

    this.getDataSource();
  }

  save() {
    const dataSource = this.dataSource;
    console.log(dataSource);
    let formData = new FormData();
    let i = 0;
    if (this.filterSelectItems.class) {
      formData.append("class_id", this.filterSelectItems.class);
    }
    if (this.filterSelectItems.semester) {
      formData.append("semester_id", this.filterSelectItems.semester);
    }
    JSON.parse(dataSource).forEach((data) => {
      if (data) {
        formData.append(
          "data" + "[" + i + "]" + "[student_id]",
          data.student_id
        );
        i++;
      }
    });

    this.attendanceService
      .createOrUpdate(formData)
      .pipe()
      .subscribe(
        (res) => {
          this.notifyService.showSuccess(
            "Tổng kết điểm thành công",
            "Thông báo"
          );
          this.filter();
          // this.checkAllProperties["nativeElement"].checked = false;
          // this.checkedList = [];
        },
        (error) => {}
      );
  }

  attendanceStatus() {}

  inputStyle: any;
  setAttendanceValue(event: any): void {
    console.log(event);
    $(event.target).css("color", "red");
    // event.srcElement.classList.add("yet-attendance");
    // this.inputStyle = "red";
  }
  removeSpecialCharacter(event) {
    var k;
    k = event.charCode;
    if (k !== 107 && k !== 112 && k !== 118) {
      return false;
    }
  }
}
