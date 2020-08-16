import { Component, Input, ChangeDetectorRef, HostListener, ChangeDetectionStrategy, OnInit, AfterViewInit, Injectable, OnChanges, SimpleChanges } from '@angular/core';
import { D3Service, ForceDirectedGraph, Link, Node } from '../../d3';
import { MatDialog } from '@angular/material/dialog';
import { ChooseObjectDialogComponent } from '../dialogs/choose-object-dialog/choose-object-dialog.component';
import { DbPediaService } from 'src/app/data-api/dbpedia.service';
import { DataGraphService } from 'src/app/services/data-graph.service';

@Component({
  selector: 'graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
@Injectable(
  {
    providedIn: 'root'
  }
)
export class GraphComponent implements OnInit, AfterViewInit {
  @Input('nodes') nodes;
  @Input('links') links;
  graph: ForceDirectedGraph;
  _options: { width, height } = { width: 800, height: 600 };

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.graph.initSimulation(this.options);
  }

  constructor(private d3Service: D3Service,
    private ref: ChangeDetectorRef,
    public dialog: MatDialog,
    private dbPediaService: DbPediaService,
    private dataGraphService: DataGraphService) { }

  ngOnInit() {
    // this.dbPediaService.getActorNode();
    this.initializeGraph();

    this.dataGraphService.getRefreshGraph$().subscribe(
      () => {
        // this.initializeGraph();
        // this.graph.updateLinks(this.links);
        this.graph.initNodes();
        this.graph.initLinks();
      }
    )
  }

  ngAfterViewInit() {
    // this.graph.initSimulation(this.options);
  }

  get options() {
    return this._options = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  initializeGraph() {
    /** Receiving an initialized simulated graph from our custom d3 service */
    this.graph = this.d3Service.getForceDirectedGraph(this.nodes, this.links, this.options);

    /** Binding change detection check on each tick
     * This along with an onPush change detection strategy should enforce checking only when relevant!
     * This improves scripting computation duration in a couple of tests I've made, consistently.
     * Also, it makes sense to avoid unnecessary checks when we are dealing only with simulations data binding.
     */
    this.graph.ticker.subscribe((d) => {
      this.ref.markForCheck();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.graph) {
      this.initializeGraph();
    }
  }

  // selectRelation(link: Link) {
  //   console.log(link);

  //   this.dbPediaService.relationSelected = link.name;
  //   this.dbPediaService.objectSelected = link.target.name;

  //   const dialogRef = this.dialog.open(ChooseObjectDialogComponent, {
  //     width: '500px',
  //     height: '100px',
  //     data: { name: 'name', animal: 'animal' }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (this.dbPediaService.objectInstanceSelected) {
  //       // this.dbPediaService.getActorsGraphQueried().subscribe(
  //       //   (data) => {
  //       //     // this.links = data.links;
  //       //     // this.nodes = data.nodes;

  //       //     this.initializeGraph();
  //       //   }
  //       // );
  //     }
  //   });
  // }

  // anyData(): boolean {
  //   let result;
  //   this.graph ? result = true : result = false;
  //   return result 
  // }
}
