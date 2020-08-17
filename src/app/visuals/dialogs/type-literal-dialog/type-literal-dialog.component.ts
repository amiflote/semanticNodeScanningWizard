import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppComponent } from 'src/app/app.component';
import { DbPediaService } from 'src/app/data-api/dbpedia.service';

export interface DialogChooseObject {
  objectUriSelected: string;
  name: string;
}

@Component({
  selector: 'app-type-literal-dialog',
  templateUrl: './type-literal-dialog.component.html',
  styleUrls: ['./type-literal-dialog.component.css']
})
export class TypeLiteralDialogComponent implements OnInit {

  title: string;
  relation: string;
  literal: string = '';

  constructor(
    public dialogRef: MatDialogRef<AppComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogChooseObject,
    private dbPediaService: DbPediaService) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.title = this.dbPediaService.subjectSelected;
    this.relation = this.dbPediaService.relationSelected;
  }

  onOkClick() {
    this.dbPediaService.literalTyped = this.literal;
  }
}
