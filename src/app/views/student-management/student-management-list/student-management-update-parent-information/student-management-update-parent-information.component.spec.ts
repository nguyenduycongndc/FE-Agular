/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StudentManagementUpdateParentInformationComponent } from './student-management-update-parent-information.component';

describe('StudentManagementUpdateParentInformationComponent', () => {
  let component: StudentManagementUpdateParentInformationComponent;
  let fixture: ComponentFixture<StudentManagementUpdateParentInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentManagementUpdateParentInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentManagementUpdateParentInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
