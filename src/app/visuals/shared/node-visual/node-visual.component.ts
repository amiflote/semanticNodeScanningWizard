import { Component, Input, OnInit } from '@angular/core';
import { Node, NodeType, NodeState } from '../../../d3';
import { DbPediaService } from 'src/app/data-api/dbpedia.service';
import { DataGraphService } from 'src/app/services/data-graph.service';
import { MatDialog } from '@angular/material/dialog';
import { ChooseObjectDialogComponent } from '../../dialogs/choose-object-dialog/choose-object-dialog.component';

@Component({
  selector: '[nodeVisual]',
  templateUrl: './node-visual.component.html',
  styleUrls: ['./node-visual.component.css']
})
export class NodeVisualComponent implements OnInit {
  @Input('nodeVisual') node: Node;

  constructor(private dbPediaService: DbPediaService,
    private dataGraphService: DataGraphService,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    // let node = this.dataGraphService.positions.find(n => n.name == this.node.name);

    // this.node.x = node.x;
    // this.node.y = node.y;
  }

  onArrowClick(){
    console.log("arrow clicked");

    this.dbPediaService.getRelations(this.node.name);
    this.node.state = NodeState.Expandido;
  }

  showArrow(): boolean {
    return this.node.type == NodeType.Concepto && this.node.state != NodeState.Expandido;
  }

  selectNode(node: Node): void {

    this.dbPediaService.relationSelected = node.name;

    const dialogRef = this.dialog.open(ChooseObjectDialogComponent, {
      width: '500px',
      height: '100px',
      data: { name: 'name', animal: 'animal' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.dbPediaService.objectInstanceSelected) {
        this.dataGraphService.findNode(this.node.name).name = this.dbPediaService.objectInstanceSelected;

        //this.node.name = this.dbPediaService.objectInstanceSelected;
        //this.node.state = NodeState.
        this.dataGraphService.canRefreshGraph();
        // this.dbPediaService.getActorsGraphQueried().subscribe(
        //   (data) => {
        //     // this.links = data.links;
        //     // this.nodes = data.nodes;

        //     this.initializeGraph();
        //   }
        // );
      }
    });
  }
}
