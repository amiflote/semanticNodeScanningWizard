import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePropertyDialogComponent } from './choose-property-dialog.component';

describe('ChoosePropertyDialogComponent', () => {
  let component: ChoosePropertyDialogComponent;
  let fixture: ComponentFixture<ChoosePropertyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosePropertyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosePropertyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
