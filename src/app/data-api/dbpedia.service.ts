import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ActorGraphReponse } from './models/actor-graph.model';
import { Node, Link } from 'src/app/d3';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class DbPediaService {
    
    private actorUri = 'http://dbpedia.org/ontology/Actor';

    private actorGraphQuery = 'select distinct ?relation ?objectType where { ?actor a ' + encodeURIComponent('<'+this.actorUri+'>') + ' . ?actor ?relation ?object . ?object a ?objectType } LIMIT 100'
    
    constructor(private http: HttpClient) { }

    public getActorGraph(): Observable<ActorGraphReponse> {
        return this.http.get<any>('http://dbpedia.org/sparql?default-graph-uri=http://dbpedia.org&query='+this.actorGraphQuery+'&format=json')
        .pipe(map(
            (data) => {
                let response: ActorGraphReponse = new ActorGraphReponse();

                let actorNode = new Node(1, this.actorUri);

                response.nodes.push(actorNode);

                data.results.bindings.forEach(
                    b => {
                        let nuNode = new Node(response.nodes.length+1, b.objectType.value);

                        response.nodes.push(nuNode);

                        response.nodes[0].linkCount++;
                        response.nodes[response.nodes.length-1].linkCount++;
                        
                        response.links.push(new Link(response.nodes[0], response.nodes[response.nodes.length-1], b.relation.value));
                    }
                );

                return response;
            }
        ))
    }
}