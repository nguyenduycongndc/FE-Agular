import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../_services';
import { first, switchMap } from 'rxjs/operators';
import { AlertService } from '../../_services/alert.service';
import { NotificationService } from '../../_services/notification.service';
import { MustMatch } from '../../_helpers/must-match.validator';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changeForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  message_success: string;
  message_error: string;
  token: string;
  checkPassword = true;

  constructor(
    protected formBuilder: FormBuilder,
    protected route: ActivatedRoute,
    protected router: Router,
    protected authenticationService: AuthenticationService,
    private notifyService: NotificationService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }
  ngOnInit() {

    this.token = this.route.snapshot.queryParams.token;
    this.changeForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6),Validators.pattern('^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{6,}$')]],
      confirmPassword: ['', Validators.required]
    },
    {
      validator: MustMatch('newPassword', 'confirmPassword')
    }
    );
    this.authenticationService.check_password(this.token)
      .subscribe(
        (data) => {
        },
        error => {
          this.router.navigate(['/404']);
        });
  }
  get f() { return this.changeForm.controls; }
  onSubmit() {
    this.submitted = true;
    this.checkPassword = true;
    if (this.changeForm.invalid) {
      return;
    }
    if (this.f.newPassword.value !== this.f.confirmPassword.value) {
      // this.notifyService.showError('Mật khẩu mới và mật khẩu cũ không trùng khớp. Vui lòng kiểm tra lại!', 'Lỗi!');
      this.checkPassword = false;
      return;

    }
    this.loading = true;
    this.authenticationService.change_password(this.token, this.f.newPassword.value)
      .subscribe(
        (data: any) => {
          if (this.f.newPassword.value == this.f.confirmPassword.value) {
            this.notifyService.showSuccess('Bạn đã thay đổi mật khẩu thành công!', 'Xin chúc mừng!');
            this.router.navigate(['/login']);
            this.loading = false;
          }
        },
        error => {
          this.notifyService.showError(error, 'Lỗi!');
          this.loading = false;
        });
  }
  goBack() {
    this.router.navigate(['/login']);
  }
}
