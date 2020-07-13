import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { SparqlService } from './services/sparql.service';
import { Concept } from './models/query-json-response.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sparqlQueryEditor';
  concepts: Concept[];
  @Input() page = 1;
  pageSize = 50;
  conceptsCount: number;

  constructor(private sparql: SparqlService) {
    this.sparql.getCountConcepts().subscribe((data) => {
      this.conceptsCount = data;
    });
    
    this.sparql.getConcepts(this.page, this.pageSize).subscribe((data) => {
       this.concepts = data;
    });
  }

  getConcepts() {
    this.sparql.getConcepts(this.page, this.pageSize).subscribe((data) => {
      this.concepts = data;
   });
  }

  onPaginationChange() {
    this.getConcepts();
  }  
}
