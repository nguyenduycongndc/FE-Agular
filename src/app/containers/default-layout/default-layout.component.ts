import { Component } from '@angular/core';
import { navItems } from '../../_nav';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../_services';
import { User } from '../../_models';
import { Router } from '@angular/router';
import { constants } from 'os';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeUrlPipe } from '../../_services/safe-url.pipe.service';
import { NotificationService } from '../../_services/notification.service';
import { AddressService } from '../../_services/address.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.css'],
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems = navItems;
  env = environment;
  currentUser: User;
  listInformationUserAccount: [];
  listInformationSchool: [];
  groupCode: string;
  schoolName: string;
  idUser: number; idSchool: number;
  srcData: any; srcSchoolLogo: any; urlLogo: any;
  public img: string;
  url: string;
  selectedYear: any;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private safeUrlPipe: SafeUrlPipe,
    private notifyService: NotificationService,
    private address: AddressService,
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.showSchoolInfo();
    this.loadImage();
    this.loadLogo();
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
  loadImage() {
    this.address.selectedYear()
    .subscribe(
      (data)=>{
        this.selectedYear = data['selectedYear'];
        localStorage.setItem('year_data', JSON.stringify(data));
      }
    )
    this.authenticationService.getPictureUser()
      .subscribe(
        (data) => {
            let dataType = data['type'];
            if(dataType !== "application/json"){
            let url = window.URL.createObjectURL(data);
            this.srcData = this.safeUrlPipe.transform(url);
            }
        });
  }
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      // this.srcData = reader.result;
           let url = window.URL.createObjectURL(reader.result);
          this.srcData = this.safeUrlPipe.transform(url);
    }, false);
  if (image) {
      reader.readAsDataURL(image);
    }
  }
  loadLogo() {
    if (this.idSchool) {
      this.authenticationService.showSchoolLogo(this.idSchool)
        .subscribe(
          (result) => {
            const urlLogo = window.URL.createObjectURL(result);
            // let srcLogo;
            this.urlLogo = this.safeUrlPipe.transform(urlLogo);
            // this.url  = srcLogo['changingThisBreaksApplicationSecurity'];
          });
    }
  }
  showSchoolInfo() {
    const id = 1;
    this.authenticationService.showSchoolInfo(id)
      .subscribe(
        (result) => {
          this.listInformationSchool = result['school'];
          this.schoolName = result['school']['name'];
          this.idSchool = result['school']['id'];
          this.loadLogo();
        },
        error => {
          return false;
        });

  }
  addressDetail:any;
getAccountInformation() {
this.authenticationService.getAccountInformation()
.subscribe(
(data) => {
this.listInformationUserAccount = data.users[0];
let fullAddress = this.listInformationUserAccount['address'];
this.addressDetail = fullAddress.substring(0,fullAddress.indexOf('-'));
this.idUser = data.users[0]['id'];
},
error => {
if (error) {
this.notifyService.showError(error, 'Thông báo lỗi');
}
});
this.loadImage();
}
  changePassword() {
    this.router.navigate(['/account/change-pass']);
    // redirectTo: 'account-information'
  }
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}

