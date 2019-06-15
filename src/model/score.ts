export class Score {
    id: number;
    alias: string;
    score: number;
    created: Date;


    constructor(id: number, alias: string, score: number, created: Date) {
        this.id = id;
        this.alias = alias;
        this.score = score;
        this.created = created;
    }
}