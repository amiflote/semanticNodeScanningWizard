export class RelationQueryJsonResponse {
    results: RelationResultsResponse;
}

export class RelationResultsResponse {
    distinct: boolean;
    ordered: boolean;
    bindings: RelationBinding[];
}

export class RelationBinding {
    relation: Relation;
}

export class Relation {
    type: string;
    value: string;
}