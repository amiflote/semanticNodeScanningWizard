import { Component, OnInit } from '@angular/core';
import { Node, Link } from './d3';
import { DbPediaService } from './data-api/dbpedia.service';
import { DataGraphService } from './services/data-graph.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  nodes: Node[] = [];
  links: Link[] = [];

  initGraph: boolean = false;

  constructor(private dbpediaService: DbPediaService,
    public dataGraphService: DataGraphService) { }

  ngOnInit(): void {
    this.nodes = this.dataGraphService.nodes;
    this.links = this.dataGraphService.links;
  }

  onReady() {
    // this.dbpediaService.addActorNode();
    this.initGraph = true;
  }
}
