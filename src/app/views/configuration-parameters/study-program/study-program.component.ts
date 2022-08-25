import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NotificationService } from "../../../_services/notification.service";
import { UtilityService } from '../../../_services/utils.service';
import { StudyProgramService } from "../service/study-program.service";

declare var $: any;

@Component({
  selector: 'app-study-program',
  templateUrl: './study-program.component.html',
  styleUrls: ['./study-program.component.scss'],
})
export class StudyProgramComponent implements OnInit {
  submitted = false;
  studyProgramDetailForm: FormGroup;
  studyProgramForm: FormGroup;

  ddlGradeData = [];
  selectedGrade = [];
  grades: any = [];

  ddlSemesterData = [];
  selectedSemester = [];
  semesters: any = [];
  // Lưu dữ liệu params chương trình học đã chọn (level, id, gradeId, semesterId, name)
  selectedStudyProgram: any = [];
  // Lưu dữ liệu truy vấn môn học theo khối, học kỳ chương trình học
  subjectData: any = [];
  // Lưu dữ liệu truy vấn chương trình học
  studyProgramDetail: any = [];
  checkSchoolLevel: number = 0;
  activeTab = 'subjectProperties';
  loadingStudyProgram = true;
  loadingSubjectProperties = true;
  checkExistData = false;

  constructor(
    private fb: FormBuilder,
    private notifyService: NotificationService,
    private studyProgramService: StudyProgramService,
    private _utilsService: UtilityService
  ) {
    this.studyProgramDetailForm = this.fb.group({
      studyProgramDetails: this.fb.array([]),
      bilinguals: this.fb.array([]),
      classes: this.fb.array([]),
    });
  }

  get f() {
    return this.studyProgramForm.controls;
  }

  ngOnInit() {
    this.studyProgramForm = this.fb.group(
      {
        name: new FormControl('', [
          Validators.required,
          Validators.maxLength(100),
        ]),
        grade_id: new FormControl('', [Validators.required]),
        semester_id: new FormControl('', [Validators.required]),
      },
      {}
    );
    this.reloadData();
  }

  // Sắp xếp khối, học kỳ, chương trình học theo thứ tự tăng dần
  compare(a, b) {
    const bandA = a.name.toUpperCase();
    const bandB = b.name.toUpperCase();

    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }

  // Xử lý sự kiện chọn khối
  onSelectGrade(item: any) {
    const yearId = JSON.parse(localStorage.getItem('year_data'));
    this.studyProgramService
      .listSemester(yearId.id, item['level'])
      .pipe()
      .subscribe((res) => {
        this.ddlSemesterData = res['query'].sort(this.compare);
      });
  }

  // Tạo mới chương trình học
  createStudyProgram() {
    //#region Validate dữ liệu thêm mới chương trình học
    this.studyProgramForm
      .get('name')
      .setValidators([Validators.required, Validators.maxLength(100)]);
    this.studyProgramForm.get('name').updateValueAndValidity();
    this.studyProgramForm.get('grade_id').setValidators([Validators.required]);
    this.studyProgramForm.get('grade_id').updateValueAndValidity();
    this.studyProgramForm
      .get('semester_id')
      .setValidators([Validators.required]);
    this.studyProgramForm.get('semester_id').updateValueAndValidity();
    this.submitted = true;
    if (this.studyProgramForm.invalid) {
      return;
    }
    //#endregion
    //#region Lấy, kiểm tra và gọi API thêm mới dữ liệu dữ liệu chương trình học từ studyProgramForm
    const name = this.studyProgramForm.controls['name'].value;
    const grade_id = this.studyProgramForm.controls['grade_id'].value;
    const semester_id = this.studyProgramForm.controls['semester_id'].value;
    const yearId = JSON.parse(localStorage.getItem('year_data'));
    const uploadData = new FormData();
    if (name) {
      uploadData.append('name', name);
    }
    if (grade_id) {
      uploadData.append('grade_id', grade_id.id);
    }
    if (semester_id) {
      uploadData.append('semester_id', semester_id.id);
    }
    if (yearId) {
      uploadData.append('year_id', yearId.id);
    }
    this.studyProgramService
      .createStudyProgram(uploadData)
      .pipe()
      .subscribe(
        (data) => {
          if (data.message === 'success') {
            this.notifyService.showSuccess(
              'Thêm mới chương trình học thành công.',
              'Thông báo'
            );
            $('#createStudyProgramModal').modal('hide');
            $('.modal-backdrop').remove();
          } else {
            this.notifyService.showInfo(
              'Thêm chương trình học không thành công.',
              'Thông báo'
            );
          }
          this.reloadData();
          this.loadingStudyProgram = true;
        },
        (error) => {
          if (error) {
            if (error.errors) {
              if (error.errors.study_program_id === 1) {
                this.notifyService.showError(
                  'Mã chương trình học không được để trống',
                  'Thông báo lỗi'
                );
              } else if (error.errors.study_program_id === 7) {
                this.notifyService.showError(
                  'Mã chương trình học không đúng định dạng',
                  'Thông báo lỗi'
                );
              } else if (error.errors.subject_id === 1) {
                this.notifyService.showError(
                  'Mã môn học không được để trống',
                  'Thông báo lỗi'
                );
              } else if (error.errors.subject_id === 7) {
                this.notifyService.showError(
                  'Mã môn học không đúng định dạng',
                  'Thông báo lỗi'
                );
              } else if (error.errors.subject_kind.op2 === 1) {
                this.notifyService.showError(
                  'Loại môn học không được để trống',
                  'Thông báo lỗi'
                );
              } else if (
                error.errors.subject_kind.op2 === 1 ||
                error.errors.subject_kind.op2 === 2 ||
                error.errors.subject_kind.ops3 === 2 ||
                error.errors.subject_kind.ops4 === 2 ||
                error.errors.subject_kind.ops5 === 2 ||
                error.errors.subject_kind.ops6 === 2
              ) {
                this.notifyService.showError(
                  'Loại môn học không đúng định dạng',
                  'Thông báo lỗi'
                );
              } else if (error.errors.regular_exam.min1 === 6) {
                this.notifyService.showError(
                  'Điểm hệ số tối thiểu đánh giá thường xuyên không đúng định dạng',
                  'Thông báo lỗi'
                );
              } else if (error.errors.regular_exam.max1 === 6) {
                this.notifyService.showError(
                  'Điểm hệ số tối đa đánh giá thường xuyên không đúng định dạng',
                  'Thông báo lỗi'
                );
              } else if (error.errors.mid_semester_exam === 1) {
                this.notifyService.showError(
                  'Điểm hệ số tối đa đánh giá giữa kỳ không được để trống',
                  'Thông báo lỗi'
                );
              } else if (
                error.errors.mid_semester_exam === 2 ||
                error.errors.mid_semester_exam.min2 === 6 ||
                error.errors.mid_semester_exam.max2 === 6
              ) {
                this.notifyService.showError(
                  'Điểm hệ số tối đa đánh giá giữa kỳ không đúng định dạng',
                  'Thông báo lỗi'
                );
              } else if (error.errors.last_semester_exam === 1) {
                this.notifyService.showError(
                  'Điểm hệ số tối đa đánh giá cuối kỳ không được để trống',
                  'Thông báo lỗi'
                );
              } else if (
                error.errors.last_semester_exam === 2 ||
                error.errors.mid_semester_exam.max3 === 6 ||
                error.errors.mid_semester_exam.max3 === 6
              ) {
                this.notifyService.showError(
                  'Điểm hệ số tối đa đánh giá cuối kỳ không đúng định dạng',
                  'Thông báo lỗi'
                );
              } else {
                this.notifyService.showError(
                  'Thêm mới không chương trình học không thành công',
                  'Thông báo lỗi'
                );
              }
            } else if (error.error) {
              if (error.error === 121) {
                this.notifyService.showError(
                  'Năm học thêm vào phải là hiện tại và tương lai',
                  'Thông báo lỗi'
                );
              } else if (error['error'] === 11) {
                this.notifyService.showError(
                  'Tên chương trình học trong một năm không được trùng',
                  'Thông báo lỗi'
                );
              } else if (error['error'] === 12) {
                this.notifyService.showError(
                  'Môn học truyền vào không hợp lệ',
                  'Thông báo lỗi'
                );
              } else if (error['error'] === 13) {
                this.notifyService.showError(
                  'Khối học không thuộc cùng 1 năm được chọn không',
                  'Thông báo lỗi'
                );
              } else if (error['error'] === 14) {
                this.notifyService.showError(
                  'Học kỳ không thuộc cùng 1 năm được chọn không',
                  'Thông báo lỗi'
                );
              } else if (error['error'] === 16) {
                this.notifyService.showError(
                  'Vui lòng không chọn đồng thời môn song ngữ và môn song ngữ chính',
                  'Thông báo lỗi'
                );
              } else if (error['error'] === 17) {
                this.notifyService.showError(
                  'Vui lòng chọn thêm điểm song ngữ (vì đã chọn điểm song ngữ)',
                  'Thông báo lỗi'
                );
              } else if (error['error'] === 18) {
                this.notifyService.showError(
                  'Vui lòng điền thêm điểm cho hệ song ngữ',
                  'Thông báo lỗi'
                );
              } else if (error['error'] === 19) {
                this.notifyService.showError(
                  'Điểm tối đa lớn hơn hoặc bằng điểm tối thiểu',
                  'Thông báo lỗi'
                );
              } else {
                this.notifyService.showError(
                  'Thêm mới chương trình học không thành công',
                  'Thông báo lỗi'
                );
              }
            } else {
              this.notifyService.showError(
                'Thêm mới chương trình học không thành công',
                'Thông báo lỗi'
              );
            }
          }
          this.loadStudyProgramDetail();
        }
      );
    //#endregion
  }

  // Kiểm tra chương trình học đã được chọn hay chưa cho chức năng chỉnh sửa chương trình học
  checkSelectStudyProgram() {
    this.studyProgramForm.controls['grade_id'].disable();
    this.studyProgramForm.controls['semester_id'].disable();
    if (this.selectedStudyProgram.length <= 0) {
      this.notifyService.showWarning(
        'Vui lòng chọn 1 chương trình học!',
        'Thông báo'
      );
    } else {
      $('#updateStudyProgramModal').modal('show');
    }
  }

  // Chỉnh sửa chương trình học
  updateStudyProgram() {
    //#region Validate dữ liệu chỉnh sửa chương trình học
    this.studyProgramForm
      .get('name')
      .setValidators([Validators.required, Validators.maxLength(100)]);
    this.studyProgramForm.get('name').updateValueAndValidity();
    this.studyProgramForm.get('grade_id').setValidators([Validators.required]);
    this.studyProgramForm.get('grade_id').updateValueAndValidity();
    this.studyProgramForm
      .get('semester_id')
      .setValidators([Validators.required]);
    this.studyProgramForm.get('semester_id').updateValueAndValidity();
    this.submitted = true;
    if (this.studyProgramForm.invalid) {
      return;
    }
    //#endregion
    //#region Lấy, kiểm tra và gọi API chỉnh sửa dữ liệu chương trình học từ studyProgramForm
    if (this.selectedStudyProgram && this.selectedStudyProgram.length > 0) {
      const id = this.selectedStudyProgram[0].id;
      const name = this.studyProgramForm.controls['name'].value;
      const grade_id = this.studyProgramForm.controls['grade_id'].value;
      const semester_id = this.studyProgramForm.controls['semester_id'].value;
      const formData = new FormData();
      if (!id) {
        this.notifyService.showError(
          'ID chương trình học không tồn tại.',
          'Thông báo'
        );
      }
      if (name) {
        formData.append('name', name);
      }
      if (grade_id) {
        formData.append('grade_id', grade_id.id);
      }
      if (semester_id) {
        formData.append('semester_id', semester_id.id);
      }

      this.studyProgramService
        .updateStudyProgram(id, formData)
        .pipe()
        .subscribe(
          (res) => {
            if (res.message === 'success') {
              this.notifyService.showSuccess(
                'Sửa chương trình học thành công.',
                'Thông báo'
              );
              $('#updateStudyProgramModal').modal('hide');
              $('.modal-backdrop').remove();
            } else {
              this.notifyService.showInfo(
                'Sửa chương trình học không thành công.',
                'Thông báo'
              );
            }
            this.reloadData();
          },
          (error) => {
            if (error) {
              if (error.errors) {
                if (error.errors.study_program_id === 1) {
                  this.notifyService.showError(
                    'Mã chương trình học không được để trống',
                    'Thông báo lỗi'
                  );
                } else if (error.errors.study_program_id === 7) {
                  this.notifyService.showError(
                    'Mã chương trình học không đúng định dạng',
                    'Thông báo lỗi'
                  );
                } else if (error.errors.subject_id === 1) {
                  this.notifyService.showError(
                    'Mã môn học không được để trống',
                    'Thông báo lỗi'
                  );
                } else if (error.errors.subject_id === 7) {
                  this.notifyService.showError(
                    'Mã môn học không đúng định dạng',
                    'Thông báo lỗi'
                  );
                } else if (error.errors.subject_kind.op2 === 1) {
                  this.notifyService.showError(
                    'Loại môn học không được để trống',
                    'Thông báo lỗi'
                  );
                } else if (
                  error.errors.subject_kind.op2 === 1 ||
                  error.errors.subject_kind.op2 === 2 ||
                  error.errors.subject_kind.ops3 === 2 ||
                  error.errors.subject_kind.ops4 === 2 ||
                  error.errors.subject_kind.ops5 === 2 ||
                  error.errors.subject_kind.ops6 === 2
                ) {
                  this.notifyService.showError(
                    'Loại môn học không đúng định dạng',
                    'Thông báo lỗi'
                  );
                } else if (error.errors.regular_exam.min1 === 6) {
                  this.notifyService.showError(
                    'Điểm hệ số tối thiểu đánh giá thường xuyên không đúng định dạng',
                    'Thông báo lỗi'
                  );
                } else if (error.errors.regular_exam.max1 === 6) {
                  this.notifyService.showError(
                    'Điểm hệ số tối đa đánh giá thường xuyên không đúng định dạng',
                    'Thông báo lỗi'
                  );
                } else if (error.errors.mid_semester_exam === 1) {
                  this.notifyService.showError(
                    'Điểm hệ số tối đa đánh giá giữa kỳ không được để trống',
                    'Thông báo lỗi'
                  );
                } else if (
                  error.errors.mid_semester_exam === 2 ||
                  error.errors.mid_semester_exam.min2 === 6 ||
                  error.errors.mid_semester_exam.max2 === 6
                ) {
                  this.notifyService.showError(
                    'Điểm hệ số tối đa đánh giá giữa kỳ không đúng định dạng',
                    'Thông báo lỗi'
                  );
                } else if (error.errors.last_semester_exam === 1) {
                  this.notifyService.showError(
                    'Điểm hệ số tối đa đánh giá cuối kỳ không được để trống',
                    'Thông báo lỗi'
                  );
                } else if (
                  error.errors.last_semester_exam === 2 ||
                  error.errors.mid_semester_exam.max3 === 6 ||
                  error.errors.mid_semester_exam.max3 === 6
                ) {
                  this.notifyService.showError(
                    'Điểm hệ số tối đa đánh giá cuối kỳ không đúng định dạng',
                    'Thông báo lỗi'
                  );
                } else {
                  this.notifyService.showError(
                    'Sửa chương trình học không thành công',
                    'Thông báo lỗi'
                  );
                }
              } else if (error.error) {
                if (error.error === 121) {
                  this.notifyService.showError(
                    'Năm học thêm vào phải là hiện tại và tương lai',
                    'Thông báo lỗi'
                  );
                } else if (error['error'] === 11) {
                  this.notifyService.showError(
                    'Tên chương trình học trong một năm không được trùng',
                    'Thông báo lỗi'
                  );
                } else if (error['error'] === 12) {
                  this.notifyService.showError(
                    'Môn học truyền vào không hợp lệ',
                    'Thông báo lỗi'
                  );
                } else if (error['error'] === 13) {
                  this.notifyService.showError(
                    'Khối học không thuộc cùng 1 năm được chọn không',
                    'Thông báo lỗi'
                  );
                } else if (error['error'] === 14) {
                  this.notifyService.showError(
                    'Học kỳ không thuộc cùng 1 năm được chọn không',
                    'Thông báo lỗi'
                  );
                } else if (error['error'] === 16) {
                  this.notifyService.showError(
                    'Vui lòng không chọn đồng thời môn song ngữ và môn song ngữ chính',
                    'Thông báo lỗi'
                  );
                } else if (error['error'] === 17) {
                  this.notifyService.showError(
                    'Vui lòng chọn thêm điểm song ngữ (vì đã chọn điểm song ngữ)',
                    'Thông báo lỗi'
                  );
                } else if (error['error'] === 18) {
                  this.notifyService.showError(
                    'Vui lòng điền thêm điểm cho hệ song ngữ',
                    'Thông báo lỗi'
                  );
                } else if (error['error'] === 19) {
                  this.notifyService.showError(
                    'Điểm tối đa lớn hơn hoặc bằng điểm tối thiểu',
                    'Thông báo lỗi'
                  );
                } else {
                  this.notifyService.showError(
                    'Sửa chương trình học không thành công',
                    'Thông báo lỗi'
                  );
                }
              } else {
                this.notifyService.showError(
                  'Sửa chương trình học không thành công',
                  'Thông báo lỗi'
                );
              }
            }
            this.loadStudyProgramDetail();
          }
        );
    }
    //#endregion
  }

  // Xóa chương trình học
  deleteStudyProgram() {
    if (this.selectedStudyProgram && this.selectedStudyProgram.length > 0) {
      const id = this.selectedStudyProgram[0].id;
      if (!id) {
        this.notifyService.showError(
          'ID chương trình học không tồn tại.',
          'Thông báo'
        );
      }
      const isDelete = confirm(
        'Bạn chắc chắn muốn xóa dữ liệu của chương trình học này?'
      );
      if (isDelete) {
        this.studyProgramService
          .deleteStudyProgram(id)
          .pipe()
          .subscribe(
            (res) => {
              this.notifyService.showSuccess(
                'Xóa chương trình học thành công.',
                'Thông báo'
              );
              this.activeTab = 'subjectProperties';
              this.reloadData();
              this.studyProgramDetailForm.removeControl('studyProgramDetails');
              this.studyProgramDetailForm.removeControl('bilinguals');
              this.studyProgramDetailForm.removeControl('classes');
            },
            (error) => {
              if (error) {
                if (error['error']) {
                  if (error['error'] === 10) {
                    this.notifyService.showError(
                      'Chương trình học không tồn tại.',
                      'Thông báo lỗi'
                    );
                  } else {
                    this.notifyService.showError(
                      'Xóa chương trình học không thành công',
                      'Thông báo lỗi'
                    );
                  }
                } else {
                  this.notifyService.showError(
                    'Xóa chương trình học không thành công',
                    'Thông báo lỗi'
                  );
                }
              }
              this.loadStudyProgramDetail();
            }
          );
      }
    } else {
      this.notifyService.showWarning(
        'Vui lòng chọn 1 chương trình học!',
        'Thông báo'
      );
    }
  }

  // Kiểm tra chương trình học đã được chọn hay chưa cho chức năng sao chép chương trình học
  checkStudyProgramCopy() {
    if (this.selectedStudyProgram.length <= 0) {
      this.notifyService.showWarning(
        'Vui lòng chọn 1 chương trình học!',
        'Thông báo'
      );
    } else {
      this.studyProgramForm.get('name').clearValidators();
      this.studyProgramForm.get('name').setValue('');
      $('#studyProgramCopyModal').modal('show');
    }
  }

  // Sao chép chương trình học
  studyProgramCopy() {
    this.studyProgramForm
      .get('name')
      .setValidators([Validators.required, Validators.maxLength(100)]);
    this.studyProgramForm.get('name').updateValueAndValidity();

    if (this.studyProgramForm.controls['name'].invalid) {
      return;
    } else {
      const name = this.studyProgramForm.controls['name'].value;
      const uploadData = new FormData();
      if (
        this.selectedStudyProgram.length > 0 &&
        this.selectedStudyProgram[0].id !== undefined
      ) {
        uploadData.append('study_program_id', this.selectedStudyProgram[0].id);
      }
      if (name) {
        uploadData.append('name', name);
      }
      this.studyProgramService
        .studyProgramCopy(uploadData)
        .pipe()
        .subscribe(
          (data) => {
            // this.refreshPage();
            if (data.message === 'success') {
              this.notifyService.showSuccess(
                'Sao chép chương trình học thành công.',
                'Thông báo'
              );
              $('#studyProgramCopyModal').modal('hide');
              $('.modal-backdrop').remove();
            } else {
              this.notifyService.showInfo(
                'Sao chép chương trình học không thành công.',
                'Thông báo'
              );
            }
            this.activeTab = 'subjectProperties';
            this.reloadData();
            this.studyProgramDetailForm.removeControl('studyProgramDetails');
            this.studyProgramDetailForm.removeControl('bilinguals');
            this.studyProgramDetailForm.removeControl('classes');
          },
          (error) => {
            if (error) {
              if (error.errors) {
                if (error.errors.name === 1) {
                  this.notifyService.showError(
                    'Tên chương trình học không được để trống',
                    'Thông báo lỗi'
                  );
                } else if (error.errors.study_program_id === 1) {
                  this.notifyService.showError(
                    'Mã chương trình học không được để trống',
                    'Thông báo lỗi'
                  );
                } else if (error.errors.study_program_id === 7) {
                  this.notifyService.showError(
                    'Mã chương trình học phải là kiểu số nguyên',
                    'Thông báo lỗi'
                  );
                } else {
                  this.notifyService.showError(
                    'Sao chép chương trình học không thành công',
                    'Thông báo lỗi'
                  );
                }
              } else if (error.error) {
                if (error.error === 13) {
                  this.notifyService.showError(
                    'Chương trình học không tồn tại',
                    'Thông báo lỗi'
                  );
                } else if (error.error === 121) {
                  this.notifyService.showError(
                    'Chương trình học không thuộc năm được chọn',
                    'Thông báo lỗi'
                  );
                } else if (error.error === 11) {
                  this.notifyService.showError(
                    'Tên chương trình học trong một năm & cùng 1 khối không được trùng nhau',
                    'Thông báo lỗi'
                  );
                } else {
                  this.notifyService.showError(
                    'Sao chép chương trình học không thành công',
                    'Thông báo lỗi'
                  );
                }
              } else {
                this.notifyService.showError(
                  'Sao chép chương trình học không thành công',
                  'Thông báo lỗi'
                );
              }
            } else {
              this.notifyService.showError(
                'Sao chép chương trình học không thành công',
                'Thông báo lỗi'
              );
            }
            this.loadStudyProgramDetail();
          }
        );
    }
  }

  // Lưu dữ liệu chương trình học được chọn
  setUpdateStudyProgramData(level, id, gradeId, semesterId, name) {
    this.activeTab = 'subjectProperties';
    this.selectedStudyProgram = [];
    const studyProgrameSelected = [];

    studyProgrameSelected.push({
      id: id,
      grade_id: gradeId,
      semester_id: semesterId,
      name: name,
      level: level,
    });

    this.selectedStudyProgram = studyProgrameSelected;
    if (studyProgrameSelected[0].level === 1) {
      this.checkSchoolLevel = 1;
      this.loadStudyProgramDetail();
    } else {
      this.checkSchoolLevel = 2;
      this.loadStudyProgramDetail();
    }
  }

  // Hiển thị dữ liệu với chương trình học được chọn
  loadStudyProgramDetail() {
    // Xóa controls cũ để đổ dữ liệu controls mới
    this.studyProgramDetailForm.removeControl('studyProgramDetails');
    this.studyProgramDetailForm.removeControl('bilinguals');
    this.studyProgramDetailForm.removeControl('classes');
    // Đổ dữ liệu tên chương trình học
    this.studyProgramForm.controls['name'].setValue(
      this.selectedStudyProgram[0].name
    );
    // Đổ dữ liệu khối và học kỳ
    if (this.selectedStudyProgram[0].grade_id) {
      const selectGrade = [];
      const mapGrade = this.ddlGradeData
        .map(function (x) {
          return x.id;
        })
        .indexOf(this.selectedStudyProgram[0].grade_id);
      if (mapGrade > -1) {
        selectGrade.push({
          id: this.ddlGradeData[mapGrade]['id'],
          name: this.ddlGradeData[mapGrade]['name'],
        });
      }
      this.selectedGrade = selectGrade[0];

      const yearId = JSON.parse(localStorage.getItem('year_data'));
      this.studyProgramService
        .listSemester(yearId.id, this.selectedStudyProgram[0].level)
        .pipe()
        .subscribe((res) => {
          this.ddlSemesterData = res['query'];
          if (this.selectedStudyProgram[0].semester_id) {
            const selectSemester = [];
            const mapSemester = this.ddlSemesterData
              .map(function (x) {
                return x.id;
              })
              .indexOf(this.selectedStudyProgram[0].semester_id);
            if (mapSemester > -1) {
              selectSemester.push({
                id: this.ddlSemesterData[mapSemester]['id'],
                name: this.ddlSemesterData[mapSemester]['name'],
              });
            }
            this.selectedSemester = selectSemester[0];
          }
        });
    }
    // Đổ dữ liệu chi tiết chương trình học
    if (this.selectedStudyProgram.length > 0) {
      this.loadingSubjectProperties = true;
      this.studyProgramService
        .subjectList(
          this.selectedStudyProgram[0].grade_id,
          this.selectedStudyProgram[0].semester_id
        )
        .pipe()
        .subscribe((res) => {
          this.subjectData = res['query'];
          // Kiểm tra dữ liệu chi tiết chương trình học
          // Đổ dữ liệu subject, chi tiết cấu hình chương trình học cùng controls ra grid
          if (this.subjectData.length > 0) {
            const rows = this.fb.array([]);
            this.studyProgramDetailForm.addControl('studyProgramDetails', rows);
            this.studyProgramService
              .listStudyProgramDetailHasData(this.selectedStudyProgram[0].id)
              .pipe()
              .subscribe((resData) => {
                if (resData['query'].length > 0) {
                  if (this.selectedStudyProgram[0].level === 1) {
                    this.onEditRowStudyProgramPrimarySchool(
                      this.subjectData,
                      resData['query']
                    );
                  } else {
                    this.onEditRowStudyProgram(
                      this.subjectData,
                      resData['query']
                    );
                    this.checkExistData = false;
                    resData['query'].forEach((items) => {
                      // Kiểm tra dữ liệu môn song ngữ để binding ra grid
                      const checkBilingual = JSON.parse(items['subject_kind']);
                      if (checkBilingual['ops5'] === '1') {
                        // Check tồn tại môn song ngữ
                        this.checkExistData = true;
                        const bilingualRows = this.fb.array([]);
                        this.studyProgramDetailForm.addControl(
                          'bilinguals',
                          bilingualRows
                        );
                        const control = this.studyProgramDetailForm.get(
                          'bilinguals'
                        ) as FormArray;
                        this.studyProgramService
                          .bilingualList(this.selectedStudyProgram[0].id)
                          .pipe()
                          .subscribe((respon) => {
                            if (respon['query'].length > 0) {
                              const result = this.subjectData.filter((obj) => {
                                if (obj.id === items.subject_id) {
                                  respon['query'].filter((data) => {
                                    if (data.subject_id === items.subject_id) {
                                      control.push(
                                        this.createBilingualFormGroup(
                                          resData['query'],
                                          obj,
                                          checkBilingual,
                                          data
                                        )
                                      );
                                    }
                                  });
                                }
                              });
                            }
                          });
                      }
                    });
                  }
                } else {
                  this.onAddRowStudyProgram(this.subjectData);
                  this.checkExistData = false;
                }
              });
            this.loadingSubjectProperties = false;
          } else {
            this.loadingSubjectProperties = false;
          }
        });

      // Show dữ liệu lớp được áp dụng chương trình học
      this.studyProgramService
        .classStudyProgram(this.selectedStudyProgram[0].grade_id)
        .pipe()
        .subscribe((res) => {
          let classData = [];
          let classApplyData = [];
          let applied = false;

          const rows = this.fb.array([]);
          this.studyProgramDetailForm.addControl('classes', rows);
          const control = this.studyProgramDetailForm.get(
            'classes'
          ) as FormArray;
          if (res['query'].length > 0) {
            classApplyData = res['query'];
            this.studyProgramService
              .applyClassStudyProgram(this.selectedStudyProgram[0].id)
              .pipe()
              .subscribe((data) => {
                classData = data['query'];

                for (let i = 0; i < classApplyData.length; i++) {
                  let obj;
                  if (classData.length > 0) {
                    obj = classData.find(
                      (o) => o.class_id === classApplyData[i].id
                    );
                    if (obj && obj.study_program_id === this.selectedStudyProgram[0].id) {
                      applied = true;
                      control.push(
                        this.createClassFormGroup(
                          obj,
                          classApplyData[i],
                          applied
                        )
                      );
                    } else {
                      applied = false;
                      control.push(
                        this.createClassFormGroup(
                          obj,
                          classApplyData[i],
                          applied
                        )
                      );
                    }
                  } else {
                    applied = false;
                    control.push(
                      this.createClassFormGroup(obj, classApplyData[i], applied)
                    );
                  }
                }
              });
          }
        });
    }
  }

  // Load dữ liệu chương trình học (cây thư mục)
  reloadData() {
    this.loadingStudyProgram = true;
    this.loadingSubjectProperties = true;
    const yearId = JSON.parse(localStorage.getItem('year_data'));
    this.studyProgramService
      .listStudyProgram(yearId.id)
      .pipe()
      .subscribe((res) => {
        const mapStudyProgram = [];
        const studyProgramData = res['query'].sort(this.compare);
        // Nhóm danh sách chương trình học theo học kỳ -> học kỳ -> khối
        const groupBy = (key) => (array) =>
          array.reduce((objectsByKeyValue, obj) => {
            const value = obj[key];
            objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(
              obj
            );
            return objectsByKeyValue;
          }, {});
        const groupByGrade = groupBy('grade_name');
        const groupBySemester = groupBy('semester_name');
        const gradeID = groupByGrade(studyProgramData);
        const sssssss = groupBySemester(studyProgramData);

        const sortSemesterFunc = this.compareSemester;
        Object.keys(gradeID).map(function (key, index) {
          const semesterDataSort = Object.entries(
            groupBySemester(gradeID[key])
          );
          if (semesterDataSort.length >= 2) {
            semesterDataSort.sort(sortSemesterFunc);
          }
          mapStudyProgram.push(
            Object.entries({
              [gradeID[key][0]['grade_name']]: semesterDataSort,
            })
          );
        });
        mapStudyProgram.sort(this.compareGrade);
        this.studyProgramDetail = mapStudyProgram;
        this.loadingStudyProgram = false;
        this.loadingSubjectProperties = false;
      });
    // });
  }

  compareGrade(a, b) {
    const bandA = a[0][0].toUpperCase();
    const bandB = b[0][0].toUpperCase();

    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }
  compareSemester(a, b) {
    const bandA = a[0].toUpperCase();
    const bandB = b[0].toUpperCase();

    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }

  // Xóa validate, dữ liệu, enable dropdown list khối, học kỳ
  resetCreateStudyProgram() {
    this.studyProgramForm.controls['grade_id'].enable();
    this.studyProgramForm.controls['semester_id'].enable();
    this.studyProgramForm.get('name').clearValidators();
    this.studyProgramForm.get('name').setValue('');
    this.studyProgramForm.get('grade_id').clearValidators();
    this.selectedGrade = [];
    this.studyProgramForm.get('semester_id').clearValidators();
    this.selectedSemester = [];

    const yearId = JSON.parse(localStorage.getItem('year_data'));
    const semesterData = [];
    this.studyProgramService
      .listGrade(yearId.id)
      .pipe()
      .subscribe((res) => {
        this.grades = res['query'].sort(this.compare);
        this.ddlGradeData = res['query'].sort(this.compare);
      });
  }

  // Khởi tạo rows chi tiết chương trình học
  onAddRowStudyProgram(studyProgramData) {
    const control = this.studyProgramDetailForm.get(
      'studyProgramDetails'
    ) as FormArray;
    for (let i = 0; i < studyProgramData.length; i++) {
      control.push(this.createStudyProgramDetailFormGroup(studyProgramData[i]));
    }
  }
  // Khởi tạo rows chi tiết cấu hình điểm môn song ngữ
  createBilingualFormGroup(
    studyProgramData,
    subject,
    bilingual,
    bilingualData
  ): FormGroup {
    return this.fb.group({
      detail_study_program_id: new FormControl(bilingualData.id),
      subject_id: new FormControl(subject.id),
      subject_name: new FormControl(subject.name),
      ops3: new FormControl(bilingual['ops3'] === '1' ? true : false),
      ops4: new FormControl(bilingual['ops4'] === '1' ? true : false),
      ops5: new FormControl(bilingual['ops5'] === '1' ? true : false),
      ops6: new FormControl({
        value: bilingual['ops6'] ? bilingual['ops6'] : 0,
        disabled: true,
      }),
      max_co1: new FormControl(
        JSON.parse(bilingualData.regular_exam).max_co1
          ? JSON.parse(bilingualData.regular_exam).max_co1
          : '1'
      ),
      min_co1: new FormControl(
        JSON.parse(bilingualData.regular_exam).min_co1
          ? JSON.parse(bilingualData.regular_exam).min_co1
          : '1'
      ),
      max_eo1: new FormControl(
        JSON.parse(bilingualData.regular_exam).max_eo1
          ? JSON.parse(bilingualData.regular_exam).max_eo1
          : '1'
      ),
      min_eo1: new FormControl(
        JSON.parse(bilingualData.regular_exam).min_eo1
          ? JSON.parse(bilingualData.regular_exam).min_eo1
          : '1'
      ),
      max_ce1: new FormControl(
        JSON.parse(bilingualData.regular_exam).max_ce1
          ? JSON.parse(bilingualData.regular_exam).max_ce1
          : '1'
      ),
      min_ce1: new FormControl(
        JSON.parse(bilingualData.regular_exam).min_ce1
          ? JSON.parse(bilingualData.regular_exam).min_ce1
          : '1'
      ),
      max_ee1: new FormControl(
        JSON.parse(bilingualData.regular_exam).max_ee1
          ? JSON.parse(bilingualData.regular_exam).max_ee1
          : '1'
      ),
      min_ee1: new FormControl(
        JSON.parse(bilingualData.regular_exam).min_ee1
          ? JSON.parse(bilingualData.regular_exam).min_ee1
          : '1'
      ),
      max_cl1: new FormControl(
        JSON.parse(bilingualData.regular_exam).max_cl1
          ? JSON.parse(bilingualData.regular_exam).max_cl1
          : '1'
      ),
      min_cl1: new FormControl(
        JSON.parse(bilingualData.regular_exam).min_cl1
          ? JSON.parse(bilingualData.regular_exam).min_cl1
          : '1'
      ),

      max_co2: new FormControl(
        JSON.parse(bilingualData.mid_semester_exam).max_co2
          ? JSON.parse(bilingualData.mid_semester_exam).max_co2
          : '1'
      ),
      min_co2: new FormControl(
        JSON.parse(bilingualData.mid_semester_exam).min_co2
          ? JSON.parse(bilingualData.mid_semester_exam).min_co2
          : '1'
      ),
      max_eo2: new FormControl(
        JSON.parse(bilingualData.mid_semester_exam).max_eo2
          ? JSON.parse(bilingualData.mid_semester_exam).max_eo2
          : '1'
      ),
      min_eo2: new FormControl(
        JSON.parse(bilingualData.mid_semester_exam).min_eo2
          ? JSON.parse(bilingualData.mid_semester_exam).min_eo2
          : '1'
      ),
      max_ce2: new FormControl(
        JSON.parse(bilingualData.mid_semester_exam).max_ce2
          ? JSON.parse(bilingualData.mid_semester_exam).max_ce2
          : '1'
      ),
      min_ce2: new FormControl(
        JSON.parse(bilingualData.mid_semester_exam).min_ce2
          ? JSON.parse(bilingualData.mid_semester_exam).min_ce2
          : '1'
      ),
      max_ee2: new FormControl(
        JSON.parse(bilingualData.mid_semester_exam).max_ee2
          ? JSON.parse(bilingualData.mid_semester_exam).max_ee2
          : '1'
      ),
      min_ee2: new FormControl(
        JSON.parse(bilingualData.mid_semester_exam).min_ee2
          ? JSON.parse(bilingualData.mid_semester_exam).min_ee2
          : '1'
      ),
      max_cl2: new FormControl(
        JSON.parse(bilingualData.mid_semester_exam).max_cl2
          ? JSON.parse(bilingualData.mid_semester_exam).max_cl2
          : '1'
      ),
      min_cl2: new FormControl(
        JSON.parse(bilingualData.mid_semester_exam).min_cl2
          ? JSON.parse(bilingualData.mid_semester_exam).min_cl2
          : '1'
      ),

      max_co3: new FormControl(
        JSON.parse(bilingualData.last_semester_exam).max_co3
          ? JSON.parse(bilingualData.last_semester_exam).max_co3
          : '1'
      ),
      min_co3: new FormControl(
        JSON.parse(bilingualData.last_semester_exam).min_co3
          ? JSON.parse(bilingualData.last_semester_exam).min_co3
          : '1'
      ),
      max_eo3: new FormControl(
        JSON.parse(bilingualData.last_semester_exam).max_eo3
          ? JSON.parse(bilingualData.last_semester_exam).max_eo3
          : '1'
      ),
      min_eo3: new FormControl(
        JSON.parse(bilingualData.last_semester_exam).min_eo3
          ? JSON.parse(bilingualData.last_semester_exam).min_eo3
          : '1'
      ),
      max_ce3: new FormControl(
        JSON.parse(bilingualData.last_semester_exam).max_ce3
          ? JSON.parse(bilingualData.last_semester_exam).max_ce3
          : '1'
      ),
      min_ce3: new FormControl(
        JSON.parse(bilingualData.last_semester_exam).min_ce3
          ? JSON.parse(bilingualData.last_semester_exam).min_ce3
          : '1'
      ),
      max_ee3: new FormControl(
        JSON.parse(bilingualData.last_semester_exam).max_ee3
          ? JSON.parse(bilingualData.last_semester_exam).max_ee3
          : '1'
      ),
      min_ee3: new FormControl(
        JSON.parse(bilingualData.last_semester_exam).min_ee3
          ? JSON.parse(bilingualData.last_semester_exam).min_ee3
          : '1'
      ),
      max_cl3: new FormControl(
        JSON.parse(bilingualData.last_semester_exam).max_cl3
          ? JSON.parse(bilingualData.last_semester_exam).max_cl3
          : '1'
      ),
      min_cl3: new FormControl(
        JSON.parse(bilingualData.last_semester_exam).min_cl3
          ? JSON.parse(bilingualData.last_semester_exam).min_cl3
          : '1'
      ),
      isEdit: false,
    });
  }
  onEditRowStudyProgramPrimarySchool(subject, studyProgramData) {
    const control = this.studyProgramDetailForm.get(
      'studyProgramDetails'
    ) as FormArray;
    for (let i = 0; i < subject.length; i++) {
      const checkSubjectId = studyProgramData
        .map(function (x) {
          return x.subject_id;
        })
        .indexOf(subject[i].id);
      if (checkSubjectId > -1) {
        control.push(
          this.editStudyProgramDetailPrimaySchoolFormGroup(
            subject[i],
            studyProgramData[checkSubjectId]
          )
        );
      } else {
        control.push(this.createStudyProgramDetailFormGroup(subject[i]));
      }
    }
  }
  // Chỉnh sửa bản ghi dữ liệu chi tiết chương trình học
  onEditRowStudyProgram(subject, studyProgramData) {
    const control = this.studyProgramDetailForm.get(
      'studyProgramDetails'
    ) as FormArray;
    for (let i = 0; i < subject.length; i++) {
      const checkSubjectId = studyProgramData
        .map(function (x) {
          return x.subject_id;
        })
        .indexOf(subject[i].id);
      if (checkSubjectId > -1) {
        control.push(
          this.editStudyProgramDetailFormGroup(
            subject[i],
            studyProgramData[checkSubjectId]
          )
        );
      } else {
        control.push(this.createStudyProgramDetailFormGroup(subject[i]));
      }
    }
  }

  // Thêm mới bản ghi dữ liệu chương trình học
  createStudyProgramDetailFormGroup(studyProgramData): FormGroup {
    return this.fb.group({
      subject_id: new FormControl(studyProgramData.id),
      subject_name: new FormControl(studyProgramData.name),
      chkApply: new FormControl(false),
      op1: new FormControl({ value: false, disabled: true }),
      op2: new FormControl({ value: false, disabled: true }),
      ops3: new FormControl({ value: false, disabled: true }),
      ops4: new FormControl({ value: false, disabled: true }),
      ops5: new FormControl({ value: false, disabled: true }),
      ops6: new FormControl({ value: null, disabled: true }),
      max1: new FormControl({ value: null, disabled: true }),
      min1: new FormControl({ value: null, disabled: true }),
      max2: new FormControl({ value: null, disabled: true }),
      min2: new FormControl({ value: null, disabled: true }),
      max3: new FormControl({ value: null, disabled: true }),
      min3: new FormControl({ value: null, disabled: true }),
    });
  }

  // Binding dữ liệu chương trình học cấp tiểu học
  editStudyProgramDetailPrimaySchoolFormGroup(
    subject,
    studyProgramData
  ): FormGroup {
    return this.fb.group({
      subject_id: new FormControl(subject.id),
      subject_name: new FormControl(subject.name),
      chkApply: new FormControl(true),
      op2: new FormControl(
        JSON.parse(studyProgramData.subject_kind).op2 === '1' ? true : false
      ),
      max2: new FormControl(
        JSON.parse(studyProgramData.mid_semester_exam) != null &&
          JSON.parse(studyProgramData.mid_semester_exam).max2 !== undefined &&
          JSON.parse(studyProgramData.mid_semester_exam).max2 === "1"
          ? true
          : false
      ),
      max3: new FormControl(
        JSON.parse(studyProgramData.last_semester_exam) != null &&
          JSON.parse(studyProgramData.last_semester_exam).max3 !== undefined &&
          JSON.parse(studyProgramData.last_semester_exam).max3 === "1"
          ? true
          : false
      ),
    });
  }

  // Chỉnh sửa bản ghi dữ liệu chương trình học
  editStudyProgramDetailFormGroup(subject, studyProgramData): FormGroup {
    let bilingualStatus = false;
    let mainBilingualStatusOps6 = false;
    let mainBilingualStatus = false;
    if (
      JSON.parse(studyProgramData.subject_kind).ops3 === '1' &&
      JSON.parse(studyProgramData.subject_kind).ops5 === '1'
    ) {
      bilingualStatus = true;
      mainBilingualStatusOps6 = false;
      mainBilingualStatus = true;
    } else if (JSON.parse(studyProgramData.subject_kind).ops4 === '1') {
      bilingualStatus = true;
      mainBilingualStatusOps6 = true;
      mainBilingualStatus = false;
    } else if (JSON.parse(studyProgramData.subject_kind).ops3 === '1') {
      bilingualStatus = true;
      mainBilingualStatusOps6 = false;
      mainBilingualStatus = true;
    } else {
      bilingualStatus = false;
      mainBilingualStatusOps6 = true;
    }
    return this.fb.group({
      subject_id: new FormControl(subject.id),
      subject_name: new FormControl(subject.name),
      chkApply: new FormControl(true),
      op1: new FormControl(
        JSON.parse(studyProgramData.subject_kind).op1 === '1' ? true : false
      ),
      op2: new FormControl(
        JSON.parse(studyProgramData.subject_kind).op2 === '1' ? true : false
      ),
      ops3: new FormControl(
        JSON.parse(studyProgramData.subject_kind).ops3 === '1' ? true : false
      ),
      ops4: new FormControl({
        value:
          JSON.parse(studyProgramData.subject_kind).ops4 === '1' ? true : false,
        disabled: mainBilingualStatus === true ? mainBilingualStatus : false,
      }),
      ops5: new FormControl(
        JSON.parse(studyProgramData.subject_kind).ops5 === '1' ? true : false
      ),
      ops6: new FormControl({
        value:
          JSON.parse(studyProgramData.subject_kind) != null &&
            JSON.parse(studyProgramData.subject_kind).ops6 != undefined &&
            JSON.parse(studyProgramData.subject_kind).ops6 != 0
            ? JSON.parse(studyProgramData.subject_kind).ops6
            : '',
        disabled: mainBilingualStatusOps6,
      }),
      max1: new FormControl({
        value:
          JSON.parse(studyProgramData.regular_exam) != null &&
            JSON.parse(studyProgramData.regular_exam).max1 != undefined &&
            JSON.parse(studyProgramData.regular_exam).max1 != 0
            ? JSON.parse(studyProgramData.regular_exam).max1
            : '',
        disabled: bilingualStatus,
      }),
      min1: new FormControl({
        value:
          JSON.parse(studyProgramData.regular_exam) != null &&
            JSON.parse(studyProgramData.regular_exam).min1 != undefined &&
            JSON.parse(studyProgramData.regular_exam).min1 != 0
            ? JSON.parse(studyProgramData.regular_exam).min1
            : '',
        disabled: bilingualStatus,
      }),
      max2: new FormControl({
        value:
          JSON.parse(studyProgramData.mid_semester_exam) != null &&
            JSON.parse(studyProgramData.mid_semester_exam).max2 != undefined &&
            JSON.parse(studyProgramData.mid_semester_exam).max2 != 0
            ? JSON.parse(studyProgramData.mid_semester_exam).max2
            : '',
        disabled: bilingualStatus,
      }),
      min2: new FormControl({
        value:
          JSON.parse(studyProgramData.mid_semester_exam) != null &&
            JSON.parse(studyProgramData.mid_semester_exam).min2 != undefined &&
            JSON.parse(studyProgramData.mid_semester_exam).min2 != 0
            ? JSON.parse(studyProgramData.mid_semester_exam).min2
            : '',
        disabled: bilingualStatus,
      }),
      max3: new FormControl({
        value:
          JSON.parse(studyProgramData.last_semester_exam) != null &&
            JSON.parse(studyProgramData.last_semester_exam).max3 != undefined &&
            JSON.parse(studyProgramData.last_semester_exam).max3 != 0
            ? JSON.parse(studyProgramData.last_semester_exam).max3
            : '',
        disabled: bilingualStatus,
      }),
      min3: new FormControl({
        value:
          JSON.parse(studyProgramData.last_semester_exam) != null &&
            JSON.parse(studyProgramData.last_semester_exam).min3 != undefined &&
            JSON.parse(studyProgramData.last_semester_exam).min3 != 0
            ? JSON.parse(studyProgramData.last_semester_exam).min3
            : '',
        disabled: bilingualStatus,
      }),
    });
  }

  // Khởi tạo form group danh sách lớp học
  createClassFormGroup(obj, classStudyProgramData, applied): FormGroup {
    const studyProgram = this.selectedStudyProgram;
    return this.fb.group({
      class_id: new FormControl(classStudyProgramData.id),
      class_name: new FormControl(classStudyProgramData.name),
      apply_class: new FormControl(applied),
      applied_class: new FormControl(
        obj != undefined ? obj.name : ''
      ),
    });
  }

  // Thêm mới chi tiết môn học và thuộc tính (chi tiết chương trình học)
  createSubjectProperties() {
    const studyProgramData = this.selectedStudyProgram;
    const control = this.studyProgramDetailForm.get(
      'studyProgramDetails'
    ) as FormArray;

    const chkApply = control.value.find((items) => items.chkApply === true);
    if (chkApply === undefined) {
      this.notifyService.showWarning(
        'Không có bản ghi dữ liệu nào thay đổi!',
        'Thông báo lỗi'
      );
      return;
    }

    if (studyProgramData.length > 0 && control.value.length > 0) {
      const formData = new FormData();
      let i = 0;
      if (studyProgramData[0].id !== undefined) {
        formData.append('study_program_id', studyProgramData[0].id);
      }
      control.value.forEach(function (item) {
        console.log('Control:', control);
        if (item.chkApply === true) {
          if (studyProgramData[0].level === 1) {
            formData.append(
              'data' + '[' + i + ']' + '[subject_id]',
              item.subject_id
            );
            formData.append(
              'data' + '[' + i + ']' + '[subject_kind][op2]',
              item.op2 === true ? '1' : '0'
            );
            formData.append(
              'data' + '[' + i + ']' + '[mid_semester_exam][max2]',
              item.max2 === true ? '1' : '0'
            );
            formData.append(
              'data' + '[' + i + ']' + '[last_semester_exam][max3]',
              item.max3 === true ? '1' : '0'
            );
          } else {
            formData.append(
              'data' + '[' + i + ']' + '[subject_id]',
              item.subject_id
            );
            formData.append(
              'data' + '[' + i + ']' + '[subject_kind][op1]',
              item.op1 === true ? '1' : '0'
            );
            formData.append(
              'data' + '[' + i + ']' + '[subject_kind][op2]',
              item.op2 === true ? '1' : '0'
            );
            formData.append(
              'data' + '[' + i + ']' + '[subject_kind][ops3]',
              item.ops3 === true ? '1' : '0'
            );
            formData.append(
              'data' + '[' + i + ']' + '[subject_kind][ops4]',
              item.ops4 === true ? '1' : '0'
            );
            formData.append(
              'data' + '[' + i + ']' + '[subject_kind][ops5]',
              item.ops5 === true ? '1' : '0'
            );
            formData.append(
              'data' + '[' + i + ']' + '[subject_kind][ops6]',
              item.ops6 ? item.ops6 : '0'
            );
            formData.append(
              'data' + '[' + i + ']' + '[regular_exam][min1]',
              item.min1 ? item.min1 : '1'
            );
            formData.append(
              'data' + '[' + i + ']' + '[regular_exam][max1]',
              item.max1 ? item.max1 : '1'
            );
            formData.append(
              'data' + '[' + i + ']' + '[mid_semester_exam][min2]',
              item.min2 ? item.min2 : '1'
            );
            formData.append(
              'data' + '[' + i + ']' + '[mid_semester_exam][max2]',
              item.max2 ? item.max2 : '1'
            );

            formData.append(
              'data' + '[' + i + ']' + '[last_semester_exam][min3]',
              item.min3 ? item.min3 : '1'
            );
            formData.append(
              'data' + '[' + i + ']' + '[last_semester_exam][max3]',
              item.max3 ? item.max3 : '1'
            );
          }
        }
        i++;
      });
      this.studyProgramService
        .createStudyProgramDetail(formData)
        .pipe()
        .subscribe(
          (res) => {
            if (res['message'] === 'success') {
              this.notifyService.showSuccess(
                'Cập nhật dữ liệu thành công.',
                'Thông báo'
              );
              this.loadStudyProgramDetail();
            }
            this.checkExistData = true;
          },
          (error) => {
            if (error['errors']) {
              if (error['errors']['study_program_id']) {
                this.notifyService.showError(
                  'ID chương trình học không tồn tại hoặc sai định dạng dữ liệu',
                  'Thông báo lỗi'
                );
              }
            } else if (error['error']) {
              if (error['error'] === 11) {
                this.notifyService.showError(
                  'Chương trình học không thuộc năm được chọn',
                  'Thông báo lỗi'
                );
              } else if (error['error'] === 121) {
                this.notifyService.showError(
                  'Năm học phải là năm hiện tại hoặc năm trong tương lai',
                  'Thông báo lỗi'
                );
              } else if (error['error'] === 12) {
                this.notifyService.showError(
                  'Môn học không thuộc khối trong chương trình học và năm được chọn',
                  'Thông báo lỗi'
                );
              } else if (error['error'] === 13) {
                this.notifyService.showError(
                  'Vui lòng chọn môn song ngữ chính trước khi chọn môn song ngữ!',
                  'Thông báo lỗi'
                );
              } else if (error['error'] === 14) {
                this.notifyService.showError(
                  'Vui lòng chọn môn song ngữ khi đã chọn môn song ngữ chính!',
                  'Thông báo lỗi'
                );
              } else if (error['error'] === 15) {
                this.notifyService.showError(
                  'Vui lòng chỉ chọn 1 môn song ngữ chính!',
                  'Thông báo lỗi'
                );
              } else if (error['error'] === 16) {
                this.notifyService.showError(
                  'Vui lòng không chọn đồng thời môn song ngữ và môn song ngữ chính!',
                  'Thông báo lỗi'
                );
              } else if (error['error'] === 17) {
                this.notifyService.showError(
                  'Vui lòng chọn môn song ngữ vì đã chọn điểm hệ song ngữ!',
                  'Thông báo lỗi'
                );
              } else if (error['error'] === 18) {
                this.notifyService.showError(
                  'Vui lòng điền thêm điểm cho hệ song ngữ!',
                  'Thông báo lỗi'
                );
              } else {
                this.notifyService.showError(
                  'Cập nhật dữ liệu không thành công',
                  'Thông báo lỗi'
                );
              }
            } else {
              this.notifyService.showError(
                'Cập nhật dữ liệu không thành công',
                'Thông báo lỗi'
              );
            }
            this.loadStudyProgramDetail();
          }
        );
    } else {
      this.notifyService.showWarning(
        'Vui lòng chọn 1 chương trình học!',
        'Thông báo'
      );
    }
  }

  // Cập nhật cấu hình điểm môn song ngữ (chi tiết chương trình học)
  updateBilingual() {
    const control = this.studyProgramDetailForm.get('bilinguals') as FormArray;
    if (this.selectedStudyProgram.length > 0 && control.value.length > 0) {
      const formData = new FormData();
      let i = 0;

      control.value.forEach(function (item) {
        if (item.detail_study_program_id) {
          formData.append(
            'data' + '[' + i + ']' + '[detail_study_program_id]',
            item.detail_study_program_id
          );
        } else {
          this.notifyService.showError(
            'ID chi tiết chương trình học không tồn tại.',
            'Thông báo lỗi'
          );
        }
        formData.append(
          'data' + '[' + i + ']' + '[regular_exam][max_co1]',
          item.max_co1 ? item.max_co1 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[regular_exam][min_co1]',
          item.min_co1 ? item.min_co1 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[regular_exam][max_eo1]',
          item.max_eo1 ? item.max_eo1 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[regular_exam][min_eo1]',
          item.min_eo1 ? item.min_eo1 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[regular_exam][max_ce1]',
          item.max_ce1 ? item.max_ce1 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[regular_exam][min_ce1]',
          item.min_ce1 ? item.min_ce1 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[regular_exam][max_ee1]',
          item.max_ee1 ? item.max_ee1 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[regular_exam][min_ee1]',
          item.min_ee1 ? item.min_ee1 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[regular_exam][max_cl1]',
          item.max_cl1 ? item.max_cl1 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[regular_exam][min_cl1]',
          item.min_cl1 ? item.min_cl1 : '0'
        );

        formData.append(
          'data' + '[' + i + ']' + '[mid_semester_exam][max_co2]',
          item.max_co2 ? item.max_co2 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[mid_semester_exam][min_co2]',
          item.min_co2 ? item.min_co2 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[mid_semester_exam][max_eo2]',
          item.max_eo2 ? item.max_eo2 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[mid_semester_exam][min_eo2]',
          item.min_eo2 ? item.min_eo2 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[mid_semester_exam][max_ce2]',
          item.max_ce2 ? item.max_ce2 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[mid_semester_exam][min_ce2]',
          item.min_ce2 ? item.min_ce2 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[mid_semester_exam][max_ee2]',
          item.max_ee2 ? item.max_ee2 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[mid_semester_exam][min_ee2]',
          item.min_ee2 ? item.min_ee2 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[mid_semester_exam][max_cl2]',
          item.max_cl2 ? item.max_cl2 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[mid_semester_exam][min_cl2]',
          item.min_cl2 ? item.min_cl2 : '0'
        );

        formData.append(
          'data' + '[' + i + ']' + '[last_semester_exam][max_co3]',
          item.max_co3 ? item.max_co3 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[last_semester_exam][min_co3]',
          item.min_co3 ? item.min_co3 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[last_semester_exam][max_eo3]',
          item.max_eo3 ? item.max_eo3 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[last_semester_exam][min_eo3]',
          item.min_eo3 ? item.min_eo3 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[last_semester_exam][max_ce3]',
          item.max_ce3 ? item.max_ce3 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[last_semester_exam][min_ce3]',
          item.min_ce3 ? item.min_ce3 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[last_semester_exam][max_ee3]',
          item.max_ee3 ? item.max_ee3 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[last_semester_exam][min_ee3]',
          item.min_ee3 ? item.min_ee3 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[last_semester_exam][max_cl3]',
          item.max_cl3 ? item.max_cl3 : '0'
        );
        formData.append(
          'data' + '[' + i + ']' + '[last_semester_exam][min_cl3]',
          item.min_cl3 ? item.min_cl3 : '0'
        );
        i++;
      });
      this.studyProgramService
        .updateBilingual(formData)
        .pipe()
        .subscribe(
          (res) => {
            if (res['message'] === 'success') {
              this.notifyService.showSuccess(
                'Cập nhật dữ liệu thành công.',
                'Thông báo'
              );
              this.loadStudyProgramDetail();
            }
          },
          (error) => {
            if (error.errors) {
              if (error.errors.study_program_id === 1) {
                this.notifyService.showError(
                  'ID chi tiết chương trình học không được để trống.',
                  'Thông báo lỗi'
                );
              } else if (
                (error.errors['regular_exam.max_co1'] !== undefined &&
                  error.errors['regular_exam.max_co1'][0] === '1') ||
                (error.errors['regular_exam.max_eo1'] !== undefined &&
                  error.errors['regular_exam.max_eo1'][0] === '1') ||
                (error.errors['regular_exam.min_eo1'] !== undefined &&
                  error.errors['regular_exam.min_eo1'][0] === '1') ||
                (error.errors['regular_exam.max_ce1'] !== undefined &&
                  error.errors['regular_exam.max_ce1'][0] === '1') ||
                (error.errors['regular_exam.min_ce1'] !== undefined &&
                  error.errors['regular_exam.min_ce1'][0] === '1') ||
                (error.errors['regular_exam.max_ee1'] !== undefined &&
                  error.errors['regular_exam.max_ee1'][0] === '1') ||
                (error.errors['regular_exam.min_ee1'] !== undefined &&
                  error.errors['regular_exam.min_ee1'][0] === '1') ||
                (error.errors['regular_exam.max_cl1'] !== undefined &&
                  error.errors['regular_exam.max_cl1'][0] === '1') ||
                (error.errors['regular_exam.min_cl1'] !== undefined &&
                  error.errors['regular_exam.min_cl1'][0] === '1') ||
                (error.errors['mid_semester_exam.max_co2'] !== undefined &&
                  error.errors['mid_semester_exam.max_co2'][0] === '1') ||
                (error.errors['mid_semester_exam.max_eo2'] !== undefined &&
                  error.errors['mid_semester_exam.max_eo2'][0] === '1') ||
                (error.errors['mid_semester_exam.min_eo2'] !== undefined &&
                  error.errors['mid_semester_exam.min_eo2'][0] === '1') ||
                (error.errors['mid_semester_exam.max_ce2'] !== undefined &&
                  error.errors['mid_semester_exam.max_ce2'][0] === '1') ||
                (error.errors['mid_semester_exam.min_ce2'] !== undefined &&
                  error.errors['mid_semester_exam.min_ce2'][0] === '1') ||
                (error.errors['mid_semester_exam.max_ee2'] !== undefined &&
                  error.errors['mid_semester_exam.max_ee2'][0] === '1') ||
                (error.errors['mid_semester_exam.min_ee2'] !== undefined &&
                  error.errors['mid_semester_exam.min_ee2'][0] === '1') ||
                (error.errors['mid_semester_exam.max_cl2'] !== undefined &&
                  error.errors['mid_semester_exam.max_cl2'][0] === '1') ||
                (error.errors['mid_semester_exam.min_cl2'] !== undefined &&
                  error.errors['mid_semester_exam.min_cl2'][0] === '1') ||
                (error.errors['last_semester_exam.max_co3'] !== undefined &&
                  error.errors['last_semester_exam.max_co3'][0] === '1') ||
                (error.errors['last_semester_exam.max_eo3'] !== undefined &&
                  error.errors['last_semester_exam.max_eo3'][0] === '1') ||
                (error.errors['last_semester_exam.min_eo3'] !== undefined &&
                  error.errors['last_semester_exam.min_eo3'][0] === '1') ||
                (error.errors['last_semester_exam.max_ce3'] !== undefined &&
                  error.errors['last_semester_exam.max_ce3'][0] === '1') ||
                (error.errors['last_semester_exam.min_ce3'] !== undefined &&
                  error.errors['last_semester_exam.min_ce3'][0] === '1') ||
                (error.errors['last_semester_exam.max_ee3'] !== undefined &&
                  error.errors['last_semester_exam.max_ee3'][0] === '1') ||
                (error.errors['last_semester_exam.min_ee3'] !== undefined &&
                  error.errors['last_semester_exam.min_ee3'][0] === '1') ||
                (error.errors['last_semester_exam.max_cl3'] !== undefined &&
                  error.errors['last_semester_exam.max_cl3'][0] === '1') ||
                (error.errors['last_semester_exam.min_cl3'] !== undefined &&
                  error.errors['last_semester_exam.min_cl3'][0] === '1')
              ) {
                this.notifyService.showError(
                  'Điểm hệ số cấu hình môn song ngữ không được để trống.',
                  'Thông báo lỗi'
                );
              } else if (
                (error.errors['regular_exam.max_co1'] !== undefined &&
                  error.errors['regular_exam.max_co1'][0] === '3') ||
                (error.errors['regular_exam.max_eo1'] !== undefined &&
                  error.errors['regular_exam.max_eo1'][0] === '3') ||
                (error.errors['regular_exam.min_eo1'] !== undefined &&
                  error.errors['regular_exam.min_eo1'][0] === '3') ||
                (error.errors['regular_exam.max_ce1'] !== undefined &&
                  error.errors['regular_exam.max_ce1'][0] === '3') ||
                (error.errors['regular_exam.min_ce1'] !== undefined &&
                  error.errors['regular_exam.min_ce1'][0] === '3') ||
                (error.errors['regular_exam.max_ee1'] !== undefined &&
                  error.errors['regular_exam.max_ee1'][0] === '3') ||
                (error.errors['regular_exam.min_ee1'] !== undefined &&
                  error.errors['regular_exam.min_ee1'][0] === '3') ||
                (error.errors['regular_exam.max_cl1'] !== undefined &&
                  error.errors['regular_exam.max_cl1'][0] === '3') ||
                (error.errors['regular_exam.min_cl1'] !== undefined &&
                  error.errors['regular_exam.min_cl1'][0] === '3') ||
                (error.errors['mid_semester_exam.max_co2'] !== undefined &&
                  error.errors['mid_semester_exam.max_co2'][0] === '3') ||
                (error.errors['mid_semester_exam.max_eo2'] !== undefined &&
                  error.errors['mid_semester_exam.max_eo2'][0] === '3') ||
                (error.errors['mid_semester_exam.min_eo2'] !== undefined &&
                  error.errors['mid_semester_exam.min_eo2'][0] === '3') ||
                (error.errors['mid_semester_exam.max_ce2'] !== undefined &&
                  error.errors['mid_semester_exam.max_ce2'][0] === '3') ||
                (error.errors['mid_semester_exam.min_ce2'] !== undefined &&
                  error.errors['mid_semester_exam.min_ce2'][0] === '3') ||
                (error.errors['mid_semester_exam.max_ee2'] !== undefined &&
                  error.errors['mid_semester_exam.max_ee2'][0] === '3') ||
                (error.errors['mid_semester_exam.min_ee2'] !== undefined &&
                  error.errors['mid_semester_exam.min_ee2'][0] === '3') ||
                (error.errors['mid_semester_exam.max_cl2'] !== undefined &&
                  error.errors['mid_semester_exam.max_cl2'][0] === '3') ||
                (error.errors['mid_semester_exam.min_cl2'] !== undefined &&
                  error.errors['mid_semester_exam.min_cl2'][0] === '3') ||
                (error.errors['last_semester_exam.max_co3'] !== undefined &&
                  error.errors['last_semester_exam.max_co3'][0] === '3') ||
                (error.errors['last_semester_exam.max_eo3'] !== undefined &&
                  error.errors['last_semester_exam.max_eo3'][0] === '3') ||
                (error.errors['last_semester_exam.min_eo3'] !== undefined &&
                  error.errors['last_semester_exam.min_eo3'][0] === '3') ||
                (error.errors['last_semester_exam.max_ce3'] !== undefined &&
                  error.errors['last_semester_exam.max_ce3'][0] === '3') ||
                (error.errors['last_semester_exam.min_ce3'] !== undefined &&
                  error.errors['last_semester_exam.min_ce3'][0] === '3') ||
                (error.errors['last_semester_exam.max_ee3'] !== undefined &&
                  error.errors['last_semester_exam.max_ee3'][0] === '3') ||
                (error.errors['last_semester_exam.min_ee3'] !== undefined &&
                  error.errors['last_semester_exam.min_ee3'][0] === '3') ||
                (error.errors['last_semester_exam.max_cl3'] !== undefined &&
                  error.errors['last_semester_exam.max_cl3'][0] === '3') ||
                (error.errors['last_semester_exam.min_cl3'] !== undefined &&
                  error.errors['last_semester_exam.min_cl3'][0] === '3')
              ) {
                this.notifyService.showError(
                  'Điểm hệ số cấu hình môn song ngữ phải tối thiểu là 1.',
                  'Thông báo lỗi'
                );
              } else if (
                (error.errors['regular_exam.max_co1'] !== undefined &&
                  error.errors['regular_exam.max_co1'][0] === '7') ||
                (error.errors['regular_exam.max_eo1'] !== undefined &&
                  error.errors['regular_exam.max_eo1'][0] === '7') ||
                (error.errors['regular_exam.min_eo1'] !== undefined &&
                  error.errors['regular_exam.min_eo1'][0] === '7') ||
                (error.errors['regular_exam.max_ce1'] !== undefined &&
                  error.errors['regular_exam.max_ce1'][0] === '7') ||
                (error.errors['regular_exam.min_ce1'] !== undefined &&
                  error.errors['regular_exam.min_ce1'][0] === '7') ||
                (error.errors['regular_exam.max_ee1'] !== undefined &&
                  error.errors['regular_exam.max_ee1'][0] === '7') ||
                (error.errors['regular_exam.min_ee1'] !== undefined &&
                  error.errors['regular_exam.min_ee1'][0] === '7') ||
                (error.errors['regular_exam.max_cl1'] !== undefined &&
                  error.errors['regular_exam.max_cl1'][0] === '7') ||
                (error.errors['regular_exam.min_cl1'] !== undefined &&
                  error.errors['regular_exam.min_cl1'][0] === '7') ||
                (error.errors['mid_semester_exam.max_co2'] !== undefined &&
                  error.errors['mid_semester_exam.max_co2'][0] === '7') ||
                (error.errors['mid_semester_exam.max_eo2'] !== undefined &&
                  error.errors['mid_semester_exam.max_eo2'][0] === '7') ||
                (error.errors['mid_semester_exam.min_eo2'] !== undefined &&
                  error.errors['mid_semester_exam.min_eo2'][0] === '7') ||
                (error.errors['mid_semester_exam.max_ce2'] !== undefined &&
                  error.errors['mid_semester_exam.max_ce2'][0] === '7') ||
                (error.errors['mid_semester_exam.min_ce2'] !== undefined &&
                  error.errors['mid_semester_exam.min_ce2'][0] === '7') ||
                (error.errors['mid_semester_exam.max_ee2'] !== undefined &&
                  error.errors['mid_semester_exam.max_ee2'][0] === '7') ||
                (error.errors['mid_semester_exam.min_ee2'] !== undefined &&
                  error.errors['mid_semester_exam.min_ee2'][0] === '7') ||
                (error.errors['mid_semester_exam.max_cl2'] !== undefined &&
                  error.errors['mid_semester_exam.max_cl2'][0] === '7') ||
                (error.errors['mid_semester_exam.min_cl2'] !== undefined &&
                  error.errors['mid_semester_exam.min_cl2'][0] === '7') ||
                (error.errors['last_semester_exam.max_co3'] !== undefined &&
                  error.errors['last_semester_exam.max_co3'][0] === '7') ||
                (error.errors['last_semester_exam.max_eo3'] !== undefined &&
                  error.errors['last_semester_exam.max_eo3'][0] === '7') ||
                (error.errors['last_semester_exam.min_eo3'] !== undefined &&
                  error.errors['last_semester_exam.min_eo3'][0] === '7') ||
                (error.errors['last_semester_exam.max_ce3'] !== undefined &&
                  error.errors['last_semester_exam.max_ce3'][0] === '7') ||
                (error.errors['last_semester_exam.min_ce3'] !== undefined &&
                  error.errors['last_semester_exam.min_ce3'][0] === '7') ||
                (error.errors['last_semester_exam.max_ee3'] !== undefined &&
                  error.errors['last_semester_exam.max_ee3'][0] === '7') ||
                (error.errors['last_semester_exam.min_ee3'] !== undefined &&
                  error.errors['last_semester_exam.min_ee3'][0] === '7') ||
                (error.errors['last_semester_exam.max_cl3'] !== undefined &&
                  error.errors['last_semester_exam.max_cl3'][0] === '7') ||
                (error.errors['last_semester_exam.min_cl3'] !== undefined &&
                  error.errors['last_semester_exam.min_cl3'][0] === '7')
              ) {
                this.notifyService.showError(
                  'Điểm hệ số cấu hình môn song ngữ phải là kiểu số nguyên.',
                  'Thông báo lỗi'
                );
              } else {
                this.notifyService.showError(
                  'Điểm hệ số cấu hình môn song ngữ không đúng định dạng.',
                  'Thông báo lỗi'
                );
              }
            } else if (error['error']) {
              if (error['error'] === 11) {
                this.notifyService.showError(
                  'Môn song ngữ truyền vào không phải là môn tính điểm',
                  'Thông báo lỗi'
                );
              } else if (error['error'] === 121) {
                this.notifyService.showError(
                  'Năm học phải là năm hiện tại hoặc năm trong tương lai',
                  'Thông báo lỗi'
                );
              } else if (error['error'] === 12) {
                this.notifyService.showError(
                  'Môn học không thuộc khối trong chương trình học và năm được chọn',
                  'Thông báo lỗi'
                );
              } else if (error['error'] === 19) {
                this.notifyService.showError(
                  'Điểm tối đa lớn hơn hoặc bằng điểm tối thiểu',
                  'Thông báo lỗi'
                );
              } else {
                this.notifyService.showError(
                  'Cấu hình điểm song ngữ không thành công.',
                  'Thông báo lỗi'
                );
              }
            } else {
              this.notifyService.showError(
                'Cấu hình điểm song ngữ không thành công.',
                'Thông báo lỗi'
              );
            }
            this.loadStudyProgramDetail();
          }
        );
    } else {
      this.notifyService.showWarning(
        'Vui lòng chọn 1 chương trình học!',
        'Thông báo'
      );
    }
  }

  // Áp dụng chương trình học cho lớp
  applyClassStudyProgram() {
    const studyProgramData = this.selectedStudyProgram;
    const control = this.studyProgramDetailForm.get('classes') as FormArray;
    if (this.selectedStudyProgram.length > 0 && control.value.length > 0) {
      const formData = new FormData();
      let i = 0;

      control.value.forEach(function (item) {
        if (studyProgramData[0].id !== undefined) {
          formData.append('study_program_id', studyProgramData[0].id);
        } else {
          this.notifyService.showError(
            'ID chi tiết chương trình học không tồn tại.',
            'Thông báo lỗi'
          );
        }
        if (item.apply_class === true) {
          formData.append('data' + '[' + i + ']' + '[class_id]', item.class_id);
        }
        i++;
      });
      this.studyProgramService
        .createApplyClassStudyProgram(formData)
        .pipe()
        .subscribe(
          (res) => {
            if (res['message'] === 'success') {
              this.notifyService.showSuccess(
                'Áp dụng chương trình học thành công.',
                'Thông báo'
              );
              this.loadStudyProgramDetail();
            }
          },
          (error) => {
            if (error.errors) {
              if (error.errors.study_program_id === 1) {
                this.notifyService.showError(
                  'Chương trình học không tồn tại',
                  'Thông báo lỗi'
                );
              } else if (error.errors.study_program_id === 7) {
                this.notifyService.showError(
                  'Chương trình học phải là kiểu số nguyên',
                  'Thông báo lỗi'
                );
              } else if (error.errors.class_id === 1) {
                this.notifyService.showError(
                  'Lớp học không được để trống',
                  'Thông báo lỗi'
                );
              } else if (error.errors.class_id === 7) {
                this.notifyService.showError(
                  'Mã lớp học là kiểu số nguyên',
                  'Thông báo lỗi'
                );
              } else {
                this.notifyService.showError(
                  'Áp dụng chương trình học không thành công',
                  'Thông báo lỗi'
                );
              }
            } else if (error.error) {
              if (error.error === 11) {
                this.notifyService.showError(
                  'Chương trình học không thuộc năm được chọn',
                  'Thông báo lỗi'
                );
              } else if (error.error === 121) {
                this.notifyService.showError(
                  'Năm học phải là năm hiện tại hoặc năm trong tương lai',
                  'Thông báo lỗi'
                );
              } else if (error.error === 12) {
                this.notifyService.showError(
                  'Môn học không thuộc khối trong chương trình học và năm được chọn',
                  'Thông báo lỗi'
                );
              } else if (error.error === 13) {
                this.notifyService.showError(
                  'Lớp hiện tại đã có chương trình học',
                  'Thông báo lỗi'
                );
              } else {
                this.notifyService.showError(
                  'Áp dụng chương trình học không thành công.',
                  'Thông báo lỗi'
                );
              }
            } else {
              this.notifyService.showError(
                'Áp dụng chương trình học không thành công.',
                'Thông báo lỗi'
              );
            }
            this.loadStudyProgramDetail();
          }
        );
    } else {
      this.notifyService.showWarning(
        'Vui lòng chọn 1 chương trình học!',
        'Thông báo'
      );
    }
  }

  // Xử lý sự kiện nhập số
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    } else {
      var inputQuantity = [];
      $(function () {
        $('.point').each(function (i) {
          inputQuantity[i] = this.defaultValue;
          $(this).data('idx', i);
        });
        $('.point').on('keyup', function (e) {
          var $field = $(this),
            val = this.value,
            $thisIndex = parseInt($field.data('idx'), 10);
          if (
            (this.validity && this.validity.badInput) ||
            isNaN(val) ||
            $field.is(':invalid')
          ) {
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

  // Kiểm tra hệ số điểm tối tiểu, tối đa cấu hình môn học và thuộc tính
  checkSubjectProperties(event, row, index) {
    if (event.key !== 'Tab') {
      const control = this.studyProgramDetailForm.get(
        'bilinguals'
      ) as FormArray;
      switch (event.target.name) {
        case 'max1': {
          if (event.key < row.value.min1) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#max1' + '_' + index).val(row.value.min1);
            row.controls['max1'].setValue(row.value.min1);
          } else {
            row.controls['max1'].setValue(event.key);
          }
          break;
        }
        case 'min1': {
          if (event.key > row.value.max1) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#min1' + '_' + index).val(row.value.max1);
            row.controls['min1'].setValue(row.value.max1);
          } else {
            row.controls['min1'].setValue(event.key);
          }
          break;
        }
        case 'max2': {
          if (event.key < row.value.min2) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#max2' + '_' + index).val(row.value.min2);
            row.controls['max2'].setValue(row.value.min2);
          } else {
            row.controls['max2'].setValue(event.key);
          }
          break;
        }
        case 'min2': {
          if (event.key > row.value.max2) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#min2' + '_' + index).val(row.value.max2);
            row.controls['min2'].setValue(row.value.max2);
          } else {
            row.controls['min2'].setValue(event.key);
          }
          break;
        }
        case 'max3': {
          if (event.key < row.value.min3) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#max3' + '_' + index).val(row.value.min3);
            row.controls['max3'].setValue(row.value.min3);
          } else {
            row.controls['max3'].setValue(event.key);
          }
          break;
        }
        case 'min3': {
          if (event.key > row.value.max3) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#min3' + '_' + index).val(row.value.max3);
            row.controls['min3'].setValue(row.value.max3);
          } else {
            row.controls['min3'].setValue(event.key);
          }
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  // Kiểm tra hệ số điểm tối tiểu, tối đa hệ song ngữ
  checkPointCoefficients(event, rowRegular, index) {
    if (event.key !== 'Tab') {
      const control = this.studyProgramDetailForm.get(
        'bilinguals'
      ) as FormArray;
      switch (event.target.name) {
        case 'max_co1': {
          if (event.key < rowRegular.value.min_co1) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#max_co1' + '_' + index).val(rowRegular.value.min_co1);
            rowRegular.controls['max_co1'].setValue(rowRegular.value.min_co1);
          } else {
            rowRegular.controls['max_co1'].setValue(event.key);
          }
          break;
        }
        case 'min_co1': {
          if (event.key > rowRegular.value.max_co1) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#min_co1' + '_' + index).val(rowRegular.value.max_co1);
            rowRegular.controls['min_co1'].setValue(rowRegular.value.max_co1);
          } else {
            rowRegular.controls['min_co1'].setValue(event.key);
          }
          break;
        }
        case 'max_eo1': {
          if (event.key < rowRegular.value.min_eo1) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#max_eo1' + '_' + index).val(rowRegular.value.min_eo1);
            rowRegular.controls['max_eo1'].setValue(rowRegular.value.min_eo1);
          } else {
            rowRegular.controls['max_eo1'].setValue(event.key);
          }
          break;
        }
        case 'min_eo1': {
          if (event.key > rowRegular.value.max_eo1) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#min_eo1' + '_' + index).val(rowRegular.value.max_eo1);
            rowRegular.controls['min_eo1'].setValue(rowRegular.value.max_eo1);
          } else {
            rowRegular.controls['min_eo1'].setValue(event.key);
          }
          break;
        }
        case 'max_ce1': {
          if (event.key < rowRegular.value.min_ce1) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#max_ce1' + '_' + index).val(rowRegular.value.min_ce1);
            rowRegular.controls['max_ce1'].setValue(rowRegular.value.min_ce1);
          } else {
            rowRegular.controls['max_ce1'].setValue(event.key);
          }
          break;
        }
        case 'min_ce1': {
          if (event.key > rowRegular.value.max_ce1) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#min_ce1' + '_' + index).val(rowRegular.value.max_ce1);
            rowRegular.controls['min_ce1'].setValue(rowRegular.value.max_ce1);
          } else {
            rowRegular.controls['min_ce1'].setValue(event.key);
          }
          break;
        }
        case 'max_ee1': {
          if (event.key < rowRegular.value.min_ee1) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#max_ee1' + '_' + index).val(rowRegular.value.min_ee1);
            rowRegular.controls['max_ee1'].setValue(rowRegular.value.min_ee1);
          } else {
            rowRegular.controls['max_ee1'].setValue(event.key);
          }
          break;
        }
        case 'min_ee1': {
          if (event.key > rowRegular.value.max_ee1) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#min_ee1' + '_' + index).val(rowRegular.value.max_ee1);
            rowRegular.controls['min_ee1'].setValue(rowRegular.value.max_ee1);
          } else {
            rowRegular.controls['min_ee1'].setValue(event.key);
          }
          break;
        }
        case 'max_cl1': {
          if (event.key < rowRegular.value.min_cl1) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#max_cl1' + '_' + index).val(rowRegular.value.min_cl1);
            rowRegular.controls['max_cl1'].setValue(rowRegular.value.min_cl1);
          } else {
            rowRegular.controls['max_cl1'].setValue(event.key);
          }
          break;
        }
        case 'min_cl1': {
          if (event.key > rowRegular.value.max_cl1) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#min_cl1' + '_' + index).val(rowRegular.value.max_cl1);
            rowRegular.controls['min_cl1'].setValue(rowRegular.value.max_cl1);
          } else {
            rowRegular.controls['min_cl1'].setValue(event.key);
          }
          break;
        }

        case 'max_co2': {
          if (event.key < rowRegular.value.min_co2) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#max_co2' + '_' + index).val(rowRegular.value.min_co2);
            rowRegular.controls['max_co2'].setValue(rowRegular.value.min_co2);
          } else {
            rowRegular.controls['max_co2'].setValue(event.key);
          }
          break;
        }
        case 'min_co2': {
          if (event.key > rowRegular.value.max_co2) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#min_co2' + '_' + index).val(rowRegular.value.max_co2);
            rowRegular.controls['min_co2'].setValue(rowRegular.value.max_co2);
          } else {
            rowRegular.controls['min_co2'].setValue(event.key);
          }
          break;
        }
        case 'max_eo2': {
          if (event.key < rowRegular.value.min_eo2) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#max_eo2' + '_' + index).val(rowRegular.value.min_eo2);
            rowRegular.controls['max_eo2'].setValue(rowRegular.value.min_eo2);
          } else {
            rowRegular.controls['max_eo2'].setValue(event.key);
          }
          break;
        }
        case 'min_eo2': {
          if (event.key > rowRegular.value.max_eo2) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#min_eo2' + '_' + index).val(rowRegular.value.max_eo2);
            rowRegular.controls['min_eo2'].setValue(rowRegular.value.max_eo2);
          } else {
            rowRegular.controls['min_eo2'].setValue(event.key);
          }
          break;
        }
        case 'max_ce2': {
          if (event.key < rowRegular.value.min_ce2) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#max_ce2' + '_' + index).val(rowRegular.value.min_ce2);
            rowRegular.controls['max_ce2'].setValue(rowRegular.value.min_ce2);
          } else {
            rowRegular.controls['max_ce2'].setValue(event.key);
          }
          break;
        }
        case 'min_ce2': {
          if (event.key > rowRegular.value.max_ce2) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#min_ce2' + '_' + index).val(rowRegular.value.max_ce2);
            rowRegular.controls['min_ce2'].setValue(rowRegular.value.max_ce2);
          } else {
            rowRegular.controls['min_ce2'].setValue(event.key);
          }
          break;
        }
        case 'max_ee2': {
          if (event.key < rowRegular.value.min_ee2) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#max_ee2' + '_' + index).val(rowRegular.value.min_ee2);
            rowRegular.controls['max_ee2'].setValue(rowRegular.value.min_ee2);
          } else {
            rowRegular.controls['max_ee2'].setValue(event.key);
          }
          break;
        }
        case 'min_ee2': {
          if (event.key > rowRegular.value.max_ee2) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#min_ee2' + '_' + index).val(rowRegular.value.max_ee2);
            rowRegular.controls['min_ee2'].setValue(rowRegular.value.max_ee2);
          } else {
            rowRegular.controls['min_ee2'].setValue(event.key);
          }
          break;
        }
        case 'max_cl2': {
          if (event.key < rowRegular.value.min_cl2) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#max_cl2' + '_' + index).val(rowRegular.value.min_cl2);
            rowRegular.controls['max_cl2'].setValue(rowRegular.value.min_cl2);
          } else {
            rowRegular.controls['max_cl2'].setValue(event.key);
          }
          break;
        }
        case 'min_cl2': {
          if (event.key > rowRegular.value.max_cl2) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#min_cl2' + '_' + index).val(rowRegular.value.max_cl2);
            rowRegular.controls['min_cl2'].setValue(rowRegular.value.max_cl2);
          } else {
            rowRegular.controls['min_cl2'].setValue(event.key);
          }
          break;
        }

        case 'max_co3': {
          if (event.key < rowRegular.value.min_co3) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#max_co3' + '_' + index).val(rowRegular.value.min_co3);
            rowRegular.controls['max_co3'].setValue(rowRegular.value.min_co3);
          } else {
            rowRegular.controls['max_co3'].setValue(event.key);
          }
          break;
        }
        case 'min_co3': {
          if (event.key > rowRegular.value.max_co3) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#min_co3' + '_' + index).val(rowRegular.value.max_co3);
            rowRegular.controls['min_co3'].setValue(rowRegular.value.max_co3);
          } else {
            rowRegular.controls['min_co3'].setValue(event.key);
          }
          break;
        }
        case 'max_eo3': {
          if (event.key < rowRegular.value.min_eo3) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#max_eo3' + '_' + index).val(rowRegular.value.min_eo3);
            rowRegular.controls['max_eo3'].setValue(rowRegular.value.min_eo3);
          } else {
            rowRegular.controls['max_eo3'].setValue(event.key);
          }
          break;
        }
        case 'min_eo3': {
          if (event.key > rowRegular.value.max_eo3) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#min_eo3' + '_' + index).val(rowRegular.value.max_eo3);
            rowRegular.controls['min_eo3'].setValue(rowRegular.value.max_eo3);
          } else {
            rowRegular.controls['min_eo3'].setValue(event.key);
          }
          break;
        }
        case 'max_ce3': {
          if (event.key < rowRegular.value.min_ce3) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#max_ce3' + '_' + index).val(rowRegular.value.min_ce3);
            rowRegular.controls['max_ce3'].setValue(rowRegular.value.min_ce3);
          } else {
            rowRegular.controls['max_ce3'].setValue(event.key);
          }
          break;
        }
        case 'min_ce3': {
          if (event.key > rowRegular.value.max_ce3) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#min_ce3' + '_' + index).val(rowRegular.value.max_ce3);
            rowRegular.controls['min_ce3'].setValue(rowRegular.value.max_ce3);
          } else {
            rowRegular.controls['min_ce3'].setValue(event.key);
          }
          break;
        }
        case 'max_ee3': {
          if (event.key < rowRegular.value.min_ee3) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#max_ee3' + '_' + index).val(rowRegular.value.min_ee3);
            rowRegular.controls['max_ee3'].setValue(rowRegular.value.min_ee3);
          } else {
            rowRegular.controls['max_ee3'].setValue(event.key);
          }
          break;
        }
        case 'min_ee3': {
          if (event.key > rowRegular.value.max_ee3) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#min_ee3' + '_' + index).val(rowRegular.value.max_ee3);
            rowRegular.controls['min_ee3'].setValue(rowRegular.value.max_ee3);
          } else {
            rowRegular.controls['min_ee3'].setValue(event.key);
          }
          break;
        }
        case 'max_cl3': {
          if (event.key < rowRegular.value.min_cl3) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#max_cl3' + '_' + index).val(rowRegular.value.min_cl3);
            rowRegular.controls['max_cl3'].setValue(rowRegular.value.min_cl3);
          } else {
            rowRegular.controls['max_cl3'].setValue(event.key);
          }
          break;
        }
        case 'min_cl3': {
          if (event.key > rowRegular.value.max_cl3) {
            this.notifyService.showWarning(
              'Vui lòng nhập giá trị điểm hệ số tối thiểu nhỏ hơn hoặc bằng điểm hệ số tối đa!',
              'Thông báo'
            );
            $('#min_cl3' + '_' + index).val(rowRegular.value.max_cl3);
            rowRegular.controls['min_cl3'].setValue(rowRegular.value.max_cl3);
          } else {
            rowRegular.controls['min_cl3'].setValue(event.key);
          }
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  // Xử lý sự kiện chọn từng row đối với cấp THCS/THPT
  selectedRow(selectedRow: any) {
    if (selectedRow.controls['chkApply'].value === true) {
      selectedRow.controls['op1'].disable();
      selectedRow.controls['op2'].disable();
      selectedRow.controls['ops3'].disable();
      selectedRow.controls['ops4'].disable();
      selectedRow.controls['ops5'].disable();
      selectedRow.controls['ops6'].disable();
      selectedRow.controls['max1'].disable();
      selectedRow.controls['min1'].disable();
      selectedRow.controls['max2'].disable();
      selectedRow.controls['min2'].disable();
      selectedRow.controls['max3'].disable();
      selectedRow.controls['min3'].disable();
      selectedRow.controls['max1'].setValue('');
      selectedRow.controls['min1'].setValue('');
      selectedRow.controls['max2'].setValue('');
      selectedRow.controls['min2'].setValue('');
      selectedRow.controls['max3'].setValue('');
      selectedRow.controls['min3'].setValue('');
    } else {
      selectedRow.controls['op1'].enable();
      selectedRow.controls['op2'].enable();
      selectedRow.controls['ops3'].enable();
      selectedRow.controls['ops4'].enable();
      selectedRow.controls['ops5'].enable();
      selectedRow.controls['ops6'].enable();
      selectedRow.controls['max1'].enable();
      selectedRow.controls['min1'].enable();
      selectedRow.controls['max2'].enable();
      selectedRow.controls['min2'].enable();
      selectedRow.controls['max3'].enable();
      selectedRow.controls['min3'].enable();

      selectedRow.controls['max1'].setValue('1');
      selectedRow.controls['min1'].setValue('1');
      selectedRow.controls['max2'].setValue('1');
      selectedRow.controls['min2'].setValue('1');
      selectedRow.controls['max3'].setValue('1');
      selectedRow.controls['min3'].setValue('1');
    }
  }

  // Xử lý sự kiện chọn từng row đối với cấp tiểu học
  selectedRowPrimarySchool(selectedRow: any) {
    if (selectedRow.controls['chkApply'].value === true) {
      selectedRow.controls['op2'].disable();
      selectedRow.controls['max2'].disable();
      selectedRow.controls['max3'].disable();
    } else {
      selectedRow.controls['op2'].enable();
      selectedRow.controls['max2'].enable();
      selectedRow.controls['max3'].enable();
    }
  }

  // Xử lý sự kiện checkbox trên grid môn học và thuộc tính
  checkBilingular(selectedRow: any, selectedCell: any) {
    const control = this.studyProgramDetailForm.get(
      'studyProgramDetails'
    ) as FormArray;
    let checkedMainBilinguar = false;
    if (control.value.length > 0) {
      control.value.forEach((items) => {
        if (items.chkApply === true) {
          if (items.ops4 === true) {
            checkedMainBilinguar = true;
            selectedRow.controls['ops6'].enable();
          }
        }
      });
    }
    if (checkedMainBilinguar === false) {
      this.notifyService.showWarning(
        'Vui lòng chọn môn song ngữ chính trước khi chọn môn song ngữ!',
        'Thông báo'
      );
      selectedRow.controls['ops3'].setValue(false);
      selectedRow.controls['ops5'].setValue(false);
    }

    if (selectedCell.target.checked === false) {
      selectedRow.controls['ops6'].disable();
      selectedRow.controls['ops6'].setValue(null);
      if (selectedRow.controls['ops5'].value === true) {
        selectedRow.controls['ops3'].setValue(true);
      }
    } else {
      selectedRow.controls['ops6'].enable();
      selectedRow.controls['ops6'].setValue('1');
    }

    console.log(control);
  }

  // Xử lý sự kiện checkbox trên grid môn học và thuộc tính
  checkBilingualMain(selectedRow: any, selectedCell: any) {
    const control = this.studyProgramDetailForm.get(
      'studyProgramDetails'
    ) as FormArray;
    let checkedMainBilinguar = false;
    if (control.value.length > 0) {
      control.value.forEach((items) => {
        if (
          items.chkApply === true &&
          items.subject_id !== selectedRow.value.subject_id
        ) {
          if (items.ops4 === true) {
            checkedMainBilinguar = true;
          }
        }
      });
    }
    if (checkedMainBilinguar === false) {
      if (selectedCell.target.checked === true) {
        selectedRow.controls['ops3'].setValue(false);
        selectedRow.controls['ops6'].setValue('1');
        selectedRow.controls['ops6'].disable();
        selectedRow.controls['max1'].disable();
        selectedRow.controls['min1'].disable();
        selectedRow.controls['max2'].disable();
        selectedRow.controls['min2'].disable();
        selectedRow.controls['max3'].disable();
        selectedRow.controls['min3'].disable();
      }
    } else {
      selectedRow.controls['ops3'].setValue(false);
      selectedRow.controls['ops4'].setValue(false);
      selectedRow.controls['ops5'].setValue(false);
      this.notifyService.showWarning(
        'Đã tồn tại môn chính song ngữ!',
        'Thông báo'
      );
    }
  }

  // Xử lý sự kiện checkbox trên grid môn học và thuộc tính
  checkBilingualMark(selectedRow: any, selectedCell: any) {
    const control = this.studyProgramDetailForm.get(
      'studyProgramDetails'
    ) as FormArray;
    let checkedMainBilinguar = false;
    if (control.value.length > 0) {
      control.value.forEach((items) => {
        if (items.chkApply === true) {
          if (items.ops4 === true) {
            checkedMainBilinguar = true;
          }
        }
      });
    }
    if (checkedMainBilinguar === false) {
      if (selectedCell.target.checked === true) {
        this.notifyService.showWarning(
          'Vui lòng chọn môn song ngữ chính trước khi chọn môn song ngữ!',
          'Thông báo'
        );
      }
      selectedRow.controls['ops3'].setValue(false);
      selectedRow.controls['ops5'].setValue(false);
    }
    if (selectedCell.target.checked === true) {
      if (selectedRow.controls['ops3'].value === false) {
        selectedRow.controls['ops3'].setValue(true);
        selectedRow.controls['ops4'].setValue(false);
        selectedRow.controls['ops4'].disable();
        selectedRow.controls['ops6'].enable();
        selectedRow.controls['ops6'].setValue('1');
        selectedRow.controls['min1'].disable();
        selectedRow.controls['max1'].disable();
        selectedRow.controls['min2'].disable();
        selectedRow.controls['max2'].disable();
        selectedRow.controls['min3'].disable();
        selectedRow.controls['max3'].disable();
      }
    } else {
      selectedRow.controls['ops4'].enable();
    }
  }

  // Sự kiện thay đổi tab
  studyProgramTabEvent(event: any) {
    const currentTab = $(this)[0].activeTab;
    this.checkDirtyFormGroup(currentTab, event);
  }

  // Kiểm tra, confirm chuyển tab khi dữ liệu thay đổi
  checkDirtyFormGroup(currentTab, event) {
    let message = 'Dữ liệu chưa được lưu. Tiếp tục sẽ làm mất dữ liệu đang chỉnh sửa. Bạn có muốn tiếp tục không?';
    let formArray = null;

    switch (currentTab) {
      case 'subjectProperties':
        formArray = this.studyProgramDetailForm.get("studyProgramDetails") as FormArray;
        break;
      case 'regularConfiguration':
        formArray = this.studyProgramDetailForm.get("bilinguals") as FormArray;
        break;
      default:
        formArray = this.studyProgramDetailForm.get("classes") as FormArray;
        break;
    }

    if (formArray && formArray.dirty) {
      event.stopImmediatePropagation();
      this._utilsService.showConfirm(message, (confirm) => {
        if (confirm) {
          this.activeTab = event.target.id;
          this.loadStudyProgramDetail();
        } else {
          this.activeTab = currentTab;
        }
      });
    } else {
      this.activeTab = event.target.id;
    }

    // if (currentTab === "subjectProperties") {
    //   const getStudyProgramDetailFormArray = this.studyProgramDetailForm.get(
    //     "studyProgramDetails"
    //   ) as FormArray;
    //   if (
    //     getStudyProgramDetailFormArray &&
    //     getStudyProgramDetailFormArray.dirty === true
    //   ) {
    //     const confirmResult = this.saveDataConfirm();
    //     if (confirmResult) {
    //       this.activeTab = event.target.id;
    //       this.loadStudyProgramDetail();
    //     } else {
    //       event.stopImmediatePropagation();
    //     }
    //   } else {
    //     this.activeTab = event.target.id;
    //   }
    // } else if (currentTab === "regularConfiguration") {
    //   const getBilingualFormArray = this.studyProgramDetailForm.get(
    //     "bilinguals"
    //   ) as FormArray;
    //   if (getBilingualFormArray && getBilingualFormArray.dirty === true) {
    //     const confirmResult = this.saveDataConfirm();
    //     if (confirmResult) {
    //       this.activeTab = event.target.id;
    //       this.loadStudyProgramDetail();
    //     } else {
    //       event.stopImmediatePropagation();
    //     }
    //   } else {
    //     this.activeTab = event.target.id;
    //   }
    // } else {
    //   const getClassFormArray = this.studyProgramDetailForm.get(
    //     "classes"
    //   ) as FormArray;
    //   if (getClassFormArray && getClassFormArray.dirty === true) {
    //     const confirmResult = this.saveDataConfirm();
    //     if (confirmResult) {
    //       this.activeTab = event.target.id;
    //       this.loadStudyProgramDetail();
    //     } else {
    //       event.stopImmediatePropagation();
    //     }
    //   } else {
    //     this.activeTab = event.target.id;
    //   }
    // }
  }

  // saveDataConfirm() {
  //   let confirmSave;
  //   confirmSave = confirm(
  //     "Dữ liệu chưa được lưu. Tiếp tục sẽ làm mất dữ liệu đang chỉnh sửa. Tiếp tục?"
  //   );
  //   if (confirmSave) {
  //     // event.stopImmediatePropagation();
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
}
