import { Component } from '@angular/core';
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

  constructor(private sparql: SparqlService){
    this.sparql.getConcepts().subscribe((data) => {
       this.concepts = data;
    });
  }

  
}
