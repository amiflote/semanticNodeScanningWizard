import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppComponent } from 'src/app/app.component';
import { DbPediaService } from 'src/app/data-api/dbpedia.service';

export interface DialogChooseObject {
  objectUriSelected: string;
  name: string;
}

@Component({
  selector: 'app-choose-property-dialog',
  templateUrl: './choose-property-dialog.component.html',
  styleUrls: ['./choose-property-dialog.component.css']
})
export class ChoosePropertyDialogComponent implements OnInit {

  properties: string[] = [];
  title: string;
  relation: string;

  constructor(
    public dialogRef: MatDialogRef<AppComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogChooseObject,
    private dbPediaService: DbPediaService) {
    this.getPropertyList();
    this.title = this.dbPediaService.subjectSelected;
    this.relation = this.dbPediaService.relationSelected;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
  }

  getPropertyList() {
    this.dbPediaService.getPropertyList().subscribe(
      (response) => {
        this.properties = response;
      }
    );
  }

  onOptionSelected(relation) {
    // console.log(object);
    if (relation)
      this.dbPediaService.propertyConceptSelected = relation;
  }
}
