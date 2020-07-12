export class QueryJsonResponse {
    results: ResultsResponse;
}

export class ResultsResponse {
    distinct: boolean;
    ordered: boolean;
    bindings: Binding[];
}

export class Binding {
    concept: Concept;
}

export class Concept {
    type: string;
    value: string;
}