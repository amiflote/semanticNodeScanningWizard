import { Component, OnInit } from '@angular/core';
import { DbPediaService } from '../data-api/dbpedia.service';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.css']
})
export class StartScreenComponent implements OnInit {

  value: string;
  concepts: string[];

  events: string[] = [];
  opened: boolean = true;
  endpoints: string[] = ['https://dbpedia.org/sparql/'];
  endpointSelected: string;
  languages: string[] = ['EN', 'ES'];
  loading: boolean = false;
  showAddEndpointInput: boolean = false;
  newEndpoint: string;
  conceptSelected: string;

  constructor(private dbPediaService: DbPediaService) { }

  ngOnInit(): void {
  }

  filterConcepts() {
    this.concepts = null;
    this.loading = true;
    this.dbPediaService.getFilteredConcepts(this.value).subscribe(
      (data) => {
        this.loading = false;
        this.concepts = data;
      }
    );
  }

  toggleAddEndpointInput(): void {
    this.showAddEndpointInput = !this.showAddEndpointInput;
  }

  addEndpointButton(): void {
    if (this.newEndpoint) {
      this.endpoints.push(this.newEndpoint);
      this.newEndpoint = null;
      this.showAddEndpointInput = false;
    }
  }

  selectConcept(concept: string): void {
    if (concept) {
      this.conceptSelected = concept;
    }
  }

  startGraph(): void {

  }
}
