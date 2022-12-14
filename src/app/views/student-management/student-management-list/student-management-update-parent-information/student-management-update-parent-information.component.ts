import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '../../../../_services/notification.service';
import { MustMatch } from '../../../../_helpers/must-match.validator';
import { StudentManagementParentInformationService } from '../../service/student-management-parent-information.service';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'student-management-update-parent-information',
  templateUrl: './student-management-update-parent-information.component.html',
  styleUrls: ['./student-management-update-parent-information.component.scss']
})
export class StudentManagementUpdateParentInformationComponent implements OnInit {

  @Input() studentId: number;
  @Input() basicInfoData: any;
  @Output() basicInforDataEvent = new EventEmitter<any>();

  parentInformationForm: FormGroup;
  submitted = false;
  separateDialCode = true;

  searchCountryField = SearchCountryField;
  tooltipLabel = TooltipLabel;
  countryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Vietnam, CountryISO.UnitedKingdom];
  phone: any;

  accountParentId: number;

  constructor(
    private fb: FormBuilder,
    private studentManagementParentInformationService: StudentManagementParentInformationService,
    private notifyService: NotificationService,
    private router: Router
  ) {
  }
  get f() { return this.parentInformationForm.controls; }

  ngOnInit() {
    this.parentInformationForm = this.fb.group({
      father_name: new FormControl('', [Validators.maxLength(50)]),
      father_job: new FormControl('', [Validators.maxLength(200)]),
      father_phone: new FormControl('', [Validators.maxLength(15)]),
      father_email: new FormControl('', [Validators.email, Validators.maxLength(100)]),
      father_work_address: new FormControl('', [Validators.maxLength(200)]),
      mother_name: new FormControl('', [Validators.maxLength(50)]),
      mother_job: new FormControl('', [Validators.maxLength(200)]),
      mother_phone: new FormControl('', [Validators.maxLength(15)]),
      mother_email: new FormControl('', [Validators.email, Validators.maxLength(100)]),
      mother_work_address: new FormControl('', [Validators.maxLength(200)]),
      protector_name: new FormControl('', [Validators.maxLength(50)]),
      protector_job: new FormControl('', [Validators.maxLength(200)]),
      protector_phone: new FormControl('', [Validators.maxLength(15)]),
      protector_email: new FormControl('', [Validators.email, Validators.maxLength(100)]),
      protector_work_address: new FormControl('', [Validators.maxLength(200)]),
      account_email: new FormControl('', [Validators.email, Validators.maxLength(100)]),
      password: new FormControl('', [Validators.minLength(6), Validators.maxLength(100)]),
      confirm_password: new FormControl('', [Validators.minLength(6), Validators.maxLength(100)]),
      account_status: new FormControl('')
    }, {
      validator: MustMatch('password', 'confirm_password')
    });
    this.getByIdParentInformation();
  }

  updateParents() {
    this.getByIdParentInformation();
    this.submitted = true;
    if (this.accountParentId === undefined && this.accountParentId === null) {
      if (this.parentInformationForm.value['account_email'] !== '') {
        if (!this.parentInformationForm.value['password'] || !this.parentInformationForm.value['password']) {
          this.notifyService.showWarning('Vui l??ng ??i???n ?????y ????? th??ng tin t??i kho???n!', 'Th??ng b??o');
          return;
        }
      }
    }
    console.log(this.parentInformationForm.value);
    if (this.parentInformationForm.invalid) {
      return;
    }
    var uploadData = new FormData();
    let tab = '3';

    if (this.parentInformationForm.value['father_name']) {
      uploadData.append('father_name', this.parentInformationForm.value['father_name']);
    }
    if (this.parentInformationForm.value['father_job']) {
      uploadData.append('father_job', this.parentInformationForm.value['father_job']);
    }
    if (this.parentInformationForm.value['father_phone']) {
      uploadData.append('father_phone', this.parentInformationForm.value['father_phone']['number']);
    }
    if (this.parentInformationForm.value['father_email']) {
      uploadData.append('father_email', this.parentInformationForm.value['father_email']);
    }
    if (this.parentInformationForm.value['father_work_address']) {
      uploadData.append('father_work_address', this.parentInformationForm.value['father_work_address']);
    }

    if (this.parentInformationForm.value['mother_name']) {
      uploadData.append('mother_name', this.parentInformationForm.value['mother_name']);
    }
    if (this.parentInformationForm.value['mother_job']) {
      uploadData.append('mother_job', this.parentInformationForm.value['mother_job']);
    }
    if (this.parentInformationForm.value['mother_phone']) {
      uploadData.append('mother_phone', this.parentInformationForm.value['mother_phone']['number']);
    }
    if (this.parentInformationForm.value['mother_email']) {
      uploadData.append('mother_email', this.parentInformationForm.value['mother_email']);
    }
    if (this.parentInformationForm.value['mother_work_address']) {
      uploadData.append('mother_work_address', this.parentInformationForm.value['mother_work_address']);
    }

    if (this.parentInformationForm.value['protector_name']) {
      uploadData.append('protector_name', this.parentInformationForm.value['protector_name']);
    }
    if (this.parentInformationForm.value['protector_job']) {
      uploadData.append('protector_job', this.parentInformationForm.value['protector_job']);
    }
    if (this.parentInformationForm.value['protector_phone']) {
      uploadData.append('protector_phone', this.parentInformationForm.value['protector_phone']['number']);
    }
    if (this.parentInformationForm.value['protector_email']) {
      uploadData.append('protector_email', this.parentInformationForm.value['protector_email']);
    }
    if (this.parentInformationForm.value['protector_work_address']) {
      uploadData.append('protector_work_address', this.parentInformationForm.value['protector_work_address']);
    }

    if (this.parentInformationForm.value['account_email']) {
      uploadData.append('account_email', this.parentInformationForm.value['account_email']);
    }
    if (this.parentInformationForm.value['password']) {
      uploadData.append('password', this.parentInformationForm.value['password']);
    }
    if (this.parentInformationForm.value['account_status']) {
      uploadData.append('account_status', '1');
    } else {
      uploadData.append('account_status', '0');
    }
    uploadData.append('tab', tab);
    this.studentManagementParentInformationService.update(this.studentId, uploadData)
      .subscribe(
        result => {
          // this.notifyService.showSuccess('C???p nh???t th??ng tin ph??? huynh th??nh c??ng', 'Th??ng b??o');
        }, error => {
          if (error.messages) {
            var fatherPhone = error.messages['father_phone'];
            if (fatherPhone == 2) {
              this.notifyService.showError('S??? ??i???n tho???i b??? kh??ng h???p l???!', 'Th??ng b??o l???i');
              return;
            }
            var fatherMail = error.messages['father_email'];
            if (fatherMail == 2) {
              this.notifyService.showError('Email b??? kh??ng h???p l???!', 'Th??ng b??o l???i');
              return;
            }
            var motherPhone = error.messages['mother_phone'];
            if (motherPhone == 2) {
              this.notifyService.showError('S??? ??i???n tho???i m??? kh??ng h???p l???!', 'Th??ng b??o l???i');
              return;
            }
            var motherMail = error.messages['mother_email'];
            if (motherMail == 2) {
              this.notifyService.showError('Email m??? kh??ng h???p l???!', 'Th??ng b??o l???i');
              return;
            }
            var protectorPhone = error.messages['protector_phone'];
            if (protectorPhone == 2) {
              this.notifyService.showError('S??? ??i???n tho???i ng?????i b???o tr??? kh??ng h???p l???!', 'Th??ng b??o l???i');
              return;
            }
            var protectorMail = error.messages['protector_email'];
            if (protectorMail == 2) {
              this.notifyService.showError('Email ng?????i b???o tr??? kh??ng h???p l???!', 'Th??ng b??o l???i');
              return;
            }
            var accountEmail = error.messages['account_email'];
            if (accountEmail == 1) {
              this.notifyService.showError('T??i kho???n kh??ng ???????c b??? tr???ng!', 'Th??ng b??o l???i');
              return;
            }
            if (accountEmail == 2) {
              this.notifyService.showError('T??i kho???n email kh??ng h???p l???!', 'Th??ng b??o l???i');
              return;
            }
            if (accountEmail == 4) {
              this.notifyService.showError('T??i kho???n email ???? t???n t???i!', 'Th??ng b??o l???i');
              return;
            }
            var password = error.messages['password'];
            if (password == 1) {
              this.notifyService.showError('M???t kh???u kh??ng ???????c b??? tr???ng!', 'Th??ng b??o l???i');
              return;
            }
            if (password == 3) {
              this.notifyService.showError('M???t kh???u t???i thi???u 6 k?? t???!', 'Th??ng b??o l???i');
              return;
            }
            var status = error.messages['account_status'];
            if (status == 1) {
              this.notifyService.showError('Tr???ng th??i ho???t ?????ng ???????c b??? tr???ng!', 'Th??ng b??o l???i');
              return;
            }
            if (status == 2) {
              this.notifyService.showError('Tr???ng th??i ho???t ?????ng kh??ng h???p l???!', 'Th??ng b??o l???i');
              return;
            }
          }
        });
  }

  addParentContinue() {
    this.submitted = true;
    if (this.accountParentId !== undefined && !this.accountParentId) {
      if (this.parentInformationForm.value['account_email'] !== '') {
        if (!this.parentInformationForm.value['password'] || !this.parentInformationForm.value['password']) {
          this.notifyService.showWarning('Vui l??ng ??i???n ?????y ????? th??ng tin t??i kho???n!', 'Th??ng b??o');
          return;
        }
      }
    }
    console.log(this.parentInformationForm.value);
    if (this.parentInformationForm.invalid) {
      return;
    }
    var uploadData = new FormData();
    let tab = '3';

    if (this.parentInformationForm.value['father_name']) {
      uploadData.append('father_name', this.parentInformationForm.value['father_name']);
    }
    if (this.parentInformationForm.value['father_job']) {
      uploadData.append('father_job', this.parentInformationForm.value['father_job']);
    }
    if (this.parentInformationForm.value['father_phone']) {
      uploadData.append('father_phone', this.parentInformationForm.value['father_phone']['number']);
    }
    if (this.parentInformationForm.value['father_email']) {
      uploadData.append('father_email', this.parentInformationForm.value['father_email']);
    }
    if (this.parentInformationForm.value['father_work_address']) {
      uploadData.append('father_work_address', this.parentInformationForm.value['father_work_address']);
    }

    if (this.parentInformationForm.value['mother_name']) {
      uploadData.append('mother_name', this.parentInformationForm.value['mother_name']);
    }
    if (this.parentInformationForm.value['mother_job']) {
      uploadData.append('mother_job', this.parentInformationForm.value['mother_job']);
    }
    if (this.parentInformationForm.value['mother_phone']) {
      uploadData.append('mother_phone', this.parentInformationForm.value['mother_phone']['number']);
    }
    if (this.parentInformationForm.value['mother_email']) {
      uploadData.append('mother_email', this.parentInformationForm.value['mother_email']);
    }
    if (this.parentInformationForm.value['mother_work_address']) {
      uploadData.append('mother_work_address', this.parentInformationForm.value['mother_work_address']);
    }

    if (this.parentInformationForm.value['protector_name']) {
      uploadData.append('protector_name', this.parentInformationForm.value['protector_name']);
    }
    if (this.parentInformationForm.value['protector_job']) {
      uploadData.append('protector_job', this.parentInformationForm.value['protector_job']);
    }
    if (this.parentInformationForm.value['protector_phone']) {
      uploadData.append('protector_phone', this.parentInformationForm.value['protector_phone']['number']);
    }
    if (this.parentInformationForm.value['protector_email']) {
      uploadData.append('protector_email', this.parentInformationForm.value['protector_email']);
    }
    if (this.parentInformationForm.value['protector_work_address']) {
      uploadData.append('protector_work_address', this.parentInformationForm.value['protector_work_address']);
    }

    if (this.parentInformationForm.value['account_email']) {
      uploadData.append('account_email', this.parentInformationForm.value['account_email']);
    }
    if (this.parentInformationForm.value['password']) {
      uploadData.append('password', this.parentInformationForm.value['password']);
    }
    if (this.parentInformationForm.value['account_status']) {
      uploadData.append('account_status', '1');
    } else {
      uploadData.append('account_status', '0');
    }
    uploadData.append('tab', tab);
    this.studentManagementParentInformationService.update(this.studentId, uploadData)
      .subscribe(
        result => {
          const student = this.basicInfoData['student'];
          const protector = this.basicInfoData['protector'];
          const address = this.basicInfoData['address'];
          const data = { 'student': student, 'protector': protector, 'address': address, 'tab': 3 };
          this.basicInforDataEvent.emit(data);
          this.notifyService.showSuccess('C???p nh???t th??ng tin ph??? huynh th??nh c??ng', 'Th??ng b??o');
        }, error => {
          if (error.messages) {
            var fatherPhone = error.messages['father_phone'];
            if (fatherPhone == 2) {
              this.notifyService.showError('S??? ??i???n tho???i b??? kh??ng h???p l???!', 'Th??ng b??o l???i');
              return;
            }
            var fatherMail = error.messages['father_email'];
            if (fatherMail == 2) {
              this.notifyService.showError('Email b??? kh??ng h???p l???!', 'Th??ng b??o l???i');
              return;
            }
            var motherPhone = error.messages['mother_phone'];
            if (motherPhone == 2) {
              this.notifyService.showError('S??? ??i???n tho???i m??? kh??ng h???p l???!', 'Th??ng b??o l???i');
              return;
            }
            var motherMail = error.messages['mother_email'];
            if (motherMail == 2) {
              this.notifyService.showError('Email m??? kh??ng h???p l???!', 'Th??ng b??o l???i');
              return;
            }
            var protectorPhone = error.messages['protector_phone'];
            if (protectorPhone == 2) {
              this.notifyService.showError('S??? ??i???n tho???i ng?????i b???o tr??? kh??ng h???p l???!', 'Th??ng b??o l???i');
              return;
            }
            var protectorMail = error.messages['protector_email'];
            if (protectorMail == 2) {
              this.notifyService.showError('Email ng?????i b???o tr??? kh??ng h???p l???!', 'Th??ng b??o l???i');
              return;
            }
            var accountEmail = error.messages['account_email'];
            if (accountEmail == 1) {
              this.notifyService.showError('T??i kho???n kh??ng ???????c b??? tr???ng!', 'Th??ng b??o l???i');
              return;
            }
            if (accountEmail == 2) {
              this.notifyService.showError('T??i kho???n email kh??ng h???p l???!', 'Th??ng b??o l???i');
              return;
            }
            if (accountEmail == 4) {
              this.notifyService.showError('T??i kho???n email ???? t???n t???i!', 'Th??ng b??o l???i');
              return;
            }
            var password = error.messages['password'];
            if (password == 1) {
              this.notifyService.showError('M???t kh???u kh??ng ???????c b??? tr???ng!', 'Th??ng b??o l???i');
              return;
            }
            if (password == 3) {
              this.notifyService.showError('M???t kh???u t???i thi???u 6 k?? t???!', 'Th??ng b??o l???i');
              return;
            }
            var status = error.messages['account_status'];
            if (status == 1) {
              this.notifyService.showError('Tr???ng th??i ho???t ?????ng ???????c b??? tr???ng!', 'Th??ng b??o l???i');
              return;
            }
            if (status == 2) {
              this.notifyService.showError('Tr???ng th??i ho???t ?????ng kh??ng h???p l???!', 'Th??ng b??o l???i');
              return;
            }
          }
        });
  }

  addParentSingle() {
    this.submitted = true;
    if (this.accountParentId !== undefined && !this.accountParentId) {
      if (this.parentInformationForm.value['account_email'] !== '') {
        if (!this.parentInformationForm.value['password'] || !this.parentInformationForm.value['password']) {
          this.notifyService.showWarning('Vui l??ng ??i???n ?????y ????? th??ng tin t??i kho???n!', 'Th??ng b??o');
          return;
        }
      }
    }
    console.log(this.parentInformationForm.value);
    if (this.parentInformationForm.invalid) {
      return;
    }
    var uploadData = new FormData();
    let tab = '3';

    if (this.parentInformationForm.value['father_name']) {
      uploadData.append('father_name', this.parentInformationForm.value['father_name']);
    }
    if (this.parentInformationForm.value['father_job']) {
      uploadData.append('father_job', this.parentInformationForm.value['father_job']);
    }
    if (this.parentInformationForm.value['father_phone']) {
      uploadData.append('father_phone', this.parentInformationForm.value['father_phone']['number']);
    }
    if (this.parentInformationForm.value['father_email']) {
      uploadData.append('father_email', this.parentInformationForm.value['father_email']);
    }
    if (this.parentInformationForm.value['father_work_address']) {
      uploadData.append('father_work_address', this.parentInformationForm.value['father_work_address']);
    }

    if (this.parentInformationForm.value['mother_name']) {
      uploadData.append('mother_name', this.parentInformationForm.value['mother_name']);
    }
    if (this.parentInformationForm.value['mother_job']) {
      uploadData.append('mother_job', this.parentInformationForm.value['mother_job']);
    }
    if (this.parentInformationForm.value['mother_phone']) {
      uploadData.append('mother_phone', this.parentInformationForm.value['mother_phone']['number']);
    }
    if (this.parentInformationForm.value['mother_email']) {
      uploadData.append('mother_email', this.parentInformationForm.value['mother_email']);
    }
    if (this.parentInformationForm.value['mother_work_address']) {
      uploadData.append('mother_work_address', this.parentInformationForm.value['mother_work_address']);
    }

    if (this.parentInformationForm.value['protector_name']) {
      uploadData.append('protector_name', this.parentInformationForm.value['protector_name']);
    }
    if (this.parentInformationForm.value['protector_job']) {
      uploadData.append('protector_job', this.parentInformationForm.value['protector_job']);
    }
    if (this.parentInformationForm.value['protector_phone']) {
      uploadData.append('protector_phone', this.parentInformationForm.value['protector_phone']['number']);
    }
    if (this.parentInformationForm.value['protector_email']) {
      uploadData.append('protector_email', this.parentInformationForm.value['protector_email']);
    }
    if (this.parentInformationForm.value['protector_work_address']) {
      uploadData.append('protector_work_address', this.parentInformationForm.value['protector_work_address']);
    }

    if (this.parentInformationForm.value['account_email']) {
      uploadData.append('account_email', this.parentInformationForm.value['account_email']);
    }
    if (this.parentInformationForm.value['password']) {
      uploadData.append('password', this.parentInformationForm.value['password']);
    }
    if (this.parentInformationForm.value['account_status']) {
      uploadData.append('account_status', '1');
    } else {
      uploadData.append('account_status', '0');
    }
    uploadData.append('tab', tab);
    this.studentManagementParentInformationService.update(this.studentId, uploadData)
      .subscribe(
        result => {
          const student = this.basicInfoData['student'];
          const protector = this.basicInfoData['protector'];
          const address = this.basicInfoData['address'];
          const data = { 'student': student, 'protector': protector, 'address': address, 'tab': 3 };
          this.basicInforDataEvent.emit(data);
          $('#editStudentModal').modal('hide');
          $('.modal-backdrop').remove();
          this.notifyService.showSuccess('C???p nh???t th??ng tin ph??? huynh th??nh c??ng', 'Th??ng b??o');
        }, error => {
          if (error.messages) {
            var fatherPhone = error.messages['father_phone'];
            if (fatherPhone == 2) {
              this.notifyService.showError('S??? ??i???n tho???i b??? kh??ng h???p l???!', 'Th??ng b??o l???i');
              return;
            }
            var fatherMail = error.messages['father_email'];
            if (fatherMail == 2) {
              this.notifyService.showError('Email b??? kh??ng h???p l???!', 'Th??ng b??o l???i');
              return;
            }
            var motherPhone = error.messages['mother_phone'];
            if (motherPhone == 2) {
              this.notifyService.showError('S??? ??i???n tho???i m??? kh??ng h???p l???!', 'Th??ng b??o l???i');
              return;
            }
            var motherMail = error.messages['mother_email'];
            if (motherMail == 2) {
              this.notifyService.showError('Email m??? kh??ng h???p l???!', 'Th??ng b??o l???i');
              return;
            }
            var protectorPhone = error.messages['protector_phone'];
            if (protectorPhone == 2) {
              this.notifyService.showError('S??? ??i???n tho???i ng?????i b???o tr??? kh??ng h???p l???!', 'Th??ng b??o l???i');
              return;
            }
            var protectorMail = error.messages['protector_email'];
            if (protectorMail == 2) {
              this.notifyService.showError('Email ng?????i b???o tr??? kh??ng h???p l???!', 'Th??ng b??o l???i');
              return;
            }
            var accountEmail = error.messages['account_email'];
            if (accountEmail == 1) {
              this.notifyService.showError('T??i kho???n kh??ng ???????c b??? tr???ng!', 'Th??ng b??o l???i');
              return;
            }
            if (accountEmail == 2) {
              this.notifyService.showError('T??i kho???n email kh??ng h???p l???!', 'Th??ng b??o l???i');
              return;
            }
            if (accountEmail == 4) {
              this.notifyService.showError('T??i kho???n email ???? t???n t???i!', 'Th??ng b??o l???i');
              return;
            }
            var password = error.messages['password'];
            if (password == 1) {
              this.notifyService.showError('M???t kh???u kh??ng ???????c b??? tr???ng!', 'Th??ng b??o l???i');
              return;
            }
            if (password == 3) {
              this.notifyService.showError('M???t kh???u t???i thi???u 6 k?? t???!', 'Th??ng b??o l???i');
              return;
            }
            var status = error.messages['account_status'];
            if (status == 1) {
              this.notifyService.showError('Tr???ng th??i ho???t ?????ng ???????c b??? tr???ng!', 'Th??ng b??o l???i');
              return;
            }
            if (status == 2) {
              this.notifyService.showError('Tr???ng th??i ho???t ?????ng kh??ng h???p l???!', 'Th??ng b??o l???i');
              return;
            }
          }
        });
  }

  getByIdParentInformation() {
    this.parentInformationForm.reset();
    if (this.basicInfoData) {
      if (this.basicInfoData['protector']) {
        this.parentInformationForm.patchValue(this.basicInfoData['protector']);
        if (this.basicInfoData['protector']['user_id']) {
          this.accountParentId = this.basicInfoData['protector']['user_id'];
        }
      }
    }
  }

  setStatus() {
    const checkAccountValue = $('#account_email')[0].value;
    if (checkAccountValue && checkAccountValue !== '') {
      $('.accountStatus').removeAttr('disabled');
    } else {
      $('.accountStatus').attr('disabled', true);
    }
  }
}
