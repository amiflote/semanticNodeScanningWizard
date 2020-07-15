import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueryJsonResponse, Concept } from '../models/query-json-response.model';
import { Relation, RelationQueryJsonResponse } from '../models/relation-query-json-response.model';

@Injectable()
export class SparqlService {

    private graphsQuery: string = 'SELECT DISTINCT ?graph WHERE { GRAPH ?graph { ?a ?b ?c } }';

    private graphsCountQuery: string = 'SELECT COUNT (DISTINCT ?graph) AS ?COUNT WHERE { GRAPH ?graph { ?a ?b ?c } }';

    public query: string = 'SELECT DISTINCT ?concept WHERE { ?s a ?concept . } LIMIT 50';

    constructor(private http: HttpClient){

        this.testConnection().subscribe(
            (data) => {
                if (data && data.results) {
                    var result = this.mapResultsToConcepts(data);
                }
            }
        );
    }

    public getGraphs(page: number, pageSize: number): Observable<string[]> {
        return this.http.get<any>('http://dbpedia.org/sparql?query=' + encodeURIComponent(this.getGraphsQuery(page, pageSize)) + '&format=json')
            .pipe(map(data => this.mapResultsToGraphs(data)));
    }

    public getConcepts(graph: string, page: number, pageSize: number): Observable<Concept[]> {
        return this.http.get<QueryJsonResponse>('http://dbpedia.org/sparql?default-graph-uri=' + encodeURIComponent(graph) + '&query=' + encodeURIComponent(this.getConceptsQuery(page, pageSize)) +'&format=json')
            .pipe(map(data => this.mapResultsToConcepts(data)));
    }

    public getRelations(graph: string, concept: string, page: number, pageSize: number): Observable<Relation[]> {
        return this.http.get<RelationQueryJsonResponse>('http://dbpedia.org/sparql?default-graph-uri=' + encodeURIComponent(graph) + '&query=' + encodeURIComponent(this.getRelationsQuery(concept, page, pageSize)) +'&format=json')
            .pipe(map(data => this.mapResultsToRelations(data)));
    }

    public getGraphsCount(): Observable<number> {
        return this.http.get<any>('http://dbpedia.org/sparql?query=' + encodeURIComponent(this.graphsCountQuery) + '&format=json')
            .pipe(map(data => data.results.bindings[0].count.value));
    }

    public getCountConcepts(): Observable<number> {
        // return this.http.get<any>('http://dbpedia.org/sparql?query=SELECT COUNT(?concept) as ?count WHERE { ?s a ?concept . }&format=json')
        //     .pipe(map(data => data.results.bindings[0].count.value));

        return of(1000);
    }

    public getCountRelations(graph: string, concept: string): Observable<number> {
        return this.http.get<any>('http://dbpedia.org/sparql?default-graph-uri=' + encodeURIComponent(graph) + '&query=' + encodeURIComponent(this.getRelationsCountQuery(concept)) +'&format=json')
            .pipe(map(data => data.results.bindings[0].count.value));
    }

    public testConnection(): Observable<QueryJsonResponse> {
        return this.http.get<QueryJsonResponse>('http://dbpedia.org/sparql?query=' + this.query +'&format=json');
    }

    private getGraphsQuery(page: number, pageSize: number): string {
        return 'SELECT DISTINCT ?graph WHERE { GRAPH ?graph { ?b a ?c } } LIMIT ' + pageSize + ' OFFSET ' + (page - 1)*pageSize;
    }

    private getConceptsQuery(page: number, pageSize: number): string {
        return 'SELECT DISTINCT ?concept WHERE { ?s a ?concept . } LIMIT ' + pageSize + ' OFFSET ' + (page - 1)*pageSize;
    }

    private getRelationsQuery(concept: string, page: number, pageSize: number): string {
        return 'SELECT DISTINCT ?relation WHERE { ?concept a <'+ concept + '> . ?concept ?relation ?valor } LIMIT ' + pageSize + ' OFFSET ' + (page - 1)*pageSize;
    }

    private getRelationsCountQuery(concept: string): string {
        return 'SELECT COUNT(?relation) as ?count WHERE { ?concept a <'+ concept + '> . ?concept ?relation ?valor }';
    }

    private mapResultsToGraphs(query: any): string[] {
        var result: string[] = [];

        query.results.bindings.forEach(b => {
            result.push(b.graph.value);
        });

        return result;
    }

    private mapResultsToConcepts(query: QueryJsonResponse): Concept[] {
        var result: Concept[] = [];

        query.results.bindings.forEach(b => {
            result.push(b.concept);
        });

        return result;
    }

    private mapResultsToRelations(query: RelationQueryJsonResponse): Relation[] {
        var result: Relation[] = [];

        query.results.bindings.forEach(b => {
            result.push(b.relation);
        });

        return result;
    }
}