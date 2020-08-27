import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NodeType } from 'src/app/d3';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DataGraphService } from './data-graph.service';

@Injectable()
export class DbPediaService {

    // Private fields
    private queryLimit = 25;
    private loading$ = new Subject<boolean>();


    // Public fields

    endpoint: string = 'https://dbpedia.org/sparql';
    language: string = 'EN';

    mainConceptUri;
    relationSelected: string;
    relationConceptSelected: string;
    propertyConceptSelected: string;
    propertyMainConceptSelected: string;
    propertyLabelMainConceptSelected: string;
    literalTyped: string;



    constructor(private http: HttpClient,
        private dataGraphService: DataGraphService) { }


    public getLoading$(): Observable<boolean> {
        return this.loading$.asObservable();
    }

    public getInstances(): void {
        this.setLoading(true);
        this.http.get<any>(this.endpoint + '?default-graph-uri=http://dbpedia.org&query=' + this.getInstancesQuery() + '&format=json&timeout=60000')
            .subscribe(
                (response) => {

                    let givenNode = this.dataGraphService.findNode(this.mainConceptUri);

                    response.results.bindings.forEach(
                        (b) => {
                            let nuNode = this.dataGraphService.addNode(b.datanode.value, NodeType.Instance, b.label.value);
                            this.dataGraphService.addLink(nuNode, givenNode, 'rdf:type', 'tipo');
                        });

                    this.dataGraphService.canRefreshGraph();
                    this.setLoading(false);
                }
            );
    }

    public getObjectList(): Observable<Map<string, string>> {
        this.setLoading(true);
        return this.http.get<any>(this.endpoint + '?default-graph-uri=http://dbpedia.org&query=' + this.getObjectListQuery() + '&format=json&timeout=60000')
            .pipe(map(
                (data) => {
                    let objects = new Map();

                    data.results.bindings.forEach(
                        (o) => {
                            objects.set(o.label.value, o.concept.value);
                        }
                    );

                    this.setLoading(false);

                    return objects;
                }
            ));
    }

    public getPropertyList(): Observable<Map<string, string>> {
        this.setLoading(true);
        return this.http.get<any>(this.endpoint + '?default-graph-uri=http://dbpedia.org&query=' + this.getPropertyListQuery() + '&format=json&timeout=60000')
            .pipe(map(
                (data) => {
                    let properties = new Map();

                    data.results.bindings.forEach(
                        (b) => {
                            properties.set(this.getDisplayLabel(b.property.value), b.property.value);
                        }
                    );

                    this.setLoading(false);
                    
                    return properties;
                }
            ));
    }

    public getFilteredConcepts(filter: string): Observable<Map<string, string>> {
        this.setLoading(true);
        return this.http.get<any>(this.endpoint + '?default-graph-uri=http://dbpedia.org&query=' + this.getFilteredConceptsQuery(filter) + '&format=json&timeout=60000')
            .pipe(map(
                (data) => {
                    let concepts = new Map();

                    data.results.bindings.forEach(
                        (b) => {
                            concepts.set(b.label.value, b.concept.value);
                        }
                    );
                    
                    this.setLoading(false);

                    return concepts;
                }
            ));
    }

    public addMainNode(pair: [string, string]): void {
        this.mainConceptUri = pair[1];
        this.dataGraphService.addNode(pair[1], NodeType.ConceptoPrincipal, pair[0]);
    }

    public getRelations(uriNode: string): void {
        this.setLoading(true);
        this.http.get<any>(this.endpoint + '?default-graph-uri=http://dbpedia.org&query=' + this.getRelationsGivenUriNodeQuery(uriNode) + '&format=json&timeout=60000')
            .subscribe(
                (response) => {

                    let givenNode = this.dataGraphService.findNode(uriNode);

                    response.results.bindings.forEach(
                        (b) => {
                            let nuNode = this.dataGraphService.addNode(b.relation.value, NodeType.SinExplorar, b.label.value);
                            this.dataGraphService.addLink(givenNode, nuNode, b.relation.value, b.label.value);
                        });

                    this.dataGraphService.canRefreshGraph();
                    this.setLoading(false);
                }
            );
    }

    public getIntancesCount(): void {
        this.setLoading(true);
        this.http.get<any>(this.endpoint + '?default-graph-uri=http://dbpedia.org&query=' + this.getNumberOfInstancesQuery() + '&format=json&timeout=60000')
            .subscribe(
                (response) => {

                    let mainNode = this.dataGraphService.findNode(this.mainConceptUri);

                    response.results.bindings.forEach(
                        (b) => {
                            let nodeId = this.dataGraphService.nextNodeId();
                            let nodeName = nodeId + '/' + b.count.value;
                            let nuNode = this.dataGraphService.addNode(nodeName, NodeType.InstanceCount, b.count.value + ' instances');
                            this.dataGraphService.addLink(mainNode, nuNode, 'rdf:type', 'type');
                        });

                    this.dataGraphService.canRefreshGraph();
                    this.setLoading(false);
                }
            );
    }

    public getPropertyMainConceptList(): Observable<Map<string, string>> {
        this.setLoading(true);
        return this.http.get<any>(this.endpoint + '?default-graph-uri=http://dbpedia.org&query=' + this.getPropertyMainConceptListQuery() + '&format=json&timeout=60000')
            .pipe(map(
                (data) => {
                    let properties = new Map();

                    data.results.bindings.forEach(
                        (b) => {
                            properties.set(b.label.value, b.property.value);
                        }
                    );
                    
                    this.setLoading(false);

                    return properties;
                }
            ));
    }

    public getInstancePropertyValue(): void {
        this.setLoading(true);
        this.http.get<any>(this.endpoint + '?default-graph-uri=http://dbpedia.org&query=' + this.getInstancePropertyValueQuery() + '&format=json&timeout=60000')
            .subscribe(
                (response) => {


                    response.results.bindings.forEach(
                        (b) => {
                            let node = this.dataGraphService.findNode(b.datanode.value);
                            let nuNode = this.dataGraphService.addNode(b.datanode.value, NodeType.LiteralRelleno, b.value2.value);
                            this.dataGraphService.addLink(node, nuNode, this.propertyMainConceptSelected, this.propertyLabelMainConceptSelected);
                        });

                    this.dataGraphService.canRefreshGraph();
                    this.setLoading(false);
                }
            );
    }

    private setLoading(isLoading: boolean) {
        this.loading$.next(isLoading);
    }

    private getObjectListQuery(): string {
        return 'select distinct ?concept ?label where { ?mainNode a ' + encodeURIComponent('<' + this.mainConceptUri + '>') + ' . ?mainNode ' + encodeURIComponent('<' + this.relationSelected + '>') + ' ?object . ?object a ?concept. ?concept rdfs:label ?label . FILTER langMatches(lang(?label),"' + this.language + '") } LIMIT ' + this.queryLimit
    }

    private getPropertyListQuery(): string {
        return 'select distinct ?property where { ?datanode ' + encodeURIComponent('<' + this.relationSelected + '>') + ' ?anotherdatanode. ?anotherdatanode a' + encodeURIComponent('<' + this.relationConceptSelected + '>') + '. ?datanode a ' + encodeURIComponent('<' + this.mainConceptUri + '>') + '. ?anotherdatanode ?property ?value. FILTER isLiteral(?value) } LIMIT ' + this.queryLimit
    }

    private getFilteredConceptsQuery(filter: string): string {
        return 'select distinct ?concept ?label where { ?x rdf:type ?concept. FILTER regex(?concept, "' + filter + '", "i"). ?concept rdfs:label ?label . FILTER langMatches(lang(?label),"' + this.language + '") } LIMIT ' + this.queryLimit
    }

    private getRelationsGivenUriNodeQuery(uriNode: string): string {
        return 'select distinct ?relation ?label where { ?nodex ?relation ?nodey. ?nodey a ?concept. ?nodex a ' + encodeURIComponent('<' + uriNode + '>') + '. ?relation rdfs:label ?label . FILTER langMatches(lang(?label),"' + this.language + '")} LIMIT ' + this.queryLimit;
    }

    private getNumberOfInstancesQuery(): string {
        return 'select count (distinct *) as ?count where { ?datanode ' + encodeURIComponent('<' + this.relationSelected + '>') + ' ?anotherdatanode. ?anotherdatanode a ' + encodeURIComponent('<' + this.relationConceptSelected + '>') + '. ?datanode a ' + encodeURIComponent('<' + this.mainConceptUri + '>') + '. ?anotherdatanode ' + encodeURIComponent('<' + this.propertyConceptSelected + '>') + ' ?value. FILTER regex(?value, "' + this.literalTyped + '", "i"). ?datanode rdfs:label ?label . FILTER langMatches(lang(?label),"' + this.language + '") }'
    }

    private getInstancesQuery(): string {
        return 'select distinct ?datanode ?label where { ?datanode ' + encodeURIComponent('<' + this.relationSelected + '>') + ' ?anotherdatanode. ?anotherdatanode a' + encodeURIComponent('<' + this.relationConceptSelected + '>') + '. ?datanode a ' + encodeURIComponent('<' + this.mainConceptUri + '>') + '. ?anotherdatanode ' + encodeURIComponent('<' + this.propertyConceptSelected + '>') + ' ?value. FILTER regex(?value, "' + this.literalTyped + '", "i"). ?datanode rdfs:label ?label . FILTER langMatches(lang(?label),"' + this.language + '") }'
    }

    private getPropertyMainConceptListQuery(): string {
        return 'select distinct ?property ?label where { ?datanode ' + encodeURIComponent('<' + this.relationSelected + '>') + ' ?anotherdatanode. ?anotherdatanode a' + encodeURIComponent('<' + this.relationConceptSelected + '>') + '. ?datanode a ' + encodeURIComponent('<' + this.mainConceptUri + '>') + '. ?anotherdatanode ' + encodeURIComponent('<' + this.propertyConceptSelected + '>') + '?value. FILTER regex(?value, "' + this.literalTyped + '", "i"). ?datanode ?property ?value2. FILTER isLiteral(?value2). ?property rdfs:label ?label . FILTER langMatches(lang(?label),"' + this.language + '") } LIMIT ' + this.queryLimit;
    }

    private getDisplayLabel(uri: string): string {
        return uri.substr(uri.lastIndexOf('/') + 1);
    }

    private getInstancePropertyValueQuery(): string {
        return 'select distinct ?datanode ?value2 where { ?datanode ' + encodeURIComponent('<' + this.relationSelected + '>') + ' ?anotherdatanode. ?anotherdatanode a' + encodeURIComponent('<' + this.relationConceptSelected + '>') + '. ?datanode a ' + encodeURIComponent('<' + this.mainConceptUri + '>') + '. ?anotherdatanode ' + encodeURIComponent('<' + this.propertyConceptSelected + '>') + '?value. FILTER regex(?value, "' + this.literalTyped + '", "i"). ?datanode ' + encodeURIComponent('<' + this.propertyMainConceptSelected + '>') + ' ?value2. FILTER isLiteral(?value2) }'
    }
}