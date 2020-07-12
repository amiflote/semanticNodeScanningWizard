import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

    public getConcepts(): Observable<Concept[]> {
        return this.http.get<QueryJsonResponse>('http://dbpedia.org/sparql?query=' + this.query +'&format=json')
            .pipe(map(data => this.mapResultsToConcepts(data)));
    }

    public testConnection(): Observable<QueryJsonResponse> {
        return this.http.get<QueryJsonResponse>('http://dbpedia.org/sparql?query=' + this.query +'&format=json');
    }

    private mapResultsToConcepts(query: QueryJsonResponse): Concept[] {
        var result: Concept[] = [];

        query.results.bindings.forEach(b => {
            result.push(b.concept);
        });

        return result;
    }
}