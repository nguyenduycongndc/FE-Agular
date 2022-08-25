import { semesterConfiguration } from './../../../_models/semester-configuration';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { MustMatch } from '../../../_helpers/must-match.validator';
import { UserAccountManagement } from '../../../_models/userAccountManagement';
import { NotificationService } from '../../../_services/notification.service';
import { SafeUrlPipe } from '../../../_services/safe-url.pipe.service';
import { FlagsComponent } from '../../icons/flags.component';
import { TooltipLabel, CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { UserAccountManagementService } from '../service/user-account-management.service';
import { ActivatedRoute } from '@angular/router';
import { AddressService } from '../../../_services/address.service';


declare var $: any;
@Component({
  selector: 'app-user-account-management',
  templateUrl: './user-account-management.component.html',
  styleUrls: ['./user-account-management.component.css']
})
export class UserAccountManagementComponent implements OnInit {
  public imagePath;
  imgURL: any; imgURLUpdate: any;
  public message: string;
  id: number;
  private sub: any;

  ngAfterViewInit() {

  }
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  userAccountManagement: Observable<UserAccountManagement>;

  ddlPermissionFilterData = []; selectedPermissionFilter = [];
  ddlGroupFilterData = []; selectedGroupFilter = [];

  ddlPermissionData = []; selectedPermission = [];
  ddlGroupData = []; selectedGroup = [];
  ddlGender = []; selectedGender = [];
  ddlLinkProfileData = []; selectedProfile = [];


  ddlProvinceInsert = []; selectedProvinceInsert = [];
  ddlDistrictInsert = []; selectedDistrictInsert = [];
  ddlWardInsert = []; selectedWardInsert = [];

  ddlProvinceUpdate = []; selectedProvinceUpdate = [];
  ddlDistrictUpdate = []; selectedDistrictUpdate = [];
  ddlWardUpdate = []; selectedWardUpdate = [];

  form: FormGroup;
  selectedFile: File;
  marked = false;
  ddlObject: any = [];

  onLinkProfileInsert: any; selectedLinkProfileInsert: any;
  onLinkProfileUpdate: any;

  onGenderUpdate = []; selectedGenderUpdate = []; gender_update = [];
  ward_update = []; ddlWard = []; selectedWard = []; ddlWardSettings = {};
  district_update = []; ddlDistrict = []; selectedDistrict = []; ddlDistrictSettings = {};
  province_update = []; ddlProvince = []; selectedProvince = []; ddlProvinceSettings = {};

  onSelectObject = [];
  onGroupSelectObject = [];
  checkUserConfigData = true;

  checkUserAccountData = true;
  headerUserAccount = false;

  p: number = 1;
  countPage: number = 10;
  totalItems = 0;

  submitted = false;
  userAccountData: any;
  userAccountGetById: any; // GetById cấu hình người sử dụng fill lên form update

  group = [];
  permission_id: any;
  gender_id: any;

  province_id: any;
  district_id: any;
  ward_id: any;
  selectedProvinceOption: number;
  selectedProfileInsert = [];
  selectedProfileUpdate = [];
  // checkLinkProfile: true;
  statusActive: number;
  idActive: number;
  phoneValue: string;
  separateDialCode = true;


  public show: boolean = false;
  public buttonName: any = 'Show';
  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private userAccountManagementService: UserAccountManagementService,
    private notifyService: NotificationService,
    private safeUrlPipe: SafeUrlPipe,
    private route: ActivatedRoute
  ) { }

  perPageSelected(id: number) {
    this.countPage = id;
  }
  get f() { return this.form.controls; }

  ngOnInit() {
    this.ddlObject = [
      { item_id: 1, item_text: 'Giáo viên' },
      { item_id: 2, item_text: 'Học sinh' },
      { item_id: 3, item_text: 'Phụ huynh' },
    ];
    this.ddlGender = [
      { id: 0, name: 'Nữ' },
      { id: 1, name: 'Nam' },
      { id: 2, name: 'Khác' },
    ];
    // Validate form
    this.form = this.fb.group({
      objectSearch: new FormControl(''),
      groupSearch: new FormControl(''),
      statusFilter: new FormControl(true),
      username: new FormControl(''),
      fullname: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(100),
      Validators.pattern("[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ\n" +
        "fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu\n" +
        "UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ, ' ']*")]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(100)]),
      permission: new FormControl('', Validators.required),
      group: new FormControl(''),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(100),Validators.pattern('^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{6,}$')]),
      confirm_password: new FormControl('', Validators.required),
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
          this.ddlPermissionFilterData = permissionObj;
          this.ddlPermissionData = permissionObj;
        });

    this.userAccountManagementService.listNhom()
      .pipe(first())
      .subscribe(
        (data) => {
          const groupData = data['group_user_configuration'];
          const groupCodeObj = [];
          const groupIdObj = [];
          groupData.forEach(function (item) {
            groupCodeObj.push({ id: item['code'], name: item['code'] + '-' + item['name'] });
          });
          groupData.forEach(function (item) {
            groupIdObj.push({ id: item['id'], name: item['code'] + '-' + item['name'] });
          });
          this.ddlGroupFilterData = groupCodeObj;
          this.ddlGroupData = groupIdObj;
        });
    this.addressService.getProvince()
      .subscribe(
        (proData) => {
          const provinceObj = [];
          proData['provinces'].forEach(function (item) {
            provinceObj.push({ id: item['id'], name: item['name'] });
          });
          this.ddlProvince = provinceObj;
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

    function getUrlParam(name) {
      const results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
      return (results && results[1]) || undefined;
    }
    const userId = getUrlParam('id');
    if (userId > '') {
      this.route.queryParams.subscribe(data => {
        if (data) {
          const userId = data['id'];
          const id = parseInt(userId, 10);
          if (!isNaN(id)) {
            this.getByIdUserAccount(userId)
            $('#editUserAccountModal').modal('show');
          }
        }
      });
    }
  }

  selectAllPermissionFilter(objectSearchData) {
    this.selectedPermissionFilter = objectSearchData;
  }
  deSelectAllPermissionFilter() {
    this.selectedPermissionFilter = [];
  }
  selectAllGroupFilter(groupSearchData) {
    this.selectedGroupFilter = groupSearchData;
  }
  deSelectAllGroupFilter() {
    this.selectedGroupFilter = [];
  }
  selectAllGroup(groupData) {
    this.selectedGroup = groupData;
  }
  deSelectAllGroup() {
    this.selectedGroup = [];
  }
  selectProvince(item: any) {
    this.selectedDistrict = [];
    this.selectedWard = [];
    this.ddlDistrict = [];
    this.ddlWard = [];
    const province = [];
    province.push(item['id']);
    this.province_update = province;
    this.addressService.getDistrict(item['id'])
      .subscribe(
        (data) => {
          const districtData = data['districts'];
          const districtObj = [];
          districtData.forEach(function (item) {
            districtObj.push({ id: item['id'], name: item['name'] });
          });
          this.ddlDistrict = districtObj;
        });
  }
  selectDistrict(item: any) {
    this.selectedWard = [];
    this.ddlWard = [];
    const district = [];
    district.push(item['id']);
    this.district_update = district;
    this.addressService.getWard(item['id'])
      .subscribe(
        (data) => {
          const wardData = data['wards'];
          const wardObj = [];
          wardData.forEach(function (item) {
            wardObj.push({ id: item['id'], name: item['name'] });
          });
          this.ddlWard = wardObj;
        });
  }

  onSelectLinkProfile(item: any) {
    this.form.value.codeProfile = item['id'];
    this.form.patchValue(this.form.value.codeProfile.value);
  }

  toggle(e) {
    this.show = !this.show;
    if (this.show) {
      this.buttonName = "Hide";
      this.form.get('password').clearValidators();
      this.form.get('confirm_password').clearValidators();
      this.form.get('password').setValue('');
      this.form.get('confirm_password').setValue('');
    } else {
      this.buttonName = "Show";
    }
  }

  preview(files) {
    if (files.length === 0)
      return;
    this.selectedFile = files[0];
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;

    }
  }
  previewUpdate(files) {
    if (files.length === 0)
      return;
    this.selectedFile = files[0];
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURLUpdate = reader.result;

    }
  }

  searchByKeyWord(search: any) {
    let selectObject = this.onSelectObject;
    let groupSelectObject = this.onGroupSelectObject;
    let groups;
    let objects;
    if (selectObject.length > 0) {
      objects = selectObject[0]['permission'];
    } else {
      objects = null;
    }
    if (groupSelectObject.length > 0) {
      groups = groupSelectObject[0]['groups'];
    } else {
      groups = [];
    }
    let status;
    if (this.form.value.statusFilter) {
      status = 'active';
    } else {
      status = 'inactive';
    }

    if (search.trim() === '') {
      this.notifyService.showError('Vui lòng điền từ khóa tìm kiếm!', 'Thông báo lỗi');
      this.checkUserAccountData = false;
      this.headerUserAccount = true;
      this.userAccountData = [];
      this.p = 1;
      this.totalItems = 1;
    } else {
      this.userAccountManagementService.searchByKeyWord(search)
        .subscribe(
          result => {
            this.headerUserAccount = true;
            if (result['count'] === 0) {
              this.totalItems = 1;
              this.p = 1;
              this.userAccountData = [];
              this.checkUserAccountData = false;
              this.userAccountData = result['users'];
              this.totalItems = result['count'];
            } else {
              this.totalItems = 1;
              this.p = 1;
              this.userAccountData = [];
              this.checkUserAccountData = true;
              this.userAccountData = result['users'];
              this.totalItems = result['count'];
            }
            this.ngOnDestroy();
          },
          error => {
            this.notifyService.showError(error, 'Thông báo lỗi');
            this.ngOnDestroy();
          });
    }
  }

  searchByInput() {
    const arrDataObject = this.form.controls['objectSearch'].value;
    const arrDataGroup = this.form.controls['groupSearch'].value;

    const formData = new FormData();
    let i = 0;
    if (arrDataObject.length > 0) {
      arrDataObject.forEach(function (item) {
        formData.append('permission_id' + '[' + i + ']', item['id']);
        i++;
      })
      i = 0;
    }
    if (arrDataGroup.length > 0) {
      arrDataGroup.forEach(function (item) {
        formData.append('groups' + '[' + i + ']', item['name']);
        i++;
      })
      i = 0;
    }
    let status;
    if (this.form.value.statusFilter) {
      formData.append('status','active');
    } else {
      formData.append('status','inactive');
    }
    this.userAccountManagementService.searchByInput(formData)
      .subscribe(
        result => {
          if (result['count'] === 0) {
            this.checkUserAccountData = false; //dữ liệu không tồn tại
            this.headerUserAccount = true;
            this.userAccountData = [];
            this.p = 1;
            this.totalItems = 1;
          } else {

            this.p = 1;
            this.checkUserAccountData = true; //dữ liệu tồn tại
            this.headerUserAccount = true;
            this.userAccountData = result['users'];
            this.totalItems = result['count'];
            const arrData = [];
            let valueName;
            let lastSpace;
            let firstSpace;
            let nameBetweent;
            result['users'].forEach(function (item) {
              valueName = item['fullname'];
              firstSpace = valueName.substring(0, valueName.indexOf(' '));
              lastSpace = valueName.substring(valueName.lastIndexOf(' ')).replace(' ', '');
              nameBetweent = valueName.substring(valueName.indexOf(' '), valueName.lastIndexOf(' ')).replace(' ', '');
              let reverseName = lastSpace + " " + nameBetweent + " " + firstSpace
              arrData.push({ id: item['id'], reverseName: reverseName, code: item['code'], fullname: item['fullname'], email: item['email'], dob: item['dob'], phone: item['phone'], group_user_configuration_id: item['group_user_configuration_id'], gender: item['gender'], permission_name: item['permission_name'], status: item['status'] });
            });
            this.userAccountData = arrData;
          }
        },
        error => {
          Object.keys(error).forEach(function (key) {
            this.notifyService.showError(error[key], 'Thông báo lỗi');
          });
          this.ngOnDestroy();
        });
  }

  reloadData() {
    const arrDataObject = this.form.controls['objectSearch'].value;
    const arrDataGroup = this.form.controls['groupSearch'].value;

    const formData = new FormData();
    let i = 0;
    if (arrDataObject.length > 0) {
      arrDataObject.forEach(function (item) {
        formData.append('permission_id' + '[' + i + ']', item['id']);
        i++;
      })
      i = 0;
    }
    if (arrDataGroup.length > 0) {
      arrDataGroup.forEach(function (item) {
        formData.append('groups' + '[' + i + ']', item['name']);
        i++;
      })
      i = 0;
    }
    let status;
    if (this.form.value.statusFilter) {
      status = 'active';
    } else {
      status = 'inactive';
    }
    this.userAccountManagementService.searchByInput(formData)
      .subscribe(
        result => {
          if (result['count'] === 0) {
            this.checkUserAccountData = false; //dữ liệu không tồn tại
            this.headerUserAccount = true;
            this.userAccountData = [];
            this.p = this.p;
            this.totalItems = 1;
          } else {

            this.p = this.p;
            this.checkUserAccountData = true; //dữ liệu tồn tại
            this.headerUserAccount = true;
            this.userAccountData = result['users'];
            this.totalItems = result['count'];
            const arrData = [];
            let valueName;
            let lastSpace;
            let firstSpace;
            let nameBetweent;
            result['users'].forEach(function (item) {
              valueName = item['fullname'];
              firstSpace = valueName.substring(0, valueName.indexOf(' '));
              lastSpace = valueName.substring(valueName.lastIndexOf(' ')).replace(' ', '');
              nameBetweent = valueName.substring(valueName.indexOf(' '), valueName.lastIndexOf(' ')).replace(' ', '');
              let reverseName = lastSpace + " " + nameBetweent + " " + firstSpace
              arrData.push({ id: item['id'], reverseName: reverseName, code: item['code'], fullname: item['fullname'], email: item['email'], dob: item['dob'], phone: item['phone'], group_user_configuration_id: item['group_user_configuration_id'], gender: item['gender'], permission_name: item['permission_name'], status: item['status'] });
            });
            this.userAccountData = arrData;
          }
        },
        error => {
          Object.keys(error).forEach(function (key) {
            this.notifyService.showError(error[key], 'Thông báo lỗi');
          });
          this.ngOnDestroy();
        });
  }


  valueCheck: any;
  valueBoolen: any;
  valueDate: any;
  checkDate: boolean;
  checkCurrentDate = true;
  changeDate($event) {
    this.valueCheck = $event.target.validationMessage;
    this.valueBoolen = $event.target.validity.valid;
    this.valueDate = $event.target.value;
    if (
      this.valueCheck === undefined && this.valueBoolen === undefined && this.valueDate === undefined ||
      this.valueCheck === '' && this.valueBoolen === true && this.valueDate === '' ||
      this.valueCheck !== '' && this.valueBoolen === false && this.valueDate === ''
    ) {
      this.checkDate === false;
    }
    if (this.valueCheck === '' && this.valueBoolen === true && this.valueDate !== '') {
      const currentDate = new Date();
      switch (Date.parse(String(this.valueDate)) > Date.parse(String(currentDate))) {
        case true:
          this.checkCurrentDate = false;
          break;
        case false:
          this.checkCurrentDate = true;
          break;
      }
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
    if (this.form.invalid) {
      return;
    }
    if (this.checkCurrentDate === false || this.checkDate === false) {
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
      uploadData.append('user_id', this.form.value.code);
    }
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
    if (this.form.value.province && this.form.value.province.length) {
      uploadData.append('province', this.form.value.province.id);
    }
    if (this.form.value.district && this.form.value.district.length) {
      uploadData.append('district', this.form.value.district.id);
    }
    if (this.form.value.ward && this.form.value.ward.length) {
      uploadData.append('ward', this.form.value.ward.id);
    }
    this.userAccountManagementService.insertUserAccount(uploadData).subscribe(
      result => {
        this.selectedProfileInsert = [];
        this.resetUserAccountForm();
        this.notifyService.showSuccess(result.message, 'Thông báo');
        this.searchByInput();
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
      },
      error => {
        this.selectedProfileInsert = [];
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
  // Thêm mới cấu hình nhóm người sử dụng
  addUserAccount() {
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
    if (this.form.invalid) {
      return;
    }

    if (this.checkCurrentDate === false || this.checkDate === false) {
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
      uploadData.append('user_id', this.form.value.code);
    }
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
    if (this.form.value.province && this.form.value.province.length) {
      uploadData.append('province', this.form.value.province.id);
    }
    if (this.form.value.district && this.form.value.district.length) {
      uploadData.append('district', this.form.value.district.id);
    }
    if (this.form.value.ward && this.form.value.ward.length) {
      uploadData.append('ward', this.form.value.ward.id);
    }
    this.userAccountManagementService.insertUserAccount(uploadData).subscribe(
      result => {
        $('#addUserAccountModal').modal('hide');
        $('.modal-backdrop').remove();
        this.notifyService.showSuccess(result.message, 'Thông báo');
        this.searchByInput();
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
      },
      error => {
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

  valueCheckUpdate: any;
  valueBoolenUpdate: any;
  valueDateUpdate: any;
  checkDateUpdate: boolean;
  checkCurrentDateUpdate = true;
  changeDateUpdate($event) {
    this.valueCheckUpdate = $event.target.validationMessage;
    this.valueBoolenUpdate = $event.target.validity.valid;
    this.valueDateUpdate = $event.target.value;
    if (
      this.valueCheck === undefined && this.valueBoolen === undefined && this.valueDate === undefined ||
      this.valueCheck === '' && this.valueBoolen === true && this.valueDate === '' ||
      this.valueCheck !== '' && this.valueBoolen === false && this.valueDate === ''
    ) {
      this.checkDateUpdate === false;
    }

    if (this.valueCheckUpdate === '' && this.valueBoolenUpdate === true && this.valueDateUpdate !== '') {
      const currentDate = new Date();
      switch (Date.parse(String(this.valueDateUpdate)) > Date.parse(String(currentDate))) {
        case true:
          this.checkCurrentDateUpdate = false;
          break;
        case false:
          this.checkCurrentDateUpdate = true;
          break;
      }
    }

  }
  // Cập nhật cấu hình nhóm người sử dụng
  updateUserAccount(id: number) {
    this.form.get('code').setValidators([Validators.minLength(2), Validators.maxLength(50)]);
    this.form.get('code').updateValueAndValidity();
    this.form.get('email').setValidators([Validators.required, Validators.email, Validators.maxLength(100), Validators.pattern("^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$")]);
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
    if (this.show) {
      this.form.get('password').setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(100),Validators.pattern('^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{6,}$')]);
      this.form.get('password').updateValueAndValidity();
      this.form.get('confirm_password').setValidators([Validators.required]);
      this.form.get('confirm_password').updateValueAndValidity();
      if (this.form.invalid) {
        return;
      }
    } else {
      if (this.form.controls['email'].invalid || this.form.controls['fullname'].invalid || this.form.controls['code'].invalid
        || this.form.controls['dob'].invalid || this.form.controls['gender'].invalid) {
        return;
      }
    }
    if (this.checkCurrentDateUpdate === false || this.checkDateUpdate === false) {
      return;
    }
    let phoneNumber;
    if (this.form.value.phone) {
      phoneNumber = this.form.value.phone.internationalNumber;
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
    if (this.form.value.username) {
      uploadData.append('username', this.form.value.username);
    }
    if (this.form.value.permission) {
      uploadData.append('permission_id', this.form.value.permission.id);
    }
    if (this.form.value.group) {
      this.form.value.group.forEach(function (item) {
        uploadData.append('group_user_configuration_id' + '[' + i + ']', item['name'].substring(0, 2));
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
    if (this.form.value.status === true || this.form.value.status === 1) {
      uploadData.append('status', '1');
    } else {
      uploadData.append('status', '0');
    }

    this.userAccountManagementService.updateUserAccount(id, uploadData).subscribe(
      result => {
        this.selectedProfileUpdate = [];
        $('#editUserAccountModal').modal('hide');
        $('.modal-backdrop').remove();
        this.notifyService.showSuccess('Dữ liệu đã được cập nhật thành công', 'Thông báo');
        this.reloadData();
      },
      error => {
        this.selectedProfileUpdate = [];
        if (error.messages && error.messages !== undefined) {
          if (error.messages['email']) {
            this.notifyService.showError(error.messages['email'], 'Thông báo lỗi');
          } else if (error.messages['status']) {
            this.notifyService.showError(error.messages['status'], 'Thông báo lỗi');
          }
        }
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
          if (error.message) {
            this.notifyService.showError(error.message, 'Thông báo lỗi');
          } else if (error.message.length >= 1) {
            Object.keys(error.message).forEach(function (key) {
              this.notifyService.showError(error.message[key], 'Thông báo lỗi');
            });
          }
        }
      });
  }
  // Xóa tài khoản người sử dụng
  deleteUserAccount(id: number) {
    let isDelete = confirm('Bạn chắc chắn muốn xóa dữ liệu này?');
    if (isDelete) {
      this.userAccountManagementService.deleteUserAccount(id)
        .subscribe(
          result => {
            this.notifyService.showSuccess('Dữ liệu đã được xóa thành công!', 'Thông báo');
            this.searchByInput();
            this.ngOnDestroy();
          },
          error => {
            this.notifyService.showError(error, 'Thông báo lỗi');
            this.ngOnDestroy();
          });
    }
  }
  // Reset form
  resetUserAccountForm() {
    this.checkDate = true;
    this.checkCurrentDate = true;
    this.valueCheck = undefined;
    this.valueBoolen = undefined;
    this.valueDate = undefined;
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
    this.form.get('address').setValue('');
    this.imgURL = null;
    this.selectedProvince = [];
    this.selectedDistrict = [];
    this.selectedWard = [];
    this.selectedPermission = [];
    this.selectedGroup = [];
    this.selectedGender = [];
  }
  setStatus() {
    if (this.statusActive === 1) {
      this.userAccountManagementService.inActiveUserAccount(this.idActive)
        .subscribe(
          result => {
            this.notifyService.showSuccess('Thay đổi trạng thái thành công!', 'Thông báo');
            this.searchByInput();
          },
          error => {
            this.notifyService.showError(error, 'Thông báo lỗi');
            this.ngOnDestroy();
          });
    } else {
      this.userAccountManagementService.activeUserAccount(this.idActive)
        .subscribe(
          result => {
            this.notifyService.showSuccess('Thay đổi trạng thái thành công!', 'Thông báo');
            this.searchByInput();
          },
          error => {
            this.notifyService.showError(error, 'Thông báo lỗi');
            this.ngOnDestroy();
          });
    }
    $('#confirmModal').modal('hide');
    $('.modal-backdrop').remove();
  }
  exitSetStatus() {
    this.searchByInput();
  }
  resetLinkProfileForm() {
    this.selectedProfile = [];
    this.form.value.code = '';
    this.form.value.codeProfile = '';
  }
  setLinkProfile() {

  }
  showModalUnlinkProfile() {
    $('#confirmUnlinkProfileModal').modal('show');
  }
  exitSetLinkProfile() {
  }
  active(id: number, status: number) {
    this.idActive = id;
    this.statusActive = status;
  }
  // GetById cấu hình nhóm người sử dụng
  arrDistrict = [];
  usernameData: any;
  showTelephoneNumber: any;
  getByIdUserAccount(id: number) {
    const provinceData = [];
    const districtData = [];
    const wardData = [];
    const groupData = [];
    const genderData = [];
    const permissionData = [];
    const groupDataMap = this.ddlGroupData;
    this.userAccountManagementService.getByIdUserAccount(id)
      .subscribe(
        result => {
          this.userAccountGetById = result;
          this.usernameData = result['users'][0]['email'];
          const provice = result['users'][0]['province'];
          const district = result['users'][0]['district'];
          const ward = result['users'][0]['ward'];
          const permission = result['users'][0]['permission_id'];
          const group = result['groups'];
          const gender = result['users'][0]['gender'];
          const id = result['users'][0]['id'];
          let code = result['users'][0]['code'];
          if (code) {
            this.form.value.code = code;
          }
          if (result['groups'][0]) {
            this.selectedGroup = result['groups'][0];
          }
          this.form.patchValue(result['users'][0]);

          let phone = result['users'][0]['phone'];
          this.showTelephoneNumber = phone.replace('+84 ','');

          let address = result['users'][0]['address'].substring(0, result['users'][0]['address'].indexOf('-'));
          if(address === ""){
            this.address_detail = [];
          }
          this.address_detail = address;

          this.userAccountManagementService.getPictureUser(id)
            .subscribe(
              (result) => {
                let url = window.URL.createObjectURL(result);
                this.imgURLUpdate = this.safeUrlPipe.transform(url);
              },
              error => {
                this.imgURLUpdate = '';
              });
          if (provice) {
            var mapProvince = this.ddlProvince.map(function (x) { return x.id; }).indexOf(provice);
            if (mapProvince > -1) {
              provinceData.push({ id: this.ddlProvince[mapProvince]['id'], name: this.ddlProvince[mapProvince]['name'] });
            }
            this.selectedProvince = provinceData[0];
            this.addressService.getDistrict(provice)
              .subscribe(
                (data) => {
                  const districtData = data['districts'];
                  const districtObj = [];
                  if (districtData.length > 0) {
                    this.ddlDistrict = districtData;
                    var mapDistrict = districtData.map(function (x) { return x.id; }).indexOf(district);
                    if (mapDistrict > -1) {
                      districtObj.push({ id: districtData[mapDistrict]['id'], name: districtData[mapDistrict]['name'] });
                    }
                    this.selectedDistrict = districtObj[0];
                  }
                });
          }
          if (district) {
            this.addressService.getWard(district)
              .subscribe(
                (data) => {
                  let wardData = data['wards'];
                  const wardObj = [];
                  this.ddlWard = wardObj;
                  var mapWard = wardData.map(function (x) { return x.id; }).indexOf(ward);
                  if (mapWard > -1) {
                    wardObj.push({ id: wardData[mapWard]['id'], name: wardData[mapWard]['name'] });
                  }
                  this.selectedWard = wardObj[0];
                });
          }
          if (permission) {
            let mapPermission = this.ddlPermissionData.map(function (x) { return x.id; }).indexOf(permission);
            if (mapPermission > -1) {
              permissionData.push({ id: this.ddlPermissionData[mapPermission]['id'], name: this.ddlPermissionData[mapPermission]['name'] });
            }
            this.selectedPermission = permissionData[0];
          }
          if (group !== '') {
            let keepGoing = true;
            group.forEach(function (value, i) {
              keepGoing = true;
              groupDataMap.forEach(function (groupVal, j) {
                const groupSplit = groupVal.name.split('-');
                if (groupSplit[0] === value) {
                  if (keepGoing) {
                    groupData.push({ id: groupDataMap[j]['id'], name: groupDataMap[j]['name'] });
                    keepGoing = false;
                  }
                }
              });
            });
            if (groupData.length > 0) {
              this.selectedGroup = groupData;
            } else {
              this.selectedGroup = [];
            }
          }
          if (gender >= 0) {
            var mapGender = this.ddlGender.map(function (x) { return x.id; }).indexOf(gender);
            if (mapGender > -1) {
              genderData.push({ id: this.ddlGender[mapGender]['id'], name: this.ddlGender[mapGender]['name'] });
            }
            this.selectedGender = genderData[0];
          }
        },
        error => {
          Object.keys(error).forEach(function (key) {
            this.notifyService.showError(error[key], 'Thông báo lỗi');
          });
          this.ngOnDestroy();
        });
  }
  alphabetsFather = ["A", "À", "Ả", "Ã", "Á", "Ạ",
    "Ă", "Ằ", "Ẳ", "Ẵ", "Ắ", "Ặ",
    "Â", "Ầ", "Ẩ", "Ẫ", "Ấ", "Ậ",
    "B", "C", "D", "Đ",
    "E", "È", "Ẻ", "Ẽ", "É", "Ẹ",
    "Ê", "Ề", "Ể", "Ễ", "Ế", "Ệ",
    "F", "G", "H",
    "I", "Ì", "Ỉ", "Ĩ", "Í", "Ị",
    "J", "K", "L", "M", "N",
    "O", "Ò", "Ỏ", "Õ", "Ó", "Ọ",
    "Ô", "Ồ", "Ổ", "Ỗ", "Ố", "Ộ",
    "Ơ", "Ờ", "Ở", "Ỡ", "Ớ", "Ợ",
    "P", "Q", "R", "S", "T",
    "U", "Ù", "Ủ", "Ũ", "Ú", "Ụ",
    "Ư", "Ừ", "Ử", "Ữ", "Ứ", "Ự",
    "V", "W", "X",
    "Y", "Ỳ", "Ỷ", "Ỹ", "Ý", "Ỵ",
    "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", " "];

  //*1 hàm sort
  public CharCompare(a, b, index) {
    var aChar;
    var bChar;
    var alphabets = this.alphabetsFather;
    if (index == a.length || index == b.length) return 0;
    aChar = alphabets.indexOf(a.toUpperCase().charAt(index));
    bChar = alphabets.indexOf(b.toUpperCase().charAt(index));
    if (aChar != bChar) return aChar - bChar;
    else return this.CharCompare(a, b, index + 1);
  }

  times = 3;
  sortFullname(event) {
    const array = this.userAccountData;
    if (this.times === 1) {
      //*2 gọi hàm sort
      array.sort((a, b) => {
        var str1 = a.fullname;
        str1 = str1.split(" ");
        str1 = str1.reverse();
        str1 = str1.toString();
        str1 = str1.toUpperCase();

        var str2 = b.fullname;
        str2 = str2.split(" ");
        str2 = str2.reverse();
        str2 = str2.toString();
        str2 = str2.toUpperCase();

        return this.CharCompare(str1, str2, 0);
      });
      this.times++;
    } else {
      //*2 gọi hàm sort
      array.sort((a, b) => {
        var str1 = a.fullname;
        str1 = str1.split(" ");
        str1 = str1.reverse();
        str1 = str1.toString();
        str1 = str1.toUpperCase();

        var str2 = b.fullname;
        str2 = str2.split(" ");
        str2 = str2.reverse();
        str2 = str2.toString();
        str2 = str2.toUpperCase();

        return this.CharCompare(str2, str1, 0);
      });
      this.times = 1
    }
    this.timesEmail = 3;
    this.timesId = 3;
    this.userAccountData = array;
  }
  public symbolUpDownName() {
    if (this.times === 3) {
      return {
      }
    } else {
      return {
        display: "none"
      }
    }
  }
  public symbolUpName() {
    if (this.times === 1) {
      return {

      }
    } else {
      return {
        display: "none"
      }
    }
  }
  public symbolDownName() {
    if (this.times === 2) {
      return {

      }
    } else {
      return {
        display: "none"
      }
    }
  }
  timesEmail = 3;
  sortEmail(event) {
    const array = this.userAccountData;
    if (this.timesEmail === 1) {
      array.sort(function (a, b) {
        let str = a.email;
        var nameA = str.toUpperCase(); // bỏ qua hoa thường

        let str2 = b.email;
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
      this.timesEmail++;
    } else {
      array.sort(function (a, b) {
        let str = a.email;
        var nameA = str.toUpperCase(); // bỏ qua hoa thường

        let str2 = b.email;
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
      this.timesEmail = 1
    }
    this.times = 3;
    this.timesId = 3;
    this.userAccountData = array;
  }
  public symbolUpDownEmail() {
    if (this.timesEmail === 3) {
      return {
      }
    } else {
      return {
        display: "none"
      }
    }
  }
  public symbolUpEmail() {
    if (this.timesEmail === 1) {
      return {
      }
    } else {
      return {
        display: "none"
      }
    }
  }
  public symbolDownEmail() {
    if (this.timesEmail === 2) {
      return {
      }
    } else {
      return {
        display: "none"
      }
    }
  }
  timesId = 3;
  sortId(event) {
    const array = this.userAccountData;
    if (this.timesId === 1) {
      array.sort(function (a, b) {
        let str = a.id
        var nameA = Number(str) // bỏ qua hoa thường
        let str2 = b.id;
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
      this.timesId++;
    } else {
      array.reverse(function (a, b) {
        let str = a.id;
        var nameA = Number(str); // bỏ qua hoa thường
        let str2 = b.id;
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
      this.timesId = 1
    }
    this.times = 3;
    this.timesEmail = 3;
    this.userAccountData = array;
  }
  public symbolUpDownCode() {
    if (this.timesId === 3) {
      return {
      }
    } else {
      return {
        display: "none"
      }
    }
  }
  public symbolUpCode() {
    if (this.timesId === 1) {
      return {
      }
    } else {
      return {
        display: "none"
      }
    }
  }
  public symbolDownCode() {
    if (this.timesId === 2) {
      return {
      }
    } else {
      return {
        display: "none"
      }
    }
  }
  linkProfileFormHide() {

  }
  address_detail: any;
  linkProfile() {
    this.resetUserAccountForm();
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
                if (gender >= 0) {
                  var mapGender = this.ddlGender.map(function (x) { return x.id; }).indexOf(gender);
                  if (mapGender > -1) {
                    genderData.push({ id: this.ddlGender[mapGender]['id'], name: this.ddlGender[mapGender]['name'] });
                    this.selectedGender = genderData[0];
                  }
                }
                if (provice) {
                  var mapProvince = this.ddlProvince.map(function (x) { return x.id; }).indexOf(provice);
                  if (mapProvince > -1) {
                    provinceData.push({ id: this.ddlProvince[mapProvince]['id'], name: this.ddlProvince[mapProvince]['name'] });
                  }
                  this.selectedProvince = provinceData[0];
                  this.addressService.getDistrict(provice)
                    .subscribe(
                      (data) => {
                        const districtData = data['districts'];
                        const districtObj = [];
                        if (districtData.length > 0) {
                          this.ddlDistrict = districtData;
                          var mapDistrict = districtData.map(function (x) { return x.id; }).indexOf(district);
                          if (mapDistrict > -1) {
                            districtObj.push({ id: districtData[mapDistrict]['id'], name: districtData[mapDistrict]['name'] });
                          }
                          this.selectedDistrict = districtObj[0];
                        }
                      });
                }
                if (district) {
                  this.addressService.getWard(district)
                    .subscribe(
                      (data) => {
                        let wardData = data['wards'];
                        const wardObj = [];
                        this.ddlWard = wardObj;
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
  unLinkProfile() {
    this.form.value.code = '';
    $('#confirmUnlinkProfileModal').modal('hide');
    $('.modal-backdrop').remove();
  }
  // Refresh
  ngOnDestroy() {
    this.ngOnInit();
  }
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Vietnam, CountryISO.UnitedStates];
}
