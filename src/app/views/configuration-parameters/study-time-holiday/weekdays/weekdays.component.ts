import  { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {StudyTimeHolidayService} from '../study-time-holiday.service';
import { NotificationService } from "../../../../_services/notification.service";

@Component({
  selector: 'weekdays-app',
  templateUrl: 'weekdays.component.html',
  styleUrls:['weekdays.component.scss']
})

export class WeekdayComponent implements OnInit {
  @Input() header:any;
  @Input() sourceData:any[];
  @Input() years:any;
  @Output() emitData = new EventEmitter();
  constructor(
    private studyTimeHolidayService: StudyTimeHolidayService,
    private notificationService: NotificationService
  ) { }
/*Data bindding*/
  weekdayData:any;
 /*End*/

  ngOnInit() {
    this.binddingData(this.sourceData);
  }

  levelData = [
    {level:1},
    {level:2},
    {level:3}
  ];

  weekdayDefault = {2:'0',3:'0',4:'0',5:'0',6:'0',7:'0',8:'0'};

  binddingData(data){
    var array = [];
    this.levelData.forEach(element=>{
      let found = data.find((el)=>{
        return el.level == element.level;
      });
      const datum = {};

      if(found){

        var weekdays = found['weekdays'];
        datum['level'] = found['level'];
        Object.keys(weekdays).forEach((element)=>{
          datum[element] = weekdays[element] == 1 ? true : false ;
        })
      }else{

        datum['level'] = element;
        Object.keys(this.weekdayDefault).forEach((element)=>{
          datum[element] = this.weekdayDefault[element] == 1 ? true : false ;
        })
      }
      array.push(datum);
    })
    this.weekdayData = array;
  }

  afterChangeYear(data){
    this.binddingData(data);
  }

  luulai(){
    var formData = new FormData();
    let i = 0;
    let weekday = [2,3,4,5,6,7,8];
    let year_id = this.years['id'];
    formData.append('year_id',year_id);
    this.weekdayData.forEach(element => {
      formData.append('data'+'['+i+']'+'[level]',element.level);
      weekday.forEach(el=>{
        formData.append('data'+'['+i+']'+'[weekday]'+'['+el+']',element[el] == true ? "1" : "0");
      })
      i++;
    });
    this.studyTimeHolidayService.createWeekdays(formData)
    .pipe()
    .subscribe(
      (res)=>{
        this.notificationService.showSuccess('Cập nhật dữ liệu thành công','Thông báo');
        return;
      },
      (errors)=>{
        let message;
        switch(errors['error']){
          case 11:
            message = 'Năm học không tồn tại hoặc đã bị xóa';
            break;
          case 121:
            message = 'Năm học phải là năm hiện tại tại hoặc tương lại';
            break;
          default:
            message = 'Cập nhật dữ liệu không thành công';
            break;
        }
        this.notificationService.showError(message,'Thông báo');
        return;
      }
    )
  }
}
