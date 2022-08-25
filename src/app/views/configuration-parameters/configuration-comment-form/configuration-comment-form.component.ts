import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NotificationService } from "../../../_services/notification.service";
import { ConfigurationCommentFormService } from "../service/configuration-comment-form.service";

declare var $: any;

@Component({
  selector: "app-configuration-comment-form",
  templateUrl: "./configuration-comment-form.component.html",
  styleUrls: ["./configuration-comment-form.component.scss"],
})
export class ConfigurationCommentFormComponent implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef;

  form: FormGroup;
  fileURL: any;
  updateContent: any;
  updateDescription: any;
  submitted = false;
  idCommentForm: any;
  //ghi chú
  numberOfCharactersDescription = 0;
  maxNumberOfCharactersDescription = 150;
  //header table
  headerCommentFormConfiguration = true;
  //drop loại môn
  ddlCommentType = [];
  selectedCommentType = [];
  selectedAddCommentType = [];
  selectedUpdateCommentType = [];
  //drop lesson
  selectedAddLesson = [];
  selectedUpdateLesson = [];
  ddlLesson: any;
  p: number = 1;
  countPage: number = 10;
  totalItems = 0;
  checkCommentFormData = false;
  loadingDownload = false;
  loadingImport = false;
  loadingExport = false;
  loadingFilter = false;
  selectedFile: File;
  commentFormConfigurationData: any;

  constructor(
    private fb: FormBuilder,
    private notifyService: NotificationService,
    private commentFormService: ConfigurationCommentFormService
  ) {}
  get f() {
    return this.form.controls;
  }
  uploadFile(files) {
    if (files.length === 0) {
      return;
    }
    this.selectedFile = files[0];
    const mimeType = files[0].type;
    if (
      mimeType !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
      mimeType !== "application/vnd.ms-excel"
    ) {
      this.notifyService.showError(
        "Chỉ hỗ trợ định dạng .xls, .xlsx, .csv",
        "Thông báo lỗi"
      );
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.fileURL = this.selectedFile["name"];
    };
  }
  ngOnInit() {
    this.ddlCommentType = [
      { id: 0, name: "Nhận xét về môn học" },
      { id: 1, name: "Nhận xét về năng lực" },
      { id: 2, name: "Nhận xét về phẩm chất" },
    ];
    this.headerCommentFormConfiguration = true;
    this.form = new FormGroup({
      statusFilter: new FormControl(true),
      commentType: new FormControl("", [Validators.required]),
      addCommentType: new FormControl("", [Validators.required]),
      addCommentContent: new FormControl("", [Validators.required]),
      updateCommentType: new FormControl("", [Validators.required]),
      updateCommentContent: new FormControl("", [Validators.required]),
      updateLesson: new FormControl(""),
      description: new FormControl(""),
      search: new FormControl(""),
    });
    this.onSelectCommentType();
  }
   //chọn loại nhận xét
   onSelectCommentType(){
    const arrData = this.form.controls["commentType"].value;
    const formData = new FormData();
    let i = 0;
    if (arrData["length"] != 0) {
      arrData.forEach(function (item) {
        formData.append("comment_type" + "[" + i + "]", item["id"]);
        i++;
      });
    }
    this.commentFormService.filter(formData).subscribe((result) => {
      if (result["query"]["length"] === 0) {
        this.p = 1;
        this.totalItems = 1;
        this.headerCommentFormConfiguration = true;
        this.checkCommentFormData = false;
        this.commentFormConfigurationData = [];
      } else {
        this.p = 1;
        this.totalItems = 1;
        this.headerCommentFormConfiguration = true;
        this.checkCommentFormData = true;
        this.commentFormConfigurationData = result["query"];
        this.totalItems = result["query"]["length"];
      }
    });
  }
  selectAllCommentTypeFilter(objectSearchData) {
    this.selectedCommentType = objectSearchData;
    if(objectSearchData){
      // const arrData = this.form.controls["commentType"].value;
      const formData = new FormData();
      // let i = 0;
      // if (arrData["length"] != 0) {
      //   arrData.forEach(function (item) {
      //     formData.append("comment_type" + "[" + i + "]", item["id"]);
      //     i++;
      //   });
      // }
      this.commentFormService.filter(formData).subscribe((result) => {
        if (result["query"]["length"] === 0) {
          this.p = 1;
          this.totalItems = 1;
          this.headerCommentFormConfiguration = true;
          this.checkCommentFormData = false;
          this.commentFormConfigurationData = [];
        } else {
          this.p = 1;
          this.totalItems = 1;
          this.headerCommentFormConfiguration = true;
          this.checkCommentFormData = true;
          this.commentFormConfigurationData = result["query"];
          this.totalItems = result["query"]["length"];
        }
      });
    }
  }
  deSelectAllCommentTypeFilter() {
    this.selectedCommentType = [];
    const formData = new FormData();
    this.commentFormService.filter(formData).subscribe((result) => {
      if (result["query"]["length"] === 0) {
        this.p = 1;
        this.totalItems = 1;
        this.headerCommentFormConfiguration = true;
        this.checkCommentFormData = false;
        this.commentFormConfigurationData = [];
      } else {
        this.p = 1;
        this.totalItems = 1;
        this.headerCommentFormConfiguration = true;
        this.checkCommentFormData = true;
        this.commentFormConfigurationData = result["query"];
        this.totalItems = result["query"]["length"];
      }
    });
  }
  onKeyUp(event: any): void {
    this.numberOfCharactersDescription = event.target.value.length;
    if (
      this.numberOfCharactersDescription > this.maxNumberOfCharactersDescription
    ) {
      event.target.value = event.target.value.slice(
        0,
        this.maxNumberOfCharactersDescription
      );
      this.numberOfCharactersDescription = this.maxNumberOfCharactersDescription;
    }
  }
  perPageSelected(id: number) {
    this.countPage = id;
    this.p = 1;
  }
  //nút Thêm
  resetCommentForm() {
    // this.form.get('commentType').clearValidators();
    this.form.get("addCommentContent").clearValidators();
    this.form.get("addCommentContent").setValue("");
    this.form.get("addCommentType").clearValidators();
    // this.selectedCommentType = [];
    this.selectedAddCommentType = [];
    this.form.get("description").setValue("");
    this.numberOfCharactersDescription = 0;
    this.form.get("updateCommentContent").clearValidators();
    this.form.get("updateCommentContent").setValue("");
    this.form.get("updateCommentType").clearValidators();
    this.selectedUpdateCommentType = [];
  }
  //Tìm kiếm
  searchByKeyWord(search: any) {
    if (search.trim() === "") {
      this.notifyService.showError(
        "Vui lòng điền từ khóa tìm kiếm!",
        "Thông báo lỗi"
      );
      this.checkCommentFormData = false;
      this.headerCommentFormConfiguration = true;
      this.commentFormConfigurationData = [];
      this.p = 1;
      this.totalItems = 1;
    } else {
      this.commentFormService.search(search).subscribe(
        (data) => {
          if (data["query"]["length"] === 0) {
            this.p = 1;
            this.totalItems = 1;
            this.headerCommentFormConfiguration = true;
            this.checkCommentFormData = false;
            this.commentFormConfigurationData = [];
          } else {
            this.p = 1;
            this.totalItems = 1;
            this.headerCommentFormConfiguration = true;
            this.checkCommentFormData = true;
            this.commentFormConfigurationData = data["query"];
          }
        },
        (error) => {
          this.notifyService.showError(error, "Thông báo lỗi");
        }
      );
    }
  }
 
  // Lọc
  // filter() {
  //   const arrData = this.form.controls["commentType"].value;
  //   const formData = new FormData();
  //   let i = 0;
  //   if (arrData["length"] != 0) {
  //     arrData.forEach(function (item) {
  //       formData.append("comment_type" + "[" + i + "]", item["id"]);
  //       i++;
  //     });
  //   }
  //   this.commentFormService.filter(formData).subscribe((result) => {
  //     if (result["query"]["length"] === 0) {
  //       this.p = 1;
  //       this.totalItems = 1;
  //       this.headerCommentFormConfiguration = true;
  //       this.checkCommentFormData = false;
  //       this.commentFormConfigurationData = [];
  //     } else {
  //       this.p = 1;
  //       this.totalItems = 1;
  //       this.headerCommentFormConfiguration = true;
  //       this.checkCommentFormData = true;
  //       this.commentFormConfigurationData = result["query"];
  //       this.totalItems = result["query"]["length"];
  //     }
  //   });
  // }
  // Nút Sửa showdata lên form
  getByIdCommentFormConfigurationData(id: any) {
    this.resetCommentForm();
    this.commentFormService.showData(id).subscribe((ress) => {
      this.idCommentForm = id;
      let commentTypeUpdate: any;
      let selectedContentTypeUpdate = [];
      const mapCommentType = this.ddlCommentType
        .map(function (x) {
          return x.id;
        })
        .indexOf(ress["query"]["comment_type"]);
      if (mapCommentType > -1) {
        commentTypeUpdate = {
          id: this.ddlCommentType[mapCommentType]["id"],
          name: this.ddlCommentType[mapCommentType]["name"],
        };
        selectedContentTypeUpdate.push(commentTypeUpdate);
      }
      this.selectedUpdateCommentType = commentTypeUpdate;
      let content = ress["query"]["content"];
      this.updateContent = content;
      let descriptions = ress["query"]["description"];
      this.updateDescription = descriptions;
      if (ress["query"]["description"] != null) {
        this.numberOfCharactersDescription =
          ress["query"]["description"].length;
      }
    });
  }
  //Xóa
  deleteCommentFormConfigurationData(id: any) {
    let isDelete = confirm("Bạn chắc chắn muốn xóa dữ liệu này");
    if (isDelete) {
      this.commentFormService.delete(id).subscribe(
        (re) => {
          this.notifyService.showSuccess(
            "Dữ liệu đã được xóa thành công!",
            "Thông báo"
          );
          // this.filter()
          {
            const arrData = this.form.controls["commentType"].value;
            const formData = new FormData();
            let i = 0;
            if (arrData["length"] != 0) {
              arrData.forEach(function (item) {
                formData.append("comment_type" + "[" + i + "]", item["id"]);
                i++;
              });
            }
            this.commentFormService.filter(formData).subscribe((result) => {
              if (result["query"]["length"] === 0) {
                this.p = 1;
                this.totalItems = 1;
                this.headerCommentFormConfiguration = true;
                this.checkCommentFormData = false;
                this.commentFormConfigurationData = [];
              } else {
                this.headerCommentFormConfiguration = true;
                this.checkCommentFormData = true;
                this.commentFormConfigurationData = result["query"];
                this.totalItems = result["query"]["length"];
              }
            });
          }
        },
        (error) => {
          if (error["error"]) {
            this.notifyService.showError(error.error, "Thông báo lỗi");
          }
        }
      );
    }
  }
  //downloadFile
  downloadTemplateFile() {
    this.commentFormService.downloadSampleFile().subscribe((res) => {
      this.loadingDownload = false;
      var downloadUrl = window.URL.createObjectURL(res);
      var link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "FileMau_ MauNhanXet.xls";
      link.click();
    });
  }
  //xuất tệp
  exportFile() {
    // this.loadingExport = true;
    if (
      this.commentFormConfigurationData === undefined ||
      this.commentFormConfigurationData === [] ||
      this.commentFormConfigurationData.length === 0
    ) {
      this.notifyService.showError(
        "Không tìm thấy dữ liệu vui lòng tìm kiếm dữ liệu!",
        "Thông báo lỗi"
      );
      this.loadingExport = false;
      return;
    } else {
      var formData = new FormData();
      var searchExport = this.form.controls.search.value;
      var filterExport = this.form.controls["commentType"].value;
      let i = 0;
      if (filterExport["length"] != 0) {
        filterExport.forEach(function (item) {
          formData.append("comment_type" + "[" + i + "]", item["id"]);
          i++;
        });
      }
      if (searchExport) {
        formData.append("search", searchExport);
      }
      formData.append("export_data", "1");
      this.commentFormService.exportExcel(formData).subscribe((res) => {
        this.loadingExport = false;
        var downloadURL = window.URL.createObjectURL(res);
        var link = document.createElement("a");
        link.href = downloadURL;
        link.download = "DanhSachMauNhanXet.xlsx";
        link.click();
      });
    }
  }
  //nhập tệp
  importFile() {
    // this.loadingImport = true
    const formData = new FormData();
    if (
      this.fileURL == undefined ||
      this.fileURL == "" ||
      this.fileURL == null
    ) {
      this.loadingImport = false;
      this.notifyService.showError("Vui lòng chọn File để nhập!", "thông báo");
    } else if (this.selectedFile === undefined || this.selectedFile === null) {
      this.loadingImport = false;
      this.notifyService.showError(
        "File excel chỉ nhận file có định dạng .xls, .xlsx, hoặc .csv",
        "thông báo"
      );
    } else {
      formData.append("data_import", this.selectedFile);
      this.commentFormService.importExcel(formData).subscribe(
        (resImport) => {
          if (resImport["success"] == 0 && resImport["fail"] == 0) {
            let mess = "File không hợp lệ, tải lên dữ liệu thất bại";
            this.notifyService.showError(mess, "Thông báo");
            this.fileInput.nativeElement.value = "";
            this.fileURL = "";
            this.selectedFile = null;
          }

          if (resImport["success"] != 0 && resImport["fail"] !== 0) {
            let mess =
              "Tải lên thành công " +
              resImport["success"] +
              " bản ghi. Có " +
              resImport["fail"] +
              " bản ghi bị lỗi !";
            this.notifyService.showSuccess(mess, "Thông báo");
            this.fileInput.nativeElement.value = "";
            this.fileURL = "";
            this.selectedFile = null;
            let err = { basicError: resImport["basicError"] };
            this.commentFormService.exportExcelErrors(err).subscribe(
              (res) => {
                var downloadURL = window.URL.createObjectURL(res);
                var link = document.createElement("a");
                link.href = downloadURL;
                link.download = "File_Errors.xlsx";
                link.click();
              },
              (error) => {
                this.loadingImport = false;
              }
            );
            // this.filter();
            this.onSelectCommentType();
          } else if (resImport["success"] != 0 && resImport["fail"] == 0) {
            let mess =
              "Tải lên thành công " +
              resImport["success"] +
              " bản ghi. Có " +
              resImport["fail"] +
              " bản ghi bị lỗi !";
            this.notifyService.showSuccess(mess, "Thông báo");
            this.fileInput.nativeElement.value = "";
            this.fileURL = "";
            this.selectedFile = null;
            // this.filter();
            this.onSelectCommentType();
          } else if (resImport["success"] == 0 && resImport["fail"] !== 0) {
            let mess =
              "Tải lên thành công " +
              resImport["success"] +
              " bản ghi. Có " +
              resImport["fail"] +
              " bản ghi bị lỗi !";
            this.notifyService.showError(mess, "Thông báo");
            this.fileInput.nativeElement.value = "";
            this.fileURL = "";
            this.selectedFile = null;
            let err = { basicError: resImport["basicError"] };
            this.commentFormService.exportExcelErrors(err).subscribe(
              (reFail) => {
                var downloadURL = window.URL.createObjectURL(reFail);
                var link = document.createElement("a");
                link.href = downloadURL;
                link.download = "File_Errors.xlsx";
                link.click();
              },
              (error) => {
                this.loadingImport = false;
              }
            );
            this.onSelectCommentType();
          }
        },
        (error) => {
          if (error.error) {
              if (error.data_import[0] === "8") {
                this.notifyService.showError(
                  "File truyền vào không hợp lệ. Định dạng file excel .xls, .xlsx, .csv",
                  "Thông báo lỗi"
                );
              } else if (error.data_import[0] === "1") {
                this.notifyService.showError(
                  "File dữ liệu không được bỏ trống",
                  "Thông báo lỗi"
                );
              } else {
              this.notifyService.showError(
                "Nhập tệp không thành công.",
                "Thông báo lỗi"
              );
              }
            this.fileInput.nativeElement.value = "";
            this.fileURL = "";
            this.selectedFile = null;
          } else if (error.message["error"]) {
            this.notifyService.showError(
              "File dữ liệu truyền vào không hợp lệ",
              "Thông báo lỗi"
            );
            this.fileInput.nativeElement.value = "";
            this.fileURL = "";
            this.selectedFile = null;
          } else {
            this.notifyService.showError(
              "Nhập tệp không thành công.",
              "Thông báo lỗi"
            );
          this.loadingImport = false;
          this.fileInput.nativeElement.value = "";
          this.fileURL = "";
        }
      });
    }
  }
  //Lưu khi thêm mới
  createCommentForm() {
    const formData = new FormData();
    this.form.get("addCommentContent").setValidators([Validators.required]);
    this.form.get("addCommentContent").updateValueAndValidity();
    this.form.get("addCommentType").setValidators([Validators.required]);
    this.form.get("addCommentType").updateValueAndValidity();
    this.submitted = true;

    if (
      this.form.controls["addCommentContent"].invalid ||
      this.form.controls["addCommentType"].invalid
    ) {
      return;
    }
    if (this.form.value["addCommentType"]) {
      formData.append("comment_type", this.form.value["addCommentType"]["id"]);
    }
    if (this.form.value["addCommentContent"]) {
      formData.append("content", this.form.value["addCommentContent"]);
    }
    const description = this.form.controls["description"].value;
    if (description) {
      formData.append("description", description.substring(0, 150));
    }
    this.commentFormService.create(formData).subscribe(
      (dt) => {
        this.notifyService.showSuccess("Thêm mới thành công", "Thông báo");
        $("#createCommentFormModal").modal("hide");
        $(".modal-backdrop").remove();
        this.resetCommentForm();
        // this.filter();
        this.onSelectCommentType();
      },
      (error) => {
        if (error) {
          this.notifyService.showError(error.error, "Thông báo lỗi");
        }
      }
    );
  }
  //Cập nhật khi sửa
  updateCommentForm(id: any) {
    this.form.get("updateCommentContent").setValidators([Validators.required]);
    this.form.get("updateCommentContent").updateValueAndValidity();
    this.form.get("updateCommentType").setValidators([Validators.required]);
    this.form.get("updateCommentType").updateValueAndValidity();
    this.submitted = true;

    if (
      this.form.controls["updateCommentContent"].invalid ||
      this.form.controls["updateCommentType"].invalid
    ) {
      return;
    }
    let updateDescription = this.form.controls["description"].value;
    var formData = new FormData();
    if (this.form.value["updateCommentContent"]) {
      formData.append("content", this.form.value["updateCommentContent"]);
    }
    if (this.form.value["updateCommentType"]) {
      formData.append(
        "comment_type",
        this.form.value["updateCommentType"]["id"]
      );
    }
    if (updateDescription) {
      formData.append("description", updateDescription.substring(0, 150));
    }
    this.commentFormService.update(id, formData).subscribe((dt) => {
      this.notifyService.showSuccess("Cập nhật thành công", "Thông báo");
      $("#updateCommentFormModal").modal("hide");
      $(".modal-backdrop").remove();
      let searchs = this.form.controls["search"].value;
      if (searchs) {
        if (searchs.trim() === "") {
          this.notifyService.showError(
            "Vui lòng điền từ khóa tìm kiếm!",
            "Thông báo lỗi"
          );
          this.headerCommentFormConfiguration = true;
          this.checkCommentFormData = false;
          this.commentFormConfigurationData = [];
          this.p = 1;
          this.totalItems = 1;
        } else {
          this.commentFormService.search(searchs).subscribe(
            (data) => {
              if (data["query"]["length"] === 0) {
                this.p = 1;
                this.totalItems = 1;
                this.headerCommentFormConfiguration = true;
                this.checkCommentFormData = false;
                this.commentFormConfigurationData = [];
              } else {
                this.p = 1;
                this.totalItems = 1;
                this.headerCommentFormConfiguration = true;
                this.checkCommentFormData = true;
                this.commentFormConfigurationData = data["query"];
              }
            },
            (error) => {
              this.notifyService.showError(error, "Thông báo lỗi");
            }
          );
        }
      } else {
        const arrData = this.form.controls["commentType"].value;
        const formData = new FormData();
        let i = 0;
        if (arrData["length"] != 0) {
          arrData.forEach(function (item) {
            formData.append("comment_type" + "[" + i + "]", item["id"]);
            i++;
          });
        }
        this.commentFormService.filter(formData).subscribe((result) => {
          if (result["query"]["length"] === 0) {
            this.p = 1;
            this.totalItems = 1;
            this.headerCommentFormConfiguration = true;
            this.checkCommentFormData = false;
            this.commentFormConfigurationData = [];
          } else {
            this.headerCommentFormConfiguration = true;
            this.checkCommentFormData = true;
            this.commentFormConfigurationData = result["query"];
            this.totalItems = result["query"]["length"];
          }
        });
      }
    });
  }
}
