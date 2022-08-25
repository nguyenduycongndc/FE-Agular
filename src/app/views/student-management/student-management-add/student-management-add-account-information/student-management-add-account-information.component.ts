import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '../../../../_services/notification.service';
import { StudentManagementAccountInformationService } from '../../service/student-management-account-information.service';
import { MustMatch } from '../../../../_helpers/must-match.validator';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'student-management-add-account-information',
  templateUrl: './student-management-add-account-information.component.html',
  styleUrls: ['./student-management-add-account-information.component.scss']
})
export class StudentManagementAddAccountInformationComponent implements OnInit {
  @Input() basicInfoData: any;
  @Output() basicInforDataEvent = new EventEmitter<any>();
  formAddAccount: FormGroup
  display: boolean;
  submitted = false;
  samesame = false;
  id_account: number;
  redirectToList: boolean;
  redirectToFirstTab: boolean;
  get f() { return this.formAddAccount.controls; }

  constructor(
    private fb: FormBuilder,
    private notifyService: NotificationService,
    private StudentSevice: StudentManagementAccountInformationService,
    private route: ActivatedRoute,
    private routes: Router
  ) { }

  ngOnInit() {
    this.formAddAccount = this.fb.group({
      email: new FormControl('',[Validators.required,Validators.email,Validators.maxLength(100)]),
      password: new FormControl('', [Validators.required,
        Validators.pattern('^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{6,}$'),
         Validators.maxLength(100)]),
      passwordConfirm: new FormControl('', [Validators.required]),
      checkStatus: new FormControl(false),
    }, {
      validator: MustMatch('password', 'passwordConfirm')
    });
    this.display = true;
  }
  redirectToListPage(){
    this.redirectToList = true;
    this.redirectToFirstTab = false;
  }
  redirectToFirstPage(){
    this.redirectToFirstTab = true;
    this.redirectToList = false;
  }
  reloadPage(){
    window.location.reload();
  }
  onSubmit() {
    this.submitted = true;
    if (this.formAddAccount.invalid) {
      this.redirectToList = false;
      this.redirectToFirstTab = false;
      return;
    }
    if(this.redirectToList){
      var word = "Bạn có muốn lưu lại và quay về danh sách học sinh không?";
    }else{
      var word = "Bạn có muốn lưu lại và tiếp tục thêm mới học sinh không?";
    }
    let question = confirm(word);
    if(question){
      var emailValue = this.formAddAccount.controls['email'].value;
      var passwordValue = this.formAddAccount.controls['password'].value;
      var status = this.formAddAccount.controls['checkStatus'].value;
      if (status) {
        status = '1';
      } else {
        status = '0';
      }
      var i = this.basicInfoData[0]['studentId'];
      var tab = '4';
      const formData = new FormData;
      formData.append('tab', tab);
      formData.append('student_email', emailValue);
      formData.append('student_password', passwordValue);
      formData.append('student_status', status)
      this.StudentSevice.updateAccount(i, formData)
        .subscribe(
          res => {
            const studentId = this.basicInfoData[0]['studentId'];
            const address = this.basicInfoData[0]['address'];
            const data = [
              { 'studentId': studentId, 'address': address, 'tab': 4 }
            ];
            this.basicInforDataEvent.emit(data);
            if(res['message'] == "success"){
            this.notifyService.showSuccess('Thêm tài khoản thành công','Thông báo');
              if(res['id']){
              this.display = false;
              this.id_account = res['id'];
              if(this.redirectToList){
              this.routes.navigate(['/student-management/student-management-list',{}]);
              }
              if(this.redirectToFirstTab){
                window.location.reload();
                // this.routes.navigate(['/student-management/student-management-add',{}]);
              }
              }
            }
          }
          ,error=>{
              let email = error['messages']['student_email'];
              if(email == 1){
                  this.notifyService.showError('Email không được bỏ trống','Thông báo lỗi');
                  return;
                }else if(email == 2){
                  this.notifyService.showError('Định dạng email chưa đúng','Thông báo lỗi');
                  return;
                }else if(email == 4){
                  this.notifyService.showError('Tên tài khoản này đã tồn tại, vui lòng chọn tên khác!','Thông báo lỗi');
                }
              let pass = error['messages']['student_password'];
              if(pass == 1){
                this.notifyService.showError('Mật khẩu không được bỏ trống','Thông báo lỗi');

              }else if(pass == 3){
                this.notifyService.showError('Mật khẩu tối thiểu 6 ký tự','Thông báo lỗi')
              }
          }
        );
  }
  }

  clearValidator(){
    // console.log(this.formAddAccount)
    this.formAddAccount.get('email').clearValidators();
    this.formAddAccount.get('email').setValue('');
    this.formAddAccount.get('password').clearValidators();
    this.formAddAccount.get('password').setValue('');
    this.formAddAccount.get('passwordConfirm').clearValidators();
    this.formAddAccount.get('passwordConfirm').setValue('');
  }
  updateValidation(){
    this.formAddAccount.get('email').setValidators([Validators.required, Validators.email, Validators.maxLength(100)]);
    this.formAddAccount.get('email').updateValueAndValidity();
    this.formAddAccount.get('password').setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(100)]);
    this.formAddAccount.get('password').updateValueAndValidity();
    this.formAddAccount.get('passwordConfirm').setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(100)]);
    this.formAddAccount.get('passwordConfirm').updateValueAndValidity();
  }

}
