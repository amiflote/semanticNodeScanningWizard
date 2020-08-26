import { Link, Node, NodeType, NodeState } from '../d3/models';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';


@Injectable()
export class DataGraphService {
    nodes: Node[] = [];
    links: Link[] = [];

    private idCounter: number = 1;
    private refreshGraph$ = new Subject<boolean>(); 

    nextNodeId(): number {
        return this.idCounter;
    }

    addNode(name: string, type: NodeType, label: string): Node {
        let nuNode = new Node(this.idCounter, type, name, label);
        this.nodes.push(nuNode);
        this.idCounter++;
        return nuNode;
    }

    findNode(name: string): Node {
        return this.nodes.find(n => n.name == name);
    }

    findLink(name: string): Link {
        return this.links.find(l => l.name == name);
    }
    
    addLink(source: Node, target: Node, name: string, label: string): Link {
        let nuLink = new Link(source, target, name, label);
        source.linkCount++;
        target.linkCount++;
        this.links.push(nuLink);
        return nuLink;
    }

    copyLinkWithMainConcept(target: Node, refNode: Node): Link {
        let mainNode = this.nodes.find(n => n.type == NodeType.ConceptoPrincipal);
        let link = this.links.find(l => l.target.id == refNode.id);
        return this.addLink(mainNode, target, link.name, link.label);
    }

    canRefreshGraph() {
        this.refreshGraph$.next(true);
    }

    getRefreshGraph$(): Observable<boolean> {
        return this.refreshGraph$.asObservable();
    }

    anyData(): boolean {
        return this.nodes.length > 0;
    }

    hideNode(id: string): void {
        this.nodes.find(n => n.id == id).state = NodeState.Oculto;
    }

    getLinkLabelRelatedWithNode(nodeId: string) {
        return this.links.find(n => n.source.id == nodeId || n.target.id == nodeId).label;
    }

    getRelationNameWithMainConcept(node: Node) {
        let link = this.links.find(l => l.target.id == node.id && l.source.type == NodeType.ConceptoPrincipal);
        return link.name;
    }
}