import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../_services/notification.service';
import { UtilityService } from '../../../_services/utils.service';
import { LockUnlockAcademicTranscriptService } from '../service/lock-unlock-academic-transcript.service';
declare var $: any;

@Component({
  selector: 'app-lock-unlock-academic-transcript',
  templateUrl: './lock-unlock-academic-transcript.component.html',
  styleUrls: ['./lock-unlock-academic-transcript.component.scss']
})
export class LockUnlockAcademicTranscriptComponent implements OnInit {
  form:FormGroup;
  lock_filter: any = {};
  loadingFilter = false;

  headerTeacher = false;
  checkTeacherData = true;
  submitted = false;
  id_current_year: number;

  headerLock = false;

  checkTab: number;

  //input checkbox

  // bl_summary:any;
  // bl_attendance:any;
  // bl_mark_board:any;
  // bl_academic_transcript:any;

  bl_summary =[];
  bl_attendance =[];
  bl_mark_board =[];
  bl_academic_transcript =[];

   //page count
   p: number = 1;
   countPage: number = 10;
   totalItems = 0;
   dataPaged: any[];

  dataSource: any[];
  dataYear: any[];
  dataSemester: any[];
  dataLevel: any[];

  selectedYear = [];
  selectedSemester = [];
  selectedLevel = [];
  currentYear = [];

  dataGrade: any[];
  dataBlock: any[];

  constructor(
    private fb: FormBuilder,
    private notifyService: NotificationService,
    private lockUnlockService: LockUnlockAcademicTranscriptService,
    private _utilsService: UtilityService,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      summary: new FormControl(''),
      attendance: new FormControl(false),
      mark_board: new FormControl(false),
      academic_transcript: new FormControl(false),
      year_id: new FormControl(''),
      // semester_id: new FormControl(''),
      semester_id: new FormControl("",[Validators.required]),
      level: new FormControl('',[Validators.required]),
      idCheckAll: new FormControl(false),
      idCheckAllMarkBoard: new FormControl(false),
      idCheckAllSummary: new FormControl(false),
      idCheckAllAcademic: new FormControl(false),
      // province_id: new FormControl("", [Validators.required]),
    });
    this.dataLevel = [
      { id: 1, name: 'Cấp 1' },
      { id: 2, name: 'Cấp 2' },
      { id: 3, name: 'Cấp 3' },

    ];
    this.fullYear();

    //checked row
    $(document).ready(function(){
      $('.allcb').on('click', function(){
        $(this).parent("td").parent("tr").find('.chk').prop('checked', this.checked);
      });
    });


  }//end-ngOninit

  get f() {
    return this.form.controls;
  }

  //check all checkboxes

  // checkAll(item)
  // {
  //   let checked_all = item.target.checked;
  //   if (checked_all === true) {
  //     Object.values(this.dataSource).forEach((item) => {
  //       item.attendance = true;
  //       item.idCheckAll = true;
  //       item.mark_board = true;
  //       item.idCheckAllMarkBoard = true;
  //       item.summary = true;
  //       item.idCheckAllSummary = true;
  //       item.academic_transcript = true;
  //       item.idCheckAllAcademic = true;
  //     });
  //   }else{
  //     this.dataSource.forEach((item) => {
  //       item.attendance = false;
  //       item.idCheckAll = false;
  //       item.mark_board = false;
  //       item.idCheckAllMarkBoard = false;
  //       item.summary = false;
  //       item.idCheckAllSummary = false;
  //       item.academic_transcript = false;
  //       item.idCheckAllAcademic = false;
  //     });
  //   }
  // }
  //check all điểm danh
  checkAllAttendance(item){
    let checked_all = item.target.checked;
    if (checked_all === true) {
      Object.values(this.dataSource).forEach((item) => {
        item.attendance = true;
        item.idCheckAll = true;
      });
    }else{
      this.dataSource.forEach((item) => {
        item.attendance = false;
        item.idCheckAll = false;
      });
    }
  }

  //check all sổ điểm
  checkAllMarkBoard(item){
    let checked_all = item.target.checked;
    if (checked_all === true) {
      Object.values(this.dataSource).forEach((item) => {
        item.mark_board = true;
        item.idCheckAllMarkBoard = true;
      });
    }else{
      this.dataSource.forEach((item) => {
        item.mark_board = false;
        item.idCheckAllMarkBoard = false;
      });
    }
  }
  //check all bảng tổng kết cấp 1
  checkAllSummary(item){
    let checked_all = item.target.checked;
    if (checked_all === true) {
      Object.values(this.dataSource).forEach((item) => {
        item.summary = true;
        item.idCheckAllSummary = true;
      });
    }else{
      this.dataSource.forEach((item) => {
        item.summary = false;
        item.idCheckAllSummary = false;
      });
    }
  }

  //check all bảng tổng kết cấp 2,3
  checkAllAcademic(item){
    let checked_all = item.target.checked;
    if (checked_all === true) {
      Object.values(this.dataSource).forEach((item) => {
        item.academic_transcript = true;
        item.idCheckAllAcademic = true;
      });
    }else{
      this.dataSource.forEach((item) => {
        item.academic_transcript = false;
        item.idCheckAllAcademic = false;
      });
    }
  }


  fullYear() {
    this.lockUnlockService.listYear().subscribe((res) => {
      if (res.years) {
        const result = res.years.map((year) => ({
          id: year.id,
          name: year.start_year + "-" + year.end_year,
        }));
        this.dataYear = result;
        this.lock_filter.year_id = res.id_current_year;
        this.id_current_year = res.id_current_year;
      }
    });
  }

  onSelectYear(item:any){
    this.dataSemester = null;
    this.lock_filter.semester_id = null;
    this.lockUnlockService.dropSemester(this.lock_filter.year_id,this.lock_filter.level).subscribe((res)=>{
      this.dataSemester = res['query'];
    });
  }
  onSelectLevel(item:any){
    this.dataSemester = null;
    this.lock_filter.semester_id = null;
    this.lockUnlockService.dropSemester(this.lock_filter.year_id,this.lock_filter.level).subscribe((res)=>{
      this.dataSemester = res['query'];
    });
  }


  filter(){

    this.form.get('semester_id').setValidators([Validators.required]);
    this.form.get('semester_id').updateValueAndValidity();

    this.form.get('level').setValidators([Validators.required]);
    this.form.get('level').updateValueAndValidity();

    this.submitted = true;

     if (this.form.controls['semester_id'].invalid || this.form.controls['level'].invalid) {
      return;
    }

    var uploadData = new FormData();
    var i = 0;

    // if(this.form.value['search'])
    // {
    //   uploadData.append('search',this.form.value['search']);
    // }
    if (this.lock_filter.year_id) {
      uploadData.append('year_id',this.lock_filter.year_id);
    }
    if (this.lock_filter.level) {
      uploadData.append('level',this.lock_filter.level);
    }
    if (this.lock_filter.semester_id >=0) {
      uploadData.append('semester_id',this.lock_filter.semester_id);
    }

    this.lockUnlockService.filter(uploadData).subscribe((res)=>{
        this.dataBlock = res['data_block'];
        this.dataGrade = res['data_grade'];
        this.headerLock = true;

        let arr = [];
        this.dataGrade.forEach(function (ite) {
          let x = res['data_block']
            .map(function (itm) {
              return itm.grade_id;
            })
            .indexOf(ite.id);
          if (x > -1) {
            arr.push({
              grade_id: ite.id,
              grade_name: ite.name,
              level: ite.level,

              semester_id: res['data_block'][x]['semester_id'],
              attendance: res['data_block'][x]['bl_attendance'] === 1? true : false,
              summary: res['data_block'][x]['bl_summary'] === 1? true : false,
              mark_board: res['data_block'][x]['bl_mark_board'] === 1? true : false,
              academic_transcript: res['data_block'][x]['bl_academic_transcript'] === 1? true : false,

            });
          } else {
            arr.push({
              grade_id: ite.id,
              grade_name: ite.name,
              level: ite.level,

              semester_id: "",
              attendance: false,
              summary: false,
              mark_board: false,
              academic_transcript: false,
            });
          }
        });

        this.dataSource = arr;
        if (this.lock_filter.level == 1) {
          this.checkTab = 1;
        } else {
          this.checkTab = 2;
          // switch (res["query"][0].subject_type) {
          //   case 1:
          //     this.checkTab = 1;
          //     break;
          //   case 2:
          //     this.checkTab = 2;
          //     break;
          //   case 3:
          //     this.checkTab = 3;
          //     break;
          // }
        }


    });
  }


  save(){
    var uploadData = new FormData();
    var i = 0;
    const data = this.dataSource;

    if (this.lock_filter.level) {
      uploadData.append("level", this.lock_filter.level);
    }
    if (this.lock_filter.semester_id) {
      uploadData.append("semester_id", this.lock_filter.semester_id);
    }

    // if (this.form.value["bl_attendance"] && this.form.value["bl_attendance"] === true)
    // {
    //   uploadData.append("bl_attendance", "1");
    // } else {
    //   uploadData.append("bl_attendance", "0");
    // }

    data.forEach((items) => {
      if (items) {
        //khối học
        uploadData.append("data" + "[" + i + "]" + "[grade_id]",items.grade_id);
        // Điểm danh

        if (items.attendance === true) {
          uploadData.append("data" + "[" + i + "]" + "[bl_attendance]", "1");
        }else{
          uploadData.append("data" + "[" + i + "]" + "[bl_attendance]", "0");
        }

        if (items.attendance === true)
        {
          uploadData.append("data" + "[" + i + "]" + "[bl_attendance]", "1");
        } else {
          uploadData.append("data" + "[" + i + "]" + "[bl_attendance]", "0");
        }
        // Tổng kết đánh giá tiểu học

        if (items.summary === true)
        {
          uploadData.append("data" + "[" + i + "]" + "[bl_summary]", "1");
        } else {
          uploadData.append("data" + "[" + i + "]" + "[bl_summary]", "0");
        }
        // Sổ điểm

        if (items.mark_board === true)
        {
          uploadData.append("data" + "[" + i + "]" + "[bl_mark_board]", "1");
        } else {
          uploadData.append("data" + "[" + i + "]" + "[bl_mark_board]", "0");
        }
        // Tổng kết của cấp 2,3

        if (items.academic_transcript === true)
        {
          uploadData.append("data" + "[" + i + "]" + "[bl_academic_transcript]", "1");
        } else {
          uploadData.append("data" + "[" + i + "]" + "[bl_academic_transcript]", "0");
        }
        i++;
      }
    });

    this.lockUnlockService.create(uploadData).subscribe((res)=>{
      this.notifyService.showSuccess("Lưu thành công", "Thông báo");
      this.filter();
    },
    (error) => {
      if (error.error) {
        switch (error.error) {
          case 11:
            this.notifyService.showError(
              "Học kỳ không hợp lệ",
              "Thông báo lỗi"
            );
            return;
          case 12:
            this.notifyService.showError(
              "Khối không hợp lệ",
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
          "Chỉ được lưu giữ liệu của năm và học kỳ hiện tại",
          "Thông báo lỗi"
        );
        return;
      }
    }
    );


  }

}
