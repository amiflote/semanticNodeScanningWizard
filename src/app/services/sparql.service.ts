import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueryJsonResponse, Concept } from '../models/query-json-response.model';

@Injectable()
export class SparqlService {

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

    public getConcepts(page: number, pageSize: number): Observable<Concept[]> {
        return this.http.get<QueryJsonResponse>('http://dbpedia.org/sparql?query=' + this.getQuery(page, pageSize) +'&format=json')
            .pipe(map(data => this.mapResultsToConcepts(data)));
    }

    public getCountConcepts(): Observable<number> {
        // return this.http.get<any>('http://dbpedia.org/sparql?query=SELECT COUNT(?concept) as ?count WHERE { ?s a ?concept . }&format=json')
        //     .pipe(map(data => data.results.bindings[0].count.value));

        return of(1000);
    }

    public testConnection(): Observable<QueryJsonResponse> {
        return this.http.get<QueryJsonResponse>('http://dbpedia.org/sparql?query=' + this.query +'&format=json');
    }

    private getQuery(page: number, pageSize: number): string {
        return 'SELECT DISTINCT ?concept WHERE { ?s a ?concept . } ' + 'LIMIT ' + pageSize + ' OFFSET ' + (page - 1)*pageSize;
    }

    private mapResultsToConcepts(query: QueryJsonResponse): Concept[] {
        var result: Concept[] = [];

        query.results.bindings.forEach(b => {
            result.push(b.concept);
        });

        return result;
    }
}