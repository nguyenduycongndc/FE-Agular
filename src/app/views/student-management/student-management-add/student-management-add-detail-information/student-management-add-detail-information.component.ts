import { StudentManagementDetailInformationService } from "./../../service/student-management-detail-information.service";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { NotificationService } from "../../../../_services/notification.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AddressService } from "../../../../_services/address.service";
import { CountryService } from "../../../../_services/country.service";
import { ReligionService } from "../../../../_services/religion.service";
import { EthnicService } from "../../../../_services/ethnic.service";
import { Router } from '@angular/router';
import { INavData } from '@coreui/angular';
declare var $: any;

@Component({
  selector: "student-management-add-detail-information",
  templateUrl: "./student-management-add-detail-information.component.html",
  styleUrls: ["./student-management-add-detail-information.component.css"],
})
export class StudentManagementAddDetailInformationComponent implements OnInit {
  @ViewChild("selectProvince") selectProvince: ElementRef;
  @ViewChild("selectDistrict") selectDistrict: ElementRef;
  @ViewChild("selectWard") selectWard: ElementRef;

  @ViewChild("selectProvince_Origin") selectProvince_Origin: ElementRef;
  @ViewChild("selectDistrict_Origin") selectDistrict_Origin: ElementRef;
  @ViewChild("selectWard_Origin") selectWard_Origin: ElementRef;

  @ViewChild("selectProvince_Birthplace") selectProvince_Birthplace: ElementRef;
  @ViewChild("selectDistrict_Birthplace") selectDistrict_Birthplace: ElementRef;
  @ViewChild("selectWard_Birthplace") selectWard_Birthplace: ElementRef;

  @ViewChild("selectCoutry") selectCoutry: ElementRef;
  @ViewChild("selectEthnic") selectEthnic: ElementRef;
  @ViewChild("selectReligion") selectReligion: ElementRef;

  @ViewChild("asAddress") asAddress: ElementRef;
  @ViewChild("asAddressOrigin") asAddressOrigin: ElementRef;
  @ViewChild("asAddressBirthplace") asAddressBirthplace: ElementRef;

  @Input() basicInfoData: any;
  @Output() basicInforDataEvent = new EventEmitter<any>();

  studentDetailForm: FormGroup;

  //Khai báo Dropdown list
  ddlWardSettings = {};
  ddlDistrictSettings = {};
  ddlProvinceSettings = {};
  ddlCountrySettings = {};
  ddlEthnicSettings = {};
  ddlReligionSettings = {};
  ddlChosesInsertSettings = {};
  ddlGeneralSettings = {};
  //End

  //Khai báo biến student để fill
  nationality: any;
  ethnic_id: any;
  religion_id: any;
  disability: any;
  is_policy: any;
  is_preference: any;
  is_exemption: any;
  status: any;
  boarding: any;
  is_admission: any;
  union_at: any;
  pioneer_at: any;
  is_union: any;
  is_pioneer: any;
  //Khai báo biến địa chỉ để fill
  type2: any;
  country_id2: any;
  province_id2: any;
  district_id2: any;
  ward_id2: any;
  address_detail2: any;
  type3: any;
  country_id3: any;
  province_id3: any;
  district_id3: any;
  ward_id3: any;
  address_detail3: any;
  type4: any;
  country_id4: any;
  province_id4: any;
  district_id4: any;
  ward_id4: any;
  address_detail4: any;

  studentAddress: any;

  //Dữ liệu 0:1
  ddlChoise = [];
  ddlExemptionData = [];
  ddlDisabilityData = [];
  ddlPolicyData = [];
  ddlPreferenceData = [];
  ddlStatusData = [];
  ddlBoardingData = [];
  ddlAdmissionData = [];

  //Selected 0:1
  selectedExemption : any;
  selectedDisability : any;
  selectedPolicy : any;
  selectedPreference : any;
  selectedStatus : any;
  selectedBoarding : any;
  selectedAdmission : any;
  selectedCountry : any;
  selectedReligion : any;
  selectedEthnic : any;

  // ddlCountrySettings = {};
  ddlCountryData = [];
  ddlEthnicData = [];
  ddlReligionData = [];

  //Khai báo các trường địa chỉ để select
  selectedProvince : any;
  ddlProvinceData = [];
  province_update = [];

  selectedDistrict :any;
  ddlDistrictData = [];
  district_update = [];

  selectedWard : any;
  ddlWardData = [];
  ward = [];

  selectedProvince_Origin : any;
  ddlProvinceData_Origin = [];
  province_update_Origin = [];

  selectedDistrict_Origin : any;
  ddlDistrictData_Origin = [];
  district_update_Origin = [];

  selectedWard_Origin : any;
  ddlWardData_Origin = [];
  ward_Origin = [];

  selectedProvince_Birthplace : any;
  ddlProvinceData_Birthplace = [];
  province_update_Birthplace = [];

  selectedDistrict_Birthplace : any;
  ddlDistrictData_Birthplace = [];
  district_update_Birthplace = [];

  selectedWard_Birthplace : any;
  ddlWardData_Birthplace = [];
  ward_Birthplace = [];

  id: any;
  form: FormGroup;
  submitted = false;

  //
  religions: any;
  religionsSelected: any;

  p: number = 1;
  countPage: number = 10;
  totalItems = 0;
  // router: any;

  constructor(
    private studentdetailService: StudentManagementDetailInformationService,
    private notifyService: NotificationService,
    private addressService: AddressService,
    private countryService: CountryService,
    private religionService: ReligionService,
    private ethnicService: EthnicService,
    private router: Router
  ) {
    this.loadDefaultValue();
  }



  loadDefaultValue() {
    this.selectedExemption = { id: 0, name: "Không" };
    this.selectedDisability = { id: 0, name: "Không" };
    this.selectedPolicy = { id: 0, name: "Không" };
    this.selectedPreference = { id: 0, name: "Không" };
    this.selectedStatus = { id: 1, name: "Đang học" };
    this.selectedBoarding = { id: 0, name: "Ngoại trú" };
    this.selectedAdmission = { id: 1, name: "Thi tuyển" };

    this.selectedCountry = { id: 239, name: "Việt Nam" };
    this.selectedReligion = { id: 1, name: "Không" };
    this.selectedEthnic = { id: 1, name: "Kinh" };
  }
  //On_Deselect

  onDeSelectExemption() {
    // this.selectedExemption = { id: 0, name: "Không" };
  }
  onDeSelectDisability() {
    // this.selectedDisability = { id: 0, name: "Không" };
  }
  onDeSelectPolicy() {
    // this.selectedPolicy = { id: 0, name: "Không" };
  }
  onDeSelectPreference() {
    // this.selectedPreference = { id: 0, name: "Không" };
  }
  onDeSelectStatus() {
    // this.selectedStatus = { id: 1, name: "Đang học" };
  }
  onDeSelectBoarding() {
    // this.selectedBoarding = { id: 1, name: "Nội trú" };
  }
  onDeSelectAdmission() {
    // this.selectedAdmission = { id: 1, name: "Thi tuyển" };
  }
  //On + deselect Country
  // onSelectCountry() {
  //   this.selectedCountry = { id: 239, name: "Việt Nam" };
  // }
  onSelectCountry(item:any){
    this.selectCoutry = item['id'];
  }
  // onDeSelectCountry(){
  //   this.selectCoutry = null;
  // }

  onSelectEthnic(item: any) {
    this.selectEthnic = item['id'];
  }
  // onDeSelectEthnic() {
  //   this.selectedEthnic = [
  //     { 'item_id': 1, 'name': 'Kinh' }
  //   ];
  // }

  onSelectReligion(item: any) {
    this.selectReligion = item['id'];
  }
  // onDeSelectReligion() {
  //   this.selectedReligion = [
  //     { 'item_id': 1, 'name': 'Không' }
  //   ];
  // }

  //Onselect + deselect Hiện tại
  onSelectWard(item: any) {
    this.ward = [];
    const ward = [];
    if (item !== undefined){
      ward.push(item["id"]);
    }
    this.ward = ward;
  }
  // onDeSelectWard(item: any) {
  //   this.ward = [];
  // }

  onSelectDistrict(item: any) {
    this.selectedWard = null;
    this.ddlWardData = [];
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
      this.ddlWardData = wardObj;
    });
    }

  }

  onSelectProvince(item: any) {
    if(this.form.value['province_id2']=== null
    ||this.form.value['province_id2']=== undefined
    ){

    this.form.get('district_id2').clearValidators();
    this.form.get('ward_id2').clearValidators();
    this.form.get('district_id2').setValue(null);
    this.form.get('ward_id2').setValue(null);
    }
    this.selectedDistrict = null;
    this.selectedWard = null;
    this.district_update = null;
    this.selectedWard = null;
    this.ddlDistrictData = [];
    this.ddlWardData = [];
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
        this.ddlDistrictData = districtObj;
      });
    }
  }


  //Nguyên Quán

  onSelectWard_Origin(item: any) {
    this.ward_Origin = [];
    const ward_Origin = [];
    if (item !== undefined){
      ward_Origin.push(item["id"]);
    }
    this.ward_Origin = ward_Origin;
  }


  onSelectDistrict_Origin(item: any) {
    this.selectedWard_Origin = null;
    this.ddlWardData_Origin = [];
    this.ward_Origin = [];
    const district_Origin = [];
    if (item !== undefined){
      district_Origin.push(item["id"]);
      this.district_update_Origin = district_Origin;
      this.studentdetailService.getWard(item["id"]).subscribe((data) => {
        let wardData_Origin = data["wards"];
        const wardObj_Origin = [];
        wardData_Origin.forEach(function (item) {
          wardObj_Origin.push({ id: item["id"], name: item["name"] });
        });
        this.ddlWardData_Origin = wardObj_Origin;
      });
    }
  }


  onSelectProvince_Origin(item: any) {
    if(this.form.value['province_id3']=== null
    ||this.form.value['province_id3']=== undefined
    ){

    this.form.get('district_id3').clearValidators();
    this.form.get('ward_id3').clearValidators();
    this.form.get('district_id3').setValue(null);
    this.form.get('ward_id3').setValue(null);

    }
    this.selectedDistrict_Origin = null;
    this.selectedWard_Origin = null;
    this.district_update_Origin = null;
    this.selectedWard_Origin = null;
    this.ddlDistrictData_Origin = [];
    this.ddlWardData_Origin = [];
    const province = [];
    if (item !== undefined){
      province.push(item["id"]);
      this.province_update_Origin = province;
      this.studentdetailService.getDistrict(item["id"]).subscribe((data) => {
        let districtData = data["districts"];
        const districtObj = [];
        districtData.forEach(function (item) {
          districtObj.push({ id: item["id"], name: item["name"] });
        });
        this.ddlDistrictData_Origin = districtObj;
      });
    }
  }

  //Nơi sinh
  //Nguyên Quán

  onSelectWard_Birthplace(item: any) {
    this.ward_Birthplace = [];
    const ward_Birthplace = [];
    if (item !== undefined){
      ward_Birthplace.push(item["id"]);
    }
    this.ward_Birthplace = ward_Birthplace;
  }

  onSelectDistrict_Birthplace(item: any) {
    this.selectedWard_Birthplace = null;
    this.ward_Birthplace = null;
    this.ddlWardData_Birthplace = [];
    const district_Birthplace = [];
    if (item !== undefined){
      district_Birthplace.push(item["id"]);
      this.district_update_Birthplace = district_Birthplace;
      this.studentdetailService.getWard(item["id"]).subscribe((data) => {
        let wardData = data["wards"];
        const wardObj = [];
        wardData.forEach(function (item) {
          wardObj.push({ id: item["id"], name: item["name"] });
        });
        this.ddlWardData_Birthplace = wardObj;
      });
    }
  }


  onSelectProvince_Birthplace(item: any) {
    if(this.form.value['province_id4']=== null
    ||this.form.value['province_id4']=== undefined
    ){
    this.form.get('district_id4').clearValidators();
    this.form.get('ward_id4').clearValidators();
    this.form.get('district_id4').setValue(null);
    this.form.get('ward_id4').setValue(null);
    }
    this.selectedDistrict_Birthplace = null;
    this.selectedWard_Birthplace = null;
    this.district_update_Birthplace = null;
    this.selectedWard_Birthplace = null;
    this.ddlDistrictData_Birthplace = [];
    this.ddlWardData_Birthplace = [];
    const province_Birthplace = [];
    if (item !== undefined){
      province_Birthplace.push(item["id"]);
      this.province_update_Birthplace = province_Birthplace;
      this.studentdetailService.getDistrict(item["id"]).subscribe((data) => {
        let districtData = data["districts"];
        const districtObj = [];
        districtData.forEach(function (item) {
          districtObj.push({ id: item["id"], name: item["name"] });
        });
        this.ddlDistrictData_Birthplace = districtObj;
      });
    }
  }


  get f() {
    return this.form.controls;
  }

  ngOnInit() {
    //Lấy giá trị ra dropdown
    this.studentdetailService.list_religion().subscribe((data) => {
      this.religions = data["religions"];
      this.religionsSelected = [{ id: 1, name: "Không" }];
    });

    this.addressService.getProvince().subscribe((data) => {
      let provinceData = data["provinces"];
      const provinceObj = [];
      provinceData.forEach(function (item) {
        provinceObj.push({ id: item["id"], name: item["name"] });
      });
      this.ddlProvinceData = provinceObj;
      this.ddlProvinceData_Origin = provinceObj;
      this.ddlProvinceData_Birthplace = provinceObj;
    });

    this.ethnicService.getEthnic().subscribe((data) => {
      let EthnicData = data["ethnics"];
      const ethnicObject = [];
      EthnicData.forEach(function (item) {
        ethnicObject.push({ id: item["id"], name: item["name"] });
      });
      this.ddlEthnicData = ethnicObject;
    });

    this.religionService.getReligion().subscribe((data) => {
      let ReligionData = data["religions"];
      const religionObject = [];
      ReligionData.forEach(function (item) {
        religionObject.push({ id: item["id"], name: item["name"] });
      });
      this.ddlReligionData = religionObject;
    });
    //////////////////////////////////



    this.ddlChoise = [
      { item_id: 0, item_text: "Không" },
      { item_id: 1, item_text: "Có" },
    ];

    //Khởi tạo để validate + biến nhận value
    this.form = new FormGroup({
      // religions: new FormControl('', [Validators.required]),
      is_exemption: new FormControl(""),
      status: new FormControl(""),
      boarding: new FormControl(""),
      is_admission: new FormControl(""),
      is_pioneer: new FormControl(""),
      is_union: new FormControl(""),
      is_preference: new FormControl(""),
      disability: new FormControl(""),
      is_policy: new FormControl(""),

      union_at: new FormControl('', [Validators.required]),
      pioneer_at: new FormControl('', [Validators.required]),
      // ward: new FormControl(''),
      address_detail2: new FormControl("", [Validators.maxLength(150)]),
      address_detail3: new FormControl("", [Validators.maxLength(150)]),
      // address_detail4: new FormControl('',[Validators.maxLength(150)]),
      nationality: new FormControl(""),
      ethnic_id: new FormControl(""),
      religion_id: new FormControl(""),

      province_id2: new FormControl(""),
      province_id3: new FormControl(""),
      province_id4: new FormControl(""),

      district_id2: new FormControl(""),
      district_id3: new FormControl(""),
      district_id4: new FormControl(""),

      ward_id2: new FormControl(""),
      ward_id3: new FormControl(""),
      ward_id4: new FormControl(""),
    });

    //Giá trị mặc định cho dropdown
    this.ddlExemptionData = [
      { id: 0, name: "Không" },
      { id: 1, name: "Có" },
    ];

    this.ddlDisabilityData = [
      { id: 0, name: "Không" },
      { id: 1, name: "Có" },
    ];

    this.ddlPolicyData = [
      { id: 0, name: "Không" },
      { id: 1, name: "Có" },
    ];

    this.ddlPreferenceData = [
      { id: 0, name: "Không" },
      { id: 1, name: "Có" },
    ];

    this.ddlStatusData = [
      { id: 1, name: "Đang học" },
      { id: 2, name: "Đình chỉ học tập" },
      { id: 3, name: "Chuyển trường" },
      { id: 4, name: "Tạm dừng" },
      { id: 5, name: "Thôi học" },
    ];
    this.ddlBoardingData = [
      { id: 0, name: "Ngoại trú" },
      { id: 1, name: "Nội trú" },
    ];

    this.ddlAdmissionData = [
      { id: 0, name: "Xét tuyển" },
      { id: 1, name: "Thi tuyển" },
    ];

    this.ddlCountryData = [{ id: 239, name: "Việt Nam" }];


  }

  //
  resetFormPioneer(){
    this.form.get("pioneer_at").clearValidators();
    this.form.get("pioneer_at").setValue("");
  }
  resetFormUnion(){
    // this.form.get("pioneer_at").clearValidators();
    this.form.get("union_at").clearValidators();

    // this.form.get("pioneer_at").setValue("");
    this.form.get("union_at").setValue("");
  }
  //
  resetForm3(){

    this.form.get("address_detail3").clearValidators();
    this.form.get("province_id3").clearValidators();
    this.form.get("district_id3").clearValidators();
    this.form.get("ward_id3").clearValidators();
  }

  resetForm4(){
    this.form.get("province_id4").clearValidators();
    this.form.get("district_id4").clearValidators();
    this.form.get("ward_id4").clearValidators();

    this.form.get("province_id4").setValue("");
    this.form.get("district_id4").setValue("");
    this.form.get("ward_id4").setValue("");
  }
  resetForm() {
    this.form.get("address_detail2").clearValidators();
    this.form.get("province_id2").clearValidators();
    this.form.get("district_id2").clearValidators();
    this.form.get("ward_id2").clearValidators();


  }

  checkPionnerAt:any;
  checkUnionAt:any;
  // checkDisable:any;
  modelPioneerAt:any;
  //End-resetForm
  checkPionner($event){
  let check = $event.target.checked;
    if(check === true){
      // this.checkDisable = true;
      this.checkPionnerAt = true;
      this.modelPioneerAt = null;
      this.valueCheck = undefined;
      this.valueBoolen = undefined;
      this.valueDate = undefined;
      this.form.get('pioneer_at').setValidators([Validators.required]);
      this.form.get('pioneer_at').updateValueAndValidity();
    }else{
      this.form.get("pioneer_at").clearValidators();
      this.form.get("pioneer_at").setValue("");
      this.checkPionnerAt = false;
      this.checkCurrentDate = true;
      this.checkDate = true;
    }
  }

  //Lấy ngày tháng so sánh pioneer
  valueCheck:any;
  valueBoolen:any;
  valueDate:any;
  checkDate:boolean;
  checkCurrentDate=true;
  changeDate($event){
    if(this.checkPionnerAt === true){
    this.checkCurrentDate = true;
    this.valueCheck =  $event.target.validationMessage;
    this.valueBoolen = $event.target.validity.valid;
    this.valueDate = $event.target.value;
    if(
      this.valueCheck === undefined && this.valueBoolen === undefined && this.valueDate === undefined ||
      this.valueCheck === '' && this.valueBoolen === true && this.valueDate === ''||
      this.valueCheck !== '' && this.valueBoolen === false && this.valueDate === ''
      ){
        this.checkDate = false;
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
  }

  // checkDisableUnion:any;
  modelUnionAt:any;
  //End-resetForm
  checkUnion($event){
  let check = $event.target.checked;
    if(check === true){
      this.checkUnionAt = true;
      // this.checkDisableUnion = true;
      this.modelUnionAt = null;
      this.valueCheckUnion = undefined;
      this.valueBoolenUnion = undefined;
      this.valueDateUnion = undefined;
      this.form.get('union_at').setValidators([Validators.required]);
      this.form.get('union_at').updateValueAndValidity();
    }else{
      // this.checkDisableUnion = false;
      this.checkUnionAt = false;
      this.checkDateUnion= true;
      this.checkCurrentDateUnion = true;
      this.form.get("union_at").clearValidators();
      this.form.get("union_at").setValue("");
    }
  }
  //Lấy ngày tháng so sánh union
  valueCheckUnion:any;
  valueBoolenUnion:any;
  valueDateUnion:any;
  checkDateUnion:boolean;
  checkCurrentDateUnion=true;
  changeDateUnion($event){
    if(this.checkUnionAt === true){
      this.checkCurrentDateUnion = true;
      this.valueCheckUnion =  $event.target.validationMessage;
      this.valueBoolenUnion = $event.target.validity.valid;
      this.valueDateUnion = $event.target.value;
      if(
        this.valueCheckUnion === undefined && this.valueBoolenUnion === undefined && this.valueDateUnion === undefined ||
        this.valueCheckUnion === '' && this.valueBoolenUnion === true && this.valueDateUnion === ''||
        this.valueCheckUnion !== '' && this.valueBoolenUnion === false && this.valueDateUnion === ''
        ){
          this.checkDateUnion = false;
        }
      if(this.valueCheckUnion === '' && this.valueBoolenUnion === true && this.valueDateUnion !== '')
      {
        const currentDate = new Date();
        switch(Date.parse(String(this.valueDateUnion )) > Date.parse(String(currentDate))){
          case true:
            this.checkCurrentDateUnion = false;
            break;
          case false:
            this.checkCurrentDateUnion = true;
            break;
        }
      }
    }
  }


  //End-resetForm
  updateBtnContinute() {

    this.form.get("address_detail2").setValidators([Validators.maxLength(150)]);
    this.form.get("address_detail2").updateValueAndValidity();

    this.form.get("address_detail3").setValidators([Validators.maxLength(150)]);
    this.form.get("address_detail3").updateValueAndValidity();

    this.submitted = true;

    //Invalid
    // if (this.form.invalid) {
    //   return;
    // }


    var uploadData = new FormData();
    let tab = "2";
    uploadData.append("tab", tab);

    if (this.form.value["is_pioneer"] && this.form.value["is_pioneer"] === true)
    {
      uploadData.append("is_pioneer", "1");
      if(this.checkCurrentDate === false || this.checkDate === false){
        return;
      }
    } else {
      uploadData.append("is_pioneer", "0");
      this. resetFormPioneer();
    }

    if (this.form.value["is_union"] && this.form.value["is_union"] === true) {
      uploadData.append("is_union", "1");
      if(this.checkCurrentDateUnion === false || this.checkDateUnion === false){
        return;
      }
    } else {
      uploadData.append("is_union", "0");
      this.resetFormUnion();
    }


    if (this.form.value["union_at"]) {
      uploadData.append("union_at", this.form.value["union_at"]);
    }
    if (this.form.value["pioneer_at"]) {
      uploadData.append("pioneer_at", this.form.value["pioneer_at"]);
    }

    if (this.form.value["nationality"]) {
      uploadData.append(
        "nationality",
        this.form.value["nationality"]["id"]
      );
    }
    if (this.form.value["is_exemption"]) {
      uploadData.append(
        "is_exemption",
        this.form.value["is_exemption"]["id"]
      );
    }
    if (this.form.value["status"]) {
      uploadData.append("status", this.form.value["status"]["id"]);
    }
    if (this.form.value["boarding"]) {
      uploadData.append("boarding", this.form.value["boarding"]["id"]);
    }
    if (this.form.value["is_admission"]) {
      uploadData.append(
        "is_admission",
        this.form.value["is_admission"]["id"]
      );
    }


    // if (this.form.value['is_union']) {
    //   uploadData.append('is_union', this.form.value['is_union']);
    // }
    if (this.form.value["is_preference"]) {
      uploadData.append(
        "is_preference",
        this.form.value["is_preference"]["id"]
      );
    }
    if (this.form.value["disability"]) {
      uploadData.append(
        "disability",
        this.form.value["disability"]["id"]
      );
    }
    if (this.form.value["is_policy"]) {
      uploadData.append(
        "is_policy",
        this.form.value["is_policy"]["id"]
      );
    }

    if (this.form.value["ethnic_id"]) {
      uploadData.append(
        "ethnic_id",
        this.form.value["ethnic_id"]["id"]
      );
    }
    if (this.form.value["religion_id"]) {
      uploadData.append(
        "religion_id",
        this.form.value["religion_id"]["id"]
      );
    }

       //validate H.K thường trú:
       if(this.form.value['province_id2']!= undefined){
        if(this.form.value['province_id2']!= null ){
          if(this.form.value['province_id2'].length !==0){
            this.form.get('district_id2').setValidators([Validators.required]);
            this.form.get('district_id2').updateValueAndValidity();
            this.form.get('ward_id2').setValidators([Validators.required]);
            this.form.get('ward_id2').updateValueAndValidity();

            if (this.form.controls['district_id2'].invalid
            || this.form.controls['ward_id2'].invalid
            ) {
              return;
            }
          }
        }
      }
      if(this.form.value['province_id2']!= null ){
        if(this.form.value['province_id2']!= undefined){
          if(this.form.value['province_id2'].length !==0){
            this.form.get('district_id2').setValidators([Validators.required]);
            this.form.get('district_id2').updateValueAndValidity();
            this.form.get('ward_id2').setValidators([Validators.required]);
            this.form.get('ward_id2').updateValueAndValidity();
            if (this.form.controls['district_id2'].invalid
            ||  this.form.controls['ward_id2'].invalid
            ) {
              return;

              }
        }
       }
      }
      if(this.form.value['province_id2']=== null
      ||this.form.value['province_id2']=== undefined
      ){
      this.form.get('district_id2').clearValidators();
      this.form.get('ward_id2').clearValidators();
      this.form.get('district_id2').setValue(null);
      this.form.get('ward_id2').setValue(null);

      }
  //validator Nguyên quán:
      if(this.form.value['province_id3']!= undefined){
        if(this.form.value['province_id3']!= null){
          if(this.form.value['province_id3'].length !== 0){
            this.form.get('district_id3').setValidators([Validators.required]);
            this.form.get('district_id3').updateValueAndValidity();
            this.form.get('ward_id3').setValidators([Validators.required]);
            this.form.get('ward_id3').updateValueAndValidity();

            if (this.form.controls['district_id3'].invalid
            || this.form.controls['ward_id3'].invalid
            ) {
              return;
            }
          }
        }
      }
      if(this.form.value['province_id3']!= null ){
        if(this.form.value['province_id3']!= undefined){
          if(this.form.value['province_id3'].length !== 0){
            this.form.get('district_id3').setValidators([Validators.required]);
            this.form.get('district_id3').updateValueAndValidity();
            this.form.get('ward_id3').setValidators([Validators.required]);
            this.form.get('ward_id3').updateValueAndValidity();

            if (this.form.controls['district_id3'].invalid
            || this.form.controls['ward_id3'].invalid
            ) {
              return;
            }
          }
        }
      }
      if(this.form.value['province_id3']=== null
      ||this.form.value['province_id3']=== undefined
      ){
      this.form.get('district_id3').clearValidators();
      this.form.get('ward_id3').clearValidators();
      this.form.get('district_id3').setValue(null);
      this.form.get('ward_id3').setValue(null);

      }
      //validate Nơi sinh:
      if(this.form.value['province_id4']!= undefined){
        if(this.form.value['province_id4']!= null ){
          if(this.form.value['province_id4'].length!== 0 ){
            this.form.get('district_id4').setValidators([Validators.required]);
            this.form.get('district_id4').updateValueAndValidity();
            this.form.get('ward_id4').setValidators([Validators.required]);
            this.form.get('ward_id4').updateValueAndValidity();

            if (this.form.controls['district_id4'].invalid
            || this.form.controls['ward_id4'].invalid
            ) {
              return;
            }
          }
        }
      }
      if(this.form.value['province_id4']!= null ){
        if(this.form.value['province_id4']!= undefined ){
          if(this.form.value['province_id4'].length!== 0 ){
            this.form.get('district_id4').setValidators([Validators.required]);
            this.form.get('district_id4').updateValueAndValidity();
            this.form.get('ward_id4').setValidators([Validators.required]);
            this.form.get('ward_id4').updateValueAndValidity();

            if (this.form.controls['district_id4'].invalid
            || this.form.controls['ward_id4'].invalid
            ) {
              return;
            }
          }
        }
      }
      if(this.form.value['province_id4']=== null
      ||this.form.value['province_id4']=== undefined
      ){
      this.form.get('district_id4').clearValidators();
      this.form.get('ward_id4').clearValidators();
      this.form.get('district_id4').setValue(null);
      this.form.get('ward_id4').setValue(null);

      }


    let getAddress2 = this.form.value["address_detail2"];
    let getAddress3 = this.form.value["address_detail3"];

    if (getAddress2 !== null
      && this.form.value["province_id2"]!== null
      && this.form.value["district_id2"]!== null
      && this.form.value["ward_id2"]!== null) {
        let addressFull2 = getAddress2 !== undefined ?
        getAddress2+' - '+ this.form.value["ward_id2"]["name"]
        +' - '+this.form.value["district_id2"]["name"]
        +' - '+this.form.value["province_id2"]["name"]
        :
        ' - '+ this.form.value["ward_id2"]["name"]
        +' - '+this.form.value["district_id2"]["name"]
        +' - '+this.form.value["province_id2"]["name"];
      uploadData.append("address_detail2", addressFull2);
    }
    if (getAddress3 !== null
      && this.form.value["province_id3"]!== null
      && this.form.value["district_id3"]!== null
      && this.form.value["ward_id3"]!== null) {
        let addressFull3 = getAddress3 !== undefined ?
        getAddress3+' - '+ this.form.value["ward_id3"]["name"]
           +' - '+this.form.value["district_id3"]["name"]
           +' - '+this.form.value["province_id3"]["name"]
           :
           ' - '+ this.form.value["ward_id3"]["name"]
           +' - '+this.form.value["district_id3"]["name"]
           +' - '+this.form.value["province_id3"]["name"];
      uploadData.append("address_detail3", addressFull3);
    }


    //province
    if (
      this.form.value["province_id2"]
    ) {
      uploadData.append(
        "province_id2",
        this.form.value["province_id2"]["id"]
      );
    }
    if (
      this.form.value["province_id3"]
    ) {
      uploadData.append(
        "province_id3",
        this.form.value["province_id3"]["id"]
      );
    }
    if (
      this.form.value["province_id4"]
    ) {
      uploadData.append(
        "province_id4",
        this.form.value["province_id4"]["id"]
      );
    }

    //district
    if (this.form.value["district_id2"])
    {
      uploadData.append("district_id2",this.form.value["district_id2"]["id"]);
    }
    if (this.form.value["district_id3"])
    {
      uploadData.append("district_id3",this.form.value["district_id3"]["id"]);
    }
    if (this.form.value["district_id4"])
    {
      uploadData.append("district_id4",this.form.value["district_id4"]["id"]);
    }

    //ward
    if (this.form.value["ward_id2"]) {
      uploadData.append("ward_id2", this.form.value["ward_id2"]["id"]);
    }
    if (this.form.value["ward_id3"]) {
      uploadData.append("ward_id3", this.form.value["ward_id3"]["id"]);
    }
    if (this.form.value["ward_id4"]) {
      uploadData.append("ward_id4", this.form.value["ward_id4"]["id"]);
    }

    this.studentdetailService
      .update(this.basicInfoData[0]["studentId"], uploadData)
      .subscribe(
        (result) => {
          const studentId = this.basicInfoData[0]["studentId"];
          const address = this.basicInfoData[0]["address"];
          const data = [{ studentId: studentId, address: address, tab: 2 }];
          this.basicInforDataEvent.emit(data);
          this.notifyService.showSuccess(
            "Tạo mới thông tin thành công",
            "Thông báo"
          );
          this.resetForm();
          this.resetForm3();
          this.resetForm4();
        },
        (error) => {
          (error) => {
            if (error.message) {
              if (error.message["province_id2"]) {
                this.notifyService.showError(
                  "Tỉnh/Tp hộ khẩu thường trú không được để trống",
                  "Thông báo"
                );
              } else if (error.message["district_id2"]) {
                this.notifyService.showError(
                  "Quận/Huyện hộ khẩu thường trú không được để trống",
                  "Thông báo"
                );
              } else if (error.message["ward_id2"]) {
                this.notifyService.showError(
                  "Xã/Phường hộ khẩu thường trú không được để trống",
                  "Thông báo"
                );
              } else if (error.message["province_id3"]) {
                this.notifyService.showError(
                  "Tỉnh/Tp nguyên quán không được để trống",
                  "Thông báo"
                );
              } else if (error.message["district_id3"]) {
                this.notifyService.showError(
                  "Quận/Huyện nguyên quán không được để trống",
                  "Thông báo"
                );
              } else if (error.message["ward_id3"]) {
                this.notifyService.showError(
                  "Xã/Phường nguyên quán không được để trống",
                  "Thông báo"
                );
              } else if (error.message["province_id4"]) {
                this.notifyService.showError(
                  "Tỉnh/Tp nơi sinh không được để trống",
                  "Thông báo"
                );
              } else if (error.message["district_id4"]) {
                this.notifyService.showError(
                  "Quận/Huyện nơi sinh không được để trống",
                  "Thông báo"
                );
              } else if (error.message["ward_id4"]) {
                this.notifyService.showError(
                  "Xã/Phường nơi sinh không được để trống",
                  "Thông báo"
                );
              } else {
                this.notifyService.showError(
                  "Tạo mới thông tin thành công",
                  "Thông báo"
                );
              }
            }
          };
        });
    this.submitted = true;
    //reset lại giá trị của drop
    if (this.form.invalid) {
      return;
    }
  }

  //
  updateBtn() {

    this.form.get("address_detail2").setValidators([Validators.maxLength(150)]);
    this.form.get("address_detail2").updateValueAndValidity();

    this.form.get("address_detail3").setValidators([Validators.maxLength(150)]);
    this.form.get("address_detail3").updateValueAndValidity();

    this.submitted = true;
    //Invalid
    // if (this.form.invalid) {
    //   return;
    // }

    var uploadData = new FormData();
    let tab = "2";
    uploadData.append("tab", tab);

    if (this.form.value["is_pioneer"] && this.form.value["is_pioneer"] === true)
    {
      uploadData.append("is_pioneer", "1");
      if(this.checkCurrentDate === false || this.checkDate === false){
        return;
      }
    } else {
      uploadData.append("is_pioneer", "0");
      this. resetFormPioneer();
    }

    if (this.form.value["is_union"] && this.form.value["is_union"] === true) {
      uploadData.append("is_union", "1");
      if(this.checkCurrentDateUnion === false || this.checkDateUnion === false){
        return;
      }
    } else {
      uploadData.append("is_union", "0");
      this.resetFormUnion();
    }


    if (this.form.value["union_at"]) {
      uploadData.append("union_at", this.form.value["union_at"]);
    }
    if (this.form.value["pioneer_at"]) {
      uploadData.append("pioneer_at", this.form.value["pioneer_at"]);
    }

    if (this.form.value["nationality"]) {
      uploadData.append(
        "nationality",
        this.form.value["nationality"]["id"]
      );
    }
    if (this.form.value["is_exemption"]) {
      uploadData.append(
        "is_exemption",
        this.form.value["is_exemption"]["id"]
      );
    }
    if (this.form.value["status"]) {
      uploadData.append("status", this.form.value["status"]["id"]);
    }
    if (this.form.value["boarding"]) {
      uploadData.append("boarding", this.form.value["boarding"]["id"]);
    }
    if (this.form.value["is_admission"]) {
      uploadData.append(
        "is_admission",
        this.form.value["is_admission"]["id"]
      );
    }


    // if (this.form.value['is_union']) {
    //   uploadData.append('is_union', this.form.value['is_union']);
    // }
    if (this.form.value["is_preference"]) {
      uploadData.append(
        "is_preference",
        this.form.value["is_preference"]["id"]
      );
    }
    if (this.form.value["disability"]) {
      uploadData.append(
        "disability",
        this.form.value["disability"]["id"]
      );
    }
    if (this.form.value["is_policy"]) {
      uploadData.append(
        "is_policy",
        this.form.value["is_policy"]["id"]
      );
    }

    if (this.form.value["ethnic_id"]) {
      uploadData.append(
        "ethnic_id",
        this.form.value["ethnic_id"]["id"]
      );
    }
    if (this.form.value["religion_id"]) {
      uploadData.append(
        "religion_id",
        this.form.value["religion_id"]["id"]
      );
    }
   //validate H.K thường trú:
   if(this.form.value['province_id2']!= undefined){
    if(this.form.value['province_id2']!= null ){
      if(this.form.value['province_id2'].length !==0){
        this.form.get('district_id2').setValidators([Validators.required]);
        this.form.get('district_id2').updateValueAndValidity();
        this.form.get('ward_id2').setValidators([Validators.required]);
        this.form.get('ward_id2').updateValueAndValidity();

        if (this.form.controls['district_id2'].invalid
        || this.form.controls['ward_id2'].invalid
        ) {
          return;
        }
      }
    }
  }
  if(this.form.value['province_id2']!= null ){
    if(this.form.value['province_id2']!= undefined){
      if(this.form.value['province_id2'].length !==0){
        this.form.get('district_id2').setValidators([Validators.required]);
        this.form.get('district_id2').updateValueAndValidity();
        this.form.get('ward_id2').setValidators([Validators.required]);
        this.form.get('ward_id2').updateValueAndValidity();
        if (this.form.controls['district_id2'].invalid
        ||  this.form.controls['ward_id2'].invalid
        ) {
          return;

          }
    }
   }
  }
  if(this.form.value['province_id2']=== null
  ||this.form.value['province_id2']=== undefined
  ){
  this.form.get('district_id2').clearValidators();
  this.form.get('ward_id2').clearValidators();
  this.form.get('district_id2').setValue(null);
  this.form.get('ward_id2').setValue(null);

  }
//validator Nguyên quán:
  if(this.form.value['province_id3']!= undefined){
    if(this.form.value['province_id3']!= null){
      if(this.form.value['province_id3'].length !== 0){
        this.form.get('district_id3').setValidators([Validators.required]);
        this.form.get('district_id3').updateValueAndValidity();
        this.form.get('ward_id3').setValidators([Validators.required]);
        this.form.get('ward_id3').updateValueAndValidity();

        if (this.form.controls['district_id3'].invalid
        || this.form.controls['ward_id3'].invalid
        ) {
          return;
        }
      }
    }
  }
  if(this.form.value['province_id3']!= null ){
    if(this.form.value['province_id3']!= undefined){
      if(this.form.value['province_id3'].length !== 0){
        this.form.get('district_id3').setValidators([Validators.required]);
        this.form.get('district_id3').updateValueAndValidity();
        this.form.get('ward_id3').setValidators([Validators.required]);
        this.form.get('ward_id3').updateValueAndValidity();

        if (this.form.controls['district_id3'].invalid
        || this.form.controls['ward_id3'].invalid
        ) {
          return;
        }
      }
    }
  }
  if(this.form.value['province_id3']=== null
  ||this.form.value['province_id3']=== undefined
  ){
  this.form.get('district_id3').clearValidators();
  this.form.get('ward_id3').clearValidators();
  this.form.get('district_id3').setValue(null);
  this.form.get('ward_id3').setValue(null);

  }
  //validate Nơi sinh:
  if(this.form.value['province_id4']!= undefined){
    if(this.form.value['province_id4']!= null ){
      if(this.form.value['province_id4'].length!== 0 ){
        this.form.get('district_id4').setValidators([Validators.required]);
        this.form.get('district_id4').updateValueAndValidity();
        this.form.get('ward_id4').setValidators([Validators.required]);
        this.form.get('ward_id4').updateValueAndValidity();

        if (this.form.controls['district_id4'].invalid
        || this.form.controls['ward_id4'].invalid
        ) {
          return;
        }
      }
    }
  }
  if(this.form.value['province_id4']!= null ){
    if(this.form.value['province_id4']!= undefined ){
      if(this.form.value['province_id4'].length!== 0 ){
        this.form.get('district_id4').setValidators([Validators.required]);
        this.form.get('district_id4').updateValueAndValidity();
        this.form.get('ward_id4').setValidators([Validators.required]);
        this.form.get('ward_id4').updateValueAndValidity();

        if (this.form.controls['district_id4'].invalid
        || this.form.controls['ward_id4'].invalid
        ) {
          return;
        }
      }
    }
  }
  if(this.form.value['province_id4']=== null
  ||this.form.value['province_id4']=== undefined
  ){
  this.form.get('district_id4').clearValidators();
  this.form.get('ward_id4').clearValidators();
  this.form.get('district_id4').setValue(null);
  this.form.get('ward_id4').setValue(null);

  }

    let getAddress2 = this.form.value["address_detail2"];
    let getAddress3 = this.form.value["address_detail3"];

    if (getAddress2 !== null
      && this.form.value["province_id2"]!== null
      && this.form.value["district_id2"]!== null
      && this.form.value["ward_id2"]!== null) {
        let addressFull2 = getAddress2 !== undefined ?
        getAddress2+' - '+ this.form.value["ward_id2"]["name"]
        +' - '+this.form.value["district_id2"]["name"]
        +' - '+this.form.value["province_id2"]["name"]
        :
        ' - '+ this.form.value["ward_id2"]["name"]
        +' - '+this.form.value["district_id2"]["name"]
        +' - '+this.form.value["province_id2"]["name"];
      uploadData.append("address_detail2", addressFull2);
    }
    if (getAddress3 !== null
      && this.form.value["province_id3"]!== null
      && this.form.value["district_id3"]!== null
      && this.form.value["ward_id3"]!== null) {
      let addressFull3 = getAddress3 !== undefined ?
      getAddress3+' - '+this.form.value["ward_id3"]["name"]
        +' - '+this.form.value["district_id3"]["name"]
        +' - '+this.form.value["province_id3"]["name"]
        :
        ' - '+this.form.value["ward_id3"]["name"]
        +' - '+this.form.value["district_id3"]["name"]
        +' - '+this.form.value["province_id3"]["name"];
      uploadData.append("address_detail3", addressFull3);
    }


    //province
    if (
      this.form.value["province_id2"]
    ) {
      uploadData.append(
        "province_id2",
        this.form.value["province_id2"]["id"]
      );
    }
    if (
      this.form.value["province_id3"]
    ) {
      uploadData.append(
        "province_id3",
        this.form.value["province_id3"]["id"]
      );
    }
    if (
      this.form.value["province_id4"]
    ) {
      uploadData.append(
        "province_id4",
        this.form.value["province_id4"]["id"]
      );
    }

    //district
    if (this.form.value["district_id2"])
    {
      uploadData.append("district_id2",this.form.value["district_id2"]["id"]);
    }
    if (this.form.value["district_id3"])
    {
      uploadData.append("district_id3",this.form.value["district_id3"]["id"]);
    }
    if (this.form.value["district_id4"])
    {
      uploadData.append("district_id4",this.form.value["district_id4"]["id"]);
    }

    //ward
    if (this.form.value["ward_id2"]) {
      uploadData.append("ward_id2", this.form.value["ward_id2"]["id"]);
    }
    if (this.form.value["ward_id3"]) {
      uploadData.append("ward_id3", this.form.value["ward_id3"]["id"]);
    }
    if (this.form.value["ward_id4"]) {
      uploadData.append("ward_id4", this.form.value["ward_id4"]["id"]);
    }


    this.studentdetailService
      .update(this.basicInfoData[0]["studentId"], uploadData)
      .subscribe(
        (result) => {

          this.router.navigate(['/student-management/student-management-list']);
          // const studentId = this.basicInfoData[0]["studentId"];
          // const address = this.basicInfoData[0]["address"];
          // const data = [{ studentId: studentId, address: address, tab: 2 }];
          // this.basicInforDataEvent.emit(data);
          this.notifyService.showSuccess(
            "Tạo mới thông tin thành công",
            "Thông báo"
          );
          this.resetForm();
          this.resetForm3();
          this.resetForm4();
        },
        (error) => {
          (error) => {
            if (error.message) {
              if (error.message["province_id2"]) {
                this.notifyService.showError(
                  "Tỉnh/Tp hộ khẩu thường trú không được để trống",
                  "Thông báo"
                );
              } else if (error.message["district_id2"]) {
                this.notifyService.showError(
                  "Quận/Huyện hộ khẩu thường trú không được để trống",
                  "Thông báo"
                );
              } else if (error.message["ward_id2"]) {
                this.notifyService.showError(
                  "Xã/Phường hộ khẩu thường trú không được để trống",
                  "Thông báo"
                );
              } else if (error.message["province_id3"]) {
                this.notifyService.showError(
                  "Tỉnh/Tp nguyên quán không được để trống",
                  "Thông báo"
                );
              } else if (error.message["district_id3"]) {
                this.notifyService.showError(
                  "Quận/Huyện nguyên quán không được để trống",
                  "Thông báo"
                );
              } else if (error.message["ward_id3"]) {
                this.notifyService.showError(
                  "Xã/Phường nguyên quán không được để trống",
                  "Thông báo"
                );
              } else if (error.message["province_id4"]) {
                this.notifyService.showError(
                  "Tỉnh/Tp nơi sinh không được để trống",
                  "Thông báo"
                );
              } else if (error.message["district_id4"]) {
                this.notifyService.showError(
                  "Quận/Huyện nơi sinh không được để trống",
                  "Thông báo"
                );
              } else if (error.message["ward_id4"]) {
                this.notifyService.showError(
                  "Xã/Phường nơi sinh không được để trống",
                  "Thông báo"
                );
              } else {
                this.notifyService.showError(
                  "Tạo mới thông tin thành công",
                  "Thông báo"
                );
              }
            }
          };
        });
    this.submitted = true;
    //reset lại giá trị của drop
    if (this.form.invalid) {
      return;
    }
  }
  //Check Box Giống Địa chỉ Hiện tại
  //Hộ khẩu thường trú
  getAsAddress() {
    if ((this.asAddress["nativeElement"].checked === true)) {

      const address_detail = this.basicInfoData[0]["address"]["address_detail"];
      if (address_detail) {
        var countAddress = address_detail.indexOf("-");
        this.address_detail2 = address_detail.substr(0, countAddress)
      }

      // this.address_detail2 = this.basicInfoData[0]["address"]["address_detail"];
      // const aaaa = this.basicInfoData['address'];
      var provinceValue = this.basicInfoData[0]["address"]["province_id"];
      const arrProvince = [];
      const mapProvince = this.ddlProvinceData
        .map(function (x) {
          return x.id;
        })
        .indexOf(Number(provinceValue));
      if (mapProvince !== -1) {
        arrProvince.push({
          id: this.ddlProvinceData[mapProvince]["id"],
          name: this.ddlProvinceData[mapProvince]["name"],
        });
        this.selectedProvince = {id:arrProvince[0]["id"], name:arrProvince[0]["name"]};
      }
      //show district
      //lay id province show district
      var province = this.selectedProvince["id"];
      this.addressService.getDistrict(province).subscribe((rel) => {
        const ddlDistrictData = rel["districts"];
        const districtObj = [];
        ddlDistrictData.forEach(function (item) {
          districtObj.push({ id: item["id"], name: item["name"] });
        });
        this.ddlDistrictData = districtObj;
        var districtValue = this.basicInfoData[0]["address"]["district_id"];
        const arrDistrict = [];
        const mapDistrict = this.ddlDistrictData
          .map(function (x) {
            return x.id;
          })
          .indexOf(Number(districtValue));
        if (mapDistrict !== -1) {
          arrDistrict.push({
            id: this.ddlDistrictData[mapDistrict]["id"],
            name: this.ddlDistrictData[mapDistrict]["name"],
          });
          this.selectedDistrict = {id:arrDistrict[0]["id"], name:arrDistrict[0]["name"]};
        }
        //lấy id district show ward
        var district = this.selectedDistrict["id"];
        this.addressService.getWard(district).subscribe((result) => {
          const ddlWardData = result["wards"];
          const wardObj = [];
          ddlWardData.forEach(function (item) {
            wardObj.push({ id: item["id"], name: item["name"] });
          });
          this.ddlWardData = wardObj;
          var wardValue = this.basicInfoData[0]["address"]["ward_id"];
          const arrWard = [];
          const mapWard = this.ddlWardData
            .map(function (x) {
              return x.id;
            })
            .indexOf(Number(wardValue));
          if (mapWard !== -1) {
            arrWard.push({
              id: this.ddlWardData[mapWard]["id"],
              name: this.ddlWardData[mapWard]["name"],
            });
            this.selectedWard = {id:arrWard[0]["id"], name:arrWard[0]["name"]};
          }
        });
      });
    }else{
      this.asAddress["nativeElement"].checked = false;
      this.selectedProvince = null;
      this.selectedDistrict = null;
      this.selectedWard = null;
      this.address_detail2 = null;
      this.ddlDistrictData =[];
      this.ddlWardData =[];
      this.resetForm();
    }
  }

  //Nguyên Quán
  getAsAddress_Origin() {
    if ((this.asAddressOrigin["nativeElement"].checked === true)) {
      // const aaaa = this.basicInfoData['address'];
      const address_detail = this.basicInfoData[0]["address"]["address_detail"];
      if (address_detail) {
        var countAddress = address_detail.indexOf("-");
        this.address_detail3 = address_detail.substr(0, countAddress)
      }
      // this.address_detail3 = this.basicInfoData[0]["address"]["address_detail"];
      var province_OriginValue = this.basicInfoData[0]["address"][
        "province_id"
      ];
      const arrProvince_Origin = [];
      const mapProvince_Origin = this.ddlProvinceData_Origin
        .map(function (x) {
          return x.id;
        })
        .indexOf(Number(province_OriginValue));
      if (mapProvince_Origin !== -1) {
        arrProvince_Origin.push({
          id: this.ddlProvinceData_Origin[mapProvince_Origin]["id"],
          name: this.ddlProvinceData_Origin[mapProvince_Origin][
            "name"
          ],
        });
        this.selectedProvince_Origin = {id: arrProvince_Origin[0]["id"], name: arrProvince_Origin[0]["name"]};
      }

      //show district
      //lay id province show district
      var province_Origin = this.selectedProvince_Origin["id"];
      this.addressService.getDistrict(province_Origin).subscribe((rel) => {
        const ddlDistrictData_Origin = rel["districts"];
        const districtObj_Origin = [];
        ddlDistrictData_Origin.forEach(function (item) {
          districtObj_Origin.push({
            id: item["id"],
            name: item["name"],
          });
        });
        this.ddlDistrictData_Origin = districtObj_Origin;
        var district_OriginValue = this.basicInfoData[0]["address"][
          "district_id"
        ];
        const arrDistrict_Origin = [];
        const mapDistrict_Origin = this.ddlDistrictData_Origin
          .map(function (x) {
            return x.id;
          })
          .indexOf(Number(district_OriginValue));
        if (mapDistrict_Origin !== -1) {
          arrDistrict_Origin.push({
            id: this.ddlDistrictData_Origin[mapDistrict_Origin]["id"],
            name: this.ddlDistrictData_Origin[mapDistrict_Origin][
              "name"
            ],
          });
        }
        this.selectedDistrict_Origin = {id: arrDistrict_Origin[0]["id"], name: arrDistrict_Origin[0]["name"]};
        //lấy id district show ward
        var district_Origin = this.selectedDistrict_Origin["id"];
        this.addressService.getWard(district_Origin).subscribe((result) => {
          const ddlWardData_Origin = result["wards"];
          const wardObj_Origin = [];
          ddlWardData_Origin.forEach(function (item) {
            wardObj_Origin.push({
              id: item["id"],
              name: item["name"],
            });
          });
          this.ddlWardData_Origin = wardObj_Origin;
          var ward_OriginValue = this.basicInfoData[0]["address"]["ward_id"];
          const arrWard_Origin = [];
          const mapWard_Origin = this.ddlWardData_Origin
            .map(function (x) {
              return x.id;
            })
            .indexOf(Number(ward_OriginValue));
          if (mapWard_Origin !== -1) {
            arrWard_Origin.push({
              id: this.ddlWardData_Origin[mapWard_Origin]["id"],
              name: this.ddlWardData_Origin[mapWard_Origin]["name"],
            });
            this.selectedWard_Origin = {id: arrWard_Origin[0]["id"], name: arrWard_Origin[0]["name"]};
          }
        });
      });
    }
    //Checkbox giống
    else{
      this.asAddressOrigin["nativeElement"].checked = false;
      this.selectedProvince_Origin = null;
      this.selectedDistrict_Origin = null;
      this.selectedWard_Origin = null;
      this.address_detail3 = null;
      this.ddlDistrictData_Origin = [];
      this.ddlWardData_Origin = [];
      this.resetForm3();
    }
  }

  //Birthplace Nơi sinh
  getAsAddress_Birthplace() {
    if ((this.asAddressBirthplace["nativeElement"].checked = true)) {
      //Show Địa chỉ Nơi sinh
      //show province
      var province_BirthplaceValue = this.basicInfoData[0]["address"][
        "province_id"
      ];
      const arrProvince_Birthplace = [];
      const mapProvince_Birthplace = this.ddlProvinceData_Birthplace
        .map(function (x) {
          return x.id;
        })
        .indexOf(Number(province_BirthplaceValue));
      if (mapProvince_Birthplace !== -1) {
        arrProvince_Birthplace.push({
          id: this.ddlProvinceData_Birthplace[mapProvince_Birthplace][
            "id"
          ],
          name: this.ddlProvinceData_Birthplace[mapProvince_Birthplace][
            "name"
          ],
        });
        this.selectedProvince_Birthplace = {id: arrProvince_Birthplace[0]["id"], name: arrProvince_Birthplace[0]["name"]};
      }

      //show district
      //lay id province show district
      var province_Birthplace = this.selectedProvince_Birthplace["id"];
      this.addressService.getDistrict(province_Birthplace).subscribe((rel) => {
        const ddlDistrictData_Birthplace = rel["districts"];
        const districtObj_Birthplace = [];
        ddlDistrictData_Birthplace.forEach(function (item) {
          districtObj_Birthplace.push({
            id: item["id"],
            name: item["name"],
          });
        });
        this.ddlDistrictData_Birthplace = districtObj_Birthplace;
        var district_BirthplaceValue = this.basicInfoData[0]["address"]["district_id"];
        const arrDistrict_Birthplace = [];
        const mapDistrict_Birthplace = this.ddlDistrictData_Birthplace
          .map(function (x) {
            return x.id;
          })
          .indexOf(Number(district_BirthplaceValue));
        if (mapDistrict_Birthplace !== -1) {
          arrDistrict_Birthplace.push({
            id: this.ddlDistrictData_Birthplace[mapDistrict_Birthplace][
              "id"
            ],
            name: this.ddlDistrictData_Birthplace[mapDistrict_Birthplace][
              "name"
            ],
          });
          this.selectedDistrict_Birthplace = {id: arrDistrict_Birthplace[0]["id"], name: arrDistrict_Birthplace[0]["name"]};
        }
        //lấy id district show ward
        var district_Birthplace = this.selectedDistrict_Birthplace["id"];
        this.addressService.getWard(district_Birthplace).subscribe((result) => {
          const ddlWardData_Birthplace = result["wards"];
          const wardObj_Birthplace = [];
          ddlWardData_Birthplace.forEach(function (item) {
            wardObj_Birthplace.push({
              id: item["id"],
              name: item["name"],
            });
          });
          this.ddlWardData_Birthplace = wardObj_Birthplace;
          var ward_BirthplaceValue = this.basicInfoData[0]["address"][
            "ward_id"
          ];
          const arrWard_Birthplace = [];
          const mapWard_Birthplace = this.ddlWardData_Birthplace
            .map(function (x) {
              return x.id;
            })
            .indexOf(Number(ward_BirthplaceValue));
          if (mapWard_Birthplace !== -1) {
            arrWard_Birthplace.push({
              id: this.ddlWardData_Birthplace[mapWard_Birthplace][
                "id"
              ],
              name: this.ddlWardData_Birthplace[mapWard_Birthplace][
                "name"
              ],
            });
            this.selectedWard_Birthplace = {id: arrWard_Birthplace[0]["id"], name: arrWard_Birthplace[0]["name"]};
          }
        });
      });
    }
    else{
      this.asAddressBirthplace["nativeElement"].checked = false;
      this.selectedProvince_Birthplace = null;
      this.selectedDistrict_Birthplace = null;
      this.selectedWard_Birthplace = null;
      this.ddlDistrictData_Birthplace = [];
      this.ddlWardData_Birthplace = [];
      this.resetForm4();
    }
  }


}
