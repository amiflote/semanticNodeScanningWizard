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
  linkLabelRelated: string;

  constructor(private dbPediaService: DbPediaService,
    private dataGraphService: DataGraphService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (this.node.type != NodeType.ConceptoPrincipal)
      this.linkLabelRelated = this.dataGraphService.getLinkLabelRelatedWithNode(this.node.id);
  }

  onArrowClick() {
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
    } else if (this.node.type == NodeType.ConceptoPrincipal) {
      this.openChoosePropertyMainConceptDialog();
    } else if (this.node.type == NodeType.PropiedadConceptoPrincipal) {
      this.dataGraphService.hideNode(this.node.id);
      this.dbPediaService.getInstancePropertyValue();
    }
  }

  showDataBtn(): boolean {
    return this.node.type == NodeType.Concepto || this.node.type == NodeType.LiteralRelleno || this.node.type == NodeType.ConceptoPrincipal || this.node.type == NodeType.PropiedadConceptoPrincipal;
  }

  openChooseConceptDialog(): void {
    const dialogConfig = new MatDialogConfig<DialogChooseObject>();

    dialogConfig.panelClass = 'custom-dialog-container';

    dialogConfig.data = {
      title: 'Choose a concept of ' + this.linkLabelRelated,
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

    dialogConfig.panelClass = 'custom-dialog-container';

    dialogConfig.data = {
      title: 'Choose a property of ' + this.linkLabelRelated,
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
                this.dbPediaService.propertyConceptSelected = result[1];

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

    dialogConfig.panelClass = 'custom-dialog-container';

    dialogConfig.data = {
      title: 'Type a filter of ' + this.linkLabelRelated,
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

  openChoosePropertyMainConceptDialog(): void {
    const dialogConfig = new MatDialogConfig<DialogChooseObject>();

    dialogConfig.panelClass = 'custom-dialog-container';

    dialogConfig.data = {
      title: 'Choose a property of ' + this.node.label,
      type: DialogType.PickFromList
    };

    this.dbPediaService.getPropertyMainConceptList().subscribe(
      (response) => {
        if (response) {
          dialogConfig.data.values = response;

          const dialogRef = this.dialog.open(ChooseObjectDialogComponent, dialogConfig);

          dialogRef.afterClosed().subscribe(
            (result: [string, string]) => {
              if (result) {
                this.dbPediaService.propertyLabelMainConceptSelected = result[0];
                this.dbPediaService.propertyMainConceptSelected = result[1];

                let nuNode = this.dataGraphService.addNode(result[1], NodeType.PropiedadConceptoPrincipal, '');
                this.dataGraphService.addLink(this.node, nuNode, result[1], result[0]);
                this.dataGraphService.canRefreshGraph();
              }
            });
        }
      });
  }
}
