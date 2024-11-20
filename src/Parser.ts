import { Expr, Binary, Unary, Literal, Grouping } from './Expr';
import Token from '../src/Token';
import TokenType from './TokenType';
import { error } from './error';

class ParserError extends Error {
    constructor(message?: string) {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype)
    }
}

class Parser {
    private tokens: Token[] = [];
    private current: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }
    
    parse(): Expr | null {
        try {
            return this.expression();
        } catch (error: unknown) {
            if (error instanceof ParserError) {
                return null;
            }
            throw error;
        }
    }

    private expression(): Expr {
        return this.equality();
    }

    private equality(): Expr {
        let expr: Expr = this.comparison();
        return this.binaryParse(expr, [TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL], this.comparison.bind(this));
    }

    private comparison(): Expr {
        let expr: Expr = this.term();
        return this.binaryParse(expr, [TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL], this.term.bind(this));
    }

    private binaryParse(expr: Expr, types: TokenType[], parseFn: () => Expr): Expr {
        while (this.match(...types)) {
            const operator: Token = this.previous();
            const right: Expr = parseFn();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    private term(): Expr {
        let expr: Expr = this.factor();

        while (this.match(TokenType.MINUS, TokenType.PLUS)) {
            const operator: Token = this.previous();
            const right: Expr = this.factor();
            expr = new Binary(expr, operator, right);
        }

        return expr;
    }

    private factor(): Expr {
        let expr: Expr = this.unary();
        
        while (this.match(TokenType.SLASH, TokenType.STAR)) {
            const operator: Token = this.previous();
            const right: Expr = this.unary();
            expr = new Binary(expr, operator, right);
        }

        return expr;
    }

    private unary(): Expr {
        if (this.match(TokenType.BANG, TokenType.MINUS)) {
            const operator: Token = this.previous();
            const right: Expr = this.unary();
            return new Unary(operator, right);
        }

        return this.primary();
    }

    private primary(): Expr {
        if (this.match(TokenType.FALSE)) return new Literal(false);
        if (this.match(TokenType.TRUE)) return new Literal(true);
        if (this.match(TokenType.NIL)) return new Literal(null);

        if (this.match(TokenType.NUMBER, TokenType.STRING)) {
            return new Literal(this.previous().literal);
        }

        if (this.match(TokenType.LEFT_PAREN)) {
            let expr: Expr = this.expression();
            this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
            return new Grouping(expr);
        }

        throw error(this.peek(), "Expect expression.");
    }

    private match(...types: TokenType[]): boolean {
        for (const type of types) {
            if (this.check(type)) {
                this.advance(); 
                return true;
            }
        }
        return false;
    }
     
    private consume(type: TokenType, message: string): Token {
        if (this.check(type)) return this.advance();

        throw error(this.peek(), message);
    }

    error(token: Token, message: string): ParserError {
        error(token, message);
        return new ParserError();
    }

    private synchronize(): void {
        this.advance();

        while (!this.isAtEnd()) {
            if (this.previous().type == TokenType.SEMICOLON) return;

            switch (this.peek().type) {
                case TokenType.CLASS:
                case TokenType.FUN:
                case TokenType.VAR:
                case TokenType.FOR:
                case TokenType.IF:
                case TokenType.WHILE:
                case TokenType.PRINT:
                case TokenType.RETURN:
                    return;
            }

            this.advance();
        }
    }
   
    private check(type: TokenType): boolean {
        if (this.isAtEnd()) return false;
        return this.peek().type == type;
    }

    private advance(): Token {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    private isAtEnd(): boolean {
        return this.peek().type == TokenType.EOF;
    }

    private peek(): Token {
        return this.tokens[this.current];
    }

    private previous(): Token {
        return this.tokens[this.current - 1];
    }

}

export default Parser;