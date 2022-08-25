import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CountryISO, SearchCountryField, TooltipLabel } from 'ngx-intl-tel-input';
import { School } from '../../../_models/school';
import { AddressService } from '../../../_services/address.service';
import { NotificationService } from '../../../_services/notification.service';
import { SafeUrlPipe } from '../../../_services/safe-url.pipe.service';
import { UserAccountManagementService } from '../../user-management/service/user-account-management.service';
import { ConfigurationParametersSchoolService } from '../service/configuration-parameters-school.service';
declare var $: any;

@Component({
  selector: 'app-configuration-school',
  templateUrl: './configuration-school.component.html',
  styleUrls: ['./configuration-school.component.css']
})
export class ConfigurationSchoolComponent implements OnInit {

  imgURL: any;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef; // File properties

  school: School[] = [];
  form: FormGroup;
  selectedFile: File;
  submitted = false;
  separateDialCode = true;
  showTelephoneNumber:any;
  // School Levlel dropdown list
  ddlSchoolLevelData = []; selectedSchoolLevel = [];
  // Province dropdown list
  ddlProvinceData = []; selectedProvince = [];
  // District dropdown list
  ddlDistrictData = []; selectedDistrict = [];
  // Ward dropdown list
  ddlWardData = []; selectedWard = [];
  // Phone setting
  phone: number;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  constructor(
    private fb: FormBuilder,
    private userAccountManagementService: UserAccountManagementService,
    private configurationParametersSchoolService: ConfigurationParametersSchoolService,
    private notifyService: NotificationService,
    private safeUrlPipe: SafeUrlPipe,
    private router: Router,
    private addressService: AddressService
  ) { }

  onSelectSchoolLevel(item: any) {
    if (item) {
      this.selectedSchoolLevel = item;
    } else {
     const schoolLevel = [];
     schoolLevel.push({ id: 1, name: 'Tiểu học' });
     this.selectedSchoolLevel = schoolLevel[0];
    }
  }
  onSelectProvince(item: any) {
    this.selectedDistrict = [];
    this.ddlDistrictData = [];
    this.selectedWard = [];
    this.ddlWardData = [];
    this.addressService.getDistrict(item['id'])
      .subscribe(
        (data) => {
          let districtData = data['districts'];
          const districtObj = [];
          districtData.forEach(function (item) {
            districtObj.push({ id: item['id'], name: item['name'] });
          });
          this.ddlDistrictData = districtObj;
        });
  }
  onSelectDistrict(item: any) {
    this.selectedWard = [];
    this.ddlWardData = [];
    this.addressService.getWard(item['id'])
      .subscribe(
        (data) => {
          let wardData = data['wards'];
          const wardObj = [];
          wardData.forEach(function (item) {
            wardObj.push({ id: item['id'], name: item['name'] });
          });
          this.ddlWardData = wardObj;
        });
  }

  get f() { return this.form.controls; }
  ngOnInit() {
    // Data dropdownlist: Giới tính
    this.ddlSchoolLevelData = [
      { id: 1, name: 'Tiểu học' },
      { id: 2, name: 'Trung học cơ sở' },
      { id: 3, name: 'Trung học phổ thông' },
    ];

    this.addressService.getProvince()
      .subscribe(
        (data) => {
          let provinceData = data['provinces'];
          const provinceObj = [];
          provinceData.forEach(function (item) {
            provinceObj.push({ id: item['id'], name: item['name'] });
          });
          this.ddlProvinceData = provinceObj;
        });

    this.loadConfigurationSchoolData();

    // Validator configuration school
    this.form = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(80)]),
      tin: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
      fax: new FormControl('', Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')),
      level: new FormControl('', Validators.required),
      province: new FormControl(this.ddlProvinceData, Validators.required),
      district: new FormControl(this.ddlDistrictData, Validators.required),
      ward: new FormControl(this.ddlWardData, Validators.required),
      address_detail: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(300)]),
    }, {});


  }
  loadConfigurationSchoolData() {
    const id = 1;
    const selectedProvince = [];
    const selectedDistrict = [];
    const selectedWard = [];
    const selectedSchoolLevel = [];
    this.configurationParametersSchoolService.find(id)
      .subscribe(
        result => {
          const proviceId = parseInt(result['address']['province_id']);
          const districtId = parseInt(result['address']['district_id']);
          const wardId = parseInt(result['address']['ward_id']);
          const levelId = result['school']['level'];
          const schoolId = result['school']['id'];
          this.configurationParametersSchoolService.show_logo(schoolId)
            .subscribe(
              (result) => {
                let url = window.URL.createObjectURL(result);
                this.imgURL = this.safeUrlPipe.transform(url);
              },
              error => {
                this.imgURL = null;
              });

          if (proviceId) {
            this.addressService.getDistrict(proviceId)
              .subscribe(
                (data) => {
                  let districtData = data['districts'];
                  const districtObj = [];
                  districtData.forEach(function (item) {
                    districtObj.push({ id: item['id'], name: item['name'] });
                  });
                  this.ddlDistrictData = districtObj;
                  var mapDistrict = districtData.map(function (x) { return x.id; }).indexOf(districtId);
                  if (mapDistrict > -1) {
                    selectedDistrict.push({ id: districtData[mapDistrict]['id'], name: districtData[mapDistrict]['name'] });
                  }
                  this.selectedDistrict = selectedDistrict[0];
                });
          }

          if (districtId) {
            this.addressService.getWard(districtId)
              .subscribe(
                (data) => {
                  let wardData = data['wards'];
                  const wardObj = [];
                  wardData.forEach(function (item) {
                    wardObj.push({ id: item['id'], name: item['name'] });
                  });
                  this.ddlWardData = wardObj;
                  var mapWard = wardData.map(function (x) { return x.id; }).indexOf(wardId);
                  if (mapWard > -1) {
                    selectedWard.push({ id: wardData[mapWard].id, name: wardData[mapWard].name });
                  }
                  this.selectedWard = selectedWard[0];
                });
          }

          if (proviceId) {
            var mapProvince = this.ddlProvinceData.map(function (x) { return x.id; }).indexOf(proviceId);
            if (mapProvince > -1) {
              selectedProvince.push({ id: this.ddlProvinceData[mapProvince].id, name: this.ddlProvinceData[mapProvince].name });
            }
            this.selectedProvince = selectedProvince[0];
          }

          this.form.patchValue(result['school']);
          let phone = result['school']['phone'];
          this.showTelephoneNumber = phone.replace('0','');
          this.form.patchValue(result['address']);
          if (levelId) {
            let schoolLevel = this.ddlSchoolLevelData.map(function (x) { return x.id; }).indexOf(levelId);
            if (schoolLevel > -1) {
              selectedSchoolLevel.push({ id: this.ddlSchoolLevelData[schoolLevel].id, name: this.ddlSchoolLevelData[schoolLevel].name });
            }
            this.selectedSchoolLevel = selectedSchoolLevel[0];
          }
        },
        error => {
          Object.keys(error).forEach(function (key) {
            this.notifyService.showError(error[key], 'Thông báo lỗi');
          });
          this.ngOnDestroy();
        });
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

  update() {
    this.submitted = true;
    const id = 1;
    const schoolData = new FormData();
    if (this.form.controls['name'].invalid || this.form.controls['email'].invalid === null || this.form.controls['fax'].invalid || this.form.controls['province'].invalid
    || this.form.controls['district'].invalid || this.form.controls['ward'].invalid || this.form.controls['address_detail'].invalid) {
      return;
    }
    if (this.selectedFile) {
      schoolData.append('logo', this.selectedFile);
    }
    if (this.form.value['name']) {
      schoolData.append('name', this.form.value['name']);
    }
    if (this.form.value.phone.nationalNumber !== undefined) {
      schoolData.append('phone', this.form.value.phone.nationalNumber.replaceAll(' ', ''));
    }
    if (this.form.value['level']) {
      schoolData.append('level', this.form.value['level'].id);
    }
    if (this.form.value['fax']) {
      schoolData.append('fax', this.form.value['fax']);
    }
    if (this.form.value['tin']) {
      schoolData.append('tin', this.form.value['tin']);
    }
    if (this.form.value['email']) {
      schoolData.append('email', this.form.value['email']);
    }
    if (this.form.value['province']) {
      schoolData.append('province_id', this.form.value['province'].id);
    }
    if (this.form.value['district']) {
      schoolData.append('district_id', this.form.value['district'].id);
    }
    if (this.form.value['ward']) {
      schoolData.append('ward_id', this.form.value['ward'].id);
    }
    if (this.form.value['address_detail']) {
      schoolData.append('address_detail', this.form.value['address_detail']);
    }
    this.configurationParametersSchoolService.update(id, schoolData).subscribe(
      result => {
        this.notifyService.showSuccess('Cấu hình trường học thành công', 'Thông báo');
        this.refresh();
      },
      error => {
        if (error.message) {
          this.notifyService.showError(error.message, 'Thông báo');
        } else if (error.messages) {
          if (error.messages['name']) {
            this.notifyService.showError(error.messages['name'], 'Thông báo');
          } else if (error.messages['phone']) {
            this.notifyService.showError(error.messages['phone'], 'Thông báo');
          } else if (error.messages['level']) {
            this.notifyService.showError(error.messages['level'], 'Thông báo');
          } else if (error.messages['tin']) {
            this.notifyService.showError(error.messages['tin'], 'Thông báo');
          } else if (error.messages['email']) {
            this.notifyService.showError(error.messages['email'], 'Thông báo');
          } else if (error.messages['province_id']) {
            this.notifyService.showError(error.messages['province_id'], 'Thông báo');
          } else if (error.messages['district_id']) {
            this.notifyService.showError(error.messages['district_id'], 'Thông báo');
          } else if (error.messages['ward_id']) {
            this.notifyService.showError(error.messages['ward_id'], 'Thông báo');
          } else if (error.messages['address_detail']) {
            this.notifyService.showError(error.messages['address_detail'], 'Thông báo');
          }
        }
      });
  }
  // Reset form
  resetUserAccountForm() {
    this.form.get('name').clearValidators();
    this.form.get('phone').clearValidators();
    this.form.get('province').clearValidators();
    this.form.get('district').clearValidators();
    this.form.get('ward').clearValidators();
    this.form.get('address_detail').clearValidators();
    this.form.get('phone').setValue('');
    this.form.get('email').setValue('');
    this.form.get('province').setValue('');
    this.form.get('district').setValue('');
    this.form.get('ward').setValue('');
    this.form.get('address_detail').setValue('');
    this.form.reset();
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  // Refresh
  ngOnDestroy() {
    this.ngOnInit();
  }
  goBack() {
    this.router.navigate(['/dashboard']);
  }
  refresh(): void {
    window.location.reload();
  }
}
