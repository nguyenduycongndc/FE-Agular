import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { StudentManagementAddBasicInformationComponent } from './student-management-add-basic-information/student-management-add-basic-information.component';
import { NotificationService } from '../../../_services/notification.service';
declare var $: any;
@Component({
  selector: 'student-management-add',
  templateUrl: './student-management-add.component.html',
  styleUrls: ['./student-management-add.component.scss']
})
export class StudentManagementAddComponent implements OnInit {
  @ViewChild('addDetailInformationTab', { static: false }) addDetailInformationTab: ElementRef;
  basicInfoData: any;
  tab = 0;
  activeTab = '';
  // @ViewChild(StudentManagementAddBasicInformationComponent) basicInformationComponent: StudentManagementAddBasicInformationComponent;
  // ngAfterViewInit() {
  //   // console.log(this.basicInformationComponent.studentId);
  // }
  addBasicInformationLoaded = false;
  addDetailInformationLoaded = false;
  addParentInformationLoaded = false;
  addAccountInformationLoaded = false;
  constructor(
    private notifyService: NotificationService,
  ) {
    this.confirmNextTab();
  }

  confirmNextTab() {
    $(function () {
      $('#myTab a[data-toggle="tab"]').click(function (e) {
        e.preventDefault();

        if (!$(this).hasClass('active') && isValid($('#myTab a[data-toggle="tab"].active').data('group'))) {
          const confirmSubmit = confirm('Bạn có muốn lưu dữ liệu trước lúc chuyển tab không?');
          if (confirmSubmit === true) {
            const classId = $(this)[0].id;
            if (classId !== undefined && classId === 'parent-information-tab') {
              $(this).tab('show');
              this.activeTab = 'addParentInformation';
              this.addParentInformationLoaded = true;
              $('.nav-tabs #detail-information-tab').addClass('disabled');

            } else if (classId !== undefined && classId === 'account-information-tab') {
              $(this).tab('show');
              this.activeTab = 'addAccountInformation';
              this.addParentInformationLoaded = false;
              this.addAccountInformationLoaded = true;
              $('.nav-tabs #detail-information-tab').addClass('disabled');
              $('.nav-tabs #parent-information-tab').addClass('disabled');
            }
          }
          //  else {
          //   return false;
          // }
        }

        // return false;
      });

      $('.save-data').click(function (e) {
        e.preventDefault();

        if (isValid($(this).data('group'))) {
          // Save data here
        }
      });

      const isValid = group => {
        let valid = true;

        $('[data-group="' + group + '"]:not(button):not(a)').each(function (index, item) {
          $(this).removeClass('is-invalid');
          if (!this.checkValidity()) {
            $(this).addClass('is-invalid');
            valid = false;
          }
        });

        return valid;
      };
    });
  }

  receiveBasicInformationData($event) {
    // $(".nav-tabs #basic-information-tab").addClass('disabled');
    // $('.nav-tabs #detail-information-tab').removeClass('disabled');
    // this.activeTab = 'addParentInformation';
    // this.addBasicInformationLoaded = true;

    // $('.nav-tabs #parent-information-tab').removeClass('disabled');
    // $('.nav-tabs #account-information-tab').removeClass('disabled');
    this.basicInfoData = $event;
    if ($event[0]['tab'] === 1) {
      this.activeTab = 'addDetailInformation';
      this.addDetailInformationLoaded = true;
      $(".nav-tabs #basic-information-tab").addClass('disabled');

      $('.nav-tabs #detail-information-tab').removeClass('disabled');
      $('.nav-tabs #parent-information-tab').removeClass('disabled');
      $('.nav-tabs #account-information-tab').removeClass('disabled');
    } else if ($event[0]['tab'] === 2) {
      this.activeTab = 'addParentInformation';
      this.addParentInformationLoaded = true;
      $(".nav-tabs #detail-information-tab").addClass('disabled');
    } else if ($event[0]['tab'] === 3) {
      this.activeTab = 'addAccountInformation';
      $('.nav-tabs #parent-information-tab').tab('hide');
      // this.addParentInformationLoaded = false;
      this.addAccountInformationLoaded = true;
      $(".nav-tabs #parent-information-tab").addClass('disabled');
    }
  }
  ngOnInit() {
    this.activeTab = 'addBasicInformation';
    this.addBasicInformationLoaded = true;
    this.addDetailInformationLoaded = true;
    $(".nav-tabs #detail-information-tab").addClass('disabled');
    this.addParentInformationLoaded = true;
    $(".nav-tabs #parent-information-tab").addClass('disabled');
    this.addAccountInformationLoaded = true;
    $(".nav-tabs #account-information-tab").addClass('disabled');



    // console.log(this.basicInformationComponent.studentId);
    // if(this.studentId && this.studentId > 0){
    //   $(".nav-tabs #detail-information-tab").removeClass('disabled');
    // }
    // $(".nav-tabs #basic-information-tab").click(function () {
    //   // $tabs.filter('.active').prev('a').removeClass("disabled");
    //   // $("a[data-toggle='tab'").prop('disabled', true);
    //   $(".nav-tabs #detail-information-tab").removeClass('disabled');
    // });
    // $('a[data-toggle="tab"]').on('click', function(){
    //   if ($(this).parent('li').hasClass('disabled')) {
    //     return false;
    //   };
    // });
    // let a;
    // a = this.addDetailInformationTab;
    // console.log($('#addBasicInformation').val());
  }

  resetLoadComponentData() {
    this.addBasicInformationLoaded = false;
    this.addDetailInformationLoaded = false;
    this.addParentInformationLoaded = false;
    this.addAccountInformationLoaded = false;
  }

  // addBasicInformation(activeTab) {
  //   this.resetLoadComponentData();
  //   var confirmSubmit = confirm('Vui lòng kiểm tra và cập nhật dữ liệu trước khi chuyển tab?  Bạn chắc chắn chuyển tab?');
  //   if (confirmSubmit === true) {
  //     this.activeTab = activeTab;
  //     this.addBasicInformationLoaded = true;
  //     $(".nav-tabs #detail-information-tab").removeClass('disabled');
  //   }
  // }

  // addDetailInformation(activeTab) {
  //   this.resetLoadComponentData();
  //   // $(".nav-tabs #basic-information-tab").addClass('disabled');
  //   var confirmSubmit = confirm('Vui lòng kiểm tra và cập nhật dữ liệu trước khi chuyển tab?  Bạn chắc chắn chuyển tab?');
  //   if (confirmSubmit === true) {
  //     this.activeTab = activeTab;
  //     this.addParentInformationLoaded = true;
  //     $(".nav-tabs #basic-information-tab").addClass('disabled');
  //   } else {
  //     this.activeTab = activeTab;
  //     this.addDetailInformationLoaded = true;
  //   }
  // }

  // addParentInformation(activeTab) {
  //   this.resetLoadComponentData();
  //   // this.activeTab = activeTab;
  //   // this.addParentInformationLoaded = true;
  //   // $(".nav-tabs #detail-information-tab").addClass('disabled');
  //   var confirmSubmit = confirm('Vui lòng kiểm tra và cập nhật dữ liệu trước khi chuyển tab?  Bạn chắc chắn chuyển tab?');
  //   if (confirmSubmit === true) {
  //     this.activeTab = activeTab;
  //     this.addParentInformationLoaded = true;
  //     $(".nav-tabs #detail-information-tab").addClass('disabled');
  //   } else {
  //     this.activeTab = 'addDetailInformation';
  //     this.addDetailInformationLoaded = true;
  //   }
  // }

  // addAccountInformation(activeTab) {
  //   this.resetLoadComponentData();
  //   // this.activeTab = activeTab;
  //   // this.addAccountInformationLoaded = true;
  //   $(".parent-information-tab").addClass('disabled');
  //   var confirmSubmit = confirm('Vui lòng kiểm tra và cập nhật dữ liệu trước khi chuyển tab?  Bạn chắc chắn chuyển tab?');
  //   if (confirmSubmit === true) {
  //     this.activeTab = activeTab;
  //     this.addAccountInformationLoaded = true;
  //     $(".nav-tabs #parent-information-tab").addClass('disabled');
  //   } else {
  //     this.activeTab = activeTab;
  //     this.addParentInformationLoaded = true;
  //   }
  // }
}
