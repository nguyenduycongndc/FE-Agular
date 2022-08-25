import { first } from 'rxjs/operators';
import { Component, OnInit, ElementRef, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from '../../../../_services/notification.service';
import { AddressService } from '../../../../_services/address.service';
import { BasicInformationService } from '../../service/basic-information.service';
import { Router } from '@angular/router';

@Component({
  selector: 'student-management-add-basic-information',
  templateUrl: './student-management-add-basic-information.component.html',
  styleUrls: ['./student-management-add-basic-information.component.css']
})
export class StudentManagementAddBasicInformationComponent implements OnInit {

  @ViewChild('selectPermission') selectPermission: ElementRef;
  @ViewChild('selectProvince') selectProvince: ElementRef;
  @ViewChild('selectDistrict') selectDistrict: ElementRef;
  @ViewChild('selectWard') selectWard: ElementRef;
  @ViewChild('selectGender') selectGender: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @Input() basicInfoData: any;
  @Output() basicInforDataEvent = new EventEmitter<any>();

  form: FormGroup;
  submitted= false;
  imgURL: any;
  selectedFile: File

  studentData: any;
  //giới tính
  selectedGender : any;
  genderSettings = {};
  genderData: any = [];
  gender_id: any;
  //giới tính
  //Phường xã
  selectedWard : any;
  wardSettings = {};
  wardData = {};
  requiredWard = true;
  ward = [];
  ward_id: any;
  //Phường xã
  //Quận/ Huyện
  selectedDistrict: any;
  districtSettings = {};
  districtData = [];
  requiredDistrict = true;
  district_update = [];
  district_id: any;
  //Quận/ Huyện
  //Tỉnh/ Thành phố
  selectedProvince: any;
  provinceSettings = {};
  provinceData = [];
  province_update = [];
  requiredProvince = true;
  province_id: any;
  //Tỉnh/ Thành phố
  //yeardata
  ddlYearData =[];
  constructor(
    private notifyService: NotificationService,
    private fb: FormBuilder,
    private addressService: AddressService,
    private studentUpdateBasic: BasicInformationService,
    private router: Router,
    ) { }
  resetform(){
    this.checkDate = true;
    this.valueCheck = undefined;
    this.valueBoolen = undefined;
    this.valueDate = undefined;
    this.form.get('fullname').clearValidators();
    this.form.get('fullname').setValue('');
    this.form.get('dob').clearValidators();
    this.form.get('dob').setValue('');
    this.form.get('gender_id').clearValidators();
    this.form.get('gender_id').setValue('');
    // this.selectGender['selectedItems'] = [];
    this.selectedGender = [];
    this.form.get('province_id').clearValidators();
    this.form.get('province_id').setValue('');
    this.form.get('district_id').clearValidators();
    this.form.get('district_id').setValue('');
    this.form.get('ward_id').clearValidators();
    this.form.get('ward_id').setValue('');
    this.form.get('address_detail').clearValidators();
    this.form.get('address_detail').setValue('');
    }
  ngOnInit() {

    var dt = new Date();
    var current_year = dt.getFullYear();

    this.genderData = [
      { id: 0, name: 'Nữ' },
      { id: 1, name: 'Nam' },
      { id: 2, name: 'Khác' },
    ];
  
    //validate
    this.form = this.fb.group({
      fullname: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]),
      dob: new FormControl('', [Validators.required]),
      gender_id: new FormControl('', Validators.required),
      province_id: new FormControl('', Validators.required),
      district_id: new FormControl('', Validators.required),
      ward_id: new FormControl('', Validators.required),
      address_detail: new FormControl('', [Validators.required,
        Validators.pattern("^[a-zA-Z/aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ\n" +
          "fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu\n" +"0-9\n" +
          "UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ, ' ']+$")
      ]),
    });
    this.wardData = [];
    this.districtData = [];
    this.provinceData = [];
    this.addressService.getProvince()
      .subscribe(
        (data) => {
          let provinceData = data['provinces'];
          const provinceObj = [];
          provinceData.forEach(function (item) {
            provinceObj.push({ id: item['id'], name: item['name'] });
          });
          this.provinceData = provinceObj;
        });
    }
  get f() {
    return this.form.controls;
}
preview(files) {
  if (files.length === 0) {
    return;
  }

  this.selectedFile = files[0];
  const mimeType = files[0].type;
  if (mimeType.match(/(\jpg|\png|\JPG|\PNG|\jpeg|\JPEG)$/) == null) {
      this.notifyService.showError('Chỉ hỗ trợ định dạng file ảnh .png, .jpg, .jpeg', 'Thông báo lỗi');
      this.fileInput.nativeElement.value = null;
      return;
    }
    const maxSize = files[0].size;
    if(maxSize > 2000000){
      this.notifyService.showError('Kích thước ảnh quá lớn, vui lòng chọn ảnh khác!', 'Thông báo lỗi');
      this.fileInput.nativeElement.value = null;
      return;
    }
  const reader = new FileReader();
  reader.readAsDataURL(files[0]);
  reader.onload = (_event) => {
    this.imgURL = reader.result;
  };
}

  valueCheck:any;
  valueBoolen:any;
  valueDate:any;
  checkDate:boolean;
  checkCurrentDate=true;
  changeDate($event){
    this.checkCurrentDate = true;
    this.valueCheck =  $event.target.validationMessage;
    this.valueBoolen = $event.target.validity.valid;
    this.valueDate = $event.target.value;
    if(
      this.valueCheck === undefined && this.valueBoolen === undefined && this.valueDate === undefined ||
      this.valueCheck === '' && this.valueBoolen === true && this.valueDate === ''||
      this.valueCheck !== '' && this.valueBoolen === false && this.valueDate === ''
      ){
        this.checkDate === false;
      }
    if(this.valueCheck === '' && this.valueBoolen === true && this.valueDate !== '')
    {
      const currentDate = new Date();
      switch(Date.parse(String(this.valueDate )) > Date.parse(String(currentDate))){
        case true:
          this.checkCurrentDate = false;
          break;
        case false:
          this.checkCurrentDate = true;
          break;
      }
    }
  }

//Lấy ngày tháng năm hiện tại so sánh
  getCurrentYear(){
    var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

  // var current_year = [year, month, day].join('-');
   return [year, month, day].join('-');
  }

//Thêm mới
addNewStudent(){

  let Name;
  this.form.get('fullname').setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(100)]);
  this.form.get('fullname').updateValueAndValidity();
  this.form.get('gender_id').setValidators([Validators.required]);
  this.form.get('gender_id').updateValueAndValidity();
  this.form.get('dob').setValidators([Validators.required]);
  this.form.get('dob').updateValueAndValidity();
  this.form.get('province_id').setValidators([Validators.required]);
  this.form.get('province_id').updateValueAndValidity();
  this.form.get('district_id').setValidators([Validators.required]);
  this.form.get('district_id').updateValueAndValidity();
  this.form.get('ward_id').setValidators([Validators.required]);
  this.form.get('ward_id').updateValueAndValidity();
  this.form.get('address_detail').setValidators([Validators.required,
    Validators.pattern("^[a-zA-Z/aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ\n" +
      "fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu\n" +"0-9\n" +
      "UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ, ' ']+$")
  ]);
  this.form.get('address_detail').updateValueAndValidity();
  this.submitted = true;
  if (this.form.controls['fullname'].invalid
  || this.form.controls['gender_id'].invalid
  || this.form.controls['dob'].invalid
  || this.form.controls['province_id'].invalid
  || this.form.controls['district_id'].invalid
  || this.form.controls['ward_id'].invalid
  || this.form.controls['address_detail'].invalid
  ) {
    return;
  }

  if(this.checkCurrentDate === false || this.checkDate === false){
    return;
  }

  var uploadData = new FormData();
  var i = 0;
  if (this.selectedFile) {
    uploadData.append('avatar', this.selectedFile);
  }
  let nameStudent = this.form.controls['fullname'].value;
  let genderId =  this.form.controls['gender_id'].value['id'];
  let dob =  this.form.controls['dob'].value;
  let provinceId =  this.form.controls['province_id'].value['id'];
  let districtId =  this.form.controls['district_id'].value['id'];
  let wardId =  this.form.controls['ward_id'].value['id'];
  let getAddress =  this.form.controls['address_detail'].value;
  let addressFull = getAddress+' - '+this.form.controls['ward_id'].value['name']
  +' - '+this.form.controls['district_id'].value['name']
  +' - '+this.form.controls['province_id'].value['name'];
  if (this.selectedFile) {
    uploadData.append('avatar', this.selectedFile);
  }
  if (nameStudent) {
    var fullname = nameStudent.lastIndexOf(" ");
    var fistname = nameStudent.substr(fullname + 1 );
    var lastname = nameStudent.substr(0,fullname);
    Name = nameStudent;
  }
  else {
    Name = '';
  }
  if(nameStudent){
    uploadData.append('firstname', fistname);
    uploadData.append('lastname', lastname);
  }

  //check ngày sinh ko dc vượt quá ngày hiện tại


  var gen = genderId;
  uploadData.append('gender', gen);
  uploadData.append('dob', dob);
  uploadData.append('province_id', provinceId);
  uploadData.append('district_id', districtId);
  uploadData.append('ward_id', wardId);
  uploadData.append('address_detail', addressFull);
  this.studentUpdateBasic.creatStudent(uploadData).subscribe(
    result => {
      this.notifyService.showSuccess('Thêm mới thành công', 'Thông báo');
      this.router.navigate(['/student-management/student-management-list']);
      this.resetform();
    });
}

//Tạo mới và tiếp tục
addNewManyStudent(){
  let Name;
  this.form.get('fullname').setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(100)]);
  this.form.get('fullname').updateValueAndValidity();
  this.form.get('gender_id').setValidators([Validators.required]);
  this.form.get('gender_id').updateValueAndValidity();
  this.form.get('dob').setValidators([Validators.required]);
  this.form.get('dob').updateValueAndValidity();
  this.form.get('province_id').setValidators([Validators.required]);
  this.form.get('province_id').updateValueAndValidity();
  this.form.get('district_id').setValidators([Validators.required]);
  this.form.get('district_id').updateValueAndValidity();
  this.form.get('ward_id').setValidators([Validators.required]);
  this.form.get('ward_id').updateValueAndValidity();
  this.form.get('address_detail').setValidators([Validators.required,
    Validators.pattern("^[a-zA-Z/aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ\n" +
      "fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu\n" +"0-9\n" +
      "UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ, ' ']+$")]);
  this.form.get('address_detail').updateValueAndValidity();
  this.submitted = true;
  if (this.form.controls['fullname'].invalid
  || this.form.controls['gender_id'].invalid
  || this.form.controls['dob'].invalid
  || this.form.controls['province_id'].invalid
  || this.form.controls['district_id'].invalid
  || this.form.controls['ward_id'].invalid
  || this.form.controls['address_detail'].invalid
  ) {
    return;
  }
  if(this.checkCurrentDate === false || this.checkDate === false){
    return;
  }
  var uploadData = new FormData();
  var i = 0;
  if (this.selectedFile) {
    uploadData.append('avatar', this.selectedFile);
  }
  let nameStudent = this.form.controls['fullname'].value;
  let genderId =  this.form.controls['gender_id'].value['id'];
  let dob =  this.form.controls['dob'].value;
  let provinceId =  this.form.controls['province_id'].value['id'];
  let districtId =  this.form.controls['district_id'].value['id'];
  let wardId =  this.form.controls['ward_id'].value['id'];
  let getAddress =  this.form.controls['address_detail'].value;
  let addressFull = getAddress+' - '+this.form.controls['ward_id'].value['name']
  +' - '+this.form.controls['district_id'].value['name']
  +' - '+this.form.controls['province_id'].value['name'];
  if (this.selectedFile) {
    uploadData.append('avatar', this.selectedFile);
  }
  if (nameStudent) {
    var fullname = nameStudent.lastIndexOf(" ");
    var fistname = nameStudent.substr(fullname + 1 );
    var lastname = nameStudent.substr(0,fullname);
    Name = nameStudent;
  }
  else {
    Name = '';
  }
  if(nameStudent){
    uploadData.append('firstname', fistname);
    uploadData.append('lastname', lastname);
  }



  var gen = genderId;
  uploadData.append('gender', gen);
  uploadData.append('dob', dob);
  uploadData.append('province_id', provinceId);
  uploadData.append('district_id', districtId);
  uploadData.append('ward_id', wardId);
  uploadData.append('address_detail', addressFull);
  this.studentUpdateBasic.creatStudent(uploadData).subscribe(
    result => {
      const studentId = result['id'];
      const address = result['address'];
      const data = [
        { 'studentId': studentId, 'address': address}
      ];
      this.basicInforDataEvent.emit(data);

      this.notifyService.showSuccess('Thêm mới thành công', 'Thông báo');
      this.resetform();
    });

}

//Thêm mới và chuyển tab
nextAddNewStudent(){

  let Name;
  this.form.get('fullname').setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(100)]);
  this.form.get('fullname').updateValueAndValidity();
  this.form.get('gender_id').setValidators([Validators.required]);
  this.form.get('gender_id').updateValueAndValidity();
  this.form.get('province_id').setValidators([Validators.required]);
  this.form.get('province_id').updateValueAndValidity();
  this.form.get('district_id').setValidators([Validators.required]);
  this.form.get('district_id').updateValueAndValidity();
  this.form.get('ward_id').setValidators([Validators.required]);
  this.form.get('ward_id').updateValueAndValidity();
  this.form.get('address_detail').setValidators([Validators.required,
    Validators.pattern("^[a-zA-Z/aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ\n" +
      "fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu\n" +"0-9\n" +
      "UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ, ' ']+$")
  ]);
  this.form.get('address_detail').updateValueAndValidity();
  this.submitted = true;
  if (this.form.controls['fullname'].invalid
  || this.form.controls['gender_id'].invalid
  || this.form.controls['province_id'].invalid
  || this.form.controls['district_id'].invalid
  || this.form.controls['ward_id'].invalid
  || this.form.controls['address_detail'].invalid
  ) {
    return;
  }
  if(this.checkCurrentDate === false || this.checkDate === false){
    return;
  }
  var uploadData = new FormData();
  var i = 0;
  if (this.selectedFile) {
    uploadData.append('avatar', this.selectedFile);
  }
  let nameStudent = this.form.controls['fullname'].value;
  let genderId =  this.form.controls['gender_id'].value['id'];
  let dob =  this.form.controls['dob'].value;
  let provinceId =  this.form.controls['province_id'].value['id'];
  let districtId =  this.form.controls['district_id'].value['id'];
  let wardId =  this.form.controls['ward_id'].value['id'];
  let getAddress =  this.form.controls['address_detail'].value;
  let addressFull = getAddress+' - '+this.form.controls['ward_id'].value['name']
  +' - '+this.form.controls['district_id'].value['name']
  +' - '+this.form.controls['province_id'].value['name'];
  if (this.selectedFile) {
    uploadData.append('avatar', this.selectedFile);
  }
  if (nameStudent) {
    var fullname = nameStudent.lastIndexOf(" ");
    var fistname = nameStudent.substr(fullname + 1 );
    var lastname = nameStudent.substr(0,fullname);
    Name = nameStudent;
  }
  else {
    Name = '';
  }
  if(nameStudent){
    uploadData.append('firstname', fistname);
    uploadData.append('lastname', lastname);
  }

  var gen = genderId;
  uploadData.append('gender', gen);
  uploadData.append('dob', dob);
  uploadData.append('province_id', provinceId);
  uploadData.append('district_id', districtId);
  uploadData.append('ward_id', wardId);
  uploadData.append('address_detail', addressFull);
  this.studentUpdateBasic.creatStudent(uploadData).subscribe(
    result => {
      const studentId = result['id'];
      const address = result['address'];
      const data = [
        { 'studentId': studentId, 'address': address, 'tab': 1}
      ];
      this.basicInforDataEvent.emit(data);
      this.notifyService.showSuccess('Thêm mới thành công', 'Thông báo');
      this.resetform();
    });
}
//select xã/phường
  //chọn 1
onSelectWard(item: any){
  this.ward = [];
  const ward = [];
  if (item !== undefined){
    ward.push(item['id']);
  }
  this.ward = ward;
}
//select xã/phường
//select quận/huyện
  //chọn 1
  onSelectDistrict(item: any){
    this.wardData = [];
    this.selectedWard = null;
    this.ward = [];
    let districtyId = item;
    if(districtyId === undefined){
      this.wardData = [];
      this.selectedDistrict = null;
      this.selectedWard = null;
    } 
    if (item !== undefined){
      this.studentUpdateBasic.getWard(item['id'])
        .subscribe(
          (data) => {
            let wardData = data['wards'];
            const wardObj = [];
            wardData.forEach(function (item) {
              wardObj.push({ id: item['id'], name: item['name'] });
            });
            this.wardData = wardObj;
          });
    }
  }
//select quận/huyện
//select thành phố/tỉnh
  //chọn 1
  onSelectProvince(item: any){
    this.selectedDistrict = [];
    this.selectedWard = [];
    this.wardData = [];
    let proviceId = item;
    if(proviceId=== undefined){
      this.wardData = [];
      this.districtData= [];
      this.selectedProvince = null;
      this.selectedDistrict = null;
      this.selectedWard = null;
    }
    if (item !== undefined){
      this.studentUpdateBasic.getDistrict(item['id'])
        .subscribe(
          (data) => {
            let districtData = data['districts'];
            const districtObj = [];
            districtData.forEach(function (item) {
              districtObj.push({ id: item['id'], name : item['name'] });
            });
            this.districtData = districtObj;
          });
    }
  }
}


