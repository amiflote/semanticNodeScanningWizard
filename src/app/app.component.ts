import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { SparqlService } from './services/sparql.service';
import { Concept } from './models/query-json-response.model';
import { Relation } from './models/relation-query-json-response.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sparqlQueryEditor';
  graphs: string[];
  concepts: Concept[];
  relations: Relation[];
  paso = 1;
  graphsPage = 1;
  conceptsPage = 1;
  relationsPage = 1;
  pageSize = 50;
  graphsCount: number;
  conceptsCount: number;
  relationsCount: number;
  graphSelected: string = null;
  conceptSelected: string = null;
  query: string = '';
  html: any = '';

  constructor(private sparql: SparqlService) {
    // this.sparql.getGraphsCount().subscribe((count) => {
    //   this.graphsCount = count;
    // });

    this.sparql.getGraphs(this.conceptsPage, this.pageSize).subscribe((graphs) => {
       this.graphs = graphs;
    });
  }

  getGraphs() {
    this.sparql.getGraphs(this.graphsPage, this.pageSize).subscribe((graphs) => {
      this.graphs = graphs;
    });
  }

  getConcepts() {
    this.sparql.getConcepts(this.graphSelected, this.conceptsPage, this.pageSize).subscribe((concepts) => {
      this.concepts = concepts;
   });
  }

  getRelations() {
    this.sparql.getRelations(this.graphSelected, this.conceptSelected, this.relationsPage, this.pageSize).subscribe((relations) => {
      this.relations = relations;
    });
  }

  getConceptsCount() {
    this.sparql.getCountConcepts().subscribe((count) => {
      this.conceptsCount = count;
    });
  }

  getRelationsCount() {
    this.sparql.getCountRelations(this.graphSelected, this.conceptSelected).subscribe((count) => {
      this.relationsCount = count;
    });
  }

  getSparqlQueryAsHtml(): any {
    console.log('hola');
    this.sparql.getSparqlQueryAsHtml(this.query).subscribe(
      (html) => {
        this.html = html;
      }
    )
  }

  setQuery(text: any) {
    this.query = text.srcElement.value;
  }

  onGraphPaginationChange() {
    this.getGraphs();
  }

  onConceptPaginationChange() {
    this.getConcepts();
  }

  onRelationPaginationChange() {
    this.getRelations();
  }
  
  selectGraph(graph: string) {
    this.graphSelected = graph ? graph : null;
    this.getConcepts();
    this.getConceptsCount();
    this.paso = 2;
  }

  selectConcept(concept: string) {
    this.conceptSelected = concept ? concept : null;
    this.getRelations();
    this.getRelationsCount();
    this.paso = 3;
  }
}
