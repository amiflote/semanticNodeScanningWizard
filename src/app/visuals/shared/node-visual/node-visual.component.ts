import { Component, Input, OnInit } from '@angular/core';
import { Node, NodeType, NodeState } from '../../../d3';
import { DbPediaService } from 'src/app/data-api/dbpedia.service';
import { DataGraphService } from 'src/app/services/data-graph.service';
import { MatDialog } from '@angular/material/dialog';
import { ChooseObjectDialogComponent } from '../../dialogs/choose-object-dialog/choose-object-dialog.component';
import { ChoosePropertyDialogComponent } from '../../dialogs/choose-property-dialog/choose-property-dialog.component';
import { TypeLiteralDialogComponent } from '../../dialogs/type-literal-dialog/type-literal-dialog.component';

@Component({
  selector: '[nodeVisual]',
  templateUrl: './node-visual.component.html',
  styleUrls: ['./node-visual.component.css']
})
export class NodeVisualComponent implements OnInit {
  @Input('nodeVisual') node: Node;
  literal: string = '';

  constructor(private dbPediaService: DbPediaService,
    private dataGraphService: DataGraphService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // let node = this.dataGraphService.positions.find(n => n.name == this.node.name);

    // this.node.x = node.x;
    // this.node.y = node.y;
  }

  onArrowClick() {
    console.log("arrow clicked");

    this.dbPediaService.getRelations(this.node.name);
    this.node.state = NodeState.Expandido;
  }

  showArrow(): boolean {
    return this.node.type == NodeType.Concepto && this.node.state != NodeState.Expandido;
  }

  selectNode(node: Node): void {

    if (node.type != NodeType.Literal && node.type != NodeType.InstanceCount) {

      this.dbPediaService.relationSelected = node.name;

      const dialogRef = this.dialog.open(ChooseObjectDialogComponent, {
        width: '500px',
        height: '100px',
        data: { name: 'name', animal: 'animal' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (this.dbPediaService.relationConceptSelected) {
          this.dataGraphService.findNode(this.node.name).name = this.dbPediaService.relationConceptSelected;
          this.dataGraphService.canRefreshGraph();
        }
      });
    }
    else if (node.type == NodeType.Literal) {
      const dialogRef = this.dialog.open(TypeLiteralDialogComponent, {
        width: '500px',
        height: '100px',
        data: { name: 'name', animal: 'animal' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (this.dbPediaService.literalTyped) {
          this.dataGraphService.findNode(this.node.name).name = this.dbPediaService.literalTyped;
          this.dataGraphService.canRefreshGraph();
        }
      });
    }
    else if (node.type == NodeType.InstanceCount) {
      this.dataGraphService.hideNode(node.id);
      this.dbPediaService.getInstances();
    }
  }

  selectDataNode(node: Node): void {

    if (node.type != NodeType.Literal) {

      const dialogRef = this.dialog.open(ChoosePropertyDialogComponent, {
        width: '500px',
        height: '100px',
        data: { name: 'name', animal: 'animal' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (this.dbPediaService.propertyConceptSelected) {

          let nuNode = this.dataGraphService.addNode(this.dbPediaService.propertyConceptSelected, NodeType.Literal);
          this.dataGraphService.addLink(this.node, nuNode, nuNode.name);

          this.dataGraphService.canRefreshGraph();

        }
      });
    }
    else {
      if (this.dbPediaService.literalTyped)
        this.dbPediaService.getNumberOfInstances();
    }
  }
}
