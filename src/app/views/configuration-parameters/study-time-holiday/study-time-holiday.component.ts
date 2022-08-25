import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl ,FormGroup } from '@angular/forms';
import {StudyTimeHolidayService} from './study-time-holiday.service'

@Component({
  selector: 'app-study-time-holiday',
  templateUrl: './study-time-holiday.component.html',
  styleUrls: ['./study-time-holiday.component.scss']
})
export class StudyTimeHolidayComponent implements OnInit {
  constructor(
    private StudyTimeHolidayService: StudyTimeHolidayService,
  ) { }
/*ViewChild*/
  @ViewChild('weekdayChild') weekdayChild:any;
  @ViewChild('holidayChild') holidayChild:any;
/*-End-*/

/*Form*/
  form = new FormGroup({
    years: new FormControl(''),
  });
/*-end-*/

/*Cấu hình tab*/
  tabs_id;
  tabs = [
    {id:'1',name:'Thời gian học'},
    {id:'2',name:'Ngày lễ'}
  ];
/*-end-*/

/*Cấu hình dữ liệu*/
weekdayData:any;
weekdayHeader = [
  {id:'0',name:'STT',fields:'stt'},
  {id:'1',name:'Cấp học',fields:'level'},
  {id:'2',name:'Thứ hai',fields:'2'},
  {id:'3',name:'Thứ ba',fields:'3'},
  {id:'4',name:'Thứ tư',fields:'4'},
  {id:'5',name:'Thứ năm',fields:'5'},
  {id:'6',name:'Thứ sáu',fields:'6'},
  {id:'7',name:'Thứ bảy',fields:'7'},
  {id:'8',name:'Chủ nhật',fields:'8'},
];
holidayData:any;
holidayHeader = [
  {id:'0',name:'STT',fields:'stt'},
  {id:'1',name:'Tên ngày',fields:'name'},
  {id:'2',name:'Từ ngày',fields:'start_date'},
  {id:'3',name:'Đến ngày',fields:'end_date'},
  {id:'4',name:'Lặp lại',fields:'repeat'},
  {id:'5',name:'Trạng thái',fields:'status'},
  {id:'6',name:'Hoạt động',fields:'action'},
]
year_for_child:any;
/*-end-*/
/*Dữ liệu year*/
dataYear:any;
selectedYear:any;
/*-end-*/
/*Dữ liệu*/
weekday:any;
weekdayEmit:any;
holiday:any;
/*-end-*/
  ngOnInit() {
    this.getAllYear();
  }

  getAllYear(){
    this.StudyTimeHolidayService.getAllYear()
    .pipe()
    .subscribe(
      (res)=>{
        const years = [];
        var currentYear;
        res['years'].forEach(element => {
          years.push({id:element['id'],name:`${element['start_year']} - ${element['end_year']}`});
          if(element['id'] == res['id_current_year']){
            currentYear =  {id:element['id'],name:`${element['start_year']} - ${element['end_year']}`}
          }
        });
        this.dataYear = years;
        this.selectedYear = currentYear;
        /*Lấy năm học cho child component*/
        this.year_for_child = currentYear;
        /*-end-*/
        this.listWeekdays(this.selectedYear['id']);
        this.listHolidays(this.selectedYear['id']);
      }
    )
  }

  listWeekdays(year_id:any){
    this.StudyTimeHolidayService.listWeekdays(year_id)
    .subscribe(
      (res)=>{
        const data = [];
        res['query'].forEach(element => {
          const array = {};
          array['level'] = element.level;
          array['weekdays'] = JSON.parse(element['weekdays']);
          data.push(array);
        });
        /*Dữ liệu cho weekdays child*/
        this.weekday = data;
        /*-end-*/
        /*Gán dữ liệu vào 1 mảng tạm*/
        this.weekdayEmit = data;
        /*-end-*/
        this.tabs_id = 1;
      }
    )
  }

  listHolidays(year_id:any){
    this.StudyTimeHolidayService.listHolidays(year_id)
    .subscribe(
      (res)=>{
        /*Dữ liệu cho holildays child component*/
        this.holiday = res['query'];
        /*-end-*/
      }
    )
  }

  listWeekdays2(year_id:any){
    this.StudyTimeHolidayService.listWeekdays(year_id)
    .subscribe(
      (res)=>{
        const data = [];
        res['query'].forEach(element => {
          const array = {};
          array['level'] = element.level;
          array['weekdays'] = JSON.parse(element['weekdays']);
          data.push(array);
        });
        this.weekday = data;
        if(this.tabs_id == 1)
         {this.weekdayChild.afterChangeYear(data)};
        this.weekdayChild.afterChangeYear(data);

        this.weekdayEmit = data;
      }
    )
  }

  listHolidays2(year_id:any){
    this.StudyTimeHolidayService.listHolidays(year_id)
    .subscribe(
      (res)=>{
        this.holiday = res['query'];
        if(this.tabs_id == 2)
        {this.holidayChild.afterChangeYear(res['query'])};

        // this.changeDataChild();
      }
    )
  }

  // changeDataChild(){
  //   if(this.tabs_id == 1){
  //     this.weekdayChild.afterChangeYear(this.weekday);
  //   }else{
  //     this.holidayChild.afterChangeYear(this.holiday);
  //   }
  // }

  selectTabs(tab_id){
    this.tabs_id = tab_id == 1 ? 1 : 2;
    this.weekday = this.weekdayEmit;
  }

  onSelectYear(){
    let year_id = this.form.controls['years'].value['id'];
    this.year_for_child = this.form.controls['years'].value;
    this.listWeekdays2(year_id);
    this.listHolidays2(year_id);
  }

  changeDataWeekday(event){
    const json_encode = [];
    event.forEach((element) => {
      var array = {};
      array['level'] = element.level_id;
      var weekday_array = {};
      Object.keys(element).forEach(el=>{
        if(el != 'level' && el != 'level_id'){
          weekday_array[el] = element[el];
        }
      })
      array['weekdays'] = weekday_array;
      json_encode.push(array);
    });
    this.weekdayEmit = json_encode;
  }

  changeDataHoliday(event){
    this.holiday = event;
  }

}
