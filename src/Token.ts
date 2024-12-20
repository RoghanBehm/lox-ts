import TokenType from './TokenType';

class Token {
    readonly type: TokenType;
    readonly lexeme: string;
    readonly literal: object | null;
    readonly line: number;

    constructor(type: TokenType, lexeme: string, literal: object | null, line: number) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }

    public toString(): string {
        return this.type + " " + this.lexeme + " " + this.literal;
    }


}


export default Token;