import  { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {FormGroup, FormControl, Validators,} from '@angular/forms';
import {StudyTimeHolidayService} from '../study-time-holiday.service';
import { NotificationService } from "../../../../_services/notification.service";

@Component({
  selector: 'holiday-app',
  templateUrl: 'holidays.component.html',
  styleUrls:['holidays.component.scss']
})

export class HolidayComponent implements OnInit {
  @Input() header: any;
  @Input() sourceData:any[];
  @Input() years:any;
  @Output() emitData = new EventEmitter();
  @ViewChild('closeModal') closeModal;

  constructor(
    private StudyTimeHolidayService: StudyTimeHolidayService,
    private Notify: NotificationService
  ) { }
  holidayData:any;
  /*Dropdownlist lặp lại*/
  repeatData = [
    {id:'0',name:'Không lặp lại'},
    {id:'1',name:'Hàng năm'}
  ];
  selectedRepeat = {id:'0',name:'Không lặp lại'};
  /*-End-*/
  /*Modal popup*/
  modalPopupData = {
    id:null,
    name:null,
    start_date:'',
    end_date:'',
    repeat:this.repeatData[0],
    status:true,
    statusUpdate:true,
  }
  formModal: FormGroup;
  statusUpdate:any;
  /*-End-*/
  ngOnInit() {
    this.binddingData(this.sourceData);
    this.formModal = new FormGroup(
      {
        name: new FormControl(this.modalPopupData.name,[Validators.required]),
        start_date: new FormControl(this.modalPopupData.start_date,[Validators.required]),
        end_date: new FormControl(this.modalPopupData.end_date,[Validators.required]),
        repeat: new FormControl(this.modalPopupData.repeat,[Validators.required]),
        status: new FormControl(this.modalPopupData.status)
      }
    )
  }

  afterChangeYear(data){
    this.binddingData(data);
  }

  /*Validator modal popup*/
  get name() {return this.formModal.get('name');}
  get start_date() {return this.formModal.get('start_date');}
  get end_date() {return this.formModal.get('end_date');}
  get repeat() {return this.formModal.get('repeat');}
  /*-End-*/

  binddingData(data){
    if(data.length > 0){
      var array = [];
      data.forEach(element => {
        array.push({
          id:element['id'],
          name:element['name'],
          start_date:element['start_date'],
          end_date:element['end_date'],
          repeat:element['repeat'],
          status:element['status'] == 1 ? true : false || element['status'] == true ? true : false,
        });
      });
      this.holidayData = array;
    }else{
      this.holidayData = [];
    }
  }

  listHolidays(year_id:any){
    this.StudyTimeHolidayService.listHolidays(year_id)
    .subscribe(
      (res)=>{
        this.holidayData = res['query'];
        this.emitData.next(res['query']);
      }
    )
  }

  saveCreate(){
    let year_id = this.years['id'];
    var formData = new FormData();
    formData.append('year_id',year_id);
    formData.append('name',this.modalPopupData['name']);
    formData.append('start_date',this.modalPopupData['start_date']);
    formData.append('end_date',this.modalPopupData['end_date']);
    formData.append('repeat',this.modalPopupData['repeat']['id']);
    this.StudyTimeHolidayService.createHolidays(formData)
    .subscribe(
      (res)=>{
        this.Notify.showSuccess('Tạo mới thành công','Thông báo');
        this.listHolidays(year_id);
        this.closeModal.nativeElement.click();
        return true;
      },
      (errors)=>{
        let message;
        switch(errors['error']){
          case 12:
            message = 'Ngày nghỉ đã diễn ra';
            break;
          case 11:
            message = 'Năm học không tồn tại hoặc đã bị xóa';
            break;
          case 121:
            message = 'Năm học phải là năm hiện tại tại hoặc tương lại';
            break;
          case 14:
            message = 'Thời gian thêm vào không thuộc năm hiện tại';
            break;
          case 13:
            message = 'Thời gian nghỉ đã tồn tại';
            break;
          default:
            message = 'Tạo mới thất bại';
        }
        this.Notify.showError(message,'Thông báo');
        return false;
      }
    )
  }

  getId(event){
    var data = this.holidayData;
    let found = data.find((el)=>{
      if(el.id == event){
        return el;
      }
    })
    if(found){
      this.modalPopupData = {
        id:found['id'],
        name:found['name'],
        start_date:found['start_date'],
        end_date:found['end_date'],
        repeat:found['repeat'] == 0 ?this.repeatData[0]:this.repeatData[1] ,
        status:found['status'],
        statusUpdate:false,
      }
    }
  }

  updateCreate(){
    let year_id = this.years['id'];
    this.StudyTimeHolidayService.updateHoliday(
      this.modalPopupData['id'],
      this.modalPopupData['name'],
      this.modalPopupData['start_date'],
      this.modalPopupData['end_date'],
      this.modalPopupData['repeat']['id'],
      this.modalPopupData['status'] == true ? '1': '0'
      )
    .subscribe(
      (res)=>{
        this.Notify.showSuccess('Cập nhật thông tin thành công','Thông báo');
        this.listHolidays(year_id);
        this.closeModal.nativeElement.click();
        return true;
      },
      (errors)=>{
        let message;
        switch(errors['error']){
          case 12:
            message = 'Ngày nghỉ đã diễn ra';
            break;
          case 11:
            message = 'Năm học không tồn tại hoặc đã bị xóa';
            break;
          case 121:
            message = 'Năm học phải là năm hiện tại tại hoặc tương lại';
            break;
          case 14:
            message = 'Thời gian thêm vào không thuộc năm hiện tại';
            break;
          case 13:
            message = 'Thời gian nghỉ đã tồn tại';
            break;
          default:
            message = 'Tạo mới thất bại';
        }
        this.Notify.showError(message,'Thông báo');
        return false;
      }
    )
  }

  active(id,event){
    this.StudyTimeHolidayService.activeHoliday(id,event.target.checked == true ? 1 : 0)
    .subscribe(
      (res)=>{
        this.Notify.showSuccess('Cập nhật trạng thái thành công','Thông báo');
        this.emitData.next(this.holidayData);
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
            message = 'Cập nhật trạng thái không thành công';
            break;
        }
        this.Notify.showError(message,'Thông báo');
        return false;
      }
    )
  }

  mt_id:any;
  getIdDel(event){
    this.mt_id = event;
  }

  deleteId(event){
    if(event == true){
      this.StudyTimeHolidayService.deleteHoliday(this.mt_id)
      .subscribe(
        (res)=>{
          this.Notify.showSuccess('Xóa thành công dữ liệu bản ghi','Thông báo');
          let year_id = this.years['id'];
          this.listHolidays(year_id);
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
              message = 'Cập nhật trạng thái không thành công';
              break;
          }
          this.Notify.showError(message,'Thông báo');
          return false;
        }
      )
    }
  }

}
