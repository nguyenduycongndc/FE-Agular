import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder, FormControl, FormGroup,

  Validators
} from '@angular/forms';
import { NotificationService } from '../../../_services/notification.service';
import { ClassManagementSubjectService } from '../service/class-management-subject.service';
declare var $: any;

export enum KEY_CODE {
  PLUS = 187,
  MINUS = 189,
}

@Component({
  selector: 'app-class-management-subject',
  templateUrl: './class-management-subject.component.html',
  styleUrls: ['./class-management-subject.component.css'],
})
export class ClassManagementSubjectComponent implements OnInit {
  @ViewChild('selectClassSearch') selectClassSearch: ElementRef;
  @ViewChild('selectSemesterSearch') selectSemesterSearch: ElementRef;
  @ViewChild('selectSchoolTime') selectSchoolTime: ElementRef;

  enableEdit = false;
  enableEditIndex = null;

  id: number;
  subjects: any;
  gridData: [];
  subjectForm: FormGroup;
  control: FormArray;
  touchedRows: any;
  submitted = false;

  // Paging
  p: number = 1;
  countPage: number = 10;
  totalItems = 0;

  headerSubject = false; headerAddSubject = false;
  checkSubjectData = false;

  // Setting, data, selected value dropdown list properties
  ddlYearSearchData = []; selectedYearSearch: any;
  ddlYearData = []; selectedYear: any;

  ddlSemesterSearchData = []; selectedSemesterSearch: any;

  ddlGradeSearchData = []; selectedGradeSearch: any;

  ddlClassSearchData = []; selectedClassSearch: any;

  ddlGradeData = []; selectedGrade: any;

  ddlClassData = []; selectedClass: any;

  ddlSubjectData = []; selectedSubject: any;

  ddlSchoolTimeData = []; selectedSchoolTime: any;

  ddlSubjectKindData = []; selectedSubjectKind: any;
  ddlSubjectTypeData = []; selectedSubjectType: any;


  schoolTimeData = [];
  code: string;
  symbol: string;
  subject_kind: string;
  subject_type: string;
  year: string;
  status: boolean;
  lesson: number;
  description: string;

  loadingFilter = false;
  loadingApplyClass = false;
  loadingApplyGrade = false;
  loadingAddSubject = false;

  checkEdit = false;
  checkAddSubject = false;
  cancelEditData = [];
  currentYear: any;
  paginator: any;

  indexRow = 0;
  constructor(
    private fb: FormBuilder,
    private notifyService: NotificationService,
    private classManagementSubjectService: ClassManagementSubjectService
  ) {
    this.checkEdit = true;
  }

  get f() {
    return this.subjectForm.controls;
  }
  ngOnInit() {
    $(document).ready(function () {
      // $('#btnApplyGradeAll').attr('disabled', true);
      $('#btnApplyClass').attr('disabled', true);
    });
    // $(function () {

    //   $('tr').each(function () {
    //     // For each row

    //     $(this).find('td').each(function (i) {
    //       // For each cell in that row (using i as a counter)

    //       $(this).find('input').attr('tabindex', i + 1);
    //       // Set the tabindex of each input in that cell to the counter

    //     });
    //     // Counter gets reset for every row
    //   });
    // });
    this.checkAddSubject = false;
    this.loadingDataDropdownList();
    this.touchedRows = [];
    this.subjectForm = this.fb.group({
      data: this.fb.array([]),
      addData: this.fb.array([]),
      dropYears: new FormControl(''),
      dropSemesters: new FormControl(''),
      dropGrades: new FormControl(''),
      dropClasses: new FormControl(''),
    });

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    } else {
      var inputQuantity = [];
      $(function () {
        $('.lesson').each(function (i) {
          inputQuantity[i] = this.defaultValue;
          $(this).data('idx', i);
        });
        $('.lesson').on('keyup', function (e) {
          var $field = $(this),
            val = this.value,
            $thisIndex = parseInt($field.data('idx'), 10);
          if (this.validity && this.validity.badInput || isNaN(val) || $field.is(':invalid')) {
            this.value = inputQuantity[$thisIndex];
            return;
          }
          if (val.length > Number($field.attr('maxlength'))) {
            val = val.slice(0, 5);
            $field.val(val);
          }
          inputQuantity[$thisIndex] = val;
        });
      });
      return true;
    }
  }

  selectAllGradeSearch(gradeSearchData) {
    this.selectedGradeSearch = gradeSearchData;
    const arrClass = [];
    const arrId = [];
    if (gradeSearchData !== undefined && gradeSearchData.length > 0) {
      gradeSearchData.forEach(function (items) {
        arrId.push(items['id']);
      });
      this.classManagementSubjectService
        .getClassList(arrId)
        .pipe()
        .subscribe((data) => {
          data.forEach(function (items) {
            arrClass.push({ id: items['id'], name: items['name'] });
          });
          arrClass.sort((a, b) => {
            var str1 = a['name'];
            var str2 = b['name'];
            return this.CharCompare(str1, str2, 0);
          });

          this.ddlClassSearchData = arrClass;
        });
    } else {
      this.ddlClassSearchData = [];
      this.selectedClassSearch = [];
    }
  }

  deSelectAllGradeSearch() {
    this.selectedGradeSearch = [];
    this.selectedClassSearch = [];
    this.ddlClassSearchData = [];
  }

  selectAllClassSearch(classSearchData) {
    this.selectedClassSearch = classSearchData;
  }

  deSelectAllClassSearch() {
    this.selectedClassSearch = [];
  }

  onSelectYearSearch(item: any) {
    const arrSemester = [];
    this.selectedSemesterSearch = [];
    this.selectedGradeSearch = [];
    this.selectedClassSearch = [];
    this.ddlClassSearchData = [];
    if (item !== undefined) {
      this.classManagementSubjectService
        .getSemesterList([item.id])
        .pipe()
        .subscribe((data) => {
          data['query'].forEach(function (items) {
            arrSemester.push({ id: items['id'], name: items['name'] });
          });
          this.ddlSemesterSearchData = arrSemester;
        });
      const arrSubject = [];
      this.classManagementSubjectService
        .getGradeList([item.id])
        .pipe()
        .subscribe((subjectData) => {
          subjectData['query'].forEach(function (items) {
            arrSubject.push({ id: items['id'], name: items['name'] });
          });
          this.ddlGradeSearchData = arrSubject;
        });
    } else {
      this.ddlSemesterSearchData = [];
      this.ddlGradeSearchData = [];
      this.ddlClassSearchData = [];
      this.selectedClassSearch = [];
      this.selectedSemesterSearch = [];
      this.selectedGradeSearch = [];
    }
  }
  onSelectYear(item: any) {
    const arrSchoolTimes = [];
    this.selectedGrade = [];
    this.selectedClass = [];
    this.selectedSchoolTime = [];
    this.ddlClassData = [];
    if (item !== undefined) {
      this.classManagementSubjectService
        .getSemesterList([item.id])
        .pipe()
        .subscribe((data) => {
          data['query'].forEach(function (items) {
            arrSchoolTimes.push({ id: items['id'], name: items['name'] });
          });
          this.ddlSchoolTimeData = arrSchoolTimes;
        });
      const arrGrades = [];
      this.classManagementSubjectService
        .getGradeList([item.id])
        .pipe()
        .subscribe((subjectData) => {
          subjectData['query'].forEach(function (items) {
            arrGrades.push({ id: items['id'], name: items['name'] });
          });
          this.ddlGradeData = arrGrades;
        });
    } else {
      this.ddlSchoolTimeData = [];
      this.ddlGradeData = [];
      this.ddlClassData = [];
      this.selectedSchoolTime = [];
      this.selectedGrade = [];
      this.selectedClass = [];
    }
  }
  onSelectGradeSearch(item: any) {
    const arrClass = [];
    const arrId = [];
    if (item !== undefined) {
      item.forEach(function (items) {
        arrId.push(items['id']);
      });
      this.classManagementSubjectService
        .getClassList(arrId)
        .pipe()
        .subscribe((data) => {
          data.forEach(function (items) {
            arrClass.push({ id: items['id'], name: items['name'] });
          });
          arrClass.sort((a, b) => {
            var str1 = a['name'];
            var str2 = b['name'];
            return this.CharCompare(str1, str2, 0);
          });
          this.ddlClassSearchData = arrClass;

          //bắt đầu
          const arrAfterFilter = [];
          const arrSelected = this.selectedClassSearch;
          arrSelected.forEach(function(items){
            let id = items.id;
            let x = arrClass.map(function(ite) {return ite.id}).indexOf(id);
            if(x > -1){
              arrAfterFilter.push({id: items.id, name: items.name});
            }
          });
          if(arrAfterFilter.length > 0){
          this.selectedClassSearch = arrAfterFilter;
          }else{
            this.selectedClassSearch = [];
          }
          //kết thúc
        });
    } else {
      this.ddlClassSearchData = [];
      this.selectedClassSearch = [];
    }

  }

  onSelectGrade(item: any) {
    this.selectedClass = [];
    this.selectedSubject = [];
    this.ddlClassData = [];
    this.ddlSubjectData = [];
    this.code = '';
    this.symbol = '';
    this.subject_kind = '';
    this.subject_type = '';
    this.lesson = null;
    if (item !== undefined) {
      this.classManagementSubjectService
        .getClassByGradeId(item.id)
        .subscribe((data) => {
          const gradeObj = [];
          data['query'].forEach(function (item) {
            gradeObj.push({ id: item['id'], name: item['name'] });
          });
          this.ddlClassData = gradeObj;
        });
    }
  }

  onSelectClass() {
    this.selectedSubject = [];
    if (this.selectedGrade.id && this.selectedClass.id) {
      this.classManagementSubjectService
        .getSubjectByClassId(this.selectedGrade.id, this.selectedClass.id)
        .subscribe((data) => {
          const subjectObj = [];
          data.forEach(function (item) {
            subjectObj.push({ id: item['id'], name: item['name'] });
          });
          this.ddlSubjectData = data;
        });
    }
  }

  onSelectSubject() {
    this.code = '';
    this.symbol = '';
    this.subject_kind = '';
    this.subject_type = '';
    this.lesson = null;
    if (this.selectedSubject.id) {
      this.classManagementSubjectService
        .getSubjectDetailByClassId(this.selectedSubject.id)
        .subscribe((data) => {
          const subjectDetailObj = data['query'];
          if (subjectDetailObj['code']) {
            this.code = subjectDetailObj['code'];
          }
          if (subjectDetailObj['symbol']) {
            this.symbol = subjectDetailObj['symbol'];
          }
          if (subjectDetailObj['subject_kind']) {
            if (subjectDetailObj['subject_kind'] === 1) {
              this.subject_kind = 'Môn bắt buộc';
            } else if (subjectDetailObj['subject_kind'] === 2) {
              this.subject_kind = 'Môn tự chọn';
            } else if (subjectDetailObj['subject_kind'] === 3) {
              this.subject_kind = 'Môn chuyên';
            } else {
              this.subject_kind = 'Môn khác';
            }
          }
          if (subjectDetailObj['subject_type']) {
            if (subjectDetailObj['subject_type'] === 1) {
              this.subject_type = 'Tính điểm';
            } else {
              this.subject_type = 'Không tính điểm';
            }
          }
          if (subjectDetailObj['lesson']) {
            this.lesson = subjectDetailObj['lesson'];
          }
        });
    }
  }

  loadingDataDropdownList() {

    this.classManagementSubjectService
      .getSchoolYearList()
      .pipe()
      .subscribe((data) => {
        const arrYear = [];
        const arrYearIdAll = [];
        const selectedYear = [];
        const arrSemester = [];
        const currentSemester = data['id_semester'][0]['id'];
        const selectedSemester = [];
        const arrGrade = [];
        let currentY;
        data['query'].forEach(function (items) {
          arrYear.push({
            id: items['id'],
            name: items['start_year'] + '-' + items['end_year'],
          });
          if (data['id_current_year'] === items['id']) {
            selectedYear.push({
              id: items['id'],
              name: items['start_year'] + '-' + items['end_year'],
            });
            currentY = items['start_year'];
          }
          arrYearIdAll.push(items['id']);
        });
        this.ddlYearSearchData = arrYear;
        this.ddlYearData = arrYear;
        this.selectedYearSearch = selectedYear[0];
        this.selectedYear = selectedYear[0];
        this.currentYear = currentY;
        this.classManagementSubjectService
          .getSemesterList([data['id_current_year']])
          .pipe()
          .subscribe((semesterData) => {
            semesterData['query'].forEach(function (items) {
              arrSemester.push({
                id: items['id'],
                name: items['name'],
              });
              if (currentSemester === items['id']) {
                selectedSemester.push({
                  id: items['id'],
                  name: items['name'],
                });
              }
            });
            this.ddlSemesterSearchData = arrSemester;
            this.selectedSemesterSearch = selectedSemester[0];
            this.ddlSchoolTimeData = arrSemester;
            this.selectedSchoolTime = selectedSemester[0];
          });

        this.classManagementSubjectService
          .getSemesterList(arrYearIdAll)
          .pipe()
          .subscribe((semesterData) => {
            this.schoolTimeData = semesterData['query'];
          });

        //Đổ dữ liệu grades
        let def = data['id_current_year'];
        this.classManagementSubjectService
          .getGradeList(def)
          .pipe()
          .subscribe((datum) => {
            // const getGradesData = [];
            datum['query'].forEach(function (items) {
              arrGrade.push({
                id: items['id'],
                name: items['name'],
              });
            });
            this.ddlGradeSearchData = arrGrade;
          });

        // this.classManagementSubjectService
        //   .getGradeList([selectedYear[0]['id']])
        //   .pipe()
        //   .subscribe((gradeData) => {
        //     gradeData['query'].forEach(function (items) {
        //       arrGrade.push({ id: items['id'], name: items['name'] });
        //     });
        //     this.ddlGradeSearchData = arrGrade;
        //   });
      });

    this.classManagementSubjectService
      .getGradeByCurrentList()
      .subscribe((data) => {
        const gradeObj = [];
        data['query'].forEach(function (item) {
          gradeObj.push({ id: item['id'], name: item['name'] });
        });
        this.ddlGradeData = gradeObj;
        console.log(this.ddlGradeData);
      });

    this.ddlSubjectKindData = [
      { id: 1, name: 'Môn bắt buộc' },
      { id: 4, name: 'Môn tự chọn' },
      { id: 2, name: 'Môn chuyên' },
      { id: 3, name: 'Môn khác' }
    ];
    this.ddlSubjectTypeData = [
      { id: 1, name: 'Tính điểm' },
      { id: 2, name: 'Không tính điểm' }
    ];

    this.classManagementSubjectService
      .getSemesterCurrentYear()
      .subscribe((data) => {
        const schoolTimeObj = [];
        data['semester'].forEach(function (item) {
          schoolTimeObj.push({ id: item['id'], name: item['name'] });
        });
        this.ddlSchoolTimeData = schoolTimeObj;
      });
  }
  public onSelectAllSchoolTime(group: FormGroup) {
    const selected = this.ddlSchoolTimeData.map(item => item.id);
    console.log(this.selectedSchoolTime);
    group.get('school_time').patchValue(this.ddlSchoolTimeData);
  }

  public onClearAllSchoolTime(group: FormGroup) {
    group.get('school_time').patchValue([]);
  }
  perPageSelected(id: number) {
    this.countPage = id;
    this.p = 1;
  }

  ngAfterOnInit() {
    this.control = this.subjectForm.get('data') as FormArray;
  }

  initiateForm(): FormGroup {
    return this.fb.group({
      grade_id: new FormControl('', Validators.required),
      class_id: new FormControl('', [Validators.required]),
      subject_name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      code: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      symbol: new FormControl('', [Validators.maxLength(50)]),
      subject_kind: new FormControl('', [Validators.required]),
      subject_type: new FormControl('', [Validators.required]),
      lesson: new FormControl('', [Validators.required, Validators.maxLength(3)]),
      school_time: new FormControl('', [Validators.required]),
      status: new FormControl(true),
      year: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.maxLength(150)]),
      history: new FormControl(''),
      isEditable: [true],
    });
  }

  initiateEditForm(classSubjectData): FormGroup {
    const selectedSubjectKind = [];
    if (classSubjectData['subject_kind']) {
      const subjectKind = this.ddlSubjectKindData;
      let selectedSubjectKindObj = [];
      const mapSubjectKindData = subjectKind.map(function (x) { return x.id; }).indexOf(classSubjectData['subject_kind']);
      if (mapSubjectKindData > -1) {
        selectedSubjectKindObj = [
          {
            id: subjectKind[mapSubjectKindData]['id'],
            name: subjectKind[mapSubjectKindData]['name'],
          },
        ];
        selectedSubjectKind.push(selectedSubjectKindObj);
      }
      this.subject_kind = selectedSubjectKindObj[0];
    }
    const selectedSubjectType = [];
    if (classSubjectData['subject_kind']) {
      const subjectType = this.ddlSubjectTypeData;
      let selectedSubjectTypeObj = [];
      const mapSubjectTypeData = subjectType.map(function (x) { return x.id; }).indexOf(classSubjectData['subject_type']);
      if (mapSubjectTypeData > -1) {
        selectedSubjectTypeObj = [
          {
            id: subjectType[mapSubjectTypeData]['id'],
            name: subjectType[mapSubjectTypeData]['name'],
          },
        ];
        selectedSubjectType.push(selectedSubjectTypeObj);
      }
      this.subject_type = selectedSubjectTypeObj[0];
    }
    // if (classSubjectData['subject_kind'] === 1) {
    //   this.subject_kind = 'Môn bắt buộc';
    // } else if (classSubjectData['subject_kind'] === 2) {
    //   this.subject_kind = 'Môn tự chọn';
    // } else if (classSubjectData['subject_kind'] === 3) {
    //   this.subject_kind = 'Môn chuyên';
    // } else {
    //   this.subject_kind = 'Môn khác';
    // }

    // if (classSubjectData['subject_type'] === 1) {
    //   this.subject_type = 'Tính điểm';
    // } else {
    //   this.subject_type = 'Không tính điểm';
    // }

    let year_id = [];
    if (classSubjectData['year_id']) {
      const ddlYearData = this.ddlYearSearchData;
      let selectedYear = [];
      const mapYear = ddlYearData.map(function (x) { return x.id; }).indexOf(classSubjectData['year_id']);
      if (mapYear > -1) {
        selectedYear = [
          {
            id: ddlYearData[mapYear]['id'],
            name: ddlYearData[mapYear]['name'],
          },
        ];
      }
      year_id = selectedYear[0];
    }

    const grade_id = { id: classSubjectData['grade_id'], name: classSubjectData['grade_name'] };
    const class_id = { id: classSubjectData['class_id'], name: classSubjectData['class_name'] };

    // this.classManagementSubjectService
    //   .getSubjectByClassId(
    //     grade_id.id,
    //     class_id.id
    //   )
    //   .subscribe((data) => {
    //     const subjectObj = [];
    //     data.forEach(function (item) {
    //       subjectObj.push(item['id']);
    //     });
    //     this.ddlSubjectData = subjectObj;
    //   });

    // const subject_name = { id: classSubjectData['subject_name'], name: classSubjectData['subject_name'] };
    const subject_name = classSubjectData['name'];
    const selectedSchoolTimeData = [];
    if (classSubjectData['school_time']) {
      const arr = JSON.parse('[' + classSubjectData['school_time'] + ']');
      const schoolTime = this.schoolTimeData;
      let selectedSchoolTimes = [];

      arr.forEach(function (item) {
        const mapSchoolTimeData = schoolTime.map(function (x) { return x.id; }).indexOf(item);
        if (mapSchoolTimeData > -1) {
          selectedSchoolTimes = [
            {
              id: schoolTime[mapSchoolTimeData]['id'],
              name: schoolTime[mapSchoolTimeData]['name'],
            },
          ];
          selectedSchoolTimeData.push(selectedSchoolTimes[0]);
        }
      });
      this.selectedSchoolTime = selectedSchoolTimeData;
    }

    if (classSubjectData['status'] === 1) {
      this.status = true;
    } else {
      this.status = false;
    }

    return this.fb.group({
      id: new FormControl(classSubjectData['id']),
      grade_id: new FormControl({ value: grade_id, disabled: true }, [Validators.required]),
      class_id: new FormControl({ value: class_id, disabled: true }, [Validators.required]),
      subject_name: new FormControl({ value: subject_name, disabled: true }, [Validators.required, Validators.maxLength(50)]),
      code: new FormControl({ value: classSubjectData['code'], disabled: true }, [Validators.required, Validators.maxLength(30)]),
      class_code: new FormControl(classSubjectData['class_code']),
      symbol: new FormControl(classSubjectData['symbol'], [Validators.maxLength(50)]),
      subject_kind: new FormControl(this.subject_kind, [Validators.required]),
      subject_type: new FormControl(this.subject_type, [Validators.required]),
      lesson: new FormControl(classSubjectData['lesson'], [Validators.required, Validators.maxLength(3)]),
      year: new FormControl({ value: year_id, disabled: true }, [Validators.required]),
      school_time: new FormControl(selectedSchoolTimeData, [Validators.required]),
      status: new FormControl(this.status),
      description: new FormControl(classSubjectData['description'], [
        Validators.maxLength(150),
      ]),
      history: new FormControl(classSubjectData['cs_history']),
      isEdit: new FormControl(classSubjectData['edit']),
      isEditable: [false],
    });
  }

  addRow() {
    this.indexRow++;
    this.loadingAddSubject = true;
    this.checkEdit = false;
    this.checkAddSubject = true;
    this.headerAddSubject = true;

    let countIsEditable = 0;
    let countIsAddable = 0;

    const controlData = this.subjectForm.get('data') as FormArray;
    const control = this.subjectForm.get('addData') as FormArray;
    if (control.controls.length === 0) {
      this.loadingAddSubject = false;
      control.push(this.initiateForm());
      this.resetForm();

    } else {
      controlData.controls.forEach(controls => {
        if (controls.get('isEditable').value === true) {
          countIsAddable++;
        }
      });
      control.controls.forEach(controls => {
        if (controls.get('isEditable').value === true) {
          countIsEditable++;
        }
      });
      if (countIsEditable > 0 || countIsAddable > 0) {
        this.loadingAddSubject = false;
        return this.notifyService.showWarning('Dữ liệu trên bản ghi chưa được hoàn thành. Vui lòng kiểm tra lại!', 'Thông báo');
      } else {
        this.loadingAddSubject = false;
        control.push(this.initiateForm());
        this.resetForm();
      }
    }
  }

  addRowEdit(classSubjectData: any) {
    const control = this.subjectForm.get('data') as FormArray;
    control.push(this.initiateEditForm(classSubjectData));
    // control.controls[0].get('grade_id').disable();
    // control.controls[0].get('class_id').disable();
  }

  deleteRow(index: number) {
    this.indexRow--;
    if (index === 0 || this.indexRow === 0) {
      const control = this.subjectForm.get('addData') as FormArray;
      if (index === 0) {
        control.removeAt(index);
      } else {
        control.removeAt(this.indexRow);
      }

      this.headerAddSubject = false;
      this.checkEdit = true;
    } else {
      const control = this.subjectForm.get('addData') as FormArray;
      control.removeAt(index);
    }

  }

  deleteEditRow(index: number, group: FormGroup) {
    let classSubjectId;
    const isDelete = confirm('Bạn chắc chắn muốn xóa môn học ra khỏi lớp?');
    if (isDelete) {
      classSubjectId = group.get('id').value;
      if (classSubjectId) {
        this.classManagementSubjectService.delete(classSubjectId).subscribe(
          (data) => {
            this.notifyService.showSuccess(
              'Xóa môn học theo lớp thành công!',
              'Thông báo'
            );
            const control = this.subjectForm.get('data') as FormArray;
            control.removeAt(index);
            this.searchByInput();
          },
          (error) => {
            if (error['error']) {
              if (error['error'] === 15) {
                this.notifyService.showError(
                  'Dữ liệu bản ghi không tồn tại hoặc đã ngừng hoạt động!',
                  'Thông báo'
                );
              }
            }
          }
        );
      }
    }
  }

  editRow(group: FormGroup) {
    this.getAddFormControls.controls = [];
    this.checkAddSubject = false;
    const control = this.subjectForm.get('data') as FormArray;
    let countIsEditable = 0;
    this.cancelEditData = group.value;
    control.controls.forEach(controls => {
      if (controls.get('isEditable').value === true) {
        countIsEditable++;
      }
    });
    if (countIsEditable > 0) {
      return this.notifyService.showWarning('Dữ liệu trên bản ghi chưa được hoàn thành. Vui lòng kiểm tra lại!', 'Thông báo');
    } else {
      this.selectedGrade = [];
      this.selectedClass = [];
      // this.selectedSchoolTime = [];
      group.get('isEditable').setValue(true);
      // Binding Grade data
      if (group.get('grade_id').value) {
        this.selectedGrade = { id: group.get('grade_id').value.id, name: group.get('grade_id').value.name };
        this.classManagementSubjectService
          .getClassByGradeId(this.selectedGrade.id)
          .subscribe((data) => {
            const gradeObj = [];
            data['query'].forEach(function (item) {
              gradeObj.push({ id: item['id'], name: item['name'] });
            });
            this.ddlClassData = gradeObj;
          });
        group.get('grade_id').disable();
        // $(document).ready(function () {
        //   $('.ddlGrade').attr('disabled', true);
        //   $('#btnApplyClass').attr('disabled', true);
        // });
      }
      // Binding Class data
      if (group.get('class_id').value) {
        this.selectedClass = { id: group.get('class_id').value.id, name: group.get('class_id').value.name };
        this.classManagementSubjectService
          .getSubjectByClassId(this.selectedGrade.id, this.selectedClass.id)
          .subscribe((data) => {
            const subjectObj = [];
            data.forEach(function (item) {
              subjectObj.push({ id: item['id'], name: item['name'] });
            });
            this.ddlSubjectData = data;
          });
        group.get('class_id').disable();
      }
      // Binding Subject data
      // if (group.get('subject_name').value) {
      //   this.selectedSubject = { id: group.get('subject_name').value.id, name: group.get('subject_name').value.name };
      //   this.classManagementSubjectService
      //     .getSubjectDetailByClassId(group.get('subject_name').value.id)
      //     .subscribe((data) => {
      //       const subjectDetailObj = data['query'];
      //       if (subjectDetailObj['code']) {
      //         this.code = subjectDetailObj['code'];
      //       } else {
      //         this.code = '';
      //       }
      //       if (subjectDetailObj['symbol']) {
      //         this.symbol = subjectDetailObj['symbol'];
      //       } else {
      //         this.symbol = '';
      //       }
      //       if (subjectDetailObj['subject_kind']) {
      //         if (subjectDetailObj['subject_kind'] === 1) {
      //           this.subject_kind = 'Môn bắt buộc';
      //         } else if (subjectDetailObj['subject_kind'] === 2) {
      //           this.subject_kind = 'Môn tự chọn';
      //         } else if (subjectDetailObj['subject_kind'] === 3) {
      //           this.subject_kind = 'Môn chuyên';
      //         } else {
      //           this.subject_kind = 'Môn khác';
      //         }
      //       }
      //       if (subjectDetailObj['subject_type']) {
      //         if (subjectDetailObj['subject_type'] === 1) {
      //           this.subject_type = 'Tính điểm';
      //         } else {
      //           this.subject_type = 'Không tính điểm';
      //         }
      //       }
      //       if (subjectDetailObj['lesson']) {
      //         this.lesson = subjectDetailObj['lesson'];
      //       }
      //     });
      // }
      if (group.get('code').value) {
        this.code = group.get('code').value;
      } else {
        this.code = '';
      }
      if (group.get('symbol').value) {
        this.symbol = group.get('symbol').value;
      } else {
        this.symbol = '';
      }
      if (group.get('subject_kind').value) {
        // if (subjectDetailObj['subject_kind'] === 1) {
        //   this.subject_kind = 'Môn bắt buộc';
        // } else if (subjectDetailObj['subject_kind'] === 2) {
        //   this.subject_kind = 'Môn tự chọn';
        // } else if (subjectDetailObj['subject_kind'] === 3) {
        //   this.subject_kind = 'Môn chuyên';
        // } else {
        //   this.subject_kind = 'Môn khác';
        // }
        this.subject_kind = group.get('subject_kind').value;
        this.selectedSubjectKind = group.get('subject_kind').value;
      }
      if (group.get('subject_type').value) {
        // if (subjectDetailObj['subject_type'] === 1) {
        //   this.subject_type = 'Tính điểm';
        // } else {
        //   this.subject_type = 'Không tính điểm';
        // }
        this.subject_kind = group.get('subject_type').value;
        this.selectedSubjectType = group.get('subject_type').value;
      }
      if (group.get('lesson').value) {
        // this.lesson = subjectDetailObj['lesson'];
        this.lesson = group.get('lesson').value;
      }
      // Binding School time data
      if (group.get('school_time').value && group.get('school_time').value !== undefined) {
        const schoolTime = this.schoolTimeData;
        const arr = group.get('school_time').value;
        let selectedSchoolTimes: any;
        let selectedSchoolTimeData = [];
        arr.forEach(function (item) {
          const mapSchoolTimeData = schoolTime
            .map(function (x) {
              return x.id;
            })
            .indexOf(item.id);
          if (mapSchoolTimeData > -1) {
            selectedSchoolTimes =
            {
              id: schoolTime[mapSchoolTimeData]['id'],
              name: schoolTime[mapSchoolTimeData]['name'],
            }
              ;
            selectedSchoolTimeData.push(selectedSchoolTimes);
          }
        });
        this.selectedSchoolTime = selectedSchoolTimeData;
      }
      if (group.get('status').value) {
        this.status = true;
      } else {
        this.status = false;
      }
      if (group.get('description').value) {
        this.description = group.get('description').value;
      } else {
        this.description = '';
      }
    }
  }

  editRowAddNew(group: FormGroup) {
    // this.getAddFormControls.setValue([]);
    this.checkAddSubject = false;
    const control = this.subjectForm.get('addData') as FormArray;
    let countIsEditable = 0;
    this.cancelEditData = group.value;
    control.controls.forEach(controls => {
      if (controls.get('isEditable').value === true) {
        countIsEditable++;
      }
    });
    if (countIsEditable > 0) {
      return this.notifyService.showWarning('Dữ liệu trên bản ghi chưa được hoàn thành. Vui lòng kiểm tra lại!', 'Thông báo');
    } else {
      this.selectedGrade = [];
      this.selectedClass = [];
      this.selectedSchoolTime = [];
      group.get('isEditable').setValue(true);
      // Binding Grade data
      if (group.get('grade_id').value) {
        this.selectedGrade = { id: group.get('grade_id').value.id, name: group.get('grade_id').value.name };
        this.classManagementSubjectService
          .getClassByGradeId(this.selectedGrade.id)
          .subscribe((data) => {
            const gradeObj = [];
            data['query'].forEach(function (item) {
              gradeObj.push({ id: item['id'], name: item['name'] });
            });
            this.ddlClassData = gradeObj;
          });
        group.get('grade_id').disable();
      }
      // Binding Class data
      if (group.get('class_id').value) {
        this.selectedClass = { id: group.get('class_id').value.id, name: group.get('class_id').value.name };
        this.classManagementSubjectService
          .getSubjectByClassId(this.selectedGrade.id, this.selectedClass.id)
          .subscribe((data) => {
            const subjectObj = [];
            data.forEach(function (item) {
              subjectObj.push({ id: item['id'], name: item['name'] });
            });
            this.ddlSubjectData = data;
          });
        group.get('class_id').disable();
      }
      if (group.get('code').value) {
        this.code = group.get('code').value;
      } else {
        this.code = '';
      }
      if (group.get('symbol').value) {
        this.symbol = group.get('symbol').value;
      } else {
        this.symbol = '';
      }
      if (group.get('subject_kind').value) {
        // if (subjectDetailObj['subject_kind'] === 1) {
        //   this.subject_kind = 'Môn bắt buộc';
        // } else if (subjectDetailObj['subject_kind'] === 2) {
        //   this.subject_kind = 'Môn tự chọn';
        // } else if (subjectDetailObj['subject_kind'] === 3) {
        //   this.subject_kind = 'Môn chuyên';
        // } else {
        //   this.subject_kind = 'Môn khác';
        // }
        this.subject_kind = group.get('subject_kind').value;
        this.selectedSubjectKind = group.get('subject_kind').value;
      }
      if (group.get('subject_type').value) {
        // if (subjectDetailObj['subject_type'] === 1) {
        //   this.subject_type = 'Tính điểm';
        // } else {
        //   this.subject_type = 'Không tính điểm';
        // }
        this.subject_kind = group.get('subject_type').value;
        this.selectedSubjectType = group.get('subject_type').value;
      }
      if (group.get('lesson').value) {
        // this.lesson = subjectDetailObj['lesson'];
        this.lesson = group.get('lesson').value;
      }
      // Binding School time data
      if (group.get('school_time').value && group.get('school_time').value !== undefined) {
        const schoolTime = this.schoolTimeData;
        const arr = group.get('school_time').value;
        let selectedSchoolTimes: any;
        let selectedSchoolTimeData = [];
        arr.forEach(function (item) {
          const mapSchoolTimeData = schoolTime
            .map(function (x) {
              return x.id;
            })
            .indexOf(item.id);
          if (mapSchoolTimeData > -1) {
            selectedSchoolTimes =
            {
              id: schoolTime[mapSchoolTimeData]['id'],
              name: schoolTime[mapSchoolTimeData]['name'],
            }
              ;
            selectedSchoolTimeData.push(selectedSchoolTimes);
          }
        });
        this.selectedSchoolTime = selectedSchoolTimeData;
      }
      if (group.get('status').value) {
        this.status = true;
      } else {
        this.status = false;
      }
      if (group.get('description').value) {
        this.description = group.get('description').value;
      } else {
        this.description = '';
      }

      // this.getAddFormControls.setValue(group.value);
      this.checkAddSubject = true;
    }
  }

  doneRow(group: FormGroup) {
    if (group.controls) {
      group.controls.year.setValidators(Validators.required);
      group.controls.year.updateValueAndValidity();
      group.controls.grade_id.setValidators(Validators.required);
      group.controls.grade_id.updateValueAndValidity();
      group.controls.class_id.setValidators(Validators.required);
      group.controls.class_id.updateValueAndValidity();
      group.controls.subject_name.setValidators([Validators.required, Validators.maxLength(50)]);
      group.controls.subject_name.updateValueAndValidity();
      group.controls.code.setValidators([Validators.required, Validators.maxLength(30)]);
      group.controls.code.updateValueAndValidity();
      group.controls.symbol.setValidators([Validators.maxLength(50)]);
      group.controls.symbol.updateValueAndValidity();
      group.controls.subject_kind.setValidators(Validators.required);
      group.controls.subject_kind.updateValueAndValidity();
      group.controls.subject_type.setValidators(Validators.required);
      group.controls.subject_type.updateValueAndValidity();
      group.controls.lesson.setValidators([Validators.required, Validators.maxLength(3)]);
      group.controls.lesson.updateValueAndValidity();
      group.controls.school_time.setValidators(Validators.required);
      group.controls.school_time.updateValueAndValidity();
      group.controls.description.setValidators(Validators.maxLength(150));
      group.controls.description.updateValueAndValidity();
    }
    this.submitted = true;
    if (group.invalid) {
      return;
    }
    group.get('isEditable').setValue(false);
  }
  doneRowEdit(group: FormGroup) {
    // const description = this.description;
    // const status = this.status;
    if (group.controls) {
      group.controls.year.setValidators(Validators.required);
      group.controls.year.updateValueAndValidity();
      group.controls.grade_id.setValidators(Validators.required);
      group.controls.grade_id.updateValueAndValidity();
      group.controls.class_id.setValidators(Validators.required);
      group.controls.class_id.updateValueAndValidity();
      group.controls.subject_name.setValidators([Validators.required, Validators.maxLength(50)]);
      group.controls.subject_name.updateValueAndValidity();
      group.controls.code.setValidators([Validators.required, Validators.maxLength(30)]);
      group.controls.code.updateValueAndValidity();
      group.controls.symbol.setValidators([Validators.maxLength(50)]);
      group.controls.symbol.updateValueAndValidity();
      group.controls.subject_kind.setValidators(Validators.required);
      group.controls.subject_kind.updateValueAndValidity();
      group.controls.subject_type.setValidators(Validators.required);
      group.controls.subject_type.updateValueAndValidity();
      group.controls.lesson.setValidators([Validators.required, Validators.maxLength(3)]);
      group.controls.lesson.updateValueAndValidity();
      group.controls.school_time.setValidators(Validators.required);
      group.controls.school_time.updateValueAndValidity();
      group.controls.description.setValidators(Validators.maxLength(150));
      group.controls.description.updateValueAndValidity();
    }
    // const control = this.subjectForm.get('data') as FormArray;
    // this.touchedRows = [];
    // this.touchedRows = control.controls
    //   .filter((row) => row.touched)
    //   .map((row) => row.value);

    // if (this.touchedRows.length > 0) {
    //   this.submitted = true;
    //   if (group.invalid) {
    //     return;
    //   }
    // }
    this.submitted = true;
    if (group.invalid) {
      return;
    } else {
      console.log(group.value);
      const subjectFilterData = new FormData();
      let classSubjectId;
      var i = 0;
      if (group.value) {
        if (group.value.id) {
          classSubjectId = group.value.id;
        }
        if (group.controls.subject_name.value) {
          subjectFilterData.append('name', group.controls.subject_name.value);
        }
        if (group.value.lesson) {
          subjectFilterData.append('lesson', group.value.lesson);
        }
        if (group.controls.code.value) {
          subjectFilterData.append('code', group.controls.code.value);
        }
        if (group.value.subject_kind) {
          subjectFilterData.append('subject_kind', group.value.subject_kind.id);
        }
        if (group.value.subject_type) {
          subjectFilterData.append('subject_type', group.value.subject_type.id);
        }
        if (group.value.symbol) {
          subjectFilterData.append('symbol', group.value.symbol);
        }
        if (group.value.school_time) {
          group.value.school_time.forEach(function (item) {
            subjectFilterData.append('school_time' + '[' + i + ']', item.id);
            i++;
          });
        }
        if (group.value.status === true) {
          subjectFilterData.append('status', '1');
        } else {
          subjectFilterData.append('status', '0');
        }
        if (group.value.description) {
          subjectFilterData.append('description', group.value.description);
        }
      }

      this.classManagementSubjectService
        .update(classSubjectId, subjectFilterData)
        .subscribe(
          (data) => {
            const result = data['messages'];
            if (result !== undefined && result === 'success') {
              this.notifyService.showSuccess(
                'Cập nhật môn học theo lớp thành công!',
                'Thông báo'
              );
              this.searchByInput();
              this.p = this.p;
              group.get('isEditable').setValue(false);
            } else {
              this.notifyService.showError(
                'Cập nhật môn học theo lớp không thành công!',
                'Thông báo'
              );
              group.get('isEditable').setValue(true);
            }
          },
          (error) => {
            console.log(error);
            group.get('isEditable').setValue(true);
            if (error.errors) {
              if (error.errors.code.length > 0 && error.errors.code[0] !== undefined && error.errors.code[0] === '1') {
                this.notifyService.showError('Mã môn học không được để trống!', 'Thông báo');
              } else if (error.errors.code.length > 0 && error.errors.code[0] !== undefined && error.errors.code[0] === '4') {
                this.notifyService.showError('Mã môn học đã tồn tại trong phân phối chương trình!', 'Thông báo');
              } else if (error.errors.name.length > 0 && error.errors.name[0] !== undefined && error.errors.name[0] === '1') {
                this.notifyService.showError('Tên môn học không được để trống!', 'Thông báo');
              } else if (error.errors.lesson.length > 0 && error.errors.lesson[0] !== undefined && error.errors.lesson[0] === '1') {
                this.notifyService.showError('Tiết học không được để trống!', 'Thông báo');
              } else if (error.errors.lesson.length > 0 && error.errors.lesson[0] !== undefined && error.errors.lesson[0] === '3') {
                this.notifyService.showError('Tiết học phải lớn hơn hoặc bằng 1 tiết!', 'Thông báo');
              } else if (error.errors.lesson.length > 0 && error.errors.lesson[0] !== undefined && error.errors.lesson[0] === '5') {
                this.notifyService.showError('Tiết học không được quá 500 tiết!', 'Thông báo');
              } else if (error.errors.subject_kind.length > 0 && error.errors.subject_kind[0] !== undefined && error.errors.subject_kind[0] === '1') {
                this.notifyService.showError('Loại môn học không được để trống!', 'Thông báo');
              } else if (error.errors.subject_kind.length > 0 && error.errors.subject_kind[0] !== undefined && error.errors.subject_kind[0] === '2') {
                this.notifyService.showError('Loại môn học gồm 4 loại: 1: Môn bắt buộc, 2: Môn chuyên , 3: Môn Khác, 4: Môn tự chọn', 'Thông báo');
              } else if (error.errors.subject_type.length > 0 && error.errors.subject_type[0] !== undefined && error.errors.subject_type[0] === '1') {
                this.notifyService.showError('Kiểu môn học không được để trống!', 'Thông báo');
              } else if (error.errors.subject_type.length > 0 && error.errors.subject_type[0] !== undefined && error.errors.subject_type[0] === '2') {
                this.notifyService.showError('Kiểu môn học gồm 2 kiểu: 1: Tính điểm, 2: Không tính điểm', 'Thông báo');
              } else if (error.errors.school_time.length > 0 && error.errors.school_time[0] !== undefined && error.errors.school_time[0] === '1') {
                this.notifyService.showError('Hiệu lực không được để trống!', 'Thông báo');
              } else if (error.errors.school_time.length > 0 && error.errors.school_time[0] !== undefined && error.errors.school_time[0] === '2') {
                this.notifyService.showError('Mã hiệu lực phải là kiểu số nguyên', 'Thông báo');
              } else if (error.errors.status.length > 0 && error.errors.status[0] !== undefined && error.errors.status[0] === '1') {
                this.notifyService.showError('Trạng thái không được để trống!', 'Thông báo');
              } else if (error.errors.status.length > 0 && error.errors.status[0] !== undefined && error.errors.status[0] === '2') {
                this.notifyService.showError('Trạng thái khôn đúng kiểu dữ liệu!', 'Thông báo');
              }
            } else if (error.error) {
              this.notifyService.showError(error.error, 'Thông báo');
            } else {
              this.notifyService.showError('Cập nhật dữ liệu môn học theo lớp không thành công!', 'Thông báo');
            }
          }
        );
    }
    //  else {
    //   this.notifyService.showSuccess(
    //     'Cập nhật môn học theo lớp thành công!',
    //     'Thông báo'
    //   );
    //   group.get('isEditable').setValue(false);
    // }

  }

  cancelEdit(group: FormGroup) {
    group.patchValue(this.cancelEditData);
    group.get('isEditable').setValue(false);
  }

  get getFormControls() {
    const control = this.subjectForm.get('data') as FormArray;
    return control;
  }

  get getAddFormControls() {
    const control = this.subjectForm.get('addData') as FormArray;
    return control;
  }

  applyClass() {
    this.loadingApplyClass = true;
    const control = this.subjectForm.get('addData') as FormArray;
    control.controls[0].get('year').setValidators(Validators.required);
    control.controls[0].get('year').updateValueAndValidity();
    control.controls[0].get('grade_id').setValidators(Validators.required);
    control.controls[0].get('grade_id').updateValueAndValidity();
    control.controls[0].get('class_id').setValidators(Validators.required);
    control.controls[0].get('class_id').updateValueAndValidity();
    control.controls[0].get('subject_name').setValidators([Validators.required, Validators.maxLength(50)]);
    control.controls[0].get('subject_name').updateValueAndValidity();
    control.controls[0].get('code').setValidators([Validators.required, Validators.maxLength(30)]);
    control.controls[0].get('code').updateValueAndValidity();
    control.controls[0].get('symbol').setValidators([Validators.maxLength(50)]);
    control.controls[0].get('symbol').updateValueAndValidity();
    control.controls[0].get('subject_kind').setValidators(Validators.required);
    control.controls[0].get('subject_kind').updateValueAndValidity();
    control.controls[0].get('subject_type').setValidators(Validators.required);
    control.controls[0].get('subject_type').updateValueAndValidity();
    control.controls[0].get('lesson').setValidators([Validators.required, Validators.maxLength(3)]);
    control.controls[0].get('lesson').updateValueAndValidity();
    control.controls[0].get('school_time').setValidators(Validators.required);
    control.controls[0].get('school_time').updateValueAndValidity();
    control.controls[0].get('description').setValidators(Validators.maxLength(150));
    control.controls[0].get('description').updateValueAndValidity();
    this.touchedRows = control.controls
      .filter((row) => row.touched)
      .map((row) => row.value);
    if (this.touchedRows.length > 0) {
      this.submitted = true;
      const data = [];
      const subjectResult = [];
      let subjectObj = {};
      if (this.subjectForm.controls.addData.invalid) {
        this.loadingApplyClass = false;
        return;
      }
      this.touchedRows.forEach((obj) => {
        if (obj['isEditable'] === true) {
          this.loadingApplyClass = false;
          return this.notifyService.showError(
            'Dữ liệu trên bản ghi chưa được hoàn thành. Vui lòng kiểm tra lại!',
            'Lỗi'
          );
        } else {
          const schoolTimeObj = [];
          if (obj['school_time'] && obj['school_time'].length > 0) {
            obj['school_time'].forEach(items => {
              schoolTimeObj.push(items.id);
            });
          }
          subjectObj = {
            year_id: obj['year'] ? obj['year'].id : '',
            class_id: obj['class_id'] ? obj['class_id'].id : '',
            code: obj['code'] ? obj['code'] : '',
            description: obj['description'] ? obj['description'] : '',
            grade_id: obj['grade_id'] ? obj['grade_id'].id : '',
            lesson: obj['lesson'] ? obj['lesson'] : null,
            school_time: schoolTimeObj
              ? schoolTimeObj
              : [],
            status: obj['status'] ? 1 : 0,
            name: obj['subject_name'] ? obj['subject_name'] : '',
            subject_kind: obj['subject_kind'] ? obj['subject_kind'].id : '',
            subject_type: obj['subject_type'] ? obj['subject_type'].id : '',
            symbol: obj['symbol'] ? obj['symbol'] : '',
          };
          data.push(subjectObj);
        }
      });
      if (data.length > 0) {
        subjectResult.push({ data: data });
        this.touchedRows = subjectResult;
        console.log(this.touchedRows);
        this.classManagementSubjectService
          .applyClassList(this.touchedRows[0])
          .subscribe(() => {
            this.notifyService.showSuccess(
              'Áp dụng môn học theo lớp thành công!',
              'Thông báo'
            );
            this.getAddFormControls.controls = [];
            this.searchByInput();
            this.checkEdit = false;
            this.loadingApplyClass = false;
          },
            (error) => {
              this.checkEdit = false;
              this.loadingApplyClass = false;
              if (error.errors && error.errors !== undefined) {
                if (error.errors['1']) {
                  if (error.errors['1']['class_id']) {
                    this.notifyService.showError(
                      'Lớp học không được để trống.',
                      'Thông báo lỗi'
                    );
                  } else if (error.errors['1']['name']) {
                    this.notifyService.showError(
                      'Môn học không được để trống.',
                      'Thông báo lỗi'
                    );
                  }
                  else if (error.errors['1']['school_time']) {
                    this.notifyService.showError(
                      'Hiệu lực không được để trống.',
                      'Thông báo lỗi'
                    );
                  } else {
                    this.notifyService.showError(
                      'Trạng thái không được để trống.',
                      'Thông báo lỗi'
                    );
                  }
                } else if (error.errors['7']) {
                  if (error.errors['1']['class_id']) {
                    this.notifyService.showError(
                      'Mã lớp học không phải là kiểu số nguyên.',
                      'Thông báo lỗi'
                    );
                  } else if (error.errors['1']['subject_name']) {
                    this.notifyService.showError(
                      'Mã môn học không phải là kiểu số nguyên.',
                      'Thông báo lỗi'
                    );
                  } else if (error.errors['1']['school_time']) {
                    this.notifyService.showError(
                      'Mã hiệu lực không phải là kiểu số nguyên.',
                      'Thông báo lỗi'
                    );
                  } else {
                    this.notifyService.showError(
                      'Trạng thái không đúng định dạng.',
                      'Thông báo lỗi'
                    );
                  }
                } else {
                  this.notifyService.showError(
                    'Áp dụng môn học không thành công.',
                    'Thông báo lỗi'
                  );
                }
              } else if (error.error && error.error !== undefined) {
                if (error.errors['11']) {
                  this.notifyService.showError(
                    'Lớp học không tồn tại.',
                    'Thông báo lỗi'
                  );
                } else if (error.errors['12']) {
                  this.notifyService.showError(
                    'Môn học không tồn tại.',
                    'Thông báo lỗi'
                  );
                } else if (error.errors['13']) {
                  this.notifyService.showError(
                    'Môn học này đã được áp dụng cho lớp.',
                    'Thông báo lỗi'
                  );
                } else if (error.errors['14']) {
                  this.notifyService.showError(
                    'Học kỳ này không tồn tại.',
                    'Thông báo lỗi'
                  );
                } else {
                  this.notifyService.showError(error, 'Thông báo lỗi');
                }
              }
              this.loadingApplyClass = false;
            }
          );
      }
    } else {
      this.loadingApplyClass = false;
      return this.notifyService.showWarning('Dữ liệu trên bản ghi chưa được hoàn thành. Vui lòng kiểm tra lại!', 'Thông báo');
    }
  }

  applyGradeAll() {
    this.loadingApplyGrade = true;
    const control = this.subjectForm.get('addData') as FormArray;
    control.controls[0].get('year').setValidators(Validators.required);
    control.controls[0].get('year').updateValueAndValidity();
    control.controls[0].get('grade_id').setValidators(Validators.required);
    control.controls[0].get('grade_id').updateValueAndValidity();
    control.controls[0].get('class_id').setValidators(Validators.required);
    control.controls[0].get('class_id').updateValueAndValidity();
    control.controls[0].get('subject_name').setValidators([Validators.required, Validators.maxLength(50)]);
    control.controls[0].get('subject_name').updateValueAndValidity();
    control.controls[0].get('code').setValidators([Validators.required, Validators.maxLength(30)]);
    control.controls[0].get('code').updateValueAndValidity();
    control.controls[0].get('symbol').setValidators([Validators.maxLength(50)]);
    control.controls[0].get('symbol').updateValueAndValidity();
    control.controls[0].get('subject_kind').setValidators(Validators.required);
    control.controls[0].get('subject_kind').updateValueAndValidity();
    control.controls[0].get('subject_type').setValidators(Validators.required);
    control.controls[0].get('subject_type').updateValueAndValidity();
    control.controls[0].get('lesson').setValidators([Validators.required, Validators.maxLength(3)]);
    control.controls[0].get('lesson').updateValueAndValidity();
    control.controls[0].get('school_time').setValidators(Validators.required);
    control.controls[0].get('school_time').updateValueAndValidity();
    control.controls[0].get('description').setValidators(Validators.maxLength(150));
    control.controls[0].get('description').updateValueAndValidity();
    this.touchedRows = control.controls
      .filter((row) => row.touched)
      .map((row) => row.value);
    if (this.touchedRows.length > 0) {
      this.submitted = true;
      const data = [];
      const subjectResult = [];
      let subjectObj = {};
      if (this.subjectForm.controls.addData.invalid) {
        this.loadingApplyGrade = false;
        return;
      }
      this.touchedRows.forEach((obj) => {
        if (obj['isEditable'] === true) {
          this.loadingApplyGrade = false;
          return this.notifyService.showError(
            'Dữ liệu trên bản ghi chưa được hoàn thành. Vui lòng kiểm tra lại!',
            'Lỗi'
          );
        } else {
          const schoolTimeObj = [];
          if (obj['school_time'] && obj['school_time'].length > 0) {
            obj['school_time'].forEach(items => {
              schoolTimeObj.push(items.id);
            });
          }
          subjectObj = {
            class_id: obj['class_id'] ? obj['class_id'].id : '',
            code: obj['code'] ? obj['code'] : '',
            description: obj['description'] ? obj['description'] : '',
            grade_id: obj['grade_id'] ? obj['grade_id'].id : '',
            lesson: obj['lesson'] ? obj['lesson'] : null,
            school_time: schoolTimeObj
              ? schoolTimeObj
              : [],
            status: obj['status'] ? 1 : 0,
            name: obj['subject_name'] ? obj['subject_name'].id : '',
            subject_kind: obj['subject_kind'] ? obj['subject_kind'] : '',
            subject_type: obj['subject_type'] ? obj['subject_type'] : '',
            symbol: obj['symbol'] ? obj['symbol'] : '',
          };
          data.push(subjectObj);
        }
      });
      if (data.length > 0) {
        subjectResult.push({ data: data });
        this.touchedRows = subjectResult;
        console.log(this.touchedRows);

        this.classManagementSubjectService
          .applyGradeAll(this.touchedRows[0])
          .subscribe((data) => {
            this.notifyService.showSuccess(
              'Áp dụng môn học cho toàn khối thành công!',
              'Thông báo lỗi'
            );
            this.getAddFormControls.controls = [];
            this.searchByInput();
            this.checkEdit = false;
            this.loadingApplyGrade = false;
          },
            (error) => {
              this.checkEdit = false;
              this.loadingApplyGrade = false;
              if (error.errors && error.errors !== undefined) {
                if (error.errors['1']) {
                  if (error.errors['1']['class_id']) {
                    this.notifyService.showError(
                      'Lớp học không được để trống!',
                      'Thông báo lỗi'
                    );
                  } else if (error.errors['1']['name']) {
                    this.notifyService.showError(
                      'Môn học không được để trống!',
                      'Thông báo lỗi'
                    );
                  } else if (error.errors['1']['school_time']) {
                    this.notifyService.showError(
                      'Hiệu lực không được để trống!',
                      'Thông báo lỗi'
                    );
                  } else {
                    this.notifyService.showError(
                      'Trạng thái không được để trống!',
                      'Thông báo lỗi'
                    );
                  }
                }
                this.notifyService.showError(error, 'Thông báo lỗi');
              }
              this.checkEdit = false;
              this.loadingApplyGrade = false;
            }
          );
      }
    } else {
      this.loadingApplyGrade = false;
      return this.notifyService.showWarning('Dữ liệu trên bản ghi chưa được hoàn thành. Vui lòng kiểm tra lại!', 'Thông báo');
    }
  }

  searchByInput() {
    this.checkEdit = true;
    this.getFormControls.controls = [];
    this.getAddFormControls.controls = [];
    this.subjects = [];
    this.loadingFilter = true;
    this.headerAddSubject = false;
    let i = 0;
    const subjectFilterData = new FormData();
    const years1 = [this.subjectForm.controls['dropYears'].value];
    const semesters1= this.subjectForm.controls['dropSemesters'].value;
    const grades2 = this.subjectForm.controls['dropGrades'].value;
    const classes1 = this.subjectForm.controls['dropClasses'].value;

    const years = [];
    years.push(this.subjectForm.controls['dropYears'].value.id);

    const school_time = [];
    if(this.subjectForm.controls['dropSemesters'].value != undefined){
      school_time.push(this.subjectForm.controls['dropSemesters'].value.id);
    }



    const grades = [];
    const grades1 = this.subjectForm.controls['dropGrades'].value ;
    if(this.subjectForm.controls['dropGrades'].value != undefined)
    {
      this.subjectForm.controls['dropGrades'].value.forEach(function (items) {
        grades.push(items['id']);
      });

    }

    const classes = [];
    if(this.subjectForm.controls['dropClasses'].value != undefined){
      this.subjectForm.controls['dropClasses'].value.forEach(function (items) {
        classes.push(items['id']);
      });
    }


    // if (years) {
    //   if (years.length > 0 && years[0] != null && years[0] !== '') {
    //     years.forEach(function (item) {
    //       subjectFilterData.append('years' + '[' + i + ']', item['id']);
    //       i++;
    //     });
    //   }
    //   i = 0;
    // }
    // if (semesters) {
    //   if (semesters.length > 0 && semesters[0] != null && semesters[0] !== '') {
    //     semesters.forEach(function (item) {
    //       subjectFilterData.append('school_time' + '[' + i + ']', item['id']);
    //       i++;
    //     });
    //   } else {

    //   }
    //   i = 0;
    // }

    // if (grades) {
    //   if (grades.length > 0) {
    //     grades.forEach(function (item) {
    //       subjectFilterData.append('grades' + '[' + i + ']', item['id']);
    //       i++;
    //     });
    //   }
    //   i = 0;
    // }
    // if (classes) {
    //   if (classes.length > 0) {
    //     classes.forEach(function (item) {
    //       subjectFilterData.append('classes' + '[' + i + ']', item['id']);
    //       i++;
    //     });
    //   }
    //   i = 0;
    // }
    this.classManagementSubjectService.filter(years,school_time,grades,classes).subscribe(
    // this.classManagementSubjectService.filter(subjectFilterData).subscribe(
      (result) => {
        this.loadingFilter = false;
        const results = result['query'];
        if (results !== []) {
          if (result['query'].length === 0) {
            this.p = 1;
            this.totalItems = 1;
            this.headerSubject = true;
            this.checkSubjectData = true;
            this.subjects = [];
          } else {
            this.headerSubject = true;
            this.checkSubjectData = false;
            this.subjects = result['query'];
            this.totalItems = result['query'].length;
            if (this.p === 1) {
              this.p = 1;
            } else {
              this.p = this.p;
            }

            this.loadingFilter = false;
          }
          this.gridData = results;
          this.sortData(results);
        }

      },
      (error) => {
        this.loadingFilter = false;
        this.notifyService.showError('Lọc dữ liệu không thành công!', 'Thông báo lỗi');
      }
    );
  }

  searchByKeyWord(search) {
    this.checkEdit = true;
    this.getFormControls.controls = [];
    this.subjects = [];
    if (search.trim() === '') {
      this.notifyService.showError(
        'Vui lòng điền từ khóa tìm kiếm!',
        'Thông báo lỗi'
      );
      this.subjects = [];
      this.p = 1;
      this.totalItems = 1;
    } else {
      this.classManagementSubjectService.searchByKeyWord(search)
        .subscribe((result) => {
          let results = result['query'];
          if (results.length > 0) {
            this.headerSubject = true;
            this.checkSubjectData = false;
            this.subjects = result['query'];
            this.totalItems = result['query'].length;

            (results as []).forEach((classSubjectData: any) => {
              this.addRowEdit(classSubjectData);
            });
            // this.countPage = id;
            // const a = this.p;
          } else {
            this.p = 1;
            this.totalItems = 1;
            this.headerSubject = true;
            this.checkSubjectData = true;
            this.subjects = [];
          }
          this.p = 1;
        },
          (error) => {
            this.notifyService.showError(error, 'Thông báo lỗi');
          }
        );
    }
  }

  sortData(results) {
    (results as []).forEach((classSubjectData: any) => {
      this.addRowEdit(classSubjectData);
    });

  }

  alphabetsFather = ['A', 'À', 'Ả', 'Ã', 'Á', 'Ạ',
    'Ă', 'Ằ', 'Ẳ', 'Ẵ', 'Ắ', 'Ặ',
    'Â', 'Ầ', 'Ẩ', 'Ẫ', 'Ấ', 'Ậ',
    'B', 'C', 'D', 'Đ',
    'E', 'È', 'Ẻ', 'Ẽ', 'É', 'Ẹ',
    'Ê', 'Ề', 'Ể', 'Ễ', 'Ế', 'Ệ',
    'F', 'G', 'H',
    'I', 'Ì', 'Ỉ', 'Ĩ', 'Í', 'Ị',
    'J', 'K', 'L', 'M', 'N',
    'O', 'Ò', 'Ỏ', 'Õ', 'Ó', 'Ọ',
    'Ô', 'Ồ', 'Ổ', 'Ỗ', 'Ố', 'Ộ',
    'Ơ', 'Ờ', 'Ở', 'Ỡ', 'Ớ', 'Ợ',
    'P', 'Q', 'R', 'S', 'T',
    'U', 'Ù', 'Ủ', 'Ũ', 'Ú', 'Ụ',
    'Ư', 'Ừ', 'Ử', 'Ữ', 'Ứ', 'Ự',
    'V', 'W', 'X',
    'Y', 'Ỳ', 'Ỷ', 'Ỹ', 'Ý', 'Ỵ',
    'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  public CharCompare(a, b, index) {
    var aChar;
    var bChar;
    var alphabets = this.alphabetsFather;
    if (index == a.length || index == b.length) return 0;
    aChar = alphabets.indexOf(a.toUpperCase().charAt(index));
    bChar = alphabets.indexOf(b.toUpperCase().charAt(index));
    if (aChar != bChar) return aChar - bChar;
    else return this.CharCompare(a, b, index + 1);
  }

  firstTimeName = false;
  reTimeName: any;
  sortName() {
    this.getFormControls.controls = [];
    this.firstTimeName = true;

    //*1 hàm sort
    const arrData = this.gridData;
    if (this.firstTimeName === true) {
      if (this.reTimeName === 1) {
        //*2 gọi hàm sort
        const x = arrData.sort((a, b) => {
          var str1 = a['name'];
          var str2 = b['name'];
          return this.CharCompare(str1, str2, 0);
        });

        (x as []).forEach((classSubjectData: any) => {
          this.addRowEdit(classSubjectData);
        });

        this.reTimeName = 2;
      } else {
        //*2 gọi hàm sort
        const x = arrData.sort((a, b) => {
          var str1 = a['name'];
          var str2 = b['name'];
          return this.CharCompare(str2, str1, 0);
        });

        (x as []).forEach((classSubjectData: any) => {
          this.addRowEdit(classSubjectData);
        });
        this.reTimeName = 1;
      }

      this.firstTimeCode = false;
      this.reTimeCode = 3;
      this.firstTimeGrade = false;
      this.reTimeGrade = 3;
      this.firstTimeKind = false;
      this.reTimeKind = 3;
      this.firstTimeType = false;
      this.reTimeType = 3;
    } else {
    }
  }
  firstTimeCode = false;
  reTimeCode: any;
  sortCode() {
    this.getFormControls.controls = [];
    this.firstTimeCode = true;


    const arrData = this.gridData;
    if (this.firstTimeCode === true) {
      if (this.reTimeCode === 1) {
        const x = arrData.sort((a, b) => {
          var number1 = Number(a['code']);
          var number2 = Number(b['code']);
          if (number1 < number2) {
            return 1;
          }
          if (number1 > number2) {
            return -1;
          }
          return 0;
        });

        (x as []).forEach((classSubjectData: any) => {
          this.addRowEdit(classSubjectData);
        });
        this.reTimeCode = 2;
      } else {
        const x = arrData.sort((a, b) => {
          var number1 = Number(a['code']);
          var number2 = Number(b['code']);
          if (number1 < number2) {
            return -1;
          }
          if (number1 > number2) {
            return 1;
          }
          return 0;
        });

        (x as []).forEach((classSubjectData: any) => {
          this.addRowEdit(classSubjectData);
        });
        this.reTimeCode = 1;
      }
      this.firstTimeName = false;
      this.reTimeName = 3;
      this.firstTimeGrade = false;
      this.reTimeGrade = 3;
      this.firstTimeKind = false;
      this.reTimeKind = 3;
      this.firstTimeType = false;
      this.reTimeType = 3;
    } else {
    }
  }
  firstTimeGrade = false;
  reTimeGrade: any;
  sortGrade() {
    this.getFormControls.controls = [];
    this.firstTimeGrade = true;

    //*1 hàm sort
    const arrData = this.gridData;
    if (this.firstTimeGrade === true) {
      if (this.reTimeGrade === 1) {

        //*2 gọi hàm sort
        const x = arrData.sort((a, b) => {
          var str1 = a['grade_name'];
          var str2 = b['grade_name'];
          return this.CharCompare(str2, str1, 0);
        });

        (x as []).forEach((classSubjectData: any) => {
          this.addRowEdit(classSubjectData);
        });
        this.reTimeGrade = 2;
      } else {

        //*2 gọi hàm sort
        const x = arrData.sort((a, b) => {
          var str1 = a['grade_name'];
          var str2 = b['grade_name'];
          return this.CharCompare(str1, str2, 0);
        });

        (x as []).forEach((classSubjectData: any) => {
          this.addRowEdit(classSubjectData);
        });
        this.reTimeGrade = 1;
      }
      this.firstTimeCode = false;
      this.reTimeCode = 3;
      this.firstTimeName = false;
      this.reTimeName = 3;
      this.firstTimeKind = false;
      this.reTimeKind = 3;
      this.firstTimeType = false;
      this.reTimeType = 3;
    } else {
    }
  }
  firstTimeKind = false;
  reTimeKind: any;
  sortKind() {
    this.getFormControls.controls = [];
    this.firstTimeKind = true;

    const arrData = this.gridData;
    if (this.firstTimeKind === true) {
      if (this.reTimeKind === 1) {
        const x = arrData.sort((a, b) => {
          var number1 = Number(a['subject_kind']);
          var number2 = Number(b['subject_kind']);
          if (number1 < number2) {
            return 1;
          }
          if (number1 > number2) {
            return -1;
          }
          return 0;
        });

        (x as []).forEach((classSubjectData: any) => {
          this.addRowEdit(classSubjectData);
        });
        this.reTimeKind = 2;
      } else {
        const x = arrData.sort((a, b) => {
          var number1 = Number(a['subject_kind']);
          var number2 = Number(b['subject_kind']);
          if (number1 < number2) {
            return -1;
          }
          if (number1 > number2) {
            return 1;
          }
          return 0;
        });

        (x as []).forEach((classSubjectData: any) => {
          this.addRowEdit(classSubjectData);
        });
        this.reTimeKind = 1;
      }
      this.firstTimeName = false;
      this.reTimeName = 3;
      this.firstTimeGrade = false;
      this.reTimeGrade = 3;
      this.firstTimeCode = false;
      this.reTimeCode = 3;
      this.firstTimeType = false;
      this.reTimeType = 3;
    } else {
    }
  }
  firstTimeType = false;
  reTimeType: any;
  sortType() {
    this.getFormControls.controls = [];
    this.firstTimeType = true;

    const arrData = this.gridData;
    if (this.firstTimeType === true) {
      if (this.reTimeType === 1) {
        const x = arrData.sort((a, b) => {
          var number1 = Number(a['subject_type']);
          var number2 = Number(b['subject_type']);
          if (number1 < number2) {
            return -1;
          }
          if (number1 > number2) {
            return 1;
          }
          return 0;
        });

        (x as []).forEach((classSubjectData: any) => {
          this.addRowEdit(classSubjectData);
        });
        this.reTimeType = 2;
      } else {
        const x = arrData.sort((a, b) => {
          var number1 = Number(a['subject_type']);
          var number2 = Number(b['subject_type']);
          if (number1 < number2) {
            return 1;
          }
          if (number1 > number2) {
            return -1;
          }
          return 0;
        });

        (x as []).forEach((classSubjectData: any) => {
          this.addRowEdit(classSubjectData);
        });
        this.reTimeType = 1;
      }
      this.firstTimeName = false;
      this.reTimeName = 3;
      this.firstTimeGrade = false;
      this.reTimeGrade = 3;
      this.firstTimeCode = false;
      this.reTimeCode = 3;
      this.firstTimeKind = false;
      this.reTimeKind = 3;
    } else {
    }
  }
  resetForm() {
    const control = this.subjectForm.get('addData') as FormArray;

    control.controls.forEach(controls => {
      if (controls) {
        controls.get('grade_id').clearValidators();
        controls.get('class_id').clearValidators();
        controls.get('subject_name').clearValidators();
        controls.get('school_time').clearValidators();
        controls.get('subject_kind').clearValidators();
        controls.get('subject_type').clearValidators();
        controls.get('description').clearValidators();
      }
      // control['controls'][0]['controls']['grade_id'].setValue('');
      // control['controls'][0]['controls']['class_id'].setValue('');
      // control['controls'][0]['controls']['subject_name'].setValue('');
      // control['controls'][0]['controls']['school_time'].setValue('');
      // control['controls'][0]['controls']['description'].setValue('');
    });

    this.selectedGrade = [];
    this.selectedClass = [];
    // this.selectedSubject = [];
    this.selectedSchoolTime = [];
    this.code = null;
    this.symbol = null;
    this.selectedSubjectKind = [];
    this.selectedSubjectType = [];
    this.lesson = null;
  }

  enableEditMethod(e, i) {
    this.enableEdit = true;
    this.enableEditIndex = i;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // console.log(event);
    if (event.keyCode === KEY_CODE.PLUS) {
      this.addRow();
    }

    // if (event.keyCode === KEY_CODE.MINUS) {
    //   this.deleteRow(this.indexRow);
    // }
  }
}
