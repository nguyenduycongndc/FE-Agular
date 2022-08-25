import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { NotificationService } from "../../../_services/notification.service";
import { OfficialsListService } from '../service/officials-list.service';
import { UtilityService } from '../../../_services/utils.service';
import { AddressService } from '../../../_services/address.service';
import { StudentManagementDetailInformationService } from '../../student-management/service/student-management-detail-information.service';
declare var $: any;
@Component({
  selector: "officials-list",
  templateUrl: "./officials-list.component.html",
  styleUrls: ["./officials-list.component.scss"],
})
export class OfficialsListComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  fileURL: any;
  form:FormGroup;

//ngModel Filter
  officials_filter: any = {};
  officials_item: any = {};

  loadingDownload = false;
  loadingImport = false;
  loadingExport = false;
  loadingFilter = false;

  headerTeacher = false;
  checkTeacherData = true;

  submitted = false;

  //bindingdata
  gender_id_update:any;
  contract_type_update:any;
  fullname:any;
  firstname:any;
  code:any;
  dob:any;
  phone:any;
  gender_id:any;
  email:any;
  name:any;
  contract_type:any;
  position_update:any;
  degree_update:any;
  status_work_insert:any;
  status_work_update:any;
  province_id: any;
  district_id: any;
  ward_id: any;
  address_detail: any;
  province_current_id: any;
  district_current_id: any;
  ward_current_id: any;
  address_current_detail: any;

  //data
  dataSource: any[];
  dataPosition: any[];
  dataDegree: any[];
  dataStatusWork: any[];
  dataGender: any[];
  dataContractType: any;

  //data địa chỉ
  dataProvince: any[];
  dataDistrict: any[];
  dataWard: any[];
  ward: any[];
  district_update: any[];
  province_update: any[];

  dataProvince_Current: any[];
  dataDistrict_Current: any[];
  dataWard_Current: any[];
  ward_Current: any[];
  district_current_update: any[];
  province_current_update: any[];

  //page count
  p: number = 1;
  countPage: number = 10;
  totalItems = 0;
  dataPaged: any[];

  id:any;
  dataShow:any[];

  //validate dob
  valueCheck:any;
  valueBoolen:any;
  valueDate:any;
  checkDate:boolean;
  checkCurrentDate=true;


  //Excel
  selectedFile: File;

  constructor(
    private fb: FormBuilder,
    private notifyService: NotificationService,
    private officialsListService: OfficialsListService,
    private _utilsService: UtilityService,
    private addressService: AddressService,
    private studentdetailService: StudentManagementDetailInformationService,
  ) {}

  ngOnInit() {

    this.form = this.fb.group({
      search: new FormControl(''),
      position: new FormControl("", [Validators.required]),
      degree: new FormControl("", [Validators.required]),
      status_work: new FormControl("", [Validators.required]),
      contract_type: new FormControl("", [Validators.required]),
      contract_type_update: new FormControl("", [Validators.required]),

      position_insert: new FormControl("", [Validators.required]),
      position_update: new FormControl("", [Validators.required]),
      degree_update: new FormControl("", [Validators.required]),
      degree_insert: new FormControl("", [Validators.required]),
      status_work_insert: new FormControl("", [Validators.required]),
      status_work_update: new FormControl("", [Validators.required]),

      fullname: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(100),
        Validators.pattern("[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ\n" +
          "fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu\n" +
          "UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ, ' ']*")]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(100)]),
      phone: new FormControl(''),
      name: new FormControl(''),
      gender_id: new FormControl("", [Validators.required]),
      gender_id_update: new FormControl("", [Validators.required]),
      gender_id_insert: new FormControl("", [Validators.required]),
      dob: new FormControl("", [Validators.required]),

      province_id: new FormControl("", [Validators.required]),
      district_id: new FormControl("", [Validators.required]),
      ward_id: new FormControl("", [Validators.required]),
      address_detail: new FormControl('', [Validators.required, Validators.maxLength(150)]),

      province_current_id: new FormControl(''),
      district_current_id: new FormControl(''),
      ward_current_id: new FormControl(''),
      address_current_detail: new FormControl(''),

    });


    ////Giá trị mặc định cho dropdown
    //Chức vụ
    this.dataPosition = [
      { id: 1, name: 'Hiệu trưởng' },
      { id: 2, name: 'Phó hiệu trưởng' },
      { id: 3, name: 'Trưởng bộ môn' },
      { id: 4, name: 'Giáo viên' },
      { id: 5, name: 'Văn thư' },
      { id: 6, name: 'khác' },
    ];
    //Trình độ
    this.dataDegree = [
      { id: 1, name: 'Tiến sỹ' },
      { id: 2, name: 'Thạc sỹ' },
      { id: 3, name: 'Đại học' },
      { id: 4, name: 'Cao đẳng' },
      { id: 5, name: 'Trung cấp' },
      { id: 6, name: 'Khác' },
    ];
    //Trạng thái
    this.dataStatusWork = [
      { id: 0, name: 'Đã nghỉ việc' },
      { id: 1, name: 'Đang làm việc' },
      { id: 2, name: 'Thuyên chuyển' },
      { id: 3, name: 'Nghỉ thai sản' },
      { id: 4, name: 'khác' },
    ];
    //Loại hợp đồng
    this.dataContractType = [
      { id: 1, name: 'Biên chế' },
      { id: 2, name: 'Hợp đồng 3 tháng' },
      { id: 3, name: 'Hợp đồng 6 tháng' },
      { id: 4, name: 'Hợp đồng 2 năm' },
      { id: 5, name: 'Khác' },
    ];
    //Giới tính
    this.dataGender = [
      { id: 0, name: 'Nữ' },
      { id: 1, name: 'Nam' },
      { id: 2, name: 'Khác' },
    ];
    ////End Giá trị mặc định cho dropdown
    this.officials_filter.position = 4;
    this.officials_filter.status_work = 1;
    this.officials_filter.degree = 3;

    //Lấy dữ liệu khi vào trang
    // this.list();
    this.province();


  }//end ngOnInit

  get f() {
    return this.form.controls;
  }

  province(){
    this.addressService.getProvince().subscribe((data) => {
      let provinceData = data["provinces"];
      const provinceObj = [];
      provinceData.forEach(function (item) {
        provinceObj.push({ id: item["id"], name: item["name"] });
      });
      this.dataProvince = provinceObj;
      this.dataProvince_Current = provinceObj;
    });
  }

  //Select các trường địa chỉ
  onSelectWard(item: any) {
    this.ward = [];
    const ward = [];
    if (item !== undefined){
      ward.push(item["id"]);
    }
    this.ward = ward;
  }

  onSelectDistrict(item: any) {
    if(this.form.value['district_id']=== null
    ||this.form.value['district_id']=== undefined
    ){

    this.form.get('ward_id').clearValidators();
    this.form.get('ward_id').setValue(null);
    }
    this.officials_filter.ward_id = null;
    this.ward_id = null;
    this.dataWard = [];
    this.ward = [];
    const district = [];
    if (item !== undefined){
       district.push(item["id"]);
    this.district_update = district;
    this.studentdetailService.getWard(item["id"]).subscribe((data) => {
      let wardData = data["wards"];
      const wardObj = [];
      wardData.forEach(function (item) {
        wardObj.push({ id: item["id"], name: item["name"] });
      });
      this.dataWard = wardObj;
    });
    }
  }

  onSelectProvince(item: any) {
    if(this.form.value['province_id']=== null
    ||this.form.value['province_id']=== undefined
    ){

    this.form.get('district_id').clearValidators();
    this.form.get('ward_id').clearValidators();
    this.form.get('district_id').setValue(null);
    this.form.get('ward_id').setValue(null);
    }
    this.district_id = null;
    this.ward_id = null;
    this.officials_filter.district_id = null;
    this.officials_filter.ward_id = null;
    this.district_update = null;
    this.dataDistrict = [];
    this.dataWard = [];
    const province = [];

    if (item !== undefined){
      province.push(item["id"]);
      this.province_update = province;
      this.studentdetailService.getDistrict(item["id"]).subscribe((data) => {
        let districtData = data["districts"];
        const districtObj = [];
        districtData.forEach(function (item) {
          districtObj.push({ id: item["id"], name: item["name"] });
        });
        this.dataDistrict = districtObj;
      });
    }
  }

  //Địa chỉ hiện tại
  onSelectWard_Current(item: any) {
    this.ward_Current = [];
    const ward_Current = [];
    if (item !== undefined){
      ward_Current.push(item["id"]);
    }
    this.ward_Current = ward_Current;
  }

  onSelectDistrict_Current(item: any) {
    if(this.form.value['district_current_id']=== null
    ||this.form.value['district_current_id']=== undefined
    ){

    this.form.get('ward_current_id').clearValidators();
    this.form.get('ward_current_id').setValue(null);
    }
    this.officials_filter.ward_current_id = null;
    this.ward_current_id = null;
    this.dataWard_Current = [];
    this.ward_Current = [];
    const district_Current = [];
    if (item !== undefined){
      district_Current.push(item["id"]);
      this.district_current_update = district_Current;
      this.studentdetailService.getWard(item["id"]).subscribe((data) => {
        let wardData_Origin = data["wards"];
        const wardObj_Origin = [];
        wardData_Origin.forEach(function (item) {
          wardObj_Origin.push({ id: item["id"], name: item["name"] });
        });
        this.dataWard_Current = wardObj_Origin;
      });
    }
  }

  onSelectProvince_Current(item: any) {
    if(this.form.value['province_current_id']=== null
    ||this.form.value['province_current_id']=== undefined
    ){
    this.form.get('district_current_id').clearValidators();
    this.form.get('ward_current_id').clearValidators();
    this.form.get('district_current_id').setValue(null);
    this.form.get('ward_current_id').setValue(null);
    }
    this.district_current_id = null;
    this.ward_current_id = null;
    this.officials_filter.district_current_id = null;
    this.officials_filter.ward_current_id = null;
    this.district_current_update = null;
    this.dataDistrict_Current = [];
    this.dataWard_Current = [];
    const province = [];
    if (item !== undefined){
      province.push(item["id"]);
      this.province_current_update = province;
      this.studentdetailService.getDistrict(item["id"]).subscribe((data) => {
        let districtData = data["districts"];
        const districtObj = [];
        districtData.forEach(function (item) {
          districtObj.push({ id: item["id"], name: item["name"] });
        });
        this.dataDistrict_Current = districtObj;
      });
    }
  }

  // list(){
  //   const data = [];
  //   let status;
  //   let degree;
  //   let position;
  //   let contract_type;
  //   let gender;
  //   const year_id = [29];
  //   this.officialsListService.listDataSource(year_id)
  //   .subscribe((res) => {
  //     // this.dataSource = res['query'];
  //     this.dataSource = res['query'];

  //           const arrAddress = [];
  //           // const schoolTime = this.ddlSemesterMap;
  //           res["query"].forEach(function (items) {
  //             let address_detail = items["address_detail"];
  //             const mang = address_detail.split(",");
  //             const arrName = [];
  //             mang.forEach(function (item) {
  //               var index = item.lastIndexOf("*");
  //               var address = item.substr(index + 1 );
  //               arrName.push(address);
  //             });
  //             //Giới tính
  //             switch(items["gender"]){
  //               case 0:
  //                 gender = "Nữ";
  //                 break;
  //               case 1:
  //                 gender = "Nam";
  //                 break;
  //               case 2:
  //                 gender = "Khác";
  //                 break;
  //             }
  //             //Loại hợp đồng
  //             switch(items["contract_type"]){
  //               case 1:
  //                  contract_type = "Biên chế";
  //                  break;
  //               case 2:
  //                  contract_type = "Hợp đồng 3 tháng";
  //                  break;
  //               case 3:
  //                  contract_type = "Hợp đồng 6 tháng";
  //                  break;
  //               case 4:
  //                  contract_type = "Hợp đồng 2 năm";
  //                  break;
  //               case 5:
  //                  contract_type = "Khác";
  //                  break;
  //             }
  //             //Chức vụ
  //             switch(items["position_id"]){
  //               case 1:
  //                  position = "Hiệu trưởng";
  //                  break;
  //               case 2:
  //                  position = "Phó hiệu trưởng";
  //                  break;
  //               case 3:
  //                  position = "Trưởng bộ môn";
  //                  break;
  //               case 4:
  //                  position = "Giáo viên";
  //                  break;
  //               case 5:
  //                  position = "Khác";
  //                  break;
  //             }
  //             //Trình độ
  //             switch(items["degree_id"]){
  //               case 1:
  //                  degree = "Tiến sỹ";
  //                  break;
  //               case 2:
  //                  degree = "Thạc sỹ";
  //                  break;
  //               case 3:
  //                  degree = "Đại học";
  //                  break;
  //               case 4:
  //                  degree = "Cao đẳng";
  //                  break;
  //               case 5:
  //                  degree = "Trung cấp";
  //                  break;
  //               case 6:
  //                  degree = "Khác";
  //                  break;
  //             }
  //              //Trạng thái
  //             switch(items["status"]){
  //               case 0:
  //                  status = "Đã nghỉ việc";
  //                  break;
  //               case 1:
  //                  status = "Đang làm việc";
  //                  break;
  //               case 2:
  //                  status = "Thuyên chuyển";
  //                  break;
  //               case 3:
  //                  status = "Nghỉ thai sản";
  //                  break;
  //               case 4:
  //                  status = "Khác";
  //                  break;
  //             }

  //             const arr_Name1 = arrName['0'];
  //             const arr_Name2 = arrName['1'];

  //             arrAddress.push({
  //               id: items["id"],
  //               lastname: items["lastname"],
  //               firstname: items["firstname"],
  //               fullname: items["fullname"],
  //               code: items["code"],
  //               dob: items["dob"],
  //               gender: gender,
  //               email: items["email"],
  //               phone: items["phone"],
  //               degree_id: degree,
  //               position_id: position,
  //               status: status,
  //               contract_type: contract_type,
  //               address_detail1: arr_Name1,
  //               address_detail2: arr_Name2,
  //               department_name: items["department_name"],
  //               // position_id: items["position_id"],
  //               // degree_id: items["degree_id"],
  //               // status: items["status"],
  //               // gender: items["gender"],
  //               // contract_type: items["contract_type"],
  //             });
  //           });
  //           this.dataSource = arrAddress;


  //     // this.officials_filter.position = [1,4,3];
  //     this._utilsService.setReverseFullname(this.dataSource, 'firstname', 'reverse_firstname');
  //   });
  // }


  changeDate($event){
    this.checkCurrentDate = true;
    this.valueCheck =  $event.target.validationMessage;
    this.valueBoolen = $event.target.validity.valid;
    this.valueDate = $event.target.value;
    if(
      this.valueCheck === undefined && this.valueBoolen === undefined && this.valueDate === undefined ||
      this.valueCheck === '' && this.valueBoolen === true && this.valueDate === ''||
      this.valueCheck !== '' && this.valueBoolen === false && this.valueDate === ''
      ){
        this.checkDate === false;
      }
    if(this.valueCheck === '' && this.valueBoolen === true && this.valueDate !== '')
    {
      const currentDate = new Date();
      switch(Date.parse(String(this.valueDate )) > Date.parse(String(currentDate))){
        case true:
          this.checkCurrentDate = false;
          break;
        case false:
          this.checkCurrentDate = true;
          break;
      }
    }
  }

  setValidatorInsert()
  {
    this.form.get('email').setValidators([Validators.required, Validators.email, Validators.maxLength(100)]);
    this.form.get('email').updateValueAndValidity();
    this.form.get('fullname').setValidators([Validators.required, Validators.pattern("[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ\n" +
      "fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu\n" +
      "UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ, ' ']*")]);
    this.form.get('fullname').updateValueAndValidity();
    this.form.get('dob').setValidators([Validators.required]);
    this.form.get('dob').updateValueAndValidity();
    this.form.get('position_insert').setValidators([Validators.required]);
    this.form.get('position_insert').updateValueAndValidity();
    this.form.get('province_id').setValidators([Validators.required]);
    this.form.get('province_id').updateValueAndValidity();
    this.form.get('district_id').setValidators([Validators.required]);
    this.form.get('district_id').updateValueAndValidity();
    this.form.get('ward_id').setValidators([Validators.required]);
    this.form.get('ward_id').updateValueAndValidity();
    this.form.get('address_detail').setValidators([Validators.required, Validators.maxLength(150)]);
    this.form.get('address_detail').updateValueAndValidity();
  }

  setValidatorUpdate()
  {
    this.form.get('email').setValidators([Validators.required, Validators.email, Validators.maxLength(100)]);
    this.form.get('email').updateValueAndValidity();
    this.form.get('fullname').setValidators([Validators.required, Validators.pattern("[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ\n" +
      "fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu\n" +
      "UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ, ' ']*")]);
    this.form.get('fullname').updateValueAndValidity();
    this.form.get('dob').setValidators([Validators.required]);
    this.form.get('dob').updateValueAndValidity();
    this.form.get('position_update').setValidators([Validators.required]);
    this.form.get('position_update').updateValueAndValidity();
    this.form.get('province_id').setValidators([Validators.required]);
    this.form.get('province_id').updateValueAndValidity();
    this.form.get('district_id').setValidators([Validators.required]);
    this.form.get('district_id').updateValueAndValidity();
    this.form.get('ward_id').setValidators([Validators.required]);
    this.form.get('ward_id').updateValueAndValidity();
    this.form.get('address_detail').setValidators([Validators.required, Validators.maxLength(150)]);
    this.form.get('address_detail').updateValueAndValidity();
  }

  resetForm(){
    this.officials_item = {};
    this.checkDate = true;
    this.checkCurrentDate = true;
    this.valueCheck = undefined;
    this.valueBoolen = undefined;
    this.valueDate = undefined;
    this.form.get('fullname').clearValidators();
    this.form.get('dob').clearValidators();
    this.form.get('gender_id').clearValidators();
    this.form.get('gender_id_update').clearValidators();
    this.form.get('phone').clearValidators();
    this.form.get('email').clearValidators();
    this.form.get('contract_type').clearValidators();
    this.form.get('contract_type_update').clearValidators();
    this.form.get('position_insert').clearValidators();
    this.form.get('degree_insert').clearValidators();
    this.form.get('status_work_insert').clearValidators();
    this.form.get('position_update').clearValidators();
    this.form.get('degree_update').clearValidators();
    this.form.get('status_work_update').clearValidators();
    this.form.get('province_id').clearValidators();
    this.form.get('district_id').clearValidators();
    this.form.get('ward_id').clearValidators();
    this.form.get('address_detail').clearValidators();
    this.form.get('province_current_id').clearValidators();
    this.form.get('district_current_id').clearValidators();
    this.form.get('ward_current_id').clearValidators();
    this.form.get('address_current_detail').clearValidators();

    this.form.get('fullname').setValue(null);
    this.form.get('dob').setValue(null);
    this.form.get('phone').setValue(null);
    this.form.get('email').setValue(null);

    this.form.get('province_id').setValue(null);
    this.form.get('district_id').setValue(null);
    this.form.get('ward_id').setValue(null);
    this.form.get('address_detail').setValue(null);
    this.form.get('province_current_id').setValue(null);
    this.form.get('district_current_id').setValue(null);
    this.form.get('ward_current_id').setValue(null);
    this.form.get('address_current_detail').setValue(null);

    this.defaultDrop();

  }
  add(){
    $('#createTeacherModal').modal('show');
    this.dataDistrict = null;
    this.dataDistrict_Current = null;
    this.dataWard = null;
    this.dataWard_Current = null;
    // this.form.controls['status_work_insert'].disable();
    this.resetForm();
  }
  defaultDrop(){
    this.officials_item.gender_id = 2;
    this.officials_item.position_insert = 4;
    this.officials_item.status_work_insert = 1;
    this.officials_item.degree_insert = 3;
    this.officials_item.contract_type = 1;
  }

  filter(){
    let status;
    let degree;
    let position;
    let contract_type;
    let gender;
    this.loadingFilter = true;
    this.dataSource = [];
    var uploadData = new FormData();
    var i = 0;

    if(this.form.value['search'])
    {
      uploadData.append('search',this.form.value['search']);
    }
    if (this.officials_filter.position) {
      uploadData.append('position_id' + '[' + 0 + ']',this.officials_filter.position);
    }
    if (this.officials_filter.degree) {
      uploadData.append('degree_id' + '['+ 0 +']',this.officials_filter.degree);
    }
    if (this.officials_filter.status_work >=0) {
      uploadData.append('status'+'['+ 0 +']',this.officials_filter.status_work);
    }

    this.officialsListService.filter(uploadData).subscribe(
      (result) => {
        this.loadingFilter = false;
        if (result['query'].length != 0) {
          this.dataSource = [];
          this.headerTeacher = true;
          this.checkTeacherData = true;
          this.dataSource = result['query'];
          this.p = 1;
          //binding lại dữ liệu/////////////////////////////////
          const arrAddress = [];
          result["query"].forEach(function (items) {
            let address_detail = items["address_detail"];
            const mang = address_detail.split(",");
            const arrName = [];
            mang.forEach(function (item) {
              var index = item.lastIndexOf("*");
              var address = item.substr(index + 1 );
              arrName.push(address);
            });
            //Giới tính
            switch(items["gender"]){
              case 0:
                gender = "Nữ";
                break;
              case 1:
                gender = "Nam";
                break;
              case 2:
                gender = "Khác";
                break;
            }
            //Loại hợp đồng
            switch(items["contract_type"]){
              case 1:
                 contract_type = "Biên chế";
                 break;
              case 2:
                 contract_type = "Hợp đồng 3 tháng";
                 break;
              case 3:
                 contract_type = "Hợp đồng 6 tháng";
                 break;
              case 4:
                 contract_type = "Hợp đồng 2 năm";
                 break;
              case 5:
                 contract_type = "Khác";
                 break;
            }
            //Chức vụ
            switch(items["position_id"]){
              case 1:
                 position = "Hiệu trưởng";
                 break;
              case 2:
                 position = "Phó hiệu trưởng";
                 break;
              case 3:
                 position = "Trưởng bộ môn";
                 break;
              case 4:
                 position = "Giáo viên";
                 break;
              case 5:
                 position = "Khác";
                 break;
            }
            //Trình độ
            switch(items["degree_id"]){
              case 1:
                 degree = "Tiến sỹ";
                 break;
              case 2:
                 degree = "Thạc sỹ";
                 break;
              case 3:
                 degree = "Đại học";
                 break;
              case 4:
                 degree = "Cao đẳng";
                 break;
              case 5:
                 degree = "Trung cấp";
                 break;
              case 6:
                 degree = "Khác";
                 break;
            }
             //Trạng thái
            switch(items["status"]){
              case 0:
                 status = "Đã nghỉ việc";
                 break;
              case 1:
                 status = "Đang làm việc";
                 break;
              case 2:
                 status = "Thuyên chuyển";
                 break;
              case 3:
                 status = "Nghỉ thai sản";
                 break;
              case 4:
                 status = "Khác";
                 break;
            }
            const arr_Name1 = arrName['0'];
            const arr_Name2 = arrName['1'];

            arrAddress.push({
              id: items["id"],
              lastname: items["lastname"],
              firstname: items["firstname"],
              fullname: items["fullname"],
              summary_name: items["summary_name"],
              code: items["code"],
              dob: items["dob"],
              gender: gender,
              email: items["email"],
              phone: items["phone"],
              degree_id: degree,
              position_id: position,
              status: status,
              contract_type: contract_type,
              address_detail1: arr_Name1,
              address_detail2: arr_Name2,
              department_name: items["department_name"],
              // position_id: items["position_id"],
              // degree_id: items["degree_id"],
              // status: items["status"],
              // gender: items["gender"],
              // contract_type: items["contract_type"],
            });
          });
          this.dataSource = arrAddress;
          this._utilsService.setReverseFullname(this.dataSource, 'fullname', 'reverse_fullname');
          //End binding lại dữ liệu/////////////////////////////
        } else {
          this.checkTeacherData = false;
          this.headerTeacher = true;
          this.dataSource = [];
          this.totalItems = 1;
          this.p = 1;
        }
      },
      (error) => {
        this.loadingFilter = false;
        Object.keys(error).forEach(function (key) {
          this.notifyService.showError(error[key], 'Thông báo lỗi');
        });
      }
    );
  }

  // filter(){
  //   let status;
  //   let degree;
  //   let position;
  //   let contract_type;
  //   let gender;
  //   this.loadingFilter = true;
  //   this.dataSource = [];
  //   var uploadData = new FormData();
  //   var i = 0;
  //   const arr_position = [];
  //   const arr_degree = [];
  //   const arr_status = [];

  //   let search = this.form.value['search'];
  //   if (this.officials_filter.position) {
  //     arr_position.push('position_id' + '[' + 0 + ']' + '=' +this.officials_filter.position);
  //   }
  //   if (this.officials_filter.degree) {
  //     arr_degree.push('degree_id' + '[' + 0 + ']' + '=' +this.officials_filter.degree);
  //   }
  //   if (this.officials_filter.status_work) {
  //     arr_status.push('status' + '[' + 0 + ']' + '=' +this.officials_filter.status_work);
  //   }
  //   let concat_position = arr_position.join('&');
  //   let concat_degree = arr_degree.join('&');
  //   let concat_status = arr_status.join('&');
  //   let x = '&';
  //   this.officialsListService.listTeacher(search, concat_position, concat_degree, concat_status, x).subscribe(
  //     (result) => {
  //       this.loadingFilter = false;
  //       if (result['query'].length != 0) {
  //         this.dataSource = [];
  //         this.headerTeacher = true;
  //         this.checkTeacherData = true;
  //         this.dataSource = result['query'];
  //         this.p = 1;
  //         //binding lại dữ liệu/////////////////////////////////
  //         const arrAddress = [];
  //         result["query"].forEach(function (items) {
  //           let address_detail = items["address_detail"];
  //           const mang = address_detail.split(",");
  //           const arrName = [];
  //           mang.forEach(function (item) {
  //             var index = item.lastIndexOf("*");
  //             var address = item.substr(index + 1 );
  //             arrName.push(address);
  //           });
  //           //Giới tính
  //           switch(items["gender"]){
  //             case 0:
  //               gender = "Nữ";
  //               break;
  //             case 1:
  //               gender = "Nam";
  //               break;
  //             case 2:
  //               gender = "Khác";
  //               break;
  //           }
  //           //Loại hợp đồng
  //           switch(items["contract_type"]){
  //             case 1:
  //                contract_type = "Biên chế";
  //                break;
  //             case 2:
  //                contract_type = "Hợp đồng 3 tháng";
  //                break;
  //             case 3:
  //                contract_type = "Hợp đồng 6 tháng";
  //                break;
  //             case 4:
  //                contract_type = "Hợp đồng 2 năm";
  //                break;
  //             case 5:
  //                contract_type = "Khác";
  //                break;
  //           }
  //           //Chức vụ
  //           switch(items["position_id"]){
  //             case 1:
  //                position = "Hiệu trưởng";
  //                break;
  //             case 2:
  //                position = "Phó hiệu trưởng";
  //                break;
  //             case 3:
  //                position = "Trưởng bộ môn";
  //                break;
  //             case 4:
  //                position = "Giáo viên";
  //                break;
  //             case 5:
  //                position = "Khác";
  //                break;
  //           }
  //           //Trình độ
  //           switch(items["degree_id"]){
  //             case 1:
  //                degree = "Tiến sỹ";
  //                break;
  //             case 2:
  //                degree = "Thạc sỹ";
  //                break;
  //             case 3:
  //                degree = "Đại học";
  //                break;
  //             case 4:
  //                degree = "Cao đẳng";
  //                break;
  //             case 5:
  //                degree = "Trung cấp";
  //                break;
  //             case 6:
  //                degree = "Khác";
  //                break;
  //           }
  //            //Trạng thái
  //           switch(items["status"]){
  //             case 0:
  //                status = "Đã nghỉ việc";
  //                break;
  //             case 1:
  //                status = "Đang làm việc";
  //                break;
  //             case 2:
  //                status = "Thuyên chuyển";
  //                break;
  //             case 3:
  //                status = "Nghỉ thai sản";
  //                break;
  //             case 4:
  //                status = "Khác";
  //                break;
  //           }
  //           const arr_Name1 = arrName['0'];
  //           const arr_Name2 = arrName['1'];

  //           arrAddress.push({
  //             id: items["id"],
  //             lastname: items["lastname"],
  //             firstname: items["firstname"],
  //             fullname: items["fullname"],
  //             code: items["code"],
  //             dob: items["dob"],
  //             gender: gender,
  //             email: items["email"],
  //             phone: items["phone"],
  //             degree_id: degree,
  //             position_id: position,
  //             status: status,
  //             contract_type: contract_type,
  //             address_detail1: arr_Name1,
  //             address_detail2: arr_Name2,
  //             department_name: items["department_name"],
  //             // position_id: items["position_id"],
  //             // degree_id: items["degree_id"],
  //             // status: items["status"],
  //             // gender: items["gender"],
  //             // contract_type: items["contract_type"],
  //           });
  //         });
  //         this.dataSource = arrAddress;
  //         this._utilsService.setReverseFullname(this.dataSource, 'firstname', 'reverse_firstname');
  //         //End binding lại dữ liệu/////////////////////////////
  //       } else {
  //         this.checkTeacherData = false;
  //         this.headerTeacher = true;
  //         this.dataSource = [];
  //         this.totalItems = 1;
  //         this.p = 1;
  //       }
  //     },
  //     (error) => {
  //       this.loadingFilter = false;
  //       Object.keys(error).forEach(function (key) {
  //         this.notifyService.showError(error[key], 'Thông báo lỗi');
  //       });
  //     }
  //   );
  // }

  //Thêm mới
  create(){
    // console.log(this.officials_item);
    this.setValidatorInsert();//Hiển thị validate
    this.submitted = true;

    if (
      this.form.controls['fullname'].invalid ||
      this.form.controls['dob'].invalid ||
      this.form.controls['email'].invalid ||
      this.form.controls['province_id'].invalid ||
      this.form.controls['district_id'].invalid ||
      this.form.controls['ward_id'].invalid ||
      this.form.controls['address_detail'].invalid
    ) {
      return;
    }

    var uploadData = new FormData();
    let Name;
    let nameStudent = this.officials_item.fullname;
    if (nameStudent) {
      var fullname = nameStudent.lastIndexOf(" ");
      var fistname = nameStudent.substr(fullname + 1 );
      var lastname = nameStudent.substr(0,fullname);
      Name = nameStudent;
    }
    else {
      Name = '';
    }
    if(nameStudent){
      uploadData.append('firstname', fistname);
      uploadData.append('lastname', lastname);
    }
    // this.officials_item.teacher_id
    if (this.officials_item.dob) {
      uploadData.append('dob',this.officials_item.dob);
    }
    if (this.officials_item.name) {
      uploadData.append('summary_name',this.officials_item.name);
    }
    if (this.officials_item.phone) {
      uploadData.append('phone',this.officials_item.phone);
    }
    if (this.officials_item.gender_id >=0 ) {
      uploadData.append('gender',this.officials_item.gender_id);
    }
    if (this.officials_item.email) {
      uploadData.append('email',this.officials_item.email);
    }
    if (this.officials_item.position_insert) {
      uploadData.append('position_id',this.officials_item.position_insert);
    }
    if (this.officials_item.degree_insert) {
      uploadData.append('degree_id',this.officials_item.degree_insert);
    }
    if (this.officials_item.contract_type) {
      uploadData.append('contract_type',this.officials_item.contract_type);
    }
    ///address
    if (this.officials_item.province_id) {
      uploadData.append('province_id',this.officials_item.province_id.id);
    }
    if (this.officials_item.district_id) {
      uploadData.append('district_id',this.officials_item.district_id.id);
    }
    if (this.officials_item.ward_id) {
      uploadData.append('ward_id',this.officials_item.ward_id.id);
    }
    if (this.officials_item.address_detail) {
      // uploadData.append('address_detail',this.officials_item.address_detail);
      let getAddress =  this.officials_item.address_detail;
      let addressFull = getAddress+' - '+this.officials_item.ward_id.name
      +' - '+this.officials_item.district_id.name
      +' - '+this.officials_item.province_id.name;
      uploadData.append('address_detail', addressFull);
    }

    ///address current
    if (this.officials_item.province_current_id) {
      uploadData.append('province_id2',this.officials_item.province_current_id.id);
    }
    if (this.officials_item.district_current_id) {
      uploadData.append('district_id2',this.officials_item.district_current_id.id);
    }
    if (this.officials_item.ward_current_id) {
      uploadData.append('ward_id2',this.officials_item.ward_current_id.id);
    }
    if (this.officials_item.address_current_detail) {
      // uploadData.append('address_detail2',this.officials_item.address_current_detail);
      let getCurrentAddress =  this.officials_item.address_current_detail;
      let addressCurrentFull = getCurrentAddress+' - '+this.officials_item.ward_current_id.name
      +' - '+this.officials_item.district_current_id.name
      +' - '+this.officials_item.province_current_id.name;
      uploadData.append('address_detail2', addressCurrentFull);
    }

    //Thực thi thêm mới
    this.officialsListService.create(uploadData)
      .subscribe(
        (res) => {
          //Khi thêm mới thành công thì ẩn modal
          $('#createTeacherModal').modal('hide');
          $('.modal-backdrop').remove();
          this.notifyService.showSuccess('Thêm mới thành công', 'Thông báo');
          this.filter();
        },
        // else if (error.error == 11) {
        //   this.notifyService.showError("Lỗi phòng ban", "Thông báo lỗi");
        error => {
          switch(error.error){
            case 11:
              this.notifyService.showError("Tuổi giáo viên không được nhỏ hơn 21 tuổi", "Thông báo lỗi");
            break;
            case 12:
              this.notifyService.showError("Địa chỉ không tồn tại", "Thông báo lỗi");
            break;
          }

          if (error.messages.email == 2) {//check email
            this.notifyService.showError("Sai định dạng gmail vui lòng kiểm tra lại!", "Thông báo lỗi");
          }else if(error.messages.email == 4){
            this.notifyService.showError("Gmail đã tồn tại vui lòng nhập địa chỉ gmail khác!", "Thông báo lỗi");
          }

          if(error.messages.phone == 6){//check phone
            this.notifyService.showError("Số điện thoại phải nhập số, vui lòng kiểm tra lại!", "Thông báo lỗi");
          }//end-if check phone

        }
      );



  }

  //Cập nhật
  update(id:number){
    this.setValidatorUpdate();//Hiển thị validate
    let Name;
    this.submitted = true;
    if (
      this.form.controls['fullname'].invalid ||
      this.form.controls['dob'].invalid ||
      this.form.controls['email'].invalid ||
      this.form.controls['province_id'].invalid ||
      this.form.controls['district_id'].invalid ||
      this.form.controls['ward_id'].invalid ||
      this.form.controls['address_detail'].invalid
    ) {
      return;
    }

    var uploadData = new FormData();
    let nameStudent = this.form.value['fullname'];

    if (nameStudent) {
      var fullname = nameStudent.lastIndexOf(" ");
      var fistname = nameStudent.substr(fullname + 1);
      var lastname = nameStudent.substr(0, fullname);
      Name = nameStudent;
    }
    else {
      Name = '';
    }
    if (nameStudent) {
      uploadData.append('firstname', fistname);
      uploadData.append('lastname', lastname);
    }

    if (this.form.value['phone'] && this.form.value['phone'].length > 0) {
      uploadData.append('phone', this.form.value['phone']);
    }

    if (this.form.value['name'] && this.form.value['name'].length > 0) {
      uploadData.append('summary_name', this.form.value['name']);
    }

    if (this.form.value['gender_id_update']) {
      uploadData.append('gender', this.form.value['gender_id_update']['id']);
    }

    if (this.form.value['dob'] && this.form.value['dob'].length > 0) {
      uploadData.append('dob', this.form.value['dob']);
    }

    if (this.form.value['email'] && this.form.value['email'].length > 0) {
      uploadData.append('email', this.form.value['email']);
    }

    if (this.form.value['position_update']) {
      uploadData.append('position_id', this.form.value['position_update']['id']);
    }

    if (this.form.value['degree_update']) {
      uploadData.append('degree_id', this.form.value['degree_update']['id']);
    }

    if (this.form.value['status_work_update']) {
      uploadData.append('status', this.form.value['status_work_update']['id']);
    }

    if (this.form.value['contract_type_update']) {
      uploadData.append('contract_type', this.form.value['contract_type_update']['id']);
    }

    let getAddress = this.form.value["address_detail"];
    let getCurrentAddress = this.form.value["address_current_detail"];

    if(getAddress !== null
      && this.form.value["province_id"]!== null
      && this.form.value["district_id"]!== null
      && this.form.value["ward_id"]!== null)
      {
        let addressFull = getAddress !== undefined ?
        getAddress+' - '+ this.form.value["ward_id"]["name"]
        +' - '+this.form.value["district_id"]["name"]
        +' - '+this.form.value["province_id"]["name"]
        :
        ' - '+ this.form.value["ward_id"]["name"]
        +' - '+this.form.value["district_id"]["name"]
        +' - '+this.form.value["province_id"]["name"];

          uploadData.append("address_detail", addressFull);
      }else{
        var addressFull = getAddress;
      }
    if(getCurrentAddress !== null
      && this.form.value["province_current_id"]!== null
      && this.form.value["district_current_id"]!== null
      && this.form.value["ward_current_id"]!== null)
      {
        let addressCurrentFull = getCurrentAddress !== undefined ?
         getCurrentAddress+' - '+ this.form.value["ward_current_id"]["name"]
            +' - '+this.form.value["district_current_id"]["name"]
            +' - '+this.form.value["province_current_id"]["name"]
            :
            ' - '+ this.form.value["ward_current_id"]["name"]
            +' - '+this.form.value["district_current_id"]["name"]
            +' - '+this.form.value["province_current_id"]["name"];
          uploadData.append("address_detail2", addressCurrentFull);
      }else{
        var addressCurrentFull = getCurrentAddress;
      }

    //province
    if (this.form.value['province_id']) {
      uploadData.append('province_id', this.form.value['province_id']['id']);
    }
    if (this.form.value['province_current_id']) {
      uploadData.append('province_id2', this.form.value['province_current_id']['id']);
    }

    //district
    if (this.form.value['district_id']) {
      uploadData.append('district_id', this.form.value['district_id']['id']);
    }
    if (this.form.value['district_current_id']) {
      uploadData.append('district_id2', this.form.value['district_current_id']['id']);
    }

    //ward
    if (this.form.value['ward_id']) {
      uploadData.append('ward_id', this.form.value['ward_id']['id']);
    }
    if (this.form.value['ward_current_id']) {
      uploadData.append('ward_id2', this.form.value['ward_current_id']['id']);
    }

    this.officialsListService.update(id,uploadData).subscribe(
      (res)=>{
        this.notifyService.showSuccess("Sửa thành công","Thông báo");

        $("#editTeacherModal").modal("hide");
        $(".modal-backdrop").remove();
        this.filter();
      },error => {
        switch(error.error){
          case 11:
            this.notifyService.showError("Tuổi giáo viên không được nhỏ hơn 21 tuổi", "Thông báo lỗi");
          break;
          case 12:
            this.notifyService.showError("Địa chỉ không tồn tại", "Thông báo lỗi");
          break;
        }

        if (error.messages.email == 2) {//check email
          this.notifyService.showError("Sai định dạng gmail vui lòng kiểm tra lại!", "Thông báo lỗi");
        }else if(error.messages.email == 4){
          this.notifyService.showError("Gmail đã tồn tại vui lòng nhập địa chỉ gmail khác!", "Thông báo lỗi");
        }

        if(error.messages.phone == 6){//check phone
          this.notifyService.showError("Số điện thoại phải nhập số, vui lòng kiểm tra lại!", "Thông báo lỗi");
        }//end-if check phone
      });

  }


  find(id:any){
    this.resetForm();
    this.dataDistrict = [];
    this.dataDistrict_Current = [];
    this.dataWard = [];
    this.dataWard_Current = [];

    this.province_id = null;
    this.province_current_id = null;
    this.district_id = null;
    this.district_current_id = null;
    this.ward_id = null;
    this.ward_current_id = null;
    // $('#editTeacherModal').modal('show');
    this.officialsListService.find(id).subscribe((data) => {
      //Fill dữ liệu lên dropdown
      this.id = data["teacher"]["id"];
      const arr = [];
      arr.push(data["teacher"]);
      let concat_name = data['teacher']['lastname']+' '+data['teacher']['firstname'];
      arr[0]['fullname'] = concat_name; // gộp name để push lại mảng
      data['address'].forEach(el=>{//Lấy địa chỉ
        if(el.type == 1){
          arr[0]['address_detail'] = el.address_detail;
          arr[0]['province_id'] = el.province_id;
          arr[0]['district_id'] = el.district_id;
          arr[0]['ward_id'] = el.ward_id;
        }
        if(el.type == 2){
          arr[0]['address_current_detail'] = el.address_detail;
          arr[0]['province_current_id'] = el.province_id;
          arr[0]['district_current_id'] = el.district_id;
          arr[0]['ward_current_id'] = el.ward_id;
        }
      })
      this.dataShow = arr[0];
      this.fullname = arr[0]['fullname'];
      this.name = arr[0]['summary_name'];
      this.dob = arr[0]['dob'];
      this.email = arr[0]['email'];
      this.code = arr[0]['code'];
      this.phone = arr[0]['phone'];

      // this.province_id = arr[0]['province_id'];
      // this.district_id = arr[0]['district_id'];
      // this.ward_id = arr[0]['ward_id'];

      // this.province_current_id = arr[0]['province_current_id'];
      // this.district_current_id = arr[0]['district_current_id'];
      // this.ward_current_id = arr[0]['ward_current_id'];
      // this.address_detail = arr[0]['address_detail'];
      // this.address_current_detail = arr[0]['address_current_detail'];
      if (arr[0]['address_detail']) {
        const address_detail = arr[0]['address_detail'];
        if (address_detail) {
          var countAddress = address_detail.indexOf("-");
          this.address_detail = address_detail.substr(0, countAddress)
        }
      }
      if (arr[0]['address_current_detail']) {
        const address_current_detail = arr[0]['address_current_detail'];
        if (address_current_detail) {
          var concatAddress = address_current_detail.indexOf("-");
          this.address_current_detail = address_current_detail.substr(0, concatAddress)
        }
      }

      //show giới tính
      const selectGender = [];
      const mapGender = this.dataGender.map(function (x) { return x.id; }).indexOf(arr[0]['gender']);
      if (mapGender !== -1) {
        selectGender.push({ id: this.dataGender[mapGender]['id'], name: this.dataGender[mapGender]['name'] });
        this.gender_id_update = { id: selectGender[0]['id'], name: selectGender[0]['name'] };
      }

      //show trình độ
      const selectDegree = [];
      const mapDegree = this.dataDegree.map(function (x) { return x.id; }).indexOf(arr[0]['degree_id']);
      if (mapDegree !== -1) {
        selectDegree.push({ id: this.dataDegree[mapDegree]['id'], name: this.dataDegree[mapDegree]['name'] });
        this.degree_update = { id: selectDegree[0]['id'], name: selectDegree[0]['name'] };
      }

      //show chức vụ
      const selectPosition = [];
      const mapPosition = this.dataPosition.map(function (x) { return x.id; }).indexOf(arr[0]['position_id']);
      if (mapPosition !== -1) {
        selectPosition.push({ id: this.dataPosition[mapPosition]['id'], name: this.dataPosition[mapPosition]['name'] });
        this.position_update = { id: selectPosition[0]['id'], name: selectPosition[0]['name'] };
      }

      //show hợp đồng
      const selectContract = [];
      const mapContract = this.dataContractType.map(function (x) { return x.id; }).indexOf(arr[0]['contract_type']);
      if (mapContract !== -1) {
        selectContract.push({ id: this.dataContractType[mapContract]['id'], name: this.dataContractType[mapContract]['name'] });
        this.contract_type_update = { id: selectContract[0]['id'], name: selectContract[0]['name'] };
      }

      //show trạng thái
      const selectStatusWork = [];
      const mapStatus = this.dataStatusWork.map(function (x) { return x.id; }).indexOf(arr[0]['status']);
      if (mapStatus !== -1) {
        selectStatusWork.push({ id: this.dataStatusWork[mapStatus]['id'], name: this.dataStatusWork[mapStatus]['name'] });
        this.status_work_update = { id: selectStatusWork[0]['id'], name: selectStatusWork[0]['name'] };
      }

      //SHow địa chỉ thường trú
      const arrProvince = [];
      let mapProvince = this.dataProvince.map(function (x) { return x.id; }).indexOf(Number(arr[0]['province_id']));
      // let mapProvince = this.dataProvince.map(function (x) { return x.id; }).indexOf(Number(this.province_id));
      if (mapProvince !==  -1) {
        arrProvince.push({ id: this.dataProvince[mapProvince]['id'], name: this.dataProvince[mapProvince]['name'] });
        this.province_id = { id: arrProvince[0]['id'], name: arrProvince[0]['name'] };
      }
      //show district
      //lay id province show district
      if(this.province_id){
        this.addressService.getDistrict(this.province_id['id'])
          .subscribe(
            rel => {
              this.dataDistrict = rel['districts'];
              const arrDistrict = [];
              const mapDistrict = this.dataDistrict.map(function (x) { return x.id; }).indexOf(Number(arr[0]['district_id']));
              if (mapDistrict !== -1) {
                arrDistrict.push({ id: this.dataDistrict[mapDistrict]['id'], name: this.dataDistrict[mapDistrict]['name'] });
                this.district_id = { id: arrDistrict[0]['id'], name: arrDistrict[0]['name'] };
              }
              //lấy id district show ward
              if(this.district_id){
                this.addressService.getWard(this.district_id['id'])
                  .subscribe(
                    result => {
                      this.dataWard = result['wards'];
                      const arrWard = [];
                      const mapWard = this.dataWard.map(function (x) { return x.id; }).indexOf(Number(arr[0]['ward_id']));
                      if (mapWard !== -1) {
                        arrWard.push({ id: this.dataWard[mapWard]['id'], name: this.dataWard[mapWard]['name'] });
                        this.ward_id = { id: arrWard[0]['id'], name: arrWard[0]['name'] };
                      }
                });
              }//end--if--ward
            });
        }//end--if--district
      //Show Địa chỉ nguyên quán
      //show province
      if(arr[0]['province_current_id']){// check province_current_id

        const arrProvince_Current = [];
        const mapProvince_Current = this.dataProvince_Current.map(function (x) { return x.id; }).indexOf(Number(arr[0]['province_current_id']));
        if (mapProvince_Current !== -1) {
          arrProvince_Current.push({ id: this.dataProvince_Current[mapProvince_Current]['id'], name: this.dataProvince_Current[mapProvince_Current]['name'] });
          this.province_current_id = { id: arrProvince_Current[0]['id'], name: arrProvince_Current[0]['name'] };
        }

        //show district
        if(this.province_current_id){
          this.addressService.getDistrict(this.province_current_id['id'])
            .subscribe(
              rel1 => {
                this.dataDistrict_Current = rel1['districts'];
                const arrDistrict_Current = [];
                const mapDistrict_Current = this.dataDistrict_Current.map(function (x) { return x.id; }).indexOf(Number(arr[0]['district_current_id']));
                if (mapDistrict_Current !== -1) {
                  arrDistrict_Current.push({ id: this.dataDistrict_Current[mapDistrict_Current]['id'], name: this.dataDistrict_Current[mapDistrict_Current]['name'] });
                  this.district_current_id = { id: arrDistrict_Current[0]['id'], name: arrDistrict_Current[0]['name'] };
                }
                //lấy id district show ward
                if(this.district_current_id){
                this.addressService.getWard(this.district_current_id['id'])
                  .subscribe(
                    result1 => {
                      this.dataWard_Current = result1['wards'];
                      const arrWard_Current = [];
                      const mapWard_Current = this.dataWard_Current.map(function (x) { return x.id; }).indexOf(Number(arr[0]['ward_current_id']));
                      if (mapWard_Current !== -1) {
                        arrWard_Current.push({ id: this.dataWard_Current[mapWard_Current]['id'], name: this.dataWard_Current[mapWard_Current]['name'] });
                        this.ward_current_id = { id: arrWard_Current[0]['id'], name: arrWard_Current[0]['name'] };
                      }
                    });
                  }//end--if--ward_id
              });
          }else{
            this.dataWard_Current = [];
            this.dataDistrict_Current = [];
          }//end--if--district_id
        }//end-if check tồn tại province_current_id




    });


      // });




  }

  //Xóa
  delete(id:any){

    this._utilsService.showConfirm('Bạn chắc chắn muốn xóa bản ghi này không?', confirm => {
      if (confirm) {
        this.officialsListService.delete(id).subscribe(
          (rs) => {
            this.notifyService.showSuccess('Xóa thành công!','Thông báo');
            // this.filter();
            this.dataSource = this.dataSource.filter(item => item.id !== id);
          },
          (error) => {
            if (error.error == 10) {
              this.notifyService.showError("Bản ghi này không còn tồn tại, vui lòng kiểm tra lại!", "Thông báo lỗi");
            } else {
              this.notifyService.showError("Xóa thất bại.", "Thông báo lỗi");
            }
          }
        );
      }
    });

  }

 // Tải file mẫu
 downloadTemplateFile() {
  this.officialsListService.downloadSampleFile().subscribe((res) => {
    this.loadingDownload = false;
    // window.open(window.URL.createObjectURL(res));
    var downloadURL = window.URL.createObjectURL(res);
    var link = document.createElement('a');
    link.href = downloadURL;
    link.download = "FileMau_CanBo.xlsx";
    link.click();
  });
}

// Nhập tự file excel
importFile() {

  this.loadingImport = true;
  var formData = new FormData();
  if(this.fileURL === undefined
    ||this.fileURL === ''
    ||this.fileURL === null){
    this.loadingImport = false;
    this.notifyService.showError('File excel chỉ nhận file có định dạng .xls, .xlsx, hoặc .csv','thông báo')
  }else{
    formData.append('data', this.fileInput.nativeElement.files[0])
    this.officialsListService.importExcel(formData)
    .subscribe(
      result => {
        this.loadingImport = false;
        if(result['success'] === 0){
          let mess = 'Tải lên thành công ' + result['success'] + ' bản ghi. Có ' +result['error']+ ' bản ghi bị lỗi !';
          this.notifyService.showError(mess,'Thông báo');
          this.fileInput.nativeElement.value = '';
          this.fileURL = '';
          if(result['error'] !== 0){
            let err = result['data_error'];

            this.officialsListService.exportExcelErrors(err)
            .subscribe((res)=>{
              // window.open(window.URL.createObjectURL(res));
              var downloadURL = window.URL.createObjectURL(res);
              var link = document.createElement('a');
              link.href = downloadURL;
              link.download = "File_Errors.xlsx";
              link.click();
            },
              error =>{
                this.loadingImport = false;
              }
            );
        }
        this.filter();
        }else{
          let mess = 'Tải lên thành công ' + result['success'] + ' bản ghi. Có ' +result['error']+ ' bản ghi bị lỗi !';
          this.notifyService.showSuccess(mess,'Thông báo');
          this.fileInput.nativeElement.value = '';
          this.fileURL = '';

          let err = result['data_error'];
          if(result['error'] !== 0){
            this.officialsListService.exportExcelErrors(err)
            .subscribe((res)=>{
              let x = res;
              var downloadURL = window.URL.createObjectURL(res);
              var link = document.createElement('a');
              link.href = downloadURL;
              link.download = "File_Errors.xlsx";
              link.click();
            },
              error =>{
                this.loadingImport = false;
              }
            );
        }
        }
        this.filter();
      },
      error => {
        this.loadingImport = false;
        this.fileInput.nativeElement.value = '';
        this.fileURL = '';
      });
  }
  ///

}

// arrYearId:any;
exportFile() {
  this.loadingExport = true;
  if (!this.dataSource) {
    this.notifyService.showError(
      'Dữ liệu không tồn tại. Vui lòng kiểm tra lại!',
      'Thông báo lỗi'
    );
    this.loadingExport = false;
    return;
  }
  let searchVal;
  var exportData = new FormData();
  var i = 0;
  if(this.form.value['search'])
  {
    exportData.append('search',this.form.value['search']);
  }
  if(this.officials_filter.position){
    exportData.append('position_id' + '['+ 0 +']',this.officials_filter.position);
  }
  if(this.officials_filter.degree){
    exportData.append('degree_id' + '['+ 0 +']',this.officials_filter.degree);
  }
  if(this.officials_filter.status_work){
    exportData.append('status' + '['+ 0 +']',this.officials_filter.status_work);
  }

  exportData.append('export', '1');
  this.officialsListService
    .exportExcel(exportData)
    .subscribe((res) => {
      this.loadingExport = false;
      // window.open(window.URL.createObjectURL(res));
      var downloadURL = window.URL.createObjectURL(res);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "DanhSachCanBo.xlsx";
      link.click();

    });
}

  uploadFile(files) {
    if (files.length === 0) {
      return;
    }
    this.selectedFile = files[0];
    const mimeType = files[0].type;
    if (
      mimeType !==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
      mimeType !== 'application/vnd.ms-excel'
    ) {
      this.notifyService.showError(
        'Chỉ hỗ trợ định dạng .xls, .xlsx, .csv',
        'Thông báo lỗi'
      );
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.fileURL = this.selectedFile['name'];
      // this.imgURL = reader.result;
    };
  }
  perPageSelected(id: number) {
    this.countPage = id;
    this.p = 1;
  }


}
