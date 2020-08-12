import { Component, Input, OnInit } from '@angular/core';
import { Node } from '../../../d3';
import { DbPediaService } from 'src/app/data-api/dbpedia.service';
import { DataGraphService } from 'src/app/services/data-graph.service';

@Component({
  selector: '[nodeVisual]',
  templateUrl: './node-visual.component.html',
  styleUrls: ['./node-visual.component.css']
})
export class NodeVisualComponent implements OnInit {
  @Input('nodeVisual') node: Node;

  constructor(private dbPediaService: DbPediaService,
    private dataGraphService: DataGraphService) { }

  ngOnInit(): void {
    // let node = this.dataGraphService.positions.find(n => n.name == this.node.name);

    // this.node.x = node.x;
    // this.node.y = node.y;
  }

  onArrowClick(){
    console.log("arrow clicked");

    this.dbPediaService.getRelations(this.node.name);

  }
}
