import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ActorGraphReponse } from './models/actor-graph.model';
import { Node, Link } from 'src/app/d3';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

    constructor(private http: HttpClient) { }

    public getActorGraph(): Observable<ActorGraphReponse> {
        return this.http.get<any>('http://dbpedia.org/sparql?default-graph-uri=http://dbpedia.org&query=' + this.actorGraphQuery + '&format=json')
            .pipe(map(
                (data) => {
                    let response: ActorGraphReponse = new ActorGraphReponse();

                    let actorNode = new Node(1, this.actorUri);

                    response.nodes.push(actorNode);

                    data.results.bindings.forEach(
                        b => {
                            let nuNode = new Node(response.nodes.length + 1, b.objectType.value);

                            response.nodes.push(nuNode);

                            response.nodes[0].linkCount++;
                            response.nodes[response.nodes.length - 1].linkCount++;

                            response.links.push(new Link(response.nodes[0], response.nodes[response.nodes.length - 1], b.relation.value));
                        }
                    );

                    return response;
                }
            ));
    }

    public getObjectList(): Observable<string[]> {
        return this.http.get<any>('http://dbpedia.org/sparql?default-graph-uri=http://dbpedia.org&query=' + this.getObjectListQuery() + '&format=json')
            .pipe(map(
                (data) => {
                    let objects: string[] = [];

                    data.results.bindings.forEach(
                        (o) => {
                            objects.push(o.object.value);
                        }
                    );

                    return objects;
                }
            ));
    }

    public getActorsGraphQueried(): Observable<ActorGraphReponse> {
        return this.http.get<any>('http://dbpedia.org/sparql?default-graph-uri=http://dbpedia.org&query=' + this.getActorInstancesQuery() + '&format=json')
            .pipe(map(
                (data) => {
                    let response: ActorGraphReponse = new ActorGraphReponse();

                    let actorNode = new Node(1, this.actorUri);

                    response.nodes.push(actorNode);

                    let objectNode = new Node(2, this.objectSelected);

                    response.nodes.push(objectNode);

                    response.nodes[0].linkCount++;
                    response.nodes[1].linkCount++;

                    response.links.push(new Link(response.nodes[0], response.nodes[ 1], this.relationSelected));

                    data.results.bindings.forEach(
                        b => {
                            let nuNode = new Node(response.nodes.length + 1, b.actor.value);

                            response.nodes.push(nuNode);

                            response.nodes[0].linkCount++;
                            response.nodes[response.nodes.length - 1].linkCount++;

                            response.links.push(new Link(response.nodes[0], response.nodes[response.nodes.length - 1], 'a'));

                            response.nodes[1].linkCount++;
                            response.nodes[response.nodes.length - 1].linkCount++;

                            response.links.push(new Link(response.nodes[1], response.nodes[response.nodes.length - 1], this.relationSelected));
                        }
                    );

                    return response;
                }
            ));
    }

    private getObjectListQuery(): string {
        return 'select distinct ?object where { ?actor a ' + encodeURIComponent('<' + this.actorUri + '>') + ' . ?actor ' + encodeURIComponent('<' + this.relationSelected + '>') + ' ?object } LIMIT 100'
    }

    private getActorInstancesQuery(): string {
        return 'select distinct ?actor where { ?actor a ' + encodeURIComponent('<' + this.actorUri + '>') + ' . ?actor ' + encodeURIComponent('<' + this.relationSelected + '>') + ' ' + encodeURIComponent('<' + this.objectSelected + '>') + ' } LIMIT 1000'
    }
}