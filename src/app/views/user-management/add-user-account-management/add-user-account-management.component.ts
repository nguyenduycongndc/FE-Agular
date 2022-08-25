import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { MustMatch } from '../../../_helpers/must-match.validator';
import { UserAccountManagement } from '../../../_models/userAccountManagement';
import { AddressService } from '../../../_services/address.service';
import { NotificationService } from '../../../_services/notification.service';
import { SafeUrlPipe } from '../../../_services/safe-url.pipe.service';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { UserAccountManagementService } from '../service/user-account-management.service';

declare var $: any;

@Component({
  selector: 'app-add-user-account-management',
  templateUrl: './add-user-account-management.component.html',
  styleUrls: ['./add-user-account-management.component.css'],
})
export class AddUserAccountManagementComponent implements OnInit {
  imgURL: any;
  ngAfterViewInit() {

  }
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  userAccountManagement: Observable<UserAccountManagement>;
  separateDialCode = true;

  form: FormGroup;
  selectedFile: File
  submitted = false;

  ddlPermissionData = []; selectedPermission = [];
  ddlUserGroupData = []; selectedUserGroup = [];

  ddlGenderData = []; selectedGender = [];
  ddlProvinceData = []; selectedProvince = [];
  ddlDistrictData = []; selectedDistrict = [];
  ddlWardData = []; selectedWard = [];
  ddlLinkProfileData = []; selectedProfile = [];

  phoneValue: string;
  constructor(
    private fb: FormBuilder,
    private userAccountManagementService: UserAccountManagementService,
    private notifyService: NotificationService,
    private safeUrlPipe: SafeUrlPipe,
    private router: Router,
    private addressService: AddressService
  ) { }

  selectDistrict(item: any) {
    // this.selectWard['selectedItems'] = [];
    this.selectedWard = [];
    this.ddlWardData = [];
    this.addressService.getWard(item['id'])
      .subscribe(
        (data) => {
          const wardData = data['wards'];
          if (wardData.length > 0) {
            this.ddlWardData = wardData;
          }
        });
  }

  selectProvince(item: any) {
    this.selectedDistrict = [];
    this.selectedWard = [];
    this.ddlDistrictData = [];
    this.ddlWardData = [];
    this.addressService.getDistrict(item['id'])
      .subscribe(
        (data) => {
          const districtData = data['districts'];
          if (districtData) {
            this.ddlDistrictData = districtData;
          }
        });
  }

  selectAllGroup(ddlUserGroupData){
    this.selectedUserGroup = ddlUserGroupData;
  }
  deSelectAllGroup(){
    this.selectedUserGroup = [];
  }

  get f() { return this.form.controls; }

  ngOnInit() {
    // Data dropdownlist: Giới tính
    this.ddlGenderData = [
      { id: 0, name: 'Nữ' },
      { id: 1, name: 'Nam' },
      { id: 2, name: 'Khác' },
    ];

    // Validator add user account form
    this.form = this.fb.group({
      // code: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
      // username: new FormControl(''),
      // password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]),
      // confirm_password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]),
      // group_user: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]),
      // email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(100)]),
      // fullname: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]),
      // dob: new FormControl('', [Validators.required]),
      // gender: new FormControl('', [Validators.required]),
      // phone: new FormControl('', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      // province: new FormControl(''),
      // district: new FormControl(''),
      // ward: new FormControl(''),
      // address: new FormControl(''),
      // codeProfile: new FormControl(''),
      // profileData: new FormControl(''),
      // permission: new FormControl(''),
      // profileData: new FormControl(''),
      // profileData: new FormControl(''),
      username: new FormControl(''),
      fullname: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(100),
        Validators.pattern("[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ\n" +
          "fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu\n" +
          "UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ, ' ']*")]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(100)]),
      permission: new FormControl('', Validators.required),
      group: new FormControl(''),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(100),Validators.pattern('^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{6,}$')]),
      confirm_password: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      phone: new FormControl(''),
      province: new FormControl(''),
      district: new FormControl(''),
      ward: new FormControl(''),
      address: new FormControl(''),
      code: new FormControl('', [Validators.minLength(2), Validators.maxLength(50)]),
      codeProfile: new FormControl(''),
      status: new FormControl(''),
      profileData: new FormControl(''),
      profile: new FormControl('')
    }, {
      validator: MustMatch('password', 'confirm_password')
    });
    this.userAccountManagementService.getSystemAccess()
      .subscribe(
        (data) => {
          let permissionData = data['permission'];
          const permissionObj = [];
          permissionData.forEach(function (item) {
            permissionObj.push({ id: item['id'], name: item['name'] });
          });
          this.ddlPermissionData = permissionObj;
          // this.ddlPermissionData = permissionObj;
        });

    this.userAccountManagementService.listNhom()
      .pipe(first())
      .subscribe(
        (data) => {
          const groupData = data['group_user_configuration'];
          const groupObj = [];
          // const groupIdObj = [];
          groupData.forEach(function (item) {
            groupObj.push({ id: item['id'], name: item['code'] + '-' + item['name'] });
          });
          // this.groupData.forEach(function (item) {
          //   groupIdObj.push({ id: item['id'], name: item['code'] + '-' + item['name'] });
          // });
          // this.ddlGroupFilterData = groupObj;
          this.ddlUserGroupData = groupObj;
          // this.ddlGroupUpdate = groupObj;
          // this.ddlObjectInsert = groupObj;
        });
    this.addressService.getProvince()
      .subscribe(
        (proData) => {
          const provinceObj = [];
          proData['provinces'].forEach(function (item) {
            provinceObj.push({ id: item['id'], name: item['name'] });
          });
          this.ddlProvinceData = provinceObj;
        });
    this.userAccountManagementService.getListUsers()
      .subscribe(
        (data) => {
          let profileData = data['object'];
          const profileObj = [];
          profileData.forEach(function (item) {
            profileObj.push({ id: item['code'], name: item['code'] + ' - ' + item['fullname'] });
          });
          this.ddlLinkProfileData = profileObj;
        });
  }
  onSelectLinkProfile(item: any) {
    this.form.controls['codeProfile'].setValue(item['id']);
  }
  onDeSelectLinkProfile() {
    this.resetUserAccountForm();
    this.form.value.code = [];
  }
  preview(files) {
    if (files.length === 0) {
      return;
    }
    this.selectedFile = files[0];
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.notifyService.showError('Chỉ hỗ trợ định dạng file ảnh', 'Thông báo lỗi');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }
  valueCheck: any;
  valueBoolen: any;
  valueDate: any;
  checkDate = true;
  changeDate($event) {
    this.valueCheck = $event.target.validationMessage;
    this.valueBoolen = $event.target.validity.valid;
    this.valueDate = $event.target.value;
    var myDate = /^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/;
    if (this.valueCheck === '' && this.valueBoolen === true && this.valueDate !== '') {
      this.checkDate = myDate.test(this.valueDate);
    }
  }

  multiAdd() {
    let phoneNumber;
    this.form.get('code').setValidators([Validators.minLength(2), Validators.maxLength(50)]);
    this.form.get('code').updateValueAndValidity();
    this.form.get('email').setValidators([Validators.required, Validators.email, Validators.maxLength(100)]);
    this.form.get('email').updateValueAndValidity();
    this.form.get('fullname').setValidators([Validators.required, Validators.pattern("[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ\n" +
      "fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu\n" +
      "UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ, ' ']*")]);
    this.form.get('fullname').updateValueAndValidity();
    this.form.get('dob').setValidators([Validators.required]);
    this.form.get('dob').updateValueAndValidity();
    this.form.get('password').setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(100),Validators.pattern('^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{6,}$')]);
    this.form.get('password').updateValueAndValidity();
    this.form.get('confirm_password').setValidators([Validators.required]);
    this.form.get('confirm_password').updateValueAndValidity();
    this.form.get('permission').setValidators([Validators.required]);
    this.form.get('permission').updateValueAndValidity();
    this.form.get('gender').setValidators([Validators.required]);
    this.form.get('gender').updateValueAndValidity();
    this.submitted = true;
    if (this.form.controls['phone'].value) {
      this.phoneValue = this.form.controls['phone'].value['internationalNumber'];
    }

    if(this.form.invalid){
      return;
    }

    if (this.checkDate === false) {
      return;
    }

    if (this.form.value.phone) {
      var tel = this.phoneValue.indexOf(" ");
      var extenTel = this.phoneValue.substr(tel + 1);
      var head = "(" + this.phoneValue.substr(0, tel) + ")";
      var full = head + extenTel;
      phoneNumber = this.phoneValue;
    } else {
      phoneNumber = '';
    }

    let addressDetail = '';
    if (this.selectedWard) {
        addressDetail += this.selectedWard['name'];
    }
    if (this.selectedDistrict) {
      addressDetail += ' - ' + this.selectedDistrict['name'];
    }
    if (this.selectedProvince) {
      addressDetail += ' - ' + this.selectedDistrict['name'];
    }

    var uploadData = new FormData();
    var i = 0;

    if (this.selectedFile) {
      uploadData.append('picture', this.selectedFile);
    }
    if (this.form.value.code) {
      uploadData.append('code', this.form.value.code);
    }
    // if (this.form.value.code) {
    // uploadData.append('user_id', this.code.value);
    // }
    if (this.form.value.username) {
    uploadData.append('username', this.form.value.username);
    }
    if (this.form.value.permission) {
    uploadData.append('permission_id', this.form.value.permission.id);
    }
    if (this.form.value.group) {
      this.form.value.group.forEach(function (item) {
        uploadData.append('group_user_configuration_id' + '[' + i + ']', item['id']);
        i++;
      });
    }
    if (this.form.value.password) {
      uploadData.append('password', this.form.value.password);
    }
    if (this.form.value.email) {
      uploadData.append('email', this.form.value.email);
    }
    if (this.form.value.fullname) {
      uploadData.append('fullname', this.form.value.fullname);
    }
    if (this.form.value.dob) {
      uploadData.append('dob', this.form.value.dob);
    }
    if (this.form.value.gender) {
      uploadData.append('gender', this.form.value.gender.id);
    }
    if (phoneNumber != '') {
      uploadData.append('phone', phoneNumber);
    }
    if (this.form.value.address) {
      uploadData.append('address', this.form.value.address + ' - ' + addressDetail);
    }
    if (this.form.value.province) {
      uploadData.append('province', this.form.value.province.id);
    }
    if (this.form.value.district) {
      uploadData.append('district', this.form.value.district.id);
    }
    if (this.form.value.ward) {
      uploadData.append('ward', this.form.value.ward.id);
    }

    // var formData = new FormData();
    // formData.append('import_excel', this.fileInput.nativeElement.files[0]);
    this.userAccountManagementService.insertUserAccount(uploadData).subscribe(
      result => {
        this.selectedProfile = [];
        this.resetUserAccountForm();
        this.notifyService.showSuccess(result.message, 'Thông báo');
        this.userAccountManagementService.getListUsers()
          .subscribe(
            (data) => {
              let profileData = data['object'];
              const profileObj = [];
              profileData.forEach(function (item) {
                profileObj.push({ id: item['code'], name: item['code'] + ' - ' + item['fullname'] });
              });
              this.ddlLinkProfileData = profileObj;
            });

        // this.ngOnDestroy();
      },
      error => {
        // this.onSelectPermission = [];
        // this.multiSelectGroupInsert = [];
        // this.onGenderInsert = [];
        this.selectedProfile= [];
        if (error.message['email']) {
          this.notifyService.showError(error.message['email'], 'Thông báo lỗi');
        } else if (error.message['user']) {
          this.notifyService.showError(error.message['user'], 'Thông báo lỗi');
        } else if (error.message['group_user_configuration_id']) {
          this.notifyService.showError(error.message['group_user_configuration_id'], 'Thông báo lỗi');
        } else if (error.message['teacher']) {
          this.notifyService.showError(error.message['teacher'], 'Thông báo lỗi');
        } else if (error.message['student']) {
          this.notifyService.showError(error.message['student'], 'Thông báo lỗi');
        } else if (error.message['parent']) {
          this.notifyService.showError(error.message['parent'], 'Thông báo lỗi');
        } else if (error.message['password']) {
          this.notifyService.showError(error.message['password'], 'Thông báo lỗi');
        } else if (error.message['picture']) {
          this.notifyService.showError(error.message['picture'], 'Thông báo lỗi');
        } else if (error.message['permission_id']) {
          this.notifyService.showError(error.message['permission_id'], 'Thông báo lỗi');
        } else if (error.message['fullname']) {
          this.notifyService.showError(error.message['fullname'], 'Thông báo lỗi');
        } else if (error.message['user_id']) {
          this.notifyService.showError(error.message['user_id'], 'Thông báo lỗi');
        } else if (error.message['dob']) {
          this.notifyService.showError(error.message['dob'], 'Thông báo lỗi');
        } else if (error.message['phone']) {
          this.notifyService.showError(error.message['phone'], 'Thông báo lỗi');
        } else if (error.message['gender']) {
          this.notifyService.showError(error.message['gender'], 'Thông báo lỗi');
        } else if (error.message['province']) {
          this.notifyService.showError(error.message['province'], 'Thông báo lỗi');
        } else if (error.message['district']) {
          this.notifyService.showError(error.message['district'], 'Thông báo lỗi');
        } else if (error.message['ward']) {
          this.notifyService.showError(error.message['ward'], 'Thông báo lỗi');
        } else {
          Object.keys(error.message).forEach(function (key) {
            this.notifyService.showError(error.message[key], 'Thông báo lỗi');
          });
        }
      });
  }

  singleAdd() {
    let phoneNumber;
    this.form.get('code').setValidators([Validators.minLength(2), Validators.maxLength(50)]);
    this.form.get('code').updateValueAndValidity();
    this.form.get('email').setValidators([Validators.required, Validators.email, Validators.maxLength(100)]);
    this.form.get('email').updateValueAndValidity();
    this.form.get('fullname').setValidators([Validators.required, Validators.pattern("[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ\n" +
      "fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu\n" +
      "UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ, ' ']*")]);
    this.form.get('fullname').updateValueAndValidity();
    this.form.get('dob').setValidators([Validators.required]);
    this.form.get('dob').updateValueAndValidity();
    this.form.get('password').setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(100),Validators.pattern('^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{6,}$')]);
    this.form.get('password').updateValueAndValidity();
    this.form.get('confirm_password').setValidators([Validators.required]);
    this.form.get('confirm_password').updateValueAndValidity();
    this.form.get('permission').setValidators([Validators.required]);
    this.form.get('permission').updateValueAndValidity();
    this.form.get('gender').setValidators([Validators.required]);
    this.form.get('gender').updateValueAndValidity();
    this.submitted = true;
    if (this.form.controls['phone'].value) {
      this.phoneValue = this.form.controls['phone'].value['internationalNumber'];
    }

    if(this.form.invalid){
      return;
    }

    // if (this.form.controls['email'].invalid || this.form.controls['dob'].invalid || this.form.controls['code'].invalid
    //   || this.form.controls['password'].invalid || this.form.controls['confirm_password'].invalid) {
    //   if (this.onSelectPermission.length <= 0) {
    //     this.requiredPermissionInsert = false;
    //   }

    //   if (this.onGenderInsert.length <= 0) {
    //     this.requiredGenderInsert = false;
    //   }
    //   if (this.requiredPermissionInsert === false || this.requiredGenderInsert === false) {
    //     return;
    //   }
    // } else {
    //   if (this.onSelectPermission.length <= 0) {
    //     this.requiredPermissionInsert = false;
    //   }

    //   if (this.onGenderInsert.length <= 0) {
    //     this.requiredGenderInsert = false;
    //   }
    //   if (this.requiredPermissionInsert == false || this.requiredGenderInsert == false || this.form.controls['email'].invalid
    //     || this.form.controls['dob'].invalid || this.form.controls['password'].invalid || this.form.controls['confirm_password'].invalid
    //     || this.form.controls['fullname'].invalid) {
    //     return;
    //   }
    // }

    if (this.checkDate === false) {
      return;
    }
    // if (this.f.password.value !== this.f.confirm_password.value) {
    //   this.notifyService.showError('Mật khẩu không trùng khớp. Vui lòng kiểm tra lại!', 'Lỗi!');
    //   return;
    // }
    // const group = [];
    // if (this.multiSelectGroupInsert.length !== 0 && this.multiSelectGroupInsert[0]['groups'] === undefined) {
    //   this.group_id = this.multiSelectGroupInsert;
    //   this.multiSelectGroupInsert[0]['groups'].forEach(function (item) {
    //     group.push(item);
    //   });
    //   this.group_id = group;
    // } else {
    //   this.selectedGroupInsert.forEach(function (item) {
    //     group.push(item['item_id']);
    //   });
    //   this.group_id = group;
    // }
    // if (this.onSelectPermission) {
    //   this.permission_id = this.onSelectPermission[0];
    // } else {
    //   this.permission_id = [];
    // }

    // if (this.onGenderInsert) {
    //   this.gender_id = this.onGenderInsert[0];
    // } else {
    //   this.gender_id = [];
    // }

    if (this.form.value.phone) {
      var tel = this.phoneValue.indexOf(" ");
      var extenTel = this.phoneValue.substr(tel + 1);
      var head = "(" + this.phoneValue.substr(0, tel) + ")";
      var full = head + extenTel;
      phoneNumber = this.phoneValue;
    } else {
      phoneNumber = '';
    }

    let addressDetail = '';
    if (this.selectedWard) {
      // var mapWard = this.ddlWard.map(function (x) { return x.item_id; }).indexOf(this.ward_update[0]);
      // if (mapWard > -1) {
        addressDetail += this.selectedWard['name'];
      // }
    }
    if (this.selectedDistrict) {
      // var mapDistrict = this.ddlDistrict.map(function (x) { return x.item_id; }).indexOf(this.district_update[0]);
      // if (mapDistrict > -1) {
      //   addressDetail += ' - ' + this.ddlDistrict[mapDistrict]['item_text'];
      // }
      addressDetail += ' - ' + this.selectedDistrict['name'];
    }
    if (this.selectedProvince) {
      // var mapProvince = this.ddlProvince.map(function (x) { return x.item_id; }).indexOf(this.province_update[0]);
      // if (mapProvince > -1) {
      //   addressDetail += ' - ' + this.ddlProvince[mapProvince]['item_text'];
      // }
      addressDetail += ' - ' + this.selectedDistrict['name'];
    }

    var uploadData = new FormData();
    var i = 0;

    if (this.selectedFile) {
      uploadData.append('picture', this.selectedFile);
    }
    if (this.form.value.code) {
      uploadData.append('code', this.form.value.code);
    }
    // if (this.form.value.code) {
    // uploadData.append('user_id', this.code.value);
    // }
    if (this.form.value.username) {
    uploadData.append('username', this.form.value.username);
    }
    if (this.form.value.permission) {
    uploadData.append('permission_id', this.form.value.permission.id);
    }
    if (this.form.value.group) {
      this.form.value.group.forEach(function (item) {
        uploadData.append('group_user_configuration_id' + '[' + i + ']', item['id']);
        i++;
      });
    }
    if (this.form.value.password) {
      uploadData.append('password', this.form.value.password);
    }
    if (this.form.value.email) {
      uploadData.append('email', this.form.value.email);
    }
    if (this.form.value.fullname) {
      uploadData.append('fullname', this.form.value.fullname);
    }
    if (this.form.value.dob) {
      uploadData.append('dob', this.form.value.dob);
    }
    if (this.form.value.gender) {
      uploadData.append('gender', this.form.value.gender.id);
    }
    if (phoneNumber != '') {
      uploadData.append('phone', phoneNumber);
    }
    if (this.form.value.address) {
      uploadData.append('address', this.form.value.address + ' - ' + addressDetail);
    }
    if (this.form.value.province) {
      uploadData.append('province', this.form.value.province.id);
    }
    if (this.form.value.district) {
      uploadData.append('district', this.form.value.district.id);
    }
    if (this.form.value.ward) {
      uploadData.append('ward', this.form.value.ward.id);
    }

    this.userAccountManagementService.insertUserAccount(uploadData).subscribe(
      result => {
        this.selectedProfile = [];
        $('#addUserAccountModal').modal('hide');
        $('.modal-backdrop').remove();
        this.notifyService.showSuccess(result.message, 'Thông báo');
        this.userAccountManagementService.getListUsers()
          .subscribe(
            (data) => {
              let profileData = data['object'];
              const profileObj = [];
              profileData.forEach(function (item) {
                profileObj.push({ 'item_id': item['code'], 'item_text': item['code'] + ' - ' + item['fullname'] });
              });
              this.ddlLinkProfileData = profileObj;
            });

      },
      error => {

        this.selectedProfile = [];
        if (error.message['email']) {
          this.notifyService.showError(error.message['email'], 'Thông báo lỗi');
        } else if (error.message['user']) {
          this.notifyService.showError(error.message['user'], 'Thông báo lỗi');
        } else if (error.message['group_user_configuration_id']) {
          this.notifyService.showError(error.message['group_user_configuration_id'], 'Thông báo lỗi');
        } else if (error.message['teacher']) {
          this.notifyService.showError(error.message['teacher'], 'Thông báo lỗi');
        } else if (error.message['student']) {
          this.notifyService.showError(error.message['student'], 'Thông báo lỗi');
        } else if (error.message['parent']) {
          this.notifyService.showError(error.message['parent'], 'Thông báo lỗi');
        } else if (error.message['password']) {
          this.notifyService.showError(error.message['password'], 'Thông báo lỗi');
        } else if (error.message['picture']) {
          this.notifyService.showError(error.message['picture'], 'Thông báo lỗi');
        } else if (error.message['permission_id']) {
          this.notifyService.showError(error.message['permission_id'], 'Thông báo lỗi');
        } else if (error.message['fullname']) {
          this.notifyService.showError(error.message['fullname'], 'Thông báo lỗi');
        } else if (error.message['user_id']) {
          this.notifyService.showError(error.message['user_id'], 'Thông báo lỗi');
        } else if (error.message['dob']) {
          this.notifyService.showError(error.message['dob'], 'Thông báo lỗi');
        } else if (error.message['phone']) {
          this.notifyService.showError(error.message['phone'], 'Thông báo lỗi');
        } else if (error.message['gender']) {
          this.notifyService.showError(error.message['gender'], 'Thông báo lỗi');
        } else if (error.message['province']) {
          this.notifyService.showError(error.message['province'], 'Thông báo lỗi');
        } else if (error.message['district']) {
          this.notifyService.showError(error.message['district'], 'Thông báo lỗi');
        } else if (error.message['ward']) {
          this.notifyService.showError(error.message['ward'], 'Thông báo lỗi');
        } else {
          Object.keys(error.message).forEach(function (key) {
            this.notifyService.showError(error.message[key], 'Thông báo lỗi');
          });
        }
      });
  }
  // Reset form
  resetUserAccountForm() {
    // this.form.get('username').clearValidators();
    this.form.get('email').clearValidators();
    this.form.get('password').clearValidators();
    this.form.get('confirm_password').clearValidators();
    this.form.get('fullname').clearValidators();
    this.form.get('dob').clearValidators();
    this.form.get('username').clearValidators();
    this.form.get('code').clearValidators();
    this.form.get('permission').clearValidators();
    this.form.get('gender').clearValidators();

    this.form.get('email').setValue('');
    this.form.get('password').setValue('');
    this.form.get('confirm_password').setValue('');
    this.form.get('fullname').setValue('');
    this.form.get('dob').setValue('');
    this.form.get('code').setValue('');
    this.form.get('phone').setValue('');
    this.form.get('permission').setValue('');
    this.form.get('gender').setValue('');
    this.selectedUserGroup = [];
    this.selectedGender = [];
    this.selectedPermission = [];
    this.imgURL = null;
    this.selectedProvince = [];
    this.selectedDistrict = [];
    this.selectedWard = [];
  }
  resetLinkProfileForm() {
    this.selectedProfile = [];
    this.form.value.code = '';
    this.form.value.codeProfile = '';
  }
  address_detail: any;
  linkProfile() {
    if (this.form.value.profileData === true) {
      this.userAccountManagementService.getInfoProfile(this.form.value.codeProfile)
        .subscribe(
          (data) => {
            // this.resetUserAccountForm();
            let parrentExist;
            this.form.value.code = this.form.value.codeProfile;
            this.selectedProvince = [];
            this.selectedDistrict = [];
            this.selectedWard = [];
            const provinceData = [];
            const genderData = [];

            if (data['object'][0]['code']) {
              this.form.patchValue(data['object'][0]);
              parrentExist = data['object'][0]['code'].substring(0, 2);
              if (parrentExist === 'PH') {
                this.form.patchValue(data['object'][0]);
              } else {
                const provice = data['object'][0]['province_id'];
                const district = data['object'][0]['district_id'];
                const ward = data['object'][0]['ward_id'];
                const gender = data['object'][0]['gender'];
                // if (provice) {
                //   this.district_update = [];

                //   this.addressService.getDistrict(provice)
                //     .subscribe(
                //       (resProvince) => {
                //         let districtData = resProvince['districts'];
                //         const districtObj = [];
                //         districtData.forEach(function (item) {
                //           districtObj.push({ 'item_id': item['id'], 'item_text': item['name'] });
                //         });
                //         this.ddlDistrict = districtObj;
                //         var mapDistrict = districtData.map(function (x) { return x.id; }).indexOf(district);
                //         if (mapDistrict > -1) {
                //           selectedDistrictUpdate.push({ 'item_id': districtData[mapDistrict]['id'], 'item_text': districtData[mapDistrict]['name'] });
                //           this.district_update.push(districtData[mapDistrict]['id']);
                //         }
                //         this.selectedDistrict = selectedDistrictUpdate;
                //       });
                // }
                // if (district) {
                //   this.ward_update = [];

                //   this.addressService.getWard(district)
                //     .subscribe(
                //       (resDistrict) => {
                //         let wardData = resDistrict['wards'];
                //         const wardObj = [];
                //         wardData.forEach(function (item) {
                //           wardObj.push({ 'item_id': item['id'], 'item_text': item['name'] });
                //         });
                //         this.ddlWard = wardObj;
                //         var mapWard = wardData.map(function (x) { return x.id; }).indexOf(ward);
                //         if (mapWard > -1) {
                //           selectedWardUpdate.push({ 'item_id': wardData[mapWard]['id'], 'item_text': wardData[mapWard]['name'] });
                //           this.ward_update.push(wardData[mapWard]['id']);
                //         }
                //         this.selectedWard = selectedWardUpdate;
                //       });
                // }
                // let gender = data['object'][0]['gender'];
                // if (gender >= 0) {
                //   var mapGender = this.ddlGender.map(function (x) { return x.item_id; }).indexOf(gender);
                //   selectedGenderInsert.push({ 'item_id': this.ddlGender[mapGender]['item_id'], 'item_text': this.ddlGender[mapGender]['item_text'] });
                //   this.selectedGenderUpdate = selectedGenderInsert;
                //   this.onGenderUpdate.push(gender);
                // }
                // if (provice) {
                //   this.province_update = [];

                //   var mapProvince = this.ddlProvince.map(function (x) { return x.item_id; }).indexOf(provice);
                //   if (mapProvince > -1) {
                //     selectedProvinceUpdate.push({ 'item_id': this.ddlProvince[mapProvince]['item_id'], 'item_text': this.ddlProvince[mapProvince]['item_text'] });
                //     this.province_update.push(this.ddlProvince[mapProvince]['item_id']);
                //   }

                //   this.selectedProvince = selectedProvinceUpdate;
                // }

                if (gender >= 0) {
                  var mapGender = this.ddlGenderData.map(function (x) { return x.id; }).indexOf(gender);
                  if(mapGender > -1){
                    genderData.push({ id: this.ddlGenderData[mapGender]['id'], name: this.ddlGenderData[mapGender]['name'] });
                    this.selectedGender = genderData[0];
                  }

                }

                if (provice) {
                  var mapProvince = this.ddlProvinceData.map(function (x) { return x.id; }).indexOf(provice);
                  if (mapProvince > -1) {
                    provinceData.push({ id: this.ddlProvinceData[mapProvince]['id'], name: this.ddlProvinceData[mapProvince]['name'] });
                  }
                  this.selectedProvince = provinceData[0];
                  this.addressService.getDistrict(provice)
                    .subscribe(
                      (data) => {
                        const districtData = data['districts'];
                        const districtObj = [];
                        if(districtData.length > 0){
                          this.ddlDistrictData = districtData;
                          var mapDistrict = districtData.map(function (x) { return x.id; }).indexOf(district);
                          if (mapDistrict > -1) {
                            districtObj.push({ id: districtData[mapDistrict]['id'], name: districtData[mapDistrict]['name'] });
                          }
                          this.selectedDistrict = districtObj[0];
                        }});
                }
                if (district) {
                  this.addressService.getWard(district)
                    .subscribe(
                      (data) => {
                        let wardData = data['wards'];
                        const wardObj = [];
                        // wardData.forEach(function (item) {
                        //   wardObj.push({ id: item['id'], name: item['name'] });
                        // });
                        this.ddlWardData = wardObj;
                        var mapWard = wardData.map(function (x) { return x.id; }).indexOf(ward);
                        if (mapWard > -1) {
                          wardObj.push({ id: wardData[mapWard]['id'], name: wardData[mapWard]['name'] });
                        }
                        this.selectedWard = wardObj[0];
                      });
                }
                let address = data['object'][0]['detail_address'].substring(0, data['object'][0]['detail_address'].indexOf('-'));
                this.address_detail = address;

              }
            }
            $('#linkProfile').modal('hide');
            $('.modal-backdrop').remove();
          });
    } else {
      this.form.value.code = this.form.value.codeProfile;
      $('#linkProfile').modal('hide');
      $('.modal-backdrop').remove();
    }
  }
  showModalUnlinkProfile() {
    $('#confirmUnlinkProfileModal').modal('show');
  }
  unLinkProfile() {
    this.form.value.code = '';
    $('#confirmUnlinkProfileModal').modal('hide');
    $('.modal-backdrop').remove();
  }
  // Refresh
  ngOnDestroy() {
    this.ngOnInit();
  }
  goBack() {
    this.router.navigate(['/user-management/user-account-management']);
  }
  //setting Phone
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Vietnam, CountryISO.UnitedStates];

}
