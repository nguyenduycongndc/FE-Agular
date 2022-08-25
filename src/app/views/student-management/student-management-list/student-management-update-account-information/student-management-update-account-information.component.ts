import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '../../../../_services/notification.service';
import { StudentManagementAccountInformationService } from '../../service/student-management-account-information.service';
import { MustMatch } from '../../../../_helpers/must-match.validator';
declare var $: any;
@Component({
  selector: 'student-management-update-account-information',
  templateUrl: './student-management-update-account-information.component.html',
  styleUrls: ['./student-management-update-account-information.component.scss']
})
export class StudentManagementUpdateAccountInformationComponent implements OnInit {
  @Input() studentId: number;
  @Input() basicInfoData: any;
  @Output() basicInforDataEvent = new EventEmitter<any>();

  formAddAccount: FormGroup
  display: any;
  submitted = false;
  samesame = false;
  id_account: number;

  constructor(
    private fb: FormBuilder,
    private notifyService: NotificationService,
    private StudentSevice: StudentManagementAccountInformationService
  ) { }

  ngOnInit() {
    const array = this.basicInfoData;

    this.formAddAccount = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(100)]),
      password: new FormControl('',
       [Validators.required,
         Validators.maxLength(100),
          Validators.pattern('^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{6,}$')]),
      passwordConfirm: new FormControl('',
       [Validators.required]),
        checkStatus: new FormControl(false),
    }, {
      validator: MustMatch('password', 'passwordConfirm')
    });
    if (this.basicInfoData['student']['user_id']) {
      this.display = false;
      this.id_account = this.basicInfoData['student']['user_id'];
    } else {
      this.display = true;
    }
  }
  get f() { return this.formAddAccount.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.formAddAccount.invalid) {
      return;
    }
    var emailValue = this.formAddAccount.controls['email'].value;
    var passwordValue = this.formAddAccount.controls['password'].value;
    var status = this.formAddAccount.controls['checkStatus'].value;
    if (status) {
      status = '1';
    } else {
      status = '0';
    }
    var i = this.studentId;
    var tab = '4';
    const formData = new FormData;
    formData.append('tab', tab);
    formData.append('student_email', emailValue);
    formData.append('student_password', passwordValue);
    formData.append('student_status', status)
    this.StudentSevice.updateAccount(i, formData)
      .subscribe(
        res => {
          if (res['message'] == "success") {
            const student = this.basicInfoData['student'];
            const protector = this.basicInfoData['protector'];
            const address = this.basicInfoData['address'];
            const data = { 'student': student, 'protector': protector, 'address': address, 'tab': 4 };
            this.basicInforDataEvent.emit(data);
            $('#editStudentModal').modal('hide');
            $('.modal-backdrop').remove();
            this.notifyService.showSuccess('Thêm tài khoản thành công', 'Thông báo');
            if (res['id']) {
              this.display = false;
              this.id_account = res['id'];
            }
          }
          if (res['message'] == "exists") {
            this.notifyService.showSuccess('Người này đã có tài khoản', 'Thông báo');
          }
        },
        error => {
          let email = error['messages']['student_email'];
          if (email == 1) {
            this.notifyService.showError('Email không được bỏ trống', 'Thông báo lỗi');
            return;
          } else if (email == 2) {
            this.notifyService.showError('Định dạng email chưa đúng', 'Thông báo lỗi');
            return;
          } else if (email == 4) {
            this.notifyService.showError('Tên tài khoản này đã tồn tại, vui lòng chọn tên khác!', 'Thông báo lỗi');
          }
          let pass = error['messages']['student_password'];
          if (pass == 1) {
            this.notifyService.showError('Mật khẩu không được bỏ trống', 'Thông báo lỗi');

          } else if (pass == 3) {
            this.notifyService.showError('Mật khẩu tối thiểu 6 ký tự', 'Thông báo lỗi')
          }
        }
      );
  }

  updateAccountInfo() {
    if (!this.studentId) {
      this.submitted = true;
      if (this.formAddAccount.invalid) {
        return;
      }
      var emailValue = this.formAddAccount.controls['email'].value;
      var passwordValue = this.formAddAccount.controls['password'].value;
      var status = this.formAddAccount.controls['checkStatus'].value;
      if (status) {
        status = '1';
      } else {
        status = '0';
      }
      var i = this.studentId;
      var tab = '4';
      const formData = new FormData;
      formData.append('tab', tab);
      formData.append('student_email', emailValue);
      formData.append('student_password', passwordValue);
      formData.append('student_status', status)
      this.StudentSevice.updateAccount(i, formData)
        .subscribe(
          res => {
            if (res['message'] == "success") {
              const student = this.basicInfoData['student'];
              const protector = this.basicInfoData['protector'];
              const address = this.basicInfoData['address'];
              const data = { 'student': student, 'protector': protector, 'address': address, 'tab': 4 };
              this.basicInforDataEvent.emit(data);
              $('#editStudentModal').modal('hide');
              $('.modal-backdrop').remove();
              this.notifyService.showSuccess('Thêm dữ liệu thành công', 'Thông báo');
              if (res['id']) {
                this.display = false;
                this.id_account = res['id'];
              }
            }
            if (res['message'] == "exists") {
              this.notifyService.showSuccess('Người này đã có tài khoản', 'Thông báo');
            }
          },
          error => {
            let email = error['messages']['student_email'];
            if (email == 1) {
              this.notifyService.showError('Email không được bỏ trống', 'Thông báo lỗi');
              return;
            } else if (email == 2) {
              this.notifyService.showError('Định dạng email chưa đúng', 'Thông báo lỗi');
              return;
            } else if (email == 4) {
              this.notifyService.showError('Tên tài khoản email này đã tồn tại, vui lòng chọn tên khác!', 'Thông báo lỗi');
            }
            let pass = error['messages']['student_password'];
            if (pass == 1) {
              this.notifyService.showError('Mật khẩu không được bỏ trống', 'Thông báo lỗi');

            } else if (pass == 3) {
              this.notifyService.showError('Mật khẩu tối thiểu 6 ký tự', 'Thông báo lỗi')
            }
          }
        );
    }
  }

  clearValidator() {
    // console.log(this.formAddAccount)
    this.formAddAccount.get('email').clearValidators();
    this.formAddAccount.get('email').setValue('');
    this.formAddAccount.get('password').clearValidators();
    this.formAddAccount.get('password').setValue('');
    this.formAddAccount.get('passwordConfirm').clearValidators();
    this.formAddAccount.get('passwordConfirm').setValue('');
  }
  updateValidation() {
    this.formAddAccount.get('email').setValidators([Validators.required, Validators.email, Validators.maxLength(100)]);
    this.formAddAccount.get('email').updateValueAndValidity();
    this.formAddAccount.get('password').setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(100)]);
    this.formAddAccount.get('password').updateValueAndValidity();
    this.formAddAccount.get('passwordConfirm').setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(100)]);
    this.formAddAccount.get('passwordConfirm').updateValueAndValidity();
  }

}
