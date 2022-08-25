/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StudentManagementUpdateAccountInformationComponent } from './student-management-update-account-information.component';

describe('StudentManagementUpdateAccountInformationComponent', () => {
  let component: StudentManagementUpdateAccountInformationComponent;
  let fixture: ComponentFixture<StudentManagementUpdateAccountInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentManagementUpdateAccountInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentManagementUpdateAccountInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
