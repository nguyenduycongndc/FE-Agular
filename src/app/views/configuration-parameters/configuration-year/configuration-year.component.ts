import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { Years } from '../../../_models/year';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfigurationParametersYearService } from '../service/configuration-parameters-year.service';
import { NotificationService } from '../../../_services/notification.service';

// import $ from 'jquery';
declare var $: any;


@Component({
  selector: 'app-configuration-year',
  templateUrl: './configuration-year.component.html',
  styleUrls: ['./configuration-year.component.css']
})
export class ConfigurationYearComponent implements OnInit {
  @Input()
  maxNumberOfCharactersDescription = 150;
  numberOfCharactersDescription = 0;

  id: number;
  years: Years[] = [];
  form: FormGroup;
  submitted = false;

  p: number = 1;
  countPage: number = 10;
  totalItems = 0;

  yearConfigGetId: any;
  headerYearConfig = false;
  checkYears = true;

  statusActive: number;
  idActive: number;

  ddlYearData = [];
  selectedStartYear = [];
  selectedEndYear = [];

  constructor(
    private yearService: ConfigurationParametersYearService,
    private notifyService: NotificationService,
  ) { }
  get f() { return this.form.controls; }
  ngOnInit(): void {
    this.numberOfCharactersDescription = 0;
    const dt = new Date();
    const year = dt.getFullYear() - 5;
    let i = 1;
    const array = [];
    for (let index = year; index <= year + 10; index++) {
      array.push({ id: index, name: index });
      i++;
    }
    this.ddlYearData = array;

    //Lấy danh sách của cấu hình năm học
    this.yearService.getAll().subscribe(
      (data: Years[]) => {
        this.years = data['years'];
      });

    //Khởi tạo để validate + biến nhận value
    this.form = new FormGroup({
      start_year: new FormControl('', [Validators.required]),
      end_year: new FormControl('', [Validators.required]),
      startYearValidate: new FormControl('', [Validators.required]),
      description: new FormControl('', Validators.maxLength(150)),
    });
  }
  active(id: number, status: number) {
    this.idActive = id;
    this.statusActive = status;
  }
  setStatus() {
    if (this.statusActive === 1) {
      this.ngOnInit();
    } else {
      this.yearService.StatusActive(this.idActive)
        .subscribe(
          result => {
            this.notifyService.showSuccess('Thay đổi trạng thái thành công!', 'Thông báo');
            this.ngOnInit();
          },
          error => {
            this.notifyService.showError(error, 'Thông báo lỗi');
            this.ngOnInit();
          });
    }
    $('#confirmModal').modal('hide');
    $('.modal-backdrop').remove();
  }
  exitSetStatus() {
    this.ngOnInit();
  }
  onKeyUp(event: any): void {
    this.numberOfCharactersDescription = event.target.value.length;
    if (this.numberOfCharactersDescription > this.maxNumberOfCharactersDescription) {
      event.target.value = event.target.value.slice(0, this.maxNumberOfCharactersDescription);
      this.numberOfCharactersDescription = this.maxNumberOfCharactersDescription;
    }
  }

  //Hiển thị 10/20/50/100
  perPageSelected(id: number) {
    this.countPage = id;
    this.p = 1;
  }

  //Search
  searchByKeyWord(search) {
    this.years = [];
    if (search.trim() === "") {
      this.notifyService.showError('Vui lòng điền từ khóa tìm kiếm!', 'Thông báo lỗi');
      this.headerYearConfig = true;
      this.checkYears = false;
      this.totalItems = 1;
      this.p = 1;
    } else {
      this.yearService.searchByKeyWord(search)
        .subscribe(
          result => {
            this.headerYearConfig = true;
            if (result.count != 0) {
              this.years = [];
              this.checkYears = true;
              this.years = result['years'];
              this.totalItems = result['count'];
              this.notifyService.showSuccess('Đã tìm thấy ' + result.count + ' bản ghi dữ liệu', 'Thông báo');
              this.p = 1;
            } else {
              this.years = [];
              this.checkYears = false;
              this.totalItems = 1;
              this.p = 1;
            }
          },
          error => {
            this.notifyService.showError(error, 'Thông báo lỗi');
          });
    }
  }


  //modal Thêm mới reset form khi thêm mới
  resetYearForm() {
    this.form.get('start_year').clearValidators();
    this.form.get('end_year').clearValidators();
    this.form.get('description').clearValidators();
    this.selectedStartYear = [];
    this.selectedEndYear = [];
    this.form.get('description').setValue('');
    this.numberOfCharactersDescription = 0;
  }

  //Show theo Id
  find(id: number) {

    this.form.get('start_year').clearValidators();
    this.form.get('end_year').clearValidators();
    this.form.get('description').clearValidators();

    this.form.get('start_year').setValue('');
    this.form.get('end_year').setValue('');
    this.form.get('description').setValue('');

    this.yearService.getIdYear(id)
      .subscribe((data) => {
        const startYear = [];
        const endYear = [];
        this.yearConfigGetId = data;
        this.form.patchValue(data['year']);
        //Fill dữ liệu lên dropdown
        startYear.push({ id: data['year']['start_year'], name: data['year']['start_year'] });
        endYear.push({ id: data['year']['end_year'], name: data['year']['end_year'] });
        this.selectedStartYear = startYear[0];
        this.selectedEndYear = endYear[0];
        const countDescriptionCharacter = data['year'].description.replace(/\s+/g, '').trim();
        if (countDescriptionCharacter) {
          this.numberOfCharactersDescription = data['year'].description.length;
        }
      });
  }

  //Tạo mới năm học
  createYear() {
    //reset lại thông báo của validate khi click thêm mới lại
    this.form.get('start_year').setValidators([Validators.required]);
    this.form.get('start_year').updateValueAndValidity();

    this.form.get('end_year').setValidators([Validators.required]);
    this.form.get('end_year').updateValueAndValidity();


    this.submitted = true;
    //reset lại giá trị của drop
    if (this.form.controls['start_year'].invalid || this.form.controls['end_year'].invalid) {
      return;
    }

    let start_year = this.form.controls['start_year'].value.name;
    let end_year = this.form.controls['end_year'].value.name;
    let description = this.form.controls['description'].value;

    //Kiểm tra năm bắt đầu > năm kết thúc
    if (start_year > end_year) {
      this.notifyService.showError('Năm bắt đầu phải nhỏ hơn năm kết thúc', 'Thông báo');
      return;
    }
    if (start_year === end_year) {
      this.notifyService.showError('Năm bắt đầu phải nhỏ hơn năm kết thúc', 'Thông báo');
      return;
    }
    var uploadData = new FormData();
    if (start_year) {
      uploadData.append('start_year', start_year);
    }
    if (end_year) {
      uploadData.append('end_year', end_year);
    }
    if (description) {
      uploadData.append('description', description.substring(0, 150));
    }
    //Thực thi thêm mới
    this.yearService.create(uploadData)
      .subscribe(
        (res) => {
          //Khi thêm mới thành công thì ẩn modal
          $('#addYearModal').modal('hide');
          $('.modal-backdrop').remove();
          this.notifyService.showSuccess('Thêm mới năm học thành công', 'Thông báo');
          //Khi thêm mới thành công thì hiển thị lên gridview
          this.headerYearConfig = true;
          this.checkYears = true;
          this.yearService.getAll().subscribe(
            (data: Years[]) => {
              this.years = data['years'];;
            });
        },
        error => {
          if (error) {
            if (error.messages) {
              if (error.messages.start_year) {
                this.notifyService.showError(error.messages.start_year, 'Thông báo lỗi');
              } else {
                this.notifyService.showError(error.messages.end_year, 'Thông báo lỗi');
              }
            } else if (error.message) {
              if (error.message.year) {
                this.notifyService.showError(error.message.year, 'Thông báo lỗi');
              }
            } else if (error.error) {
                this.notifyService.showError(error.error, 'Thông báo lỗi');

            } else{
              this.notifyService.showError('Kiểm tra dữ liệu đầu vào', 'Thông báo lỗi');
            }
          }
        }
      );
  }

  updateYear(id) {
    //reset lại thông báo của validate khi update
    this.form.get('start_year').setValidators([Validators.required]);
    this.form.get('start_year').updateValueAndValidity();

    this.form.get('end_year').setValidators([Validators.required]);
    this.form.get('end_year').updateValueAndValidity();

    this.submitted = true;
    //reset lại giá trị của drop
    if (this.form.controls['start_year'].invalid || this.form.controls['end_year'].invalid) {
      return;
    }
    //Kiểm tra năm bắt đầu > năm kết thúc
    let start_year = this.form.controls['start_year'].value.name;
    let end_year = this.form.controls['end_year'].value.name;
    let description = this.form.controls['description'].value;
    if (start_year > end_year) {
      this.notifyService.showError('Năm bắt đầu phải nhỏ hơn năm kết thúc', 'Thông báo');
      return;
    }
    if (start_year === end_year) {
      this.notifyService.showError('Năm bắt đầu phải nhỏ hơn năm kết thúc', 'Thông báo');
      return;
    }

    let uploadData = new FormData();
    if (start_year) {
      uploadData.append('start_year', start_year);
    }
    if (end_year) {
      uploadData.append('end_year', end_year);
    }
    if (description) {
      uploadData.append('description', description.substring(0, 150));
    }
    this.yearService.update(id, uploadData)
      .subscribe(res => {
        $('#editYearModal').modal('hide');
        $('.modal-backdrop').remove();
        this.notifyService.showSuccess('Cập nhật thành công', 'Thông báo');

        //Khi thêm mới thành công thì hiển thị lên gridview
        this.headerYearConfig = true;
        this.checkYears = true;
        this.yearService.getAll().subscribe(
          (data: Years[]) => {
            this.years = data['years'];;

          });
      },
        error => {
          if (error) {
            if (error.messages) {
              if (error.messages.start_year) {
                this.notifyService.showError(error.messages.start_year, 'Thông báo lỗi');
              } else {
                this.notifyService.showError(error.messages.end_year, 'Thông báo lỗi');
              }
            } else if (error.message) {
              if (error.message.year) {
                this.notifyService.showError(error.message.year, 'Thông báo lỗi');
              }
            } else if (error.error) {
                this.notifyService.showError(error.error, 'Thông báo lỗi');

            } else{
              this.notifyService.showError('Kiểm tra dữ liệu đầu vào', 'Thông báo lỗi');
            }
          }
        }
      );
  }

  //Xóa năm học
  deletePost(id) {
    let isDelete = confirm('Bạn chắc chắn muốn xóa dữ liệu này?');
    if (isDelete) {
      this.yearService.delete(id).subscribe(res => {
        this.years = this.years.filter(item => item.id !== id);
        this.notifyService.showSuccess('Xóa thành công', 'Thông báo');
      }, error => {
        if (error.message['year']) {
          this.notifyService.showError(error.message['year'], 'Thông báo lỗi');
        }
      });
    }
  }
}


