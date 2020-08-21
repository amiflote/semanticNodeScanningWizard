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
    //objectSelected: string;
    relationConceptSelected: string;
    propertyConceptSelected: string;
    literalTyped: string;
    language: string = 'EN';

    constructor(private http: HttpClient,
        private dataGraphService: DataGraphService) { }

    public getInstances(): void {
        this.http.get<any>('http://dbpedia.org/sparql?default-graph-uri=http://dbpedia.org&query=' + this.getInstancesQuery() + '&format=json&timeout=60000')
            .subscribe(
                (response) => {

                    let givenNode = this.dataGraphService.findNode(this.actorUri);

                    response.results.bindings.forEach(
                        (b) => {
                            let nuNode = this.dataGraphService.addNode(b.datanode.value, NodeType.Instance, b.label.value);
                            this.dataGraphService.addLink(nuNode, givenNode, 'rdf:type', 'tipo');
                        });

                    this.dataGraphService.canRefreshGraph();
                }
            );
    }

    public getObjectList(): Observable<Map<string,string>> {
        return this.http.get<any>('http://dbpedia.org/sparql?default-graph-uri=http://dbpedia.org&query=' + this.getObjectListQuery() + '&format=json&timeout=60000')
            .pipe(map(
                (data) => {
                    let objects = new Map();

                    data.results.bindings.forEach(
                        (o) => {
                            objects.set(o.label.value, o.concept.value);
                        }
                    );

                    return objects;
                }
            ));
    }

    public getPropertyList(): Observable<Map<string, string>> {
        return this.http.get<any>('http://dbpedia.org/sparql?default-graph-uri=http://dbpedia.org&query=' + this.getPropertyListQuery() + '&format=json&timeout=60000')
            .pipe(map(
                (data) => {
                    let properties = new Map();

                    data.results.bindings.forEach(
                        (b) => {
                            properties.set(b.property.value, 'b.label.value');
                        }
                    );

                    return properties;
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

    public addActorNode(): void {
        this.dataGraphService.addNode(this.actorUri, NodeType.ConceptoPrincipal, 'actor');
        this.dataGraphService.canRefreshGraph();

        //return this.dataGraphService.findNode(this.actorUri);
    }

    public getRelations(uriNode: string): void {
        this.http.get<any>('http://dbpedia.org/sparql?default-graph-uri=http://dbpedia.org&query=' + this.getRelationsGivenUriNodeQuery(uriNode) + '&format=json&timeout=60000')
            .subscribe(
                (response) => {

                    let givenNode = this.dataGraphService.findNode(uriNode);

                    response.results.bindings.forEach(
                        (b) => {
                            let nuNode = this.dataGraphService.addNode(b.relation.value, NodeType.SinExplorar, b.label.value);
                            this.dataGraphService.addLink(givenNode, nuNode, b.relation.value, b.label.value);
                        });

                    this.dataGraphService.canRefreshGraph();
                }
            );
    }

    public getIntancesCount(): void {
        this.http.get<any>('http://dbpedia.org/sparql?default-graph-uri=http://dbpedia.org&query=' + this.getNumberOfInstancesQuery() + '&format=json&timeout=60000')
            .subscribe(
                (response) => {

                    let actorNode = this.dataGraphService.findNode(this.actorUri);

                    response.results.bindings.forEach(
                        (b) => {
                            let nodeId = this.dataGraphService.nextNodeId();
                            let nodeName = nodeId + '/' + b.count.value;
                            let nuNode = this.dataGraphService.addNode(nodeName, NodeType.InstanceCount, b.count.value + ' instances');
                            this.dataGraphService.addLink(actorNode, nuNode, 'rdf:type', 'type');
                        });

                    this.dataGraphService.canRefreshGraph();
                }
            );
    }

    private getObjectListQuery(): string {
        return 'select distinct ?concept ?label where { ?actor a ' + encodeURIComponent('<' + this.actorUri + '>') + ' . ?actor ' + encodeURIComponent('<' + this.relationSelected + '>') + ' ?object . ?object a ?concept. ?concept rdfs:label ?label . FILTER langMatches(lang(?label),"' + this.language +'") } LIMIT 5'
    }

    private getPropertyListQuery(): string {
        // return 'select distinct ?property ?label where { ?datanode ' + encodeURIComponent('<' + this.relationSelected + '>') + ' ?anotherdatanode. ?anotherdatanode a' + encodeURIComponent('<' + this.relationConceptSelected + '>') + '. ?datanode a ' + encodeURIComponent('<' + this.actorUri + '>') + '. ?anotherdatanode ?property ?value. FILTER isLiteral(?value). ?property rdfs:label ?label . FILTER langMatches(lang(?label),"' + this.language +'") } LIMIT 5'
        return 'select distinct ?property where { ?datanode ' + encodeURIComponent('<' + this.relationSelected + '>') + ' ?anotherdatanode. ?anotherdatanode a' + encodeURIComponent('<' + this.relationConceptSelected + '>') + '. ?datanode a ' + encodeURIComponent('<' + this.actorUri + '>') + '. ?anotherdatanode ?property ?value. FILTER isLiteral(?value) } LIMIT 5'
    }

    // private getActorInstancesQuery(): string {
    //     return 'select distinct ?actor where { ?actor a ' + encodeURIComponent('<' + this.actorUri + '>') + ' . ?actor ' + encodeURIComponent('<' + this.relationSelected + '>') + ' ' + encodeURIComponent('<' + this.objectSelected + '>') + ' } LIMIT 1000'
    // }

    private getFilteredConceptsQuery(filter: string): string {
        return 'select distinct ?concept ?label where { ?x rdf:type ?concept. FILTER regex(?concept, "' + filter + '", "i"). ?concept rdfs:label ?label . FILTER langMatches(lang(?label),"' + this.language +'") } LIMIT 100';
    }

    private getRelationsGivenUriNodeQuery(uriNode: string): string {
        return 'select distinct ?relation ?label where { ?nodex ?relation ?nodey. ?nodey a ?concept. ?nodex a ' + encodeURIComponent('<' + uriNode + '>') + '. ?relation rdfs:label ?label . FILTER langMatches(lang(?label),"' + this.language +'")} LIMIT 5';
    }

    private getNumberOfInstancesQuery(): string {
        return 'select count (distinct *) as ?count where { ?datanode ' + encodeURIComponent('<' + this.relationSelected + '>') + ' ?anotherdatanode. ?anotherdatanode a ' + encodeURIComponent('<' + this.relationConceptSelected + '>') + '. ?datanode a ' + encodeURIComponent('<' + this.actorUri + '>') + '. ?anotherdatanode ' + encodeURIComponent('<' + this.propertyConceptSelected + '>') + ' ?value. FILTER regex(?value, "' + this.literalTyped + '", "i"). ?datanode rdfs:label ?label . FILTER langMatches(lang(?label),"' + this.language +'") }'
    }

    private getInstancesQuery(): string {
        return 'select distinct ?datanode ?label where { ?datanode ' + encodeURIComponent('<' + this.relationSelected + '>') + ' ?anotherdatanode. ?anotherdatanode a' + encodeURIComponent('<' + this.relationConceptSelected + '>') + '. ?datanode a ' + encodeURIComponent('<' + this.actorUri + '>') + '. ?anotherdatanode ' + encodeURIComponent('<' + this.propertyConceptSelected + '>') + ' ?value. FILTER regex(?value, "' + this.literalTyped + '", "i"). ?datanode rdfs:label ?label . FILTER langMatches(lang(?label),"' + this.language +'") }'
    }
}