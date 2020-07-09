import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SparqlService {
    constructor(private http: HttpClient){

        this.testConnection().subscribe(
            (data) => {
                if (data) {
                    console.log('amo');
                }
            }
        )
    }

    public testConnection() {
        return this.http.get('http://dbpedia.org/sparql?query=DESCRIBE <http://dbpedia.org/resource/Musician>', {responseType: 'json'})
    }
}