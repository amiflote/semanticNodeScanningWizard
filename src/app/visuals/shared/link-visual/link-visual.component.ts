import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { Link } from '../../../d3';
import { DataGraphService } from 'src/app/services/data-graph.service';

@Component({
  selector: '[linkVisual]',
  templateUrl: './link-visual.component.html',
  styleUrls: ['./link-visual.component.css']
})
export class LinkVisualComponent implements OnInit {
  @Input('linkVisual') link: Link;

  constructor(private dataGraphService: DataGraphService) { }

  ngOnInit(): void {
    // let source = this.dataGraphService.positions.find(n => n.name == this.link.source.name);
    // let target = this.dataGraphService.positions.find(n => n.name == this.link.target.name);

    // this.link.source.x = source.x;
    // this.link.source.y = source.y;
    // this.link.target.x = target.x;
    // this.link.target.y = target.y;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('Himaniac');
  }

  getXPositionName(): number {
    return (this.link.target.x + this.link.source.x)/2;
  }

  getYPositionName(): number {
    return (this.link.target.y + this.link.source.y)/2;
  }
}
