import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../_services';
import { NotificationService } from '../../../_services/notification.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  message_success: string;
  message_error: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notifyService: NotificationService

  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {

    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],

    });
    // // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl']  || '/';
  }


  get f() { return this.forgotPasswordForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    const url = window.location.origin;
    const domainAndApp = url + '/#/change-password/?token=';
    this.loading = true;
    this.authenticationService.send_mail(this.f.email.value, domainAndApp)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.message === 'Vui lòng truy cập email của bạn để thay đổi mật khẩu!') {
            this.notifyService.showSuccess(data.message, 'Thành công!');
          } else {
            this.notifyService.showError(data.message, 'Lỗi!');
          }
          this.loading = false;
        },
        error => {
          this.notifyService.showError(error, 'Lỗi!');
          this.loading = false;
        });
  }
  goBack() {
    this.router.navigate(['/login'])
  }
}
