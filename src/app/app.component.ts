import { Component, OnInit } from '@angular/core';
import { Node, Link } from './d3';
import { DbPediaService } from './data-api/dbpedia.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  nodes: Node[] = [];
  links: Link[] = [];

  constructor(private dbpediaService: DbPediaService) {
    // const N = APP_CONFIG.N,
    //   getIndex = number => number - 1;

    // /** constructing the nodes array */
    // for (let i = 1; i <= N; i++) {
    //   this.nodes.push(new Node(i));
    // }

    // for (let i = 1; i <= N; i++) {
    //   for (let m = 2; i * m <= N; m++) {
    //     /** increasing connections toll on connecting nodes */
    //     this.nodes[getIndex(i)].linkCount++;
    //     this.nodes[getIndex(i * m)].linkCount++;

    //     /** connecting the nodes before starting the simulation */
    //     this.links.push(new Link(i, i * m));
    //   }
    // }
  }

  ngOnInit(): void {
    this.dbpediaService.getActorGraph().subscribe(
      (response) => {
        this.nodes = response.nodes;

        this.links = response.links;
      }
    );
  }
}
