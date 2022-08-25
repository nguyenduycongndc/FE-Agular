import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '../../../_services/notification.service';
import { ConfigurationParametersGradeService } from '../service/configuration-parameters-grade.service';
declare var $: any;
@Component({
  selector: 'app-configuration-grade',
  templateUrl: './configuration-grade.component.html',
  styleUrls: ['./configuration-grade.component.scss']
})
export class ConfigurationGradeComponent implements OnInit {
  @Input()
  maxNumberOfCharactersDescription = 150;
  counter = true;
  numberOfCharactersDescription = 0;

  form: FormGroup;
  ddlYearData = []; selectedYear = [];
  ddlLevel = [];
  selectedLevel = [];
  selectedLevelUpdate=[];
  gradeConfigurationData: any;
  gradeConfigurationGetById: any;
  headerGradeConfiguration = false;
  submitted = false;
  checkGradeConfigurationData = true;
  p: number = 1;
  countPage: number = 10;
  totalItems = 0;

  //year
  yearDataInsert = [];
  selectedCurrentYearInsert:any;
  selectedCurrentYearReset:any;

  selectedCurrentYear = [];

  loadingFilter = false;
  perPageSelected(id: number) {
    this.countPage = id;
    this.p = 1;
  }
  constructor(private fb: FormBuilder,
    private notifyService: NotificationService,
    private gradeService: ConfigurationParametersGradeService,
  ) { }
  get f() {
    return this.form.controls;
  }
  @ViewChild('tabCheck', { static: true, read: ElementRef }) tabCheck: ElementRef;

  ngOnInit() {
    this.ddlLevel = [
      { id: 1, name: 'Tiểu học' },
      { id: 2, name: 'Trung học cơ sở' },
      { id: 3, name: 'Trung học phổ thông' },
    ];
    this.headerGradeConfiguration = false;
    this.form = new FormGroup({
      code: new FormControl(''),
      name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      year_id: new FormControl('',[Validators.required]),
      level: new FormControl('',[Validators.required]),
      levelUpdate: new FormControl('',[Validators.required]),
      // year_id_insert: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      statusFilter: new FormControl(true),
      yearSearch: new FormControl('')
    });


    this.gradeService.getYears()
      .pipe()
      .subscribe((data) => {
        const selectedYearData = [];
        const fullYear = [];
        const limitYear = [];
        const idCurrentYear = data['id_current_year'];
        let currentYearData;
        const currentArrYearData = [];
        data['years'].forEach(function (item) {
          fullYear.push({ id: item['id'], name: item['start_year'] + ' - ' + item['end_year'] });
        });
        data['limit_year'].forEach(function (item) {
          limitYear.push({ id: item['id'], name: item['start_year'] + ' - ' + item['end_year'] });
          if (item['id'] === idCurrentYear) {
            currentYearData = { id: item['id'], name: item['start_year'] + ' - ' + item['end_year'] };
            currentArrYearData.push({ id: item['id'], name: item['start_year'] + ' - ' + item['end_year'] });
          }

        });
        this.ddlYearData = fullYear;
        this.selectedYear = currentYearData;
        this.selectedCurrentYear = currentYearData;
      });

      this.gradeService.getYearsAdd()
      .pipe()
      .subscribe((data) => {
        const yearInsert = [];
        let currentYearData;
        data['query'].forEach(function (item) {
          yearInsert.push({ id: item['id'], name: item['start_year'] + ' - ' + item['end_year'],});
          if (item['status'] === 1) {
            currentYearData = { id: item['id'], name: item['start_year'] + ' - ' + item['end_year'] };
          }
        });

        this.yearDataInsert = yearInsert;
        this.selectedCurrentYearInsert = currentYearData;
        this.selectedCurrentYearReset = currentYearData;
      });

  }

  onKeyUp(event: any): void {
    this.numberOfCharactersDescription = event.target.value.length;
    if (this.numberOfCharactersDescription > this.maxNumberOfCharactersDescription) {
      event.target.value = event.target.value.slice(0, this.maxNumberOfCharactersDescription);
      this.numberOfCharactersDescription = this.maxNumberOfCharactersDescription;
    }
  }

  filter() {
    var i = 0;
    const year = [];
    const status = this.form.value.statusFilter;
    this.loadingFilter = true;
    var uploadData = new FormData();
    year.push(this.selectedYear);
    if (year && year.length > 0) {
      year.forEach(function (item) {
        uploadData.append('year' + '[' + i + ']', item['id']);
        i++;
      });
    }
    if (status) {
      uploadData.append('status', 'active');
    } else {
      uploadData.append('status', 'inactive');
    }
    this.gradeService.listGrade(uploadData)
      .subscribe(
        result => {
          this.loadingFilter = false;
          if (result['count'] === 0) {
            this.checkGradeConfigurationData = false; //dữ liệu không tồn tại
            this.headerGradeConfiguration = true;
            this.gradeConfigurationData = [];
            this.p = 1;
            this.totalItems = 1;
          } else {
            this.p = 1;
            this.checkGradeConfigurationData = true; //dữ liệu tồn tại
            this.headerGradeConfiguration = true;
            this.gradeConfigurationData = result['grades'];
            this.totalItems = result['count'];
          }
        }, error => {
          this.loadingFilter = false;
          if (error) {
            this.notifyService.showError('Lọc dữ liệu khối không thành công.', 'Thông báo lỗi');
          }
        }
      );
  }

  //Reload gridData
  reloadGradeData() {
    this.filter();
  }
  //check Status
  getDataByCheckBox() {
    let status = '';
    let statusValue = this.form.controls['statusFilter']['nativeElement'].checked;
    if (statusValue) {
      status = "active";
    } else {
      status = "inactive";
    }
    var uploadData = new FormData();
    if (status) {
      uploadData.append('status', status);
    }
    this.gradeService.listGrade(uploadData)
      .subscribe(
        result => {
          if (result['count'] === 0) {
            this.checkGradeConfigurationData = false; //dữ liệu không tồn tại
            this.headerGradeConfiguration = true;
            this.gradeConfigurationData = [];
            this.p = 1;
            this.totalItems = 1;
          } else {
            this.p = 1;
            this.checkGradeConfigurationData = true; //dữ liệu tồn tại
            this.headerGradeConfiguration = true;
            this.gradeConfigurationData = result['grades'];
            this.totalItems = result['count'];
          }
        }, error => {
          if (error) {
            this.notifyService.showError('Lọc dữ liệu khối không thành công.', 'Thông báo lỗi');
          }
        }
      );
  }
  //reset form click Thêm mới
  resetGradeConfigurationForm() {
    this.form.get('name').clearValidators();
    this.form.get('name').setValue('');
    this.form.get('description').clearValidators();
    this.form.get('description').setValue('');
    this.form.get('level').clearValidators();
    this.selectedLevel= [];
    this.selectedCurrentYearInsert = this.selectedCurrentYearReset;
    // this.form.get('year_id').clearValidators();
    // this.form.get('year_id').setValue('');
    this.numberOfCharactersDescription = 0;
  }
  idShowGrade: any;
  //button sửa
  getByIdGradeConfiguration(id: any) {
    this.resetGradeConfigurationForm();
    this.gradeService.getByIdGrade(id)
      .subscribe(
        result => {
          this.form.patchValue(result);
          this.idShowGrade = id;
          const countDescriptionCharacter = result.description.replace(/\s+/g, '').trim();
          if (countDescriptionCharacter) {
            this.numberOfCharactersDescription = result.description.length;
          }
          let gradeUpdate: any;
          let selectedLevelUpdate = [];
          const mapLevel = this.ddlLevel.map(function (x) { return x.id }).indexOf(result['level']);
          if (mapLevel > -1) {
            gradeUpdate = {
              id: this.ddlLevel[mapLevel]['id'],
              name: this.ddlLevel[mapLevel]['name'],
            }
           selectedLevelUpdate.push(gradeUpdate);
          }
          this.selectedLevelUpdate = gradeUpdate;
        }
      )
  }
  //lưu
  addGradeConfiguration() {
    this.form.get('name').setValidators([Validators.required, Validators.maxLength(50)]);
    this.form.get('name').updateValueAndValidity();
    this.form.get('year_id').setValidators([Validators.required]);
    this.form.get('year_id').updateValueAndValidity();
    this.form.get('level').setValidators([Validators.required]);
    this.form.get('level').updateValueAndValidity();
    this.submitted = true;
    if (
      this.form.controls["name"].invalid ||
      this.form.controls["year_id"].invalid||
      this.form.controls["level"].invalid
    ) {
      return;
    }
    let schoolId = 1;
    let yearAddGrade = this.form.controls['year_id'].value.id;
    let nameAddGrade = this.form.controls['name'].value;
    let desAddGrade = this.form.controls['description'].value;
    let addLevel = this.form.controls['level'].value.id;
    if(desAddGrade){
      desAddGrade = desAddGrade.substring(0, 150);
    }
    this.gradeService.createGrade(yearAddGrade,nameAddGrade, schoolId, desAddGrade,addLevel)
      .subscribe(
        result => {
          this.notifyService.showSuccess('Thêm mới khối học thành công', 'Thông báo');
          this.headerGradeConfiguration = true;
          this.checkGradeConfigurationData = true;
          this.resetGradeConfigurationForm();
          let statusValue = this.form.controls['statusFilter'].value;
          $('#addGradeConfigurationModal').modal('hide');
          $('.modal-backdrop').remove();
          this.reloadGradeData();
        }, error => {
          if (error) {
            this.notifyService.showError(error.error, 'Thông báo lỗi');
          } else if (error.messages) {
            if (error.messages.name) {
              this.notifyService.showError(error.messages.name, 'Thông báo lỗi');
            } else if (error.messages.school_id) {
              this.notifyService.showError(error.messages.school_id, 'Thông báo lỗi');
            } else {
              this.notifyService.showError('Thêm mới khối học không thành công', 'Thông báo');
            }
          } else {
            this.notifyService.showError('Thêm mới khối học không thành công', 'Thông báo');
          }
        }
      )
  }
  //Cập nhật
  updateGradeConfiguration(id: number) {
    this.form.get('name').setValidators([Validators.required, Validators.maxLength(50)]);
    this.form.get('name').updateValueAndValidity();
    this.form.get('levelUpdate').setValidators([Validators.required]);
    this.form.get('levelUpdate').updateValueAndValidity();
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    let schoolId = 1;
    let statusUpdateGrade = 1;
    let nameUpdateGrade = this.form.controls['name'].value;
    let desUpdateGrade = this.form.controls['description'].value;
    if(desUpdateGrade){
      desUpdateGrade = desUpdateGrade.substring(0, 150);
    }
    this.gradeService.updateGrade(id, schoolId, nameUpdateGrade, desUpdateGrade, statusUpdateGrade)
      .subscribe(
        result => {

          this.notifyService.showSuccess('Dữ liệu đã được cập nhật thành công', 'Thông báo');
          this.resetGradeConfigurationForm();
          $('#editGradeConfigurationModal').modal('hide');
          $('.modal-backdrop').remove();
          this.reloadGradeData();
        }, error => {
          if (error.message['error']) {
            this.notifyService.showError(error.message['error'], 'Thông báo lỗi');
          }
          else {
            Object.keys(error.message).forEach(function (key) {
              this.notifyService.showError(error.message[key], 'Thông báo lỗi');
            });
          }
        }
      )
  }
  //button xóa
  deleteGradeConfiguration(id: number) {
    let isDeleteGrade = confirm("Bạn chắc chắn muốn xóa dữ liệu này?")
    if (isDeleteGrade) {
      this.gradeService.deleteGrade(id)
        .subscribe(
          result => {
            this.notifyService.showSuccess('Dữ liệu đã được xóa thành công!', 'Thông báo');
            this.reloadGradeData();
          },
         error => {
          if (error.error) {
            this.notifyService.showError(error.error, 'Thông báo lỗi');
          }
          else {
            Object.keys(error.message).forEach(function (key) {
              this.notifyService.showError(error.message[key], 'Thông báo lỗi');
            });
          }
        });
    }
  }
  //reset Status
  // resetStatusActive(){
  //   this.ngOnInit();
  // }
  // resetStatusUnactive(){
  //   let statusValue =this.form.controls['statusFilter'].value;
  //  if(statusValue === true){
  //   var status = "active";
  //  }else{
  //   var status = "inactive";
  //  }
  //  this.gradeService.listGrade(status)
  //  .subscribe(
  //    result=>{
  //      if (result['count'] === 0) {
  //        this.checkGradeConfigurationData = false; //dữ liệu không tồn tại
  //        this.headerGradeConfiguration = true;
  //        this.gradeConfigurationData = [];
  //        this.p = 1;
  //        this.totalItems = 1;
  //      }else {
  //        this.p = 1;
  //        this.checkGradeConfigurationData = true; //dữ liệu tồn tại
  //        this.headerGradeConfiguration = true;
  //        this.gradeConfigurationData = result['grades'];
  //        this.totalItems = result['count'];
  //    }
  //  }
  //  );
  // }
  //reset Status
  //sort mã khối
  firstCode = 1;
  timesGradeCode: any;
  sortGradeCode() {
    this.firstName = 1;
    this.firstCode = 0;
    this.timesName = 0;
    const array = this.gradeConfigurationData;
    if (this.timesGradeCode === 1) {
      array.sort(function (a, b) {
        let str = a.code
        var nameA = Number(str) // bỏ qua hoa thường
        let str2 = b.code;
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
      this.timesGradeCode++;
    } else {
      array.sort(function (a, b) {
        let str = a.code;
        var nameA = Number(str); // bỏ qua hoa thường
        let str2 = b.code;
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
      this.timesGradeCode = 1;
      this.gradeConfigurationData = array;
    }
  }


  //sort tên khối
  firstName = 1;
  timesName: any;
  sortGradeName() {
    this.firstName = 0;
    this.firstCode = 1;
    this.timesGradeCode = 0;
    const array = this.gradeConfigurationData;
    if (this.timesName === 1) {
      array.sort(function (a, b) {
        let str = a.name;

        str = str.replace(/\s+/g, ' ');
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

        var nameA = str.toUpperCase(); // bỏ qua hoa thường

        let str2 = b.name;
        str2 = str2.replace(/\s+/g, ' ');
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

        str = str.replace(/\s+/g, ' ');
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

        var nameA = str.toUpperCase(); // bỏ qua hoa thường

        let str2 = b.name;
        str2 = str2.replace(/\s+/g, ' ');
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
      this.timesName = 1
    }
    this.gradeConfigurationData = array;
  }
}
