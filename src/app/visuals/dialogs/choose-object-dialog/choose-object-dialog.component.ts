import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppComponent } from 'src/app/app.component';
import { DbPediaService } from 'src/app/data-api/dbpedia.service';

export interface DialogChooseObject {
  objectUriSelected: string;
  name: string;
}

@Component({
  selector: 'app-choose-object-dialog',
  templateUrl: './choose-object-dialog.component.html',
  styleUrls: ['./choose-object-dialog.component.css']
})
export class ChooseObjectDialogComponent implements OnInit {

  objects: string[] = [];
  title: string;
  relation: string;

  constructor(
    public dialogRef: MatDialogRef<AppComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogChooseObject,
    private dbPediaService: DbPediaService) {
    this.getObjectList();
    this.title = this.dbPediaService.subjectSelected;
    this.relation = this.dbPediaService.relationSelected;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
  }

  getObjectList() {
    this.dbPediaService.getObjectList().subscribe(
      (response) => {
        this.objects = response;
      }
    );
  }

  onOptionSelected(object) {
    // console.log(object);
    if (object)
      this.dbPediaService.objectInstanceSelected = object;
  }
}
