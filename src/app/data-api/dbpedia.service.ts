import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ActorGraphReponse } from './models/actor-graph.model';
import { Node, Link, NodeType } from 'src/app/d3';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataGraphService } from '../services/data-graph.service';

@Injectable()
export class DbPediaService {

    // Private fields
    private actorUri = 'http://dbpedia.org/ontology/Actor';
    private actorGraphQuery = 'select distinct ?relation ?objectType where { ?actor a ' + encodeURIComponent('<' + this.actorUri + '>') + ' . ?actor ?relation ?object . ?object a ?objectType } LIMIT 100'

    // Public fields
    subjectSelected: string = 'Actor';
    relationSelected: string;
    objectSelected: string;
    objectInstanceSelected: string;

    constructor(private http: HttpClient,
        private dataGraphService: DataGraphService) { }

    // public getActorGraph(): Observable<ActorGraphReponse> {
    //     return this.http.get<any>('http://dbpedia.org/sparql?default-graph-uri=http://dbpedia.org&query=' + this.actorGraphQuery + '&format=json')
    //         .pipe(map(
    //             (data) => {
    //                 let response: ActorGraphReponse = new ActorGraphReponse();

    //                 let actorNode = new Node(1, this.actorUri);

    //                 response.nodes.push(actorNode);

    //                 data.results.bindings.forEach(
    //                     b => {
    //                         let nuNode = new Node(response.nodes.length + 1, b.objectType.value);

    //                         response.nodes.push(nuNode);

    //                         response.nodes[0].linkCount++;
    //                         response.nodes[response.nodes.length - 1].linkCount++;

    //                         response.links.push(new Link(response.nodes[0], response.nodes[response.nodes.length - 1], b.relation.value));
    //                     }
    //                 );

    //                 return response;
    //             }
    //         ));
    // }

    public getObjectList(): Observable<string[]> {
        return this.http.get<any>('http://dbpedia.org/sparql?default-graph-uri=http://dbpedia.org&query=' + this.getObjectListQuery() + '&format=json&timeout=60000')
            .pipe(map(
                (data) => {
                    let objects: string[] = [];

                    data.results.bindings.forEach(
                        (o) => {
                            objects.push(o.concept.value);
                        }
                    );

                    return objects;
                }
            ));
    }

    // public getActorsGraphQueried(): Observable<ActorGraphReponse> {
    //     return this.http.get<any>('http://dbpedia.org/sparql?default-graph-uri=http://dbpedia.org&query=' + this.getActorInstancesQuery() + '&format=json')
    //         .pipe(map(
    //             (data) => {
    //                 let response: ActorGraphReponse = new ActorGraphReponse();

    //                 let actorNode = new Node(1, this.actorUri);

    //                 response.nodes.push(actorNode);

    //                 let objectNode = new Node(2, this.objectSelected);

    //                 response.nodes.push(objectNode);

    //                 response.nodes[0].linkCount++;
    //                 response.nodes[1].linkCount++;

    //                 response.links.push(new Link(response.nodes[0], response.nodes[1], this.relationSelected));

    //                 data.results.bindings.forEach(
    //                     b => {
    //                         let nuNode = new Node(response.nodes.length + 1, b.actor.value);

    //                         response.nodes.push(nuNode);

    //                         response.nodes[0].linkCount++;
    //                         response.nodes[response.nodes.length - 1].linkCount++;

    //                         response.links.push(new Link(response.nodes[0], response.nodes[response.nodes.length - 1], 'a'));

    //                         response.nodes[1].linkCount++;
    //                         response.nodes[response.nodes.length - 1].linkCount++;

    //                         response.links.push(new Link(response.nodes[1], response.nodes[response.nodes.length - 1], this.relationSelected));
    //                     }
    //                 );

    //                 return response;
    //             }
    //         ));
    // }

    public getFilteredConcepts(filter: string): Observable<string[]> {
        return this.http.get<any>('http://dbpedia.org/sparql?default-graph-uri=http://dbpedia.org&query=' + this.getFilteredConceptsQuery(filter) + '&format=json&timeout=60000')
            .pipe(map(
                (data) => {
                    let concepts: string[] = [];

                    data.results.bindings.forEach(
                        (b) => {
                            concepts.push(b.concept.value);
                        }
                    );

                    return concepts;
                }
            ));
    }

    public getActorNode(): Node {
        this.dataGraphService.addNode(this.actorUri, NodeType.Concepto);
        //this.dataGraphService.canRefreshGraph();

        return this.dataGraphService.findNode(this.actorUri);
    }

    public getRelations(uriNode: string): void {
        this.http.get<any>('http://dbpedia.org/sparql?default-graph-uri=http://dbpedia.org&query=' + this.getRelationsGivenUriNodeQuery(uriNode) + '&format=json&timeout=60000')
            .subscribe(
                (response) => {

                    let givenNode = this.dataGraphService.findNode(uriNode);

                    response.results.bindings.forEach(
                        (b) => {
                            let nuNode = this.dataGraphService.addNode(b.relation.value, NodeType.Expansible);
                            this.dataGraphService.addLink(givenNode, nuNode, b.relation.value);
                        });

                    this.dataGraphService.canRefreshGraph();
                }
            );
    }

    private getObjectListQuery(): string {
        return 'select distinct ?concept where { ?actor a ' + encodeURIComponent('<' + this.actorUri + '>') + ' . ?actor ' + encodeURIComponent('<' + this.relationSelected + '>') + ' ?object . ?object a ?concept } LIMIT 5'
    }

    private getActorInstancesQuery(): string {
        return 'select distinct ?actor where { ?actor a ' + encodeURIComponent('<' + this.actorUri + '>') + ' . ?actor ' + encodeURIComponent('<' + this.relationSelected + '>') + ' ' + encodeURIComponent('<' + this.objectSelected + '>') + ' } LIMIT 1000'
    }

    private getFilteredConceptsQuery(filter: string) {
        return 'select distinct ?concept where { ?x rdf:type ?concept. FILTER regex(?concept, "' + filter + '", "i") } LIMIT 100';
    }

    private getRelationsGivenUriNodeQuery(uriNode: string) {
        return 'select distinct ?relation where { ?nodex ?relation ?nodey. ?nodey a ?concept. ?nodex a ' + encodeURIComponent('<' + uriNode + '>') + '} LIMIT 5';
    }
}