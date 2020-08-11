import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseObjectDialogComponent } from './choose-object-dialog.component';

describe('ChooseObjectDialogComponent', () => {
  let component: ChooseObjectDialogComponent;
  let fixture: ComponentFixture<ChooseObjectDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseObjectDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseObjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
