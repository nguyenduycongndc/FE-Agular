import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { isBuffer } from 'util';
import { NotificationService } from '../../../_services/notification.service';
import { SummerTrainingService } from '../service/summer-training.service';

@Component({
  selector: 'app-summer-training',
  templateUrl: './summer-training.component.html',
  styleUrls: ['./summer-training.component.scss']
})
export class SummerTrainingComponent implements OnInit {
  submitted = false;
  dataSource: any[];
  statusActive: number;
  idActive: number;
  active(id: number, status: number) {
    this.idActive = id;
    this.statusActive = status;
  }
  //tồn tại dữ liệu
  checkData = true;
  header = false;

  dataPaged: any[];
  p: number = 1;
  countPage: number = 10;
  totalItems = 0;
  perPageSelected(id: number) {
    this.countPage = id;
    this.p = 1;
  }
  filterSaveItems: any = {};
  form: FormGroup;
  //year data
  ddlYearData = [];
  selectedYear = [];
  currentYear = [];
  minDate: string;
  maxDate: string;

  //class list
  ddlClassData = [];
  ddlClassSearchData = [];
  selectedClassSearch = [];

  //load lại filter
  loadingFilter = false;

  constructor(
    private fb: FormBuilder,
    private summerTrainingService: SummerTrainingService,
    private notifyService: NotificationService,) { }

  get f() {
    return this.form.controls;
  }
  //drop năm
  fullYear() {
    this.summerTrainingService.listYear().subscribe((res) => {
      if (res.years) {
        const result = res.years.map((year) => ({
          id: year.id,
          name: year.start_year + "-" + year.end_year,
        }));
        this.ddlYearData = result;
        this.filterSaveItems.year = res.id_current_year;

        this.summerTrainingService
          .listClass(res.id_current_year)
          .subscribe((res) => {
            if (res.query) {
              const result = res.query.map((item) => ({
                id: item.id,
                name: item.class_name,
                level: item.level,
                year_id: this.filterSaveItems.year,
              }));
              const classData = result.filter((value) => value.level != 1);
              this.ddlClassData = classData;
            }
          });
      }
    });

  }
  //sk change class
  onSelectClass(item: any) {
    if (this.filterSaveItems.class) {
      this.filterSaveItems.showErrorClass = false;
    }
  }
  ngOnInit() {
    this.fullYear();
  }
  //lọc dữ liệu
  filter() {
    if (!this.filterSaveItems.class) {
      this.filterSaveItems.showErrorClass = true;
    }
    this.submitted = true;
    if (
      this.filterSaveItems.showErrorClass
    ) {
      return;
    }
    this.summerTrainingService.filter(this.filterSaveItems.class, this.filterSaveItems.year)
      .subscribe((res) => {
        if (res.academic.length == 0) {
          this.header = true;
          this.checkData = false;
          this.dataSource = [];
        } else {

          this.header = true;
          this.checkData = true;
          //binding lại dữ liệu
          const data = [];
          Object.values(res['academic']).forEach(function (items) {
            let found = data.find((el) => {
              return items['student_id'] == el.student_id;
            })
            var newData;
            if(found){
               newData = {
                id: items['id'],
                student_id: items['student_id'],
                code: "",
                lastname: "",
                firstname: "",
                dob: "",
                name: items['name'],
                subjects_id: items["subjects_id"],
                subject_type: items["subject_type"],
                scores: items["mark_board_avg"] ? JSON.parse(items["mark_board_avg"]).scores : null,
              };
            }else{
               newData = {
                id: items['id'],
                student_id: items['student_id'],
                code: items['code'],
                lastname: items["lastname"],
                firstname: items["firstname"],
                dob: items['dob'],
                name: items['name'],
                subjects_id: items["subjects_id"],
                subject_type: items["subject_type"],
                scores: items["mark_board_avg"] ? JSON.parse(items["mark_board_avg"]).scores : null,
              };
            }
            let findStudentData = res['retest'].find((item) => {
              return item.student_id == items['student_id'];
            })
            if (findStudentData) {
              if (findStudentData.retest_result) {
                let scores_retest = findStudentData.retest_result;
                let arr_retest = JSON.parse(scores_retest);
                let findSubjectData = arr_retest.find((item) => {

                  return items["subjects_id"] == item.subject_id;
                })
                if (findSubjectData) {
                  newData['retest_score'] = findSubjectData.after_retest;
                  if (findSubjectData.before_retest) {
                    findSubjectData.before_retest ? newData['selected'] = true : newData['selected'] = false;
                  }
                }
              }
            }
            data.push(newData);
          });
          this.dataSource = data;
        }
      })
  }
  // }
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
    const arrStudentId = [];
    for (var i = 0; i < this.dataSource.length; i++) {
      if (this.dataSource[i].selected)
        arrStudentId.push(this.dataSource[i]);
    }
    this.checkedList = arrStudentId;
  }
  //sk change year
  onSelectYear(item: any) {
    this.filterSaveItems.class = {};
    if (item != undefined) {
      const arrClass = [];
      this.summerTrainingService
        .listClass(item.id)
        .pipe()
        .subscribe((ress) => {
          ress["query"].forEach(function (items) {
            if (items.level != 1) {
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

  //lưu
  save() {
    var dataSource = this.dataSource;
    let formData = new FormData();
    const arrStudentId = [];
    for (var k = 0; k < this.dataSource.length; k++) {
      if (this.dataSource[k].selected)
        arrStudentId.push(this.dataSource[k]);
    }
    const chkList = arrStudentId;
    // const chkList = this.checkedList;
    // let i = 0;
    formData.append("class_id", this.filterSaveItems.class);


    var flags = [], output = [], l = dataSource.length, i;
    for (i = 0; i < l; i++) {
      if (chkList[i] && chkList[i].student_id !== undefined) {
        if (flags[chkList[i].student_id]) continue;
        flags[chkList[i].student_id] = true;
        output.push(chkList[i].student_id);
      }
    }

    let found;
    for (let index = 0; index < output.length; index++) {
      const elm = output[index];

      formData.append("data" + "[" + index + "]" + "[student_id]", elm);

      found = dataSource.filter((p) => {
        return elm == p.student_id;
      })
      if (found) {
        let j = 0;

        found.forEach(element => {
          if (element.subjects_id && element.retest_score) {
            formData.append("data" + "[" + index + "]" + "[detail]" + "[" + j + "]" + "[subject_id]", element.subjects_id);
            formData.append("data" + "[" + index + "]" + "[detail]" + "[" + j + "]" + "[after_retest]", element.retest_score);
          }
          j++;
        });
      }

    }
    this.summerTrainingService.save(formData).subscribe((res) => {
      if (res.message === "success") {
        this.notifyService.showSuccess(
          "Cập nhật dữ liệu thành công",
          "Thông báo"
        );
      }
      this.filter();
    }, (error) => {
      if (error.error == 20) {
        this.notifyService.showError("Đầu vào thiếu học sinh", "Thông báo lỗi");
      } else if (error.error == 15) {
        this.notifyService.showError("Môn học bao gồm cả môn có điểm tổng >= 5.0", "Thông báo lỗi");
      } else if (error.error == 14) {
        this.notifyService.showError("Học sinh không thuộc lớp", "Thông báo lỗi");
      } else if (error.error == 13) {
        this.notifyService.showError("Học sinh không thuộc diện thi lại hoặc chưa có xếp hạng", "Thông báo lỗi");
      } else if (error.error == 12) {
        this.notifyService.showError("Cấp học phải là cấp 2 và 3", "Thông báo lỗi");
      } else if (error.error == 11) {
        this.notifyService.showError("ớp học không tồn tại", "Thông báo lỗi");
      } else {
        this.notifyService.showError("Lưu thất bại.", "Thông báo lỗi");
      }
    });
  }

  changeRetestScore(item) {
    if (item.retest_score > 10) {
      item.retest_score = 10;
    }
    if (item.retest_score < 0) {
      item.retest_score = 0;
    }
  }

}
