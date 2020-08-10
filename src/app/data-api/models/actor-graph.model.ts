import { Link } from "src/app/d3/models/link";
import { Node } from "src/app/d3";

export class ActorGraphReponse {
    nodes: Node[];
    links: Link[];

    constructor() {
        this.nodes = [];
        this.links = [];
    }
}