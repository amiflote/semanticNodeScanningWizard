import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeLiteralDialogComponent } from './type-literal-dialog.component';

describe('TypeLiteralDialogComponent', () => {
  let component: TypeLiteralDialogComponent;
  let fixture: ComponentFixture<TypeLiteralDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeLiteralDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeLiteralDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
