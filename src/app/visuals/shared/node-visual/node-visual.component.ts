import { Component, Input, OnInit } from '@angular/core';
import { Node, NodeType, NodeState } from '../../../d3';
import { DbPediaService } from 'src/app/data-api/dbpedia.service';
import { DataGraphService } from 'src/app/services/data-graph.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChooseObjectDialogComponent, DialogChooseObject, DialogType } from '../../dialogs/choose-object-dialog/choose-object-dialog.component';

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

  ngOnInit(): void { }

  onArrowClick() {
    console.log("arrow clicked");

    this.dbPediaService.getRelations(this.node.name);
    this.node.state = NodeState.Expandido;
  }

  showArrow(): boolean {
    return this.node.type == NodeType.ConceptoPrincipal;
  }

  selectNode(): void {

    if (this.node.type == NodeType.SinExplorar) {
      this.dbPediaService.relationSelected = this.node.name;
      this.openChooseConceptDialog();
    } else if (this.node.type == NodeType.LiteralVacio) {
      this.openTypeFilterDialog();
    } else if (this.node.type == NodeType.InstanceCount) {
      this.dataGraphService.hideNode(this.node.id);
      this.dbPediaService.getInstances();
    }
  }

  selectDataNode(): void {

    if (this.node.type == NodeType.Concepto) {
      this.openChoosePropertyDialog();
    } else if (this.node.type == NodeType.LiteralRelleno) {
      this.dbPediaService.getIntancesCount();
    }
  }

  showDataBtn(): boolean {
    return this.node.type == NodeType.Concepto || this.node.type == NodeType.LiteralRelleno;
  }

  openChooseConceptDialog(): void {
    const dialogConfig = new MatDialogConfig<DialogChooseObject>();

    dialogConfig.width = '500px';
    dialogConfig.height = '300px';

    dialogConfig.data = {
      description: 'test',
      title: 'test',
      type: DialogType.PickFromList
    };

    this.dbPediaService.getObjectList().subscribe(
      (response) => {
        if (response) {
          dialogConfig.data.values = response;

          const dialogRef = this.dialog.open(ChooseObjectDialogComponent, dialogConfig);

          dialogRef.afterClosed().subscribe(
            (result: [string, string]) => {
              if (result) {
                let nodeToModify = this.dataGraphService.findNode(this.node.name);
                nodeToModify.label = result[0];
                nodeToModify.name = result[1];
                nodeToModify.type = NodeType.Concepto;
                this.dbPediaService.relationConceptSelected = result[1];
                this.dataGraphService.canRefreshGraph();
              }
            });
        }
      });
  }

  openChoosePropertyDialog(): void {
    const dialogConfig = new MatDialogConfig<DialogChooseObject>();

    dialogConfig.width = '500px';
    dialogConfig.height = '100px';

    dialogConfig.data = {
      description: 'test',
      title: 'test',
      type: DialogType.PickFromList
    };

    this.dbPediaService.getPropertyList().subscribe(
      (response) => {
        if (response) {
          dialogConfig.data.values = response;

          const dialogRef = this.dialog.open(ChooseObjectDialogComponent, dialogConfig);

          dialogRef.afterClosed().subscribe(
            (result: [string, string]) => {
              if (result) {
                this.dbPediaService.propertyConceptSelected = result[0];

                let nuNode = this.dataGraphService.addNode(result[1], NodeType.LiteralVacio, '');
                this.dataGraphService.addLink(this.node, nuNode, result[1], result[0]);
                this.dataGraphService.canRefreshGraph();
              }
            });
        }
      });
  }

  showCircle(): boolean {
    return this.node.type != NodeType.LiteralVacio;
  }

  openTypeFilterDialog(): void {
    const dialogConfig = new MatDialogConfig<DialogChooseObject>();

    dialogConfig.width = '500px';
    dialogConfig.height = '100px';

    dialogConfig.data = {
      description: 'test',
      title: 'test',
      type: DialogType.TypeValue
    };

    const dialogRef = this.dialog.open(ChooseObjectDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (result: string) => {
        if (result) {
          this.dbPediaService.literalTyped = result;

          this.node.label = result;
          this.node.type = NodeType.LiteralRelleno;
          this.dataGraphService.canRefreshGraph();
        }
      });
  }

  showNode(): boolean {
    return this.node.state != NodeState.Oculto;
  }
}
