import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppComponent } from 'src/app/app.component';

export enum DialogType {
  PickFromList,
  TypeValue
}

export interface DialogChooseObject {
  title: string;
  type: DialogType;
  values?: Map<string, string>;
}

@Component({
  selector: 'app-choose-object-dialog',
  templateUrl: './choose-object-dialog.component.html',
  styleUrls: ['./choose-object-dialog.component.css']
})
export class ChooseObjectDialogComponent implements OnInit {

  optionSelected: string;
  literal: string = 'Filter';

  constructor(
    public dialogRef: MatDialogRef<AppComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogChooseObject) { }

  onNoClick(): void {
    this.dialogRef.close();
    // this.removeDivs();
  }

  onOkClick(): void {
    let result: any;

    if (this.optionSelected)
      result = [this.optionSelected, this.data.values.get(this.optionSelected)];
    else if (this.literal)
      result = this.literal;

    this.dialogRef.close(result);
    // this.removeDivs();
  }

  ngOnInit(): void { }

  onOptionSelected(object) {
    if (object)
      this.optionSelected = object;
  }

  showPickList(): boolean {
    return this.data.type == DialogType.PickFromList;
  }

  private removeDivs(): void {
    document.querySelectorAll('.cdk-overlay-container').forEach(function (a) {
      a.remove()
    });
    document.querySelectorAll('.cdk-visually-hidden').forEach(function (a) {
      a.remove()
    });
  }
}
