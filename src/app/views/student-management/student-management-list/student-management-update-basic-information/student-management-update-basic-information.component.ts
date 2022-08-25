import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from '../../../../_services/notification.service';
import { AddressService } from '../../../../_services/address.service';
import { BasicInformationService } from '../../service/basic-information.service';
import { Router } from '@angular/router';
import { SafeUrlPipe } from '../../../../_services/safe-url.pipe.service';
declare var $: any;
@Component({
  selector: 'student-management-update-basic-information',
  templateUrl: './student-management-update-basic-information.component.html',
  styleUrls: ['./student-management-update-basic-information.component.css']
})
export class StudentManagementUpdateBasicInformationComponent implements OnInit {
  @Input() studentId: number;
  @Input() basicInfoData: any;
  @Output() basicInforDataEvent = new EventEmitter<any>();

  @ViewChild('selectPermission') selectPermission: ElementRef;
  @ViewChild('selectProvince') selectProvince: ElementRef;
  @ViewChild('selectDistrict') selectDistrict: ElementRef;
  @ViewChild('selectWard') selectWard: ElementRef;
  @ViewChild('selectGender') selectGender: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;

  form: FormGroup;
  submitted = false;
  imgURL: any;
  public imagePath;
  imgURLUpdate: any;
  public message: string;
  selectedFile: File
  //giới tính
  selectedGender :any;
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
  ward_update = [];
  //Phường xã
  //Quận/ Huyện
  selectedDistrict : any;
  districtSettings = {};
  districtData = [];
  requiredDistrict = true;
  district_update = [];
  district_id: any;
  //Quận/ Huyện
  //Tỉnh/ Thành phố
  province: any;
  selectedProvince:any;
  provinceSettings = {};
  provinceData = [];
  province_update = [];
  requiredProvince = true;
  province_id: any;
  //Tỉnh/ Thành phố
  showFullname: any;
  cutAddressDetail: any;
  constructor(
    private notifyService: NotificationService,
    private fb: FormBuilder,
    private addressService: AddressService,
    private studentUpdateBasic: BasicInformationService,
    private router: Router,
    private safeUrlPipe: SafeUrlPipe,//ham safrUrl
  ) { }
  resetform() {
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
    this.form.get('addressDetail').clearValidators();
    this.form.get('addressDetail').setValue('');
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
    // if(size)
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }
  ngOnInit() {

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
    this.genderData = [
      { id: 0, name: 'Nữ' },
      { id: 1, name: 'Nam' },
      { id: 2, name: 'Khác' },
    ];
   
    //validate
    this.form = this.fb.group({
      code: new FormControl(''),
      fullname: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]),
      dob: new FormControl('', [Validators.required]),
      gender_id: new FormControl('', Validators.required),
      province_id: new FormControl(''),
      district_id: new FormControl(''),
      ward_id: new FormControl(''),
      addressDetail: new FormControl('', [Validators.required,
        Validators.pattern("^[a-zA-Z/aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ\n" +
        "fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu\n" +"0-9\n" +
        "UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ, ' ']+$")
    ]),
    });
    this.form.reset();
    this.getByIdStudent();
  }
  get f() {
    return this.form.controls;
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

  //show dữ liệu lên form
  getByIdStudent() {
    this.form.reset();
    //this.form.patchValue(this.basicInfoData['address']['address1'][0]);
    const address_detail = this.basicInfoData['address']['address1'][0]['address_detail'];
    if (address_detail) {
      var countAddress = address_detail.indexOf("-");
      var spaceAddress = address_detail.substr(0, countAddress );
      var countSpaceAddress = spaceAddress.lastIndexOf(" ");
      this.cutAddressDetail = address_detail.substr(0, countSpaceAddress);
    }
    this.form.patchValue(this.basicInfoData['student']);
    var fullname = this.basicInfoData['student']['lastname'] + " " + this.basicInfoData['student']['firstname'];
    this.showFullname = fullname;
    //show gender
    var genderValue = this.basicInfoData['student']['gender'];
    const arrGender = [];
    this.genderData.forEach(function (item) {
      arrGender.push(item['id']);
    })
    var positionGender = arrGender.indexOf(genderValue);
    
    let x = { id: this.genderData[positionGender]['id'], name: this.genderData[positionGender]['name'] };
    this.selectedGender = x; 
    //show province
    var provinceValue = this.basicInfoData['address']['address1'][0]['province_id'];
    this.studentUpdateBasic.getProvince()
      .subscribe(
        re => {
          const provinceData = re['rows'];
          const selectProvince = [];
          const mapProvince = this.provinceData.map(function (x) { return x.id; }).indexOf(Number(provinceValue));
          if (mapProvince > -1) {
            selectProvince.push({ id: provinceData[mapProvince]['id'], name: provinceData[mapProvince]['name'] });
            this.selectedProvince = {id:selectProvince[0]['id'],name: selectProvince[0]['name']};
          }
     
          this.studentUpdateBasic.getDistrict(provinceValue)
            .subscribe(
              data => {
                const districtData = data['districts'];
                const districtObj = [];
                districtData.forEach(function (item) {
                  districtObj.push({ id: item['id'], name: item['name'] });
                });
                this.districtData = districtObj;
                var districtValue = this.basicInfoData['address']['address1'][0]['district_id'];
                const selectDistrict = [];
                const mapDistrict = districtData.map(function (x) { return x.id; }).indexOf(Number(districtValue));
                if (mapDistrict > -1) {
                  selectDistrict.push({ id: districtData[mapDistrict]['id'], name: districtData[mapDistrict]['name'] });
                  this.selectedDistrict = {id:selectDistrict[0]['id'],name: selectDistrict[0]['name']};
                }

                // lấy id district show ward
                // var district = selectDistrict[0]['id'];
                this.studentUpdateBasic.getWard(districtValue)
                  .subscribe(
                    res => {
                      const wardData = res['wards'];
                      const wardObj = [];
                      wardData.forEach(function (item) {
                        wardObj.push({ id: item['id'], name: item['name'] });
                      });
                      this.wardData = wardObj;
                      var wardValue = this.basicInfoData['address']['address1'][0]['ward_id'];

                      const selectWard = [];
                      const mapWard = wardObj.map(function (x) { return x.id; }).indexOf(Number(wardValue));
                      if (mapWard > -1) {
                        selectWard.push({ id: wardObj[mapWard]['id'], name: wardObj[mapWard]['name'] });
                        this.selectedWard = {id:selectWard[0]['id'],name: selectWard[0]['name']};
                      }
                    }
                  );
              })
        });

    this.studentUpdateBasic.getPictureStudent(this.studentId)
      .subscribe(
        (result) => {
          let url = window.URL.createObjectURL(result);
          this.imgURL = this.safeUrlPipe.transform(url);
        },
        error => {
          this.imgURL = null;
        });

        // });
      }
      
      //lưu lại
    updateStudent() {       
    this.submitted = true;
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
    this.form.get('addressDetail').setValidators([Validators.required,
      Validators.pattern("^[a-zA-Z/aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ\n" +
      "fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu\n" +"0-9\n" +
      "UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ, ' ']+$")
  ]);
    this.form.get('addressDetail').updateValueAndValidity();
    this.submitted = true;
    if (this.form.controls['fullname'].invalid
      || this.form.controls['gender_id'].invalid
      || this.form.controls['dob'].invalid
      || this.form.controls['province_id'].invalid
      || this.form.controls['district_id'].invalid
      || this.form.controls['ward_id'].invalid
      || this.form.controls['addressDetail'].invalid
    ) {
      return;
    }
    if(this.checkCurrentDate === false || this.checkDate === false){
      return;
    }
    
    var uploadData = new FormData();
    var i = 0;
    let tab = '1';
    uploadData.append('tab', tab)
    // if (this.selectedFile) {
    //   uploadData.append('avatar', this.selectedFile);
    // }
    let nameStudent = this.form.controls['fullname'].value;
    let genderId =  this.form.controls['gender_id'].value['id'];
    let dob =  this.form.controls['dob'].value;
    let provinceId =  this.form.controls['province_id'].value['id'];
    let districtId =  this.form.controls['district_id'].value['id'];
    let wardId =  this.form.controls['ward_id'].value['id'];
    let getAddress =  this.form.controls['addressDetail'].value;
    let addressFull = getAddress+' - '+this.form.controls['ward_id'].value['name']
    +' - '+this.form.controls['district_id'].value['name']
    +' - '+this.form.controls['province_id'].value['name'];
    if (this.selectedFile) {
    uploadData.append('avatar', this.selectedFile);
    }
    if (this.province_update && this.province_update.length > 0) {
      uploadData.append('province', this.province_update[0]);
    }
    if (this.district_update && this.district_update.length > 0) {
      uploadData.append('district', this.district_update[0]);
    }
    if (this.ward_update && this.ward_update.length > 0) {
      uploadData.append('ward', this.ward_update[0]);
    }
    if (nameStudent) {
      var fullname = nameStudent.lastIndexOf(" ");
      var fistname = nameStudent.substr(fullname + 1);
      var lastname = nameStudent.substr(0, fullname);
      Name = nameStudent;
    }
    else {
      Name = '';
    }
    if (nameStudent) {
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
    this.studentUpdateBasic.updateStudent(this.studentId, uploadData).subscribe(
      result => {
        const student = this.basicInfoData['student'];
        const protector = this.basicInfoData['protector'];
        const address = this.basicInfoData['address'];
        const data = { 'student': student, 'protector': protector, 'address': address, 'tab': 1 };
        this.basicInforDataEvent.emit(data);
        $('#editStudentModal').modal('hide');
        $('.modal-backdrop').remove();
        this.notifyService.showSuccess('Cập nhật thông tin cơ bản thành công', 'Thông báo');

        // this.resetform();
      }, error => {
        if (error.message['fullname']) {
          this.notifyService.showError(
            "Họ và tên không được để trống", "Thông báo"
          );
         }
        if (error.message['gender']) {
          this.notifyService.showError(
            "Giới không được để trống", "Thông báo"
          );
         }
        if (error.message['dob']) {
          this.notifyService.showError(
            "Ngày sinh không được để trống", "Thông báo"
          );
         }
        if (error.message['ward_id']) {
          this.notifyService.showError(
            "Xã/Phường nơi sinh không được để trống", "Thông báo"
          );
         }
        if (error.message['district_id']) {
          this.notifyService.showError(
            "Quận/Huyện nơi sinh không được để trống", "Thông báo"
          );
         }
        if (error.message['province_id']) {
          this.notifyService.showError(
            "Tỉnh/Tp nơi sinh không được để trống", "Thông báo"
          );
         }
      });
  }

  //lưu và chuyển tab
  nextUpdateStudent() {
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
    this.form.get('addressDetail').setValidators([Validators.required,
      Validators.pattern("^[a-zA-Z/aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ\n" +
      "fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu\n" +"0-9\n" +
      "UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ, ' ']+$")
  ]);
    this.form.get('addressDetail').updateValueAndValidity();
    this.submitted = true;
    if (this.form.controls['fullname'].invalid
      || this.form.controls['gender_id'].invalid
      || this.form.controls['dob'].invalid
      || this.form.controls['province_id'].invalid
      || this.form.controls['district_id'].invalid
      || this.form.controls['ward_id'].invalid
      || this.form.controls['addressDetail'].invalid
    ) {
      return;
    }
    if(this.checkCurrentDate === false || this.checkDate === false){
      return;
    }
   
    var uploadData = new FormData();
    var i = 0;
    let tab = '1';
    uploadData.append('tab', tab);
    // if (this.selectedFile) {
    //   uploadData.append('avatar', this.selectedFile);
    // }
    let nameStudent = this.form.controls['fullname'].value;
    let genderId =  this.form.controls['gender_id'].value['id'];
    let dob =  this.form.controls['dob'].value;
    let provinceId =  this.form.controls['province_id'].value['id'];
    let districtId =  this.form.controls['district_id'].value['id'];
    let wardId =  this.form.controls['ward_id'].value['id'];
    let getAddress =  this.form.controls['addressDetail'].value;
    let addressFull = getAddress+' - '+this.form.controls['ward_id'].value['name']
    +' - '+this.form.controls['district_id'].value['name']
    +' - '+this.form.controls['province_id'].value['name'];
    if (this.selectedFile) {
    uploadData.append('avatar', this.selectedFile);
    }
    if (nameStudent) {
      var fullname = nameStudent.lastIndexOf(' ');
      var fistname = nameStudent.substr(fullname + 1);
      var lastname = nameStudent.substr(0, fullname);
      Name = nameStudent;
    }
    else {
      Name = '';
    }
    if (nameStudent) {
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
    this.studentUpdateBasic.updateStudent(this.studentId, uploadData).subscribe(
      result => {
        const student = this.basicInfoData['student'];
        const protector = this.basicInfoData['protector'];
        const address = this.basicInfoData['address'];
        const data = { 'student': student, 'protector': protector, 'address': address, 'tab': 1 };
        this.basicInforDataEvent.emit(data);
        this.notifyService.showSuccess('Cập nhật thông tin cơ bản thành công', 'Thông báo');
        this.resetform();
      }, error => {
        if (error.message['fullname']) {
          this.notifyService.showError(
            "Họ và tên không được để trống", "Thông báo"
          );
         }
        if (error.message['gender']) {
          this.notifyService.showError(
            "Giới không được để trống", "Thông báo"
          );
         }
        if (error.message['dob']) {
          this.notifyService.showError(
            "Ngày sinh không được để trống", "Thông báo"
          );
         }
        if (error.message['ward_id']) {
          this.notifyService.showError(
            "Xã/Phường nơi sinh không được để trống", "Thông báo"
          );
         }
        if (error.message['district_id']) {
          this.notifyService.showError(
            "Quận/Huyện nơi sinh không được để trống", "Thông báo"
          );
         }
        if (error.message['province_id']) {
          this.notifyService.showError(
            "Tỉnh/Tp nơi sinh không được để trống", "Thông báo"
          );
         }
        //  if (error.message['avatar']) {
        //   this.notifyService.showError(
        //     error.message['avatar'], "Thông báo"
        //   );
        //  }
      });
  }

  updateBasicStudent() {
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
    this.form.get('addressDetail').setValidators([Validators.required,
      Validators.pattern("^[a-zA-Z/aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ\n" +
      "fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu\n" +"0-9\n" +
      "UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ, ' ']+$")
  ]);
    this.form.get('addressDetail').updateValueAndValidity();
    this.submitted = true;
    if (this.form.controls['fullname'].invalid
      || this.form.controls['gender_id'].invalid
      || this.form.controls['dob'].invalid
      || this.form.controls['province_id'].invalid
      || this.form.controls['district_id'].invalid
      || this.form.controls['ward_id'].invalid
      || this.form.controls['addressDetail'].invalid
    ) {
      return;
    }
    if(this.checkCurrentDate === false || this.checkDate === false){
      return;
    }
    var uploadData = new FormData();
    var i = 0;
    let tab = '1';
    uploadData.append('tab', tab);
    // if (this.selectedFile) {
    //   uploadData.append('avatar', this.selectedFile);
    // }
    let nameStudent = this.form.controls['fullname'].value;
    let genderId =  this.form.controls['gender_id'].value['id'];
    let dob =  this.form.controls['dob'].value;
    let provinceId =  this.form.controls['province_id'].value['id'];
    let districtId =  this.form.controls['district_id'].value['id'];
    let wardId =  this.form.controls['ward_id'].value['id'];
    let getAddress =  this.form.controls['addressDetail'].value;
    let addressFull = getAddress+' - '+this.form.controls['ward_id'].value['name']
    +' - '+this.form.controls['district_id'].value['name']
    +' - '+this.form.controls['province_id'].value['name'];
    if (this.selectedFile) {
    uploadData.append('avatar', this.selectedFile);
    }
    if (nameStudent) {
      var fullname = nameStudent.lastIndexOf(' ');
      var fistname = nameStudent.substr(fullname + 1);
      var lastname = nameStudent.substr(0, fullname);
      Name = nameStudent;
    }
    else {
      Name = '';
    }
    if (nameStudent) {
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
    this.studentUpdateBasic.updateStudent(this.studentId, uploadData).subscribe(
      result => {
        // this.notifyService.showSuccess('Cập nhật thành công', 'Thông báo');
        // this.resetform();
      }, error => {
        if (error.message['fullname']) {
          this.notifyService.showError(
            "Họ và tên không được để trống", "Thông báo"
          );
         }
        if (error.message['gender']) {
          this.notifyService.showError(
            "Giới không được để trống", "Thông báo"
          );
         }
        if (error.message['dob']) {
          this.notifyService.showError(
            "Ngày sinh không được để trống", "Thông báo"
          );
         }
        if (error.message['ward_id']) {
          this.notifyService.showError(
            "Xã/Phường nơi sinh không được để trống", "Thông báo"
          );
         }
        if (error.message['district_id']) {
          this.notifyService.showError(
            "Quận/Huyện nơi sinh không được để trống", "Thông báo"
          );
         }
        if (error.message['province_id']) {
          this.notifyService.showError(
            "Tỉnh/Tp nơi sinh không được để trống", "Thông báo"
          );
         }
      }
    );
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
    this.selectedWard = [];
    this.ward = [];
    let districtyId = item;
    if(districtyId === undefined){
      this.wardData = [];
      this.selectedDistrict = [];
      this.selectedWard = [];
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
      this.selectedProvince = [];
      this.selectedDistrict = [];
      this.selectedWard = [];
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
