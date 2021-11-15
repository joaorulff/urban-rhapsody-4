import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ClusterTreeController } from './controller/cluster-tree.controller';

@Component({
  selector: 'app-cluster-tree',
  templateUrl: './cluster-tree.component.html',
  styleUrls: ['./cluster-tree.component.scss']
})
export class ClusterTreeComponent implements OnInit, AfterViewInit {

  // controller
  public clusterTreeController: ClusterTreeController = new ClusterTreeController();

  // outputs
  @Output('clusternodeselected') clusternodeselected: EventEmitter<{'uids': string[]}> = new EventEmitter<{'uids': string[]}>();

  // dom refs
  @ViewChild('chartcontainerref') chartcontainerref!: ElementRef;

  // inputs
  @Input('isloadingtree') isLoadingTree: boolean = false;
  @Input('clustertree') set clustertree( clusterTree: any ){
    if(clusterTree !== null ) this.clusterTreeController.update_tree( clusterTree );
  } 

  constructor() { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {

    // events
    const events: {} = {
      'clusternodeselected': this.clusternodeselected
    }

    // initializing chart
    this.clusterTreeController.initialize_controller( this.chartcontainerref.nativeElement, events );

  }

}