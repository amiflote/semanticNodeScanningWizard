import { Component, OnInit } from '@angular/core';
import { DbPediaService } from '../data-api/dbpedia.service';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.css']
})
export class StartScreenComponent implements OnInit {
  
  value: string = 'Search concept';
  concepts: string[] = [];

  constructor(private dbPediaService: DbPediaService) { }

  ngOnInit(): void {
  }

  filterConcepts() {
    this.dbPediaService.getFilteredConcepts(this.value).subscribe(
      (data) => {
        this.concepts = data;
      }
    );
  }

}
