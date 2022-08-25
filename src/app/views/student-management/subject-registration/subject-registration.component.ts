import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { SubjectRegistrationService } from "../service/subject-registration.service";
import { NotificationService } from "../../../_services/notification.service";
import { delay } from 'rxjs/operators';
import { UtilityService } from '../../../_services/utils.service';


@Component({
  selector: "app-subject-registration",
  templateUrl: "./subject-registration.component.html",
  styleUrls: ["./subject-registration.component.scss"],
})
export class SubjectRegistrationComponent implements OnInit {
  subjectRegistrationForm: FormGroup;
  constructor(
    private subjectRegistrationService: SubjectRegistrationService,
    private fb: FormBuilder,
    private nofication: NotificationService,
    private _utilsService: UtilityService
  ) {
  }

  //khai báo cho form
  form: FormGroup;

  dataYear = [];
  selectedYear: any;
  cols: any[];
  dataSource: any[];
  dataPaged: any[];

  //paginate
  p: number = 1;
  countPage: number = 10;

  existStudent = false;

  ngOnInit() {
    //Cấu hình form controll name
    this.form = this.fb.group({
      year: new FormControl(""),
      class: new FormControl(""),
      semester: new FormControl(""),
    });

    //Gọi API năm học
    this.subjectRegistrationService
      .getAllYear()
      .pipe()
      .subscribe((res) => {
        const data = [];
        var currentYear;
        //chuyển dữ liệu vào [items]
        res["years"].forEach(function (items) {
          if (res["id_current_year"] == items["id"]) {
            currentYear = {
              id: items["id"],
              name: items["start_year"] + " - " + items["end_year"],
            };
          }
          data.push({
            id: items["id"],
            name: items["start_year"] + " - " + items["end_year"],
          });
        });
        this.dataYear = data;
        this.selectedYear = currentYear;
        //Gọi API lớp để binding ra dữ liệu dropdownlist lớp
        this.ClassList(res["id_current_year"]);
      });
  }

  dataClass = [];
  selectedClass: any;
  onSelectYear(event) {
    //Nếu tích vào nút xóa năm học thì loại bỏ tất cả
    if (event != undefined) {
      let id = event.id;
      //Xóa dữ liệu cũ khi chọn id mới
      this.dataClass = [];
      this.dataSemester = [];
      this.selectedClass = null;
      this.ClassList(id);
    }
    this.selectedClass = null;
    this.selectedSemester = null;
    this.dataClass = [];
    this.dataSemester = [];
  }

  //Hàm dùng chung để gọi API lớp
  ClassList(year_id) {
    this.subjectRegistrationService
      .getClassFLYear(year_id)
      .pipe()
      .subscribe((res) => {
        const data = [];
        //chuyển dữ liệu vào [items]
        res["query"].forEach(function (items) {
          data.push({
            id: items["id"],
            name: items["name"],
            year_id: year_id,
            level: items["level"],
          });
        });
        this.dataClass = data;
        this.selectedClass = { id: data[0]["id"], name: data[0]["name"] };
        this.SemesterList(data[0]["year_id"], data[0]["level"]);
      });
  }

  dataSemester = [];
  selectedSemester: any;
  onSelectClass(event) {
    let year = event.year_id;
    let level = event.level;
    this.SemesterList(year, level);
  }

  SemesterList(year, level) {
    this.subjectRegistrationService
      .getSemesterFLLevel(year, level)
      .pipe()
      .subscribe((res) => {
        //Xóa dữ liệu cũ khi chọn id mới
        this.dataSemester = [];
        this.selectedSemester = null;
        const data = [];
        //chuyển dữ liệu vào [items]
        res["query"].forEach(function (items) {
          data.push({ id: items["id"], name: items["name"] });
        });
        this.dataSemester = data;
        this.selectedSemester = { id: data[0]["id"], name: data[0]["name"] };
      });
  }

  onSelectSemester(event) {}

  listOps2: any[];
  filter() {
    this.unDisSave = true;

    let class_id = this.form.controls["class"].value["id"];
    let semester_id = this.form.controls["semester"].value["id"];
    //Khởi tạo mảng header - name là tên header, value là giá trị để lấy ra ở từng cột lúc for HTML
    const header = [
      { name: "STT", value: "id" },
      { name: "Mã học sinh", value: "code" },
      { name: "Họ và tên", value: "name" },
      { name: "Ngày sinh", value: "dob" },
    ];
    var opList2 = [];
    this.dataSource = [];
    // var registrationList = [];
    //Danh sách môn học tự chọn & danh sách học sinh đã đăng ký
    if (class_id != undefined && semester_id != undefined) {

      this.subjectRegistrationService.getOption2(class_id, semester_id).pipe()
        .subscribe((res) => {
          opList2 = res["query"]; //Danh sách môn học tự chọn

          if(res["query"].length > 0){
              opList2.forEach((items) => {
              header.push({
                name: items["name"],
                value: "p_" + items["detail_study_program_id"],
              });
            });
          }
          this.listOps2 = opList2;//Lấy danh sách để lưu dữ liệu
        });

        this.subjectRegistrationService.getStudent(class_id)
        .subscribe((res) => {
        let studentList = res["query"]; //Danh sách học sinh
        this.dataSource = [];
        if (studentList.length) {
          this.existStudent = false;//Mở save học sinh tồn tại
          this.dataSource = studentList.map((p) => {
            return {
              id: p.id,
              code: p.code,
              name: `${p.lastname} ${p.firstname}`,
              dob: p.dob,
            };
          });
          this._utilsService.setReverseFullname(this.dataSource, 'name', 'reverseName');
          this.p = 1;
        }else{
          this.existStudent = true;//Đóng save học sinh tồn tại
        }

          this.subjectRegistrationService.getRegistrationList(class_id, semester_id).pipe()
          .subscribe((result) => {
            const registrationList = result['query'];//Danh sách môn học tự chọn đã đăng ký

            //Binding danh sách môn học tự chọn đã đăng ký
            if (registrationList) {
              registrationList.forEach((e) => {
                let student_ids = JSON.parse(e.student_id || "[]");
                student_ids.forEach((student_id) => {
                  let row = this.dataSource.find((p) => p.id == student_id);
                  if (row) {
                    row["p_" + e.detail_study_program_id] = true;
                  }
                });
              });
            }
            this.setColCheckbox();
          });
      });
      this.cols = header;//gán header sau khi push dữ liệu môn học vào mảng
    } else {
      this.nofication.showWarning('Vui lòng chọn đầy đủ điều kiện lọc','Thông báo')
      return;
    }

    //Danh sách học sinh
    // if (class_id != undefined) {
    // } else {
    //   this.nofication.showWarning('Vui lòng chọn đầy đủ điều kiện lọc','Thông báo')
    //   return;
    // }
  }

  unDisSave=true;
  checkValue(evt) {
    this.unDisSave=false;
    this.setColCheckbox();
    // window.addEventListener('beforeunload', (event) => {
    //   event.returnValue = 'Dữ liệu của bạn đã thay đổi bản có muốn tiếp tục chỉnh sửa không';
    // })
    // console.log(this.dataSource);
  }

  luulai() {
    const data = [];
    if(this.listOps2.length > 0)
    {
        //lấy danh sách môn học tự chọn - bao nhiêu môn thì for bấy nhiêu lần
      this.listOps2.forEach((items) => {
        const student_id = [];
        //lấy dữ liệu nguồn để for - kiểm tra học sinh nào trong tích chọn môn thì đẩy học sinh đó vào mảng
        //Mỗi vòng lặp bên trên kiểm tra 1 môn học tương đương với môn học được lấy ra trong dataSource
        this.dataSource.forEach((it) => {
          if (it["p_" + items["detail_study_program_id"]]) {
            if(it["p_" + items["detail_study_program_id"]] == true){
              student_id.push(it.id);
            }
          }
        });

        if(student_id.length > 0){
            // const datum = {detail_study_program_id: items["detail_study_program_id"],student_id: student_id};
            data.push({
              detail_study_program_id: items["detail_study_program_id"],student_id: student_id
            });
        }else{

            // const datum = {detail_study_program_id: items["detail_study_program_id"]}
            data.push({
              detail_study_program_id: items["detail_study_program_id"]
            })

        }
      });
      console.log(data);
      this.subjectRegistrationService.postRegistrationList(this.form.controls["class"].value['id'],this.form.controls['semester'].value['id'],data).pipe()
      .subscribe(
        (res)=>{
          this.nofication.showSuccess('Cập nhật dữ liệu thành công','Thông báo');
        },
        (errors)=>{
            if(errors.errors){
              this.nofication.showError('Vui lòng kiểm tra lại dữ liệu đầu vào','Thông báo');
            }else{
              switch(errors.error){
                case 11:
                  this.nofication.showError('Chương trình học không tồn tại hoặc không còn tồn tại','Thông báo!');
                  break;
                case 12:
                  this.nofication.showError('Môn học truyền vào không phải môn tự chọn','Thông báo!');
                  break;
                case 13:
                  this.nofication.showError('Môn học tự chọn không thuộc lớp hoặc học kỳ','Thông báo!');
                  break;
                case 14:
                  this.nofication.showError('Học sinh được chọn không thuộc lớp','Thông báo!');
                  break;
                case 121:
                  this.nofication.showError('Năm học đã đóng lại không thể sửa thông tin','Thông báo!');
                  break;
                default:
                  this.nofication.showError('Vui lòng liên hệ với quản trị viên, xử lý lỗi này','Thông báo!');
                  break;
              }
            }
            return;
        }
      )
    }else{
      this.nofication.showWarning('Vui lòng cấu hình môn học tự chọn cho lớp','Thông báo');
      return;
    }
  }

  onCheckAllChange(col, event){
    this.unDisSave=false;
    this.dataSource.forEach(el=>{
        el[col.value] = event.target.checked;
    })
  }

  setColCheckbox(){
    if(this.cols && this.dataSource) {
      this.cols.forEach(col => {
        if(col.value.startsWith('p_')) {
          col.checked = true;
          for(let rowIndex = 0 ; rowIndex < this.dataSource.length; rowIndex ++){
            let row = this.dataSource[rowIndex];
            if(!row[col.value]) {
              col.checked = false;
              break;
            }
          }
        }
      });
    }
  }
}
